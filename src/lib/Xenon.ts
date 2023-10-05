import {
  Vector,
  degrees_to_radians,
  mat4,
  vec3,
} from './math'

export default class Xenon {
  static #context?: GPUCanvasContext | null = undefined
  static #device?:  GPUDevice               = undefined
  static #format?:  GPUTextureFormat        = undefined
  static #target?:  HTMLCanvasElement       = undefined

  static #buffers:          Array<GPUBuffer>                    = []
  static #color_attachment: Array<GPURenderPassColorAttachment> = []

  static #depth_stencil?:   GPURenderPassDepthStencilAttachment = undefined
  static #render_pipeline?: GPURenderPipeline                   = undefined

  static #camera_matrix_bind_group?:        GPUBindGroup
  static #camera_matrix_buffer?:            GPUBuffer
  static #camera_matrix_buffer_description: GPUBufferDescriptor = {
    size: 64,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  }

  static #render_target?: GPUTexture

  static async init(render_target: string) {
    this.#target = document.getElementById(render_target) as HTMLCanvasElement

    const adapter = await navigator.gpu.requestAdapter()
    if (!adapter) throw new Error('No appropriate GPUAdapter found.')

    this.#device  = await adapter.requestDevice()
    this.#context = this.#target?.getContext('webgpu')

    if (this.#context) {
      this.#format = navigator.gpu.getPreferredCanvasFormat()

      this.#context.configure({
        device:     this.#device,
        format:     this.#format,
        alphaMode: 'premultiplied',
      })

      this.#device.lost.then(details => console.error('WebGPU device was lost', {details}))

      this.refresh_render_target_size_and_scale()

      this.#render_target = this.#device.createTexture({
        size: [this.#target.width, this.#target.height, 1],
        format: this.#format,
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
      })

      this.register_color_attachment()
      this.define_depth_stencil()

      const self = this

      const resize_observer = new ResizeObserver(e =>
        self.refresh_render_target_size_and_scale()
      )

      resize_observer.observe(document.querySelector('html'))
    }
    else throw new Error('Unable to get WebGPU context')
  }

  static define_depth_stencil() {
    if (this.#target && this.#device) {
      const spec: GPUTextureDescriptor = {
        size: [this.#target.width, this.#target.height, 1],
        format: 'depth24plus',
        usage: GPUTextureUsage.RENDER_ATTACHMENT
      }
  
      this.#depth_stencil = {
        view: this.#device.createTexture(spec).createView(),
        depthClearValue: 1.0,
        depthLoadOp:  'clear',
        depthStoreOp: 'store',
      }
    }
    else throw new Error('No #target or #device, cannot define depth stencil')
  }

  static refresh_render_target_size_and_scale() {
    if (this.#target) {
      this.#target.height = Math.floor(window.innerHeight)
      this.#target.width  = Math.floor(window.innerWidth)
    }
    else throw new Error('No #target, cannot resize')
  }

  static register_buffer(
    items: Float32Array,  
    offset = 0,
    usage  = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  ): number {
    const buffer = this.#device?.createBuffer({
      size: items.byteLength,
      usage,
    })
  
    if (buffer) {
      this.#device?.queue.writeBuffer(buffer, offset, items)
      
      this.#buffers.push(buffer)

      return this.#buffers.length - 1
    }
    else throw new Error("Couldn't create buffer")
  }

  static register_render_pipeline(
    name: string,
    shaders: {
      compute?:  string,
      fragment?: string,
      vertex?:   string,
    },
    buffers?: {
      vertex?: Array<GPUVertexBufferLayout>,
    },
  ) {
    // @ts-ignore
    const descriptor: GPURenderPipelineDescriptor = {
      label: `${name} Render Pipeline`,
      layout: 'auto',
      primitive: {
        cullMode: 'back',
        topology: 'triangle-list',
      },
      depthStencil: {
        format: 'depth24plus',
        depthWriteEnabled: true,
        depthCompare: 'less'
      },
    }

    if (shaders.vertex) {
      descriptor.vertex = {
        buffers: buffers?.vertex,
        entryPoint: 'main',
        // @ts-ignore
        module: this.#device.createShaderModule({ code: shaders.vertex }),
      }
    }

    if (shaders.fragment) {
      descriptor.fragment = {
        entryPoint: 'main',
        // @ts-ignore
        module: this.#device.createShaderModule({ code: shaders.fragment }),
        targets: [{ format: this.#format }],
      }
    }

    this.#render_pipeline = this.#device?.createRenderPipeline(descriptor)

    this.register_camera_matrix()
  }

  static register_color_attachment(
    clear_value: GPUColor = { r: 0.2, g: 0.247, b: 0.314, a: 1.0 }
  ) {
    this.#color_attachment.push({
      view: this.#render_target.createView(),
      clearValue: clear_value,
      loadOp: 'clear',
      storeOp: 'store'
    })
  }

  static register_camera_matrix() {
    this.#camera_matrix_buffer     = this.#device.createBuffer(this.#camera_matrix_buffer_description)
    this.#camera_matrix_bind_group = this.#device.createBindGroup({
      layout: this.#render_pipeline.getBindGroupLayout(0),
      entries: [{
        binding: 0,
        resource: {
          buffer: this.#camera_matrix_buffer,
          offset: 0,
          size: 64
        }
      }]
    })
  }

  static render(
    position: Float32Array,
    target:   Float32Array,
    vertices: number,
  ) {
    const currentHeight = Math.floor(window.innerHeight)
    const currentWidth  = Math.floor(window.innerWidth)

    if (
      (currentWidth !== this.#target.width || currentHeight !== this.#target.height) &&
      currentWidth &&
      currentHeight
    ) {
      if (this.#render_target !== undefined)
        this.#render_target.destroy()

      // Setting the canvas width and height will automatically resize the textures returned
      // when calling getCurrentTexture() on the context.
      this.#target.height = currentHeight
      this.#target.width  = currentWidth

      this.define_depth_stencil()
    }

    this.#color_attachment[0].view = this.#context.getCurrentTexture().createView()

    this.#device.queue.writeBuffer(
      this.#camera_matrix_buffer,
      0,
      Camera(
        this.#target?.width / this.#target?.height,
        position,
        target,
      ),
    )

    const commandEncoder = this.#device.createCommandEncoder()
    const renderPass     = commandEncoder.beginRenderPass({
      colorAttachments:       this.#color_attachment,
      depthStencilAttachment: this.#depth_stencil,
    })

    renderPass.setPipeline(this.#render_pipeline)

    for (let i = 0; i < this.#buffers.length; i++)
      renderPass.setVertexBuffer(i, this.#buffers[i])

    renderPass.setBindGroup(0, this.#camera_matrix_bind_group)
    renderPass.draw(vertices)
    renderPass.end()

    this.#device.queue.submit([commandEncoder.finish()])
  }
}

export const VertexBufferLayout = (
  location: number,
  offset = 0,
): GPUVertexBufferLayout => ({
  arrayStride: 12,
  attributes: [{
    shaderLocation: location,
    format: 'float32x3',
    offset,
  }]
})

export const Camera = (
  aspectRatio: number,
  location:    Float32Array,
  sphere:      Float32Array,
): Float32Array => {
  const projection = mat4.perspective(
    degrees_to_radians(80), // fieldOfView,
    aspectRatio,
    1,      // zNear
    2000,   // zFar
  )

  const vm  = mat4.lookAt(location, vec3.add(sphere, location), Vector.Up)
  const vpm = mat4.multiply(projection, vm)

  return vpm
}

