import { view_projection_matrix } from "#/Xenon/helpers"

import MainCamera from "@/Athenaeum/components/MainCamera"
import Mabueth    from "@/Mabeuth"
import Yggdrasil  from "@/Yggdrasil"

import { VPM } from "@/Xenon/settings"

import { RenderDimensions } from "@/Mabeuth/types"
import {
  InstancedRenderEncoding,
  RenderEncoding,
  ShaderBuffers,
  ShadersSources,
} from "@/Xenon/types"

/**
 * Manages all rendering
 * 
 * It requires an html \<canvas\> element and a browser with WebGPU support
 * 
 * @remarks
 * To use Xenon:
 * 1. Call {@link Xenon.init | `Xenon.init`}
 * 2. Call {@link Xenon.register_render_pipeline | `Xenon.register_render_pipeline`}
 * 3. Call either:
 *     * {@link Xenon.register_render_encoding | `Xenon.register_render_encoding`} for **non-instanced** rendering
 *     * {@link Xenon.register_instanced_render_encoding | `Xenon.register_instanced_render_encoding`} for **instanced** rendering
 * 4. Add a material with geometry to render. _For an example, see src/test/index.tsx line: 29_
 * 5. Call {@link Xenon.render | `Xenon.render`}
 */
export default class Xenon {
  static #context?:    GPUCanvasContext | null = undefined
  static #device?:     GPUDevice               = undefined
  static #format?:     GPUTextureFormat        = undefined
  static #dimensions?: RenderDimensions        = undefined

  static #vertex_buffers:   Array<GPUBuffer> = []
  static #index_buffers:    Array<GPUBuffer> = []
  static #color_attachment: Array<GPURenderPassColorAttachment> = []

  static #depth_stencil?:   GPURenderPassDepthStencilAttachment = undefined
  static #render_encodings: Array<RenderEncoding>               = []

  static #render_target?: GPUTexture

  static #main_camera: MainCamera

  static #default_bind_group_layout:            GPUBindGroupLayout
  static #default_bind_group_layout_descriptor: GPUBindGroupLayoutDescriptor

  static #default_render_pipeline_layout: GPUPipelineLayout

  /**
   * The main camera used to render the scene
   * 
   * @remarks
   * This object's view projection matrix is what's used when rendering
   * 
   * @readonly
   */
  static set main_camera(that: MainCamera) {
    this.#main_camera = that
  }

  /**
   * Creates and returns a {@link https://webgpu.rocks/reference/interface/gpubuffer/#idl-gpubuffer | GPUBuffer} using a {@link https://webgpu.rocks/reference/dictionary/gpubufferdescriptor/#idl-gpubufferdescriptor | GPUBufferDescriptor}
   * @param descriptor The {@link https://webgpu.rocks/reference/dictionary/gpubufferdescriptor/#idl-gpubufferdescriptor | GPUBufferDescriptor} used to create the output buffer
   * @returns A {@link https://webgpu.rocks/reference/interface/gpubuffer/#idl-gpubuffer | GPUBuffer} configured according to the passed GPUBufferDescriptor
   */
  static create_buffer(descriptor: GPUBufferDescriptor): GPUBuffer {
    return this.#device.createBuffer(descriptor)
  }

  /**
   * Creates and returns a {@link https://webgpu.rocks/reference/interface/gpubindgroup/#idl-gpubindgroup | GPUBindGroup} using the passed `entries` and Xenon's default bind ground layout
   * @param entries {@link https://webgpu.rocks/reference/dictionary/gpubindgroupentry/#idl-gpubindgroupentry | GPUBindGroupEntries} to use with the bind group
   * @returns A {@link https://webgpu.rocks/reference/interface/gpubindgroup/#idl-gpubindgroup | GPUBindGroup} created using the passed `entries` and Xenon's default bind ground layout
   */
  static create_bind_group(entries: Array<GPUBindGroupEntry>): GPUBindGroup {
    return this.#device.createBindGroup({
      entries,
      layout: this.#default_bind_group_layout,
    })
  }

  /**
   * Initializes Xenon
   * 
   * @remarks
   * `init` performs the following tasks:
   * 1. Gets a reference to the html \<canvas\> element to use as the main render target
   * 2. Attempts to get a reference to a GPU adapter, if possible
   * 3. Gets a GPU device from the adapter obtained in the previous step
   * 3. Attempts to get the `'webgpu'` context from the GPU adapter
   * 4. Configures the WebPU context obtained from the previous step for rendering
   * 5. Registers a listener to log an error to the console if the GPU device is lost
   * 6. Configures the default bind group
   * 
   * @throws **No appropriate GPUAdapter found** if a GPU adapter cannot be found
   * @throws **Unable to get WebGPU context** if the browser does not support WebGPU
   */
  static async init() {
    this.#dimensions = Mabueth.dimensions

    const adapter = await navigator.gpu.requestAdapter()
    if (!adapter) throw new Error('No appropriate GPUAdapter found')

    this.#device = await adapter.requestDevice()
    this.#context = Mabueth.context

    if (this.#context) {
      this.#format = navigator.gpu.getPreferredCanvasFormat()

      this.#context.configure({
        device: this.#device,
        format: this.#format,
        alphaMode: 'premultiplied',
      })

      this.#device.lost.then(details => console.error('WebGPU device was lost', { details }))

      this.#render_target = this.#device.createTexture({
        size: [this.#dimensions.width, this.#dimensions.height, 1],
        format: this.#format,
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
      })

      this.#register_color_attachment()
      this.refresh_render_target_size_and_scale()

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

  /**
   * Reinitializes rendering resources when the available rendering area size changes
   */
  static refresh_render_target_size_and_scale() {
    if (this.#dimensions) {
      this.#dimensions.height = Mabueth.dimensions.height
      this.#dimensions.width  = Mabueth.dimensions.width

      if (this.#render_target !== undefined)
        this.#render_target.destroy()
      
      this.#define_depth_stencil()
    }
    else throw new Error('No #target, cannot resize')
  }

  /**
   * Creates, writes, and caches a {@link https://webgpu.rocks/reference/interface/gpubuffer/#idl-gpubuffer | GPUBuffer} using the passed arguments
   * 
   * @param items The items to be written to the buffer
   * @param index The index to Xenon's internal buffer cache; _This should be globally unique across materials and buffer layouts in a material_
   * @param offset How far into the buffer the actual data starts; _defaults to `0` meaning the data starts at the beginning of the buffer_
   * @param usage {@link https://webgpu.rocks/reference/typedef/gpubufferusageflags/#idl-gpubufferusageflags | GPUBufferUsageFlags} detailing how the data should be stored/accessed
   * 
   * @remarks
   * Xenon maintains an internal list of buffers created via {@link Xenon.create_vertex_buffer | `Xenon.create_vertex_buffer`}.
   * For this internal list to function as intended, the `index` parameter _must_ be unique for each distinct buffer.
   * If two materials call `Xenon.create_vertex_buffer` passing the same value for `index` they would clobber each other's data.
   * This is especially problematic if/when the _layout_ of the data is identical while the _semantics_ (or meaning) of the data is different.
   */
  static create_vertex_buffer(
    items: Float32Array,
    index: number,
    offset = 0,
    usage  = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  ): void {
    const buffer = this.#device.createBuffer({
      size: items.byteLength,
      usage,
    })

    if (buffer) {
      this.#device.queue.writeBuffer(buffer, offset, items)

      this.#vertex_buffers[index] = buffer
    }
    else throw new Error("Couldn't create vertex buffer")
  }

  static create_index_buffer(
    items: Uint16Array,
    index: number,
    usage  = GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
  ): void {
    const pad     = items.length % Uint16Array.BYTES_PER_ELEMENT,
          content = items.length * Uint16Array.BYTES_PER_ELEMENT,
          padding = pad          * Uint16Array.BYTES_PER_ELEMENT,
          buffer  = this.#device.createBuffer({
            size: content + padding,
            usage,
            mappedAtCreation: true,
          })

    new Uint16Array(buffer.getMappedRange()).set(items)

    buffer.unmap()

    this.#index_buffers[index] = buffer
  }

  /**
   * Create and return a {@link https://webgpu.rocks/reference/interface/gpurenderpipeline/#idl-gpurenderpipeline | GPURenderPipeline}
   * 
   * @param name The string used to identify this render pipeline
   * @param shaders vertex and/or fragment shader source code
   * @param buffers vertex buffer layouts used by the vertex shader
   * 
   * @returns A {@link https://webgpu.rocks/reference/interface/gpurenderpipeline/#idl-gpurenderpipeline | GPURenderPipeline} configured using the passed arguments
   * 
   * @remarks
   * Xenon's render pipelines have a few non-configurable defaults:
   * 1. The depth stencil is always enabled, and is set to the `depth24plus` format with depth compare set to `less`
   * 2. The primitive topology is always `triangle-list` with the cull mode set to `back`
   * 3. The layout is always Xenon's default render pipeline layout
   * 4. The entry point for the vertex and fragment shaders is always `main`
   * 5. The fragment shader only supports a single target; using the value returned by `navigator.gpu.getPreferredCanvasFormat()` as the format
   */
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
        cullMode:  'back',
        frontFace: 'cw',
        topology:  'triangle-list',
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

    return this.#device.createRenderPipeline(descriptor)
  }

  /**
   * Creates, caches, and returns an `InstancedRenderEncoding`
   * 
   * @param instances The number is instances to pass to the vertex shader
   * @param pipeline The render pipeline to use
   * @param buffers A mapping of shader locations to indices in Xenon's internal buffer list
   * 
   * @returns An `InstancedRenderEncoding` configured using the passed arguments
   * 
   * @remarks
   * These objects are iterated over during {@link Xenon.render | `Xenon.render`} to produce output.
   * 
   * The `buffers` parameter is of note as it needs to be precisely calibrated to avoid problems that may be extremely difficult to diagnose/fix.
   * 
   * Xenon maintains an internal list of buffers created via {@link Xenon.create_vertex_buffer | `Xenon.refresh_buffer`}.
   * For this internal list to function as intended, the `index` value passed to that method _must_ be unique for each distinct buffer.
   * If two materials call `Xenon.refresh_buffer` passing the same value for `index` they would clobber each other's data.
   * This is especially problematic if/when the _layout_ of the data is identical while the _semantics_ (or meaning) of the data is different.
   * 
   * **NOTE** _Only_ vertex buffer layouts creating using **`InstancedVertexBufferLayout`** will work with these encodings
   * 
   * **NOTE** The returned encoging object will not has nay vertices specified. Vertices are added using `Xenon.refresh_buffer`
   */
  static register_instanced_render_encoding(
    instances: number,
    pipeline:  GPURenderPipeline,
    buffers:   Map<number, number>,
  ): InstancedRenderEncoding {
    const pass = {
      buffers,
      instances,
      pipeline,
      vertices: 0,
      indices: 0,
    }

    this.#render_encodings.push(pass)

    return pass
  }

  /**
   * Creates, caches, and returns a `RenderEncoding`
   * 
   * @param pipeline The render pipeline to use
   * @param buffers A mapping of shader locations to indices in Xenon's internal buffer list
   * 
   * @returns A `RenderEncoding` configured using the passed arguments
   * 
   * @remarks
   * These objects are iterated over during {@link Xenon.render | `Xenon.render`} to produce output.
   * 
   * The `buffers` parameter is of note as it needs to be precisely calibrated to avoid problems that may be extremely difficult to diagnose/fix.
   * 
   * Xenon maintains an internal list of buffers created via {@link Xenon.create_vertex_buffer | `Xenon.refresh_buffer`}.
   * For this internal list to function as intended, the `index` value passed to that method _must_ be unique for each distinct buffer.
   * If two materials call `Xenon.refresh_buffer` passing the same value for `index` they would clobber each other's data.
   * This is especially problematic if/when the _layout_ of the data is identical while the _semantics_ (or meaning) of the data is different.
   * 
   * **NOTE** _Only_ vertex buffer layouts creating using **`VertexBufferLayout`** will work with these encodings
   * 
   * **NOTE** The returned encoging object will not has nay vertices specified. Vertices are added using `Xenon.refresh_buffer`
   */
  static register_render_encoding(
    pipeline: GPURenderPipeline,
    buffers:  Map<number, number>,
  ): RenderEncoding {
    const pass = {
      buffers,
      pipeline,
      indices: 0,
    }

    this.#render_encodings.push(pass)

    return pass
  }

  /**
   * Iterate over all cached render encodings, rendering their contents using the main camera's view projection matrix
   */
  static render() {
    Yggdrasil.start_phase('render')

    this.#color_attachment[0].view = this.#context.getCurrentTexture().createView()

    const c   = this.#main_camera,
          vpm = new Float32Array([
            ...view_projection_matrix(
              this.#dimensions.width / this.#dimensions.height,
              this.#main_camera.position,
              this.#main_camera.target,
              VPM.FieldOfView,
              VPM.NearPlane,
              VPM.FarPlane,
            ),
            this.#dimensions.width,
            this.#dimensions.height,
          ])

    this.#device.queue.writeBuffer(c.buffer, 0, vpm)

    const encoder = this.#device.createCommandEncoder()
    const pass    = encoder.beginRenderPass({
      colorAttachments:       this.#color_attachment,
      depthStencilAttachment: this.#depth_stencil,
    })

    for (const data of this.#render_encodings) this.#encode(pass, data)

    pass.end()

    this.#device.queue.submit([encoder.finish()])

    Yggdrasil.complete_phase('render')
  }

  // TODO: See about refactoring so that all this is done prior to rendering
  static #encode(
    pass: GPURenderPassEncoder,
    data: RenderEncoding | InstancedRenderEncoding,
  ): void {
    pass.setPipeline(data.pipeline)

    for (const [v, b] of data.buffers.entries()) {
      pass.setVertexBuffer(v, this.#vertex_buffers[b])

      if (this.#index_buffers[b])
        pass.setIndexBuffer(this.#index_buffers[b], 'uint16')
    }
    
    pass.setBindGroup(0, this.#main_camera.bind_group)

    if (Object.hasOwn(data, 'instances'))
      pass.draw((data as InstancedRenderEncoding).instances, data.vertices / 3)
    else pass.draw(data.vertices / 3)
  }

  static #register_color_attachment(
    clear_value: GPUColor = { r: 0.2, g: 0.247, b: 0.314, a: 1.0 }
  ) {
    this.#color_attachment.push({
      view:       this.#render_target.createView(),
      clearValue: clear_value,
      loadOp:    'clear',
      storeOp:   'store'
    })
  }

  static #define_depth_stencil() {
    if (this.#dimensions && this.#device) {
      const spec: GPUTextureDescriptor = {
        size: [this.#dimensions.width, this.#dimensions.height, 1],
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
}
