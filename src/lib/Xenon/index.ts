import MainCamera from "../Athenaeum/components/MainCamera"
import Finesse    from "../Finesse"
import Yggdrasil  from "../Yggdrasil"

import {
  RenderPass,
  ShaderBuffers,
  ShadersSources,
  ViewPort,
} from "./types"

export default class Xenon {
  static #context?: GPUCanvasContext | null = undefined
  static #device?:  GPUDevice               = undefined
  static #format?:  GPUTextureFormat        = undefined
  static #target?:  HTMLCanvasElement       = undefined

  static #buffers:          Array<GPUBuffer> = []
  static #color_attachment: Array<GPURenderPassColorAttachment> = []

  static #depth_stencil?:   GPURenderPassDepthStencilAttachment = undefined
  static #render_pipelines: Array<GPURenderPipeline>            = []
  static #render_passes:    Array<RenderPass>                   = []

  static #camera_matrix_bind_group?: GPUBindGroup

  static #render_target?: GPUTexture

  static #main_camera: MainCamera

  static #default_bind_group_layout:            GPUBindGroupLayout
  static #default_bind_group_layout_descriptor: GPUBindGroupLayoutDescriptor

  static #default_render_pipeline_layout: GPUPipelineLayout

  static get viewport(): ViewPort {
    return {
      height: this.#target.height,
      width:  this.#target.width,
    }
  }

  static set main_camera(that: MainCamera) {
    this.#main_camera = that
  }

  static create_buffer(descriptor: GPUBufferDescriptor): GPUBuffer {
    return this.#device.createBuffer(descriptor)
  }

  static create_bind_group(entries: Array<GPUBindGroupEntry>): GPUBindGroup {
    return this.#device.createBindGroup({
      entries,
      layout: this.#default_bind_group_layout,
    })
  }

  static async init(render_target = 'main-render-target') {
    this.#target = document.getElementById(render_target) as HTMLCanvasElement

    const adapter = await navigator.gpu.requestAdapter()
    if (!adapter) throw new Error('No appropriate GPUAdapter found.')

    this.#device = await adapter.requestDevice()
    this.#context = this.#target?.getContext('webgpu')

    if (this.#context) {
      this.#format = navigator.gpu.getPreferredCanvasFormat()

      this.#context.configure({
        device: this.#device,
        format: this.#format,
        alphaMode: 'premultiplied',
      })

      this.#device.lost.then(details => console.error('WebGPU device was lost', { details }))

      this.#render_target = this.#device.createTexture({
        size: [this.#target.width, this.#target.height, 1],
        format: this.#format,
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
      })

      this.register_color_attachment()
      this.refresh_render_target_size_and_scale()

      const self = this

      const resize_observer = new ResizeObserver(e =>
        self.refresh_render_target_size_and_scale()
      )

      resize_observer.observe(document.querySelector('html'))

      Finesse.init()

      this.#default_bind_group_layout_descriptor = {
        entries: [{
          binding: 0, // camera uniforms
          visibility: GPUShaderStage.VERTEX,
          buffer: {},
        }]
      }

      this.#default_bind_group_layout = this.#device.createBindGroupLayout(
        this.#default_bind_group_layout_descriptor
      )

      this.#default_render_pipeline_layout = this.#device.createPipelineLayout({
        bindGroupLayouts: [this.#default_bind_group_layout]
      })
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
        depthLoadOp: 'clear',
        depthStoreOp: 'store',
      }
    }
    else throw new Error('No #target or #device, cannot define depth stencil')
  }

  static refresh_render_target_size_and_scale() {
    if (this.#target) {
      this.#target.height = Math.floor(window.innerHeight)
      this.#target.width = Math.floor(window.innerWidth)

      if (this.#render_target !== undefined)
        this.#render_target.destroy()
      
      this.define_depth_stencil()

      if (this.#main_camera)
        this.#main_camera.viewport = this.viewport
    }
    else throw new Error('No #target, cannot resize')
  }

  static refresh_buffer(
    items: Float32Array,
    index: number,
    offset = 0,
    usage  = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  ) {
    const buffer = this.#device?.createBuffer({
      size: items.byteLength,
      usage,
    })

    if (buffer) {
      this.#device?.queue.writeBuffer(buffer, offset, items)

      this.#buffers[index] = buffer

      return index
    }
    else throw new Error("Couldn't create buffer")
  }

  static register_render_pipeline(
    name:     string,
    shaders:  ShadersSources,
    buffers?: ShaderBuffers,
  ): GPURenderPipeline {
    const descriptor: GPURenderPipelineDescriptor = {
      depthStencil: {
        format: 'depth24plus',
        depthWriteEnabled: true,
        depthCompare: 'less'
      },
      fragment: null,
      label: `RenderPipeline(${name})`,
      layout: this.#default_render_pipeline_layout,
      primitive: {
        cullMode: 'back',
        topology: 'triangle-list',
      },
      vertex: null,
    }

    if (shaders.vertex) {
      descriptor.vertex = {
        buffers: buffers?.vertex.layouts,
        entryPoint: 'main',
        module: this.#device.createShaderModule({
          label: `RenderPipeline(${name}).shader(vertex)`,
          code: shaders.vertex,
        }),
      }
    }

    if (shaders.fragment) {
      descriptor.fragment = {
        entryPoint: 'main',
        module: this.#device.createShaderModule({
          label: `RenderPipeline(${name}).shader(fragment)`,
          code: shaders.fragment,
        }),
        targets: [{ format: this.#format }],
      }
    }

    const pipeline = this.#device?.createRenderPipeline(descriptor)

    this.#render_pipelines.push(pipeline)

    return pipeline
  }

  static register_color_attachment(
    clear_value: GPUColor = { r: 0.2, g: 0.247, b: 0.314, a: 1.0 }
  ) {
    this.#color_attachment.push({
      view:       this.#render_target.createView(),
      clearValue: clear_value,
      loadOp:    'clear',
      storeOp:   'store'
    })
  }

  static register_instanced_render_pass(
    instances: number,
    pipeline:  GPURenderPipeline,
    buffers:   Map<number, number>,
  ): RenderPass {
    const pass = {
      buffers,
      instances,
      pipeline,
      vertices: 0,
    }

    this.#render_passes.push(pass)

    return pass
  }

  static execute_instanced_render_pass(
    pass: GPURenderPassEncoder,
    data: RenderPass,
  ) {
    pass.setPipeline(data.pipeline)

    for (const [v, b] of data.buffers.entries())
      pass.setVertexBuffer(v, this.#buffers[b])

    pass.setBindGroup(0, this.#main_camera.bind_group)
    pass.draw(data.instances, data.vertices / 3)
    pass.end()
  }

  static render() {
    Yggdrasil.start_phase('render')

    this.#color_attachment[0].view = this.#context.getCurrentTexture().createView()

    const c = this.#main_camera

    this.#device.queue.writeBuffer(c.buffer, 0, c.view_projection_matrix)

    const commandEncoder = this.#device.createCommandEncoder()

    for (const data of this.#render_passes) {
      const pass = commandEncoder.beginRenderPass({
        colorAttachments: this.#color_attachment,
        depthStencilAttachment: this.#depth_stencil,
      })

      this.execute_instanced_render_pass(pass, data)
    }

    this.#device.queue.submit([commandEncoder.finish()])

    Yggdrasil.complete_phase('render')
  }
}