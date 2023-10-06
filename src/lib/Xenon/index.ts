import { vpm } from "./helpers"
import {
  ComponentClass,
  Entity,
} from "./types"

/**
 * All ECS-related code originally taken from https://maxwellforbes.com/posts/typescript-ecs-implementation/
 */

export abstract class Component { }

export abstract class System {
  abstract componentsRequired: Set<Function>
  abstract update(entities: Set<Entity>, delta_seconds: number): void

  ecs: ECS
}

class ComponentContainer {
  #map = new Map<Function, Component>()

  add(component: Component): void {
      this.#map.set(component.constructor, component);
  }

  get<T extends Component>(
      componentClass: ComponentClass<T>
  ): T {
      return this.#map.get(componentClass) as T;
  }

  has(componentClass: Function): boolean {
      return this.#map.has(componentClass);
  }

  hasAll(componentClasses: Iterable<Function>): boolean {
      for (let cls of componentClasses) {
          if (!this.#map.has(cls)) {
              return false;
          }
      }
      return true;
  }

  delete(componentClass: Function): void {
      this.#map.delete(componentClass);
  }
}

class ECS {
  // Main state
  #entities = new Map<Entity, ComponentContainer>()
  #systems = new Map<System, Set<Entity>>()

  // Bookkeeping for entities.
  #nextEntityID = 0
  #entitiesToDestroy = new Array<Entity>()

  // API: Entities

  addEntity(): Entity {
    let entity = this.#nextEntityID;
    this.#nextEntityID++;
    this.#entities.set(entity, new ComponentContainer());
    return entity;
  }

  /**
   * Marks `entity` for removal. The actual removal happens at the end
   * of the next `update()`. This way we avoid subtle bugs where an
   * Entity is removed mid-`update()`, with some Systems seeing it and
   * others not.
   */
  removeEntity(entity: Entity): void {
    this.#entitiesToDestroy.push(entity);
  }

  // API: Components

  addComponent(entity: Entity, component: Component): void {
    this.#entities.get(entity).add(component);
    this.#checkE(entity);
  }

  getComponents(entity: Entity): ComponentContainer {
    return this.#entities.get(entity);
  }

  removeComponent(
    entity: Entity, componentClass: Function
  ): void {
    this.#entities.get(entity).delete(componentClass);
    this.#checkE(entity);
  }

  // API: Systems

  addSystem(system: System): void {
    // Checking invariant: systems should not have an empty
    // Components list, or they'll run on every entity. Simply remove
    // or special case this check if you do want a System that runs
    // on everything.
    if (system.componentsRequired.size == 0) {
      console.warn("System not added: empty Components list.");
      console.warn(system);
      return;
    }

    // Give system a reference to the ECS so it can actually do
    // anything.
    system.ecs = this;

    // Save system and set who it should track immediately.
    this.#systems.set(system, new Set());
    for (let entity of this.#entities.keys()) {
      this.#checkES(entity, system);
    }
  }

  /**
   * Note: I never actually had a removeSystem() method for the entire
   * time I was programming the game Fallgate (2 years!). I just added
   * one here for a specific testing reason (see the next post).
   * Because it's just for demo purposes, this requires an actual
   * instance of a System to remove (which would be clunky as a real
   * API).
   */
  removeSystem(system: System): void {
    this.#systems.delete(system);
  }

  /**
   * This is ordinarily called once per tick (e.g., every frame). It
   * updates all Systems, then destroys any Entities that were marked
   * for removal.
   */
  update(delta_seconds: number): void {
    // Update all systems. (Later, we'll add a way to specify the
    // update order.)
    for (let [system, entities] of this.#systems.entries()) {
      system.update(entities, delta_seconds)
    }

    // Remove any entities that were marked for deletion during the
    // update.
    while (this.#entitiesToDestroy.length > 0) {
      this.#destroyEntity(this.#entitiesToDestroy.pop());
    }
  }

  // #methods for doing internal state checks and mutations.

  #destroyEntity(entity: Entity): void {
    this.#entities.delete(entity);
    for (let entities of this.#systems.values()) {
      entities.delete(entity);  // no-op if doesn't have it
    }
  }

  #checkE(entity: Entity): void {
    for (let system of this.#systems.keys()) {
      this.#checkES(entity, system);
    }
  }

  #checkES(entity: Entity, system: System): void {
    let have = this.#entities.get(entity);
    let need = system.componentsRequired;
    if (have.hasAll(need)) {
      // should be in system
      this.#systems.get(system).add(entity); // no-op if in
    } else {
      // should not be in system
      this.#systems.get(system).delete(entity); // no-op if out
    }
  }
}

export default class Xenon {
  static #context?: GPUCanvasContext | null = undefined
  static #device?: GPUDevice = undefined
  static #format?: GPUTextureFormat = undefined
  static #target?: HTMLCanvasElement = undefined

  static #buffers: Array<GPUBuffer> = []
  static #color_attachment: Array<GPURenderPassColorAttachment> = []

  static #depth_stencil?: GPURenderPassDepthStencilAttachment = undefined
  static #render_pipeline?: GPURenderPipeline = undefined

  static #camera_matrix_bind_group?: GPUBindGroup
  static #camera_matrix_buffer?: GPUBuffer
  static #camera_matrix_buffer_description: GPUBufferDescriptor = {
    size: 64,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  }

  static #legion: ECS = new ECS()

  static #render_target?: GPUTexture

  static #main_camera = {
    position: new Float32Array([0, 0, 0]),
    target:   new Float32Array([0, 0, 1]),
  }

  static #vertices = 0

  static async init(render_target: string) {
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
    }
    else throw new Error('No #target, cannot resize')
  }

  static refresh_buffer(
    items: Float32Array,
    index: number,
    offset = 0,
    usage = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  ) {
    const buffer = this.#device?.createBuffer({
      size: items.byteLength,
      usage,
    })

    if (buffer) {
      this.#device?.queue.writeBuffer(buffer, offset, items)

      this.#buffers[index] = buffer

      this.#vertices += items.length
    }
    else throw new Error("Couldn't create buffer")
  }

  static register_render_pipeline(
    name: string,
    shaders: {
      compute?: string,
      fragment?: string,
      vertex?: string,
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
    this.#camera_matrix_buffer = this.#device.createBuffer(this.#camera_matrix_buffer_description)
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

  static update_main_camera(
    position: Float32Array,
    target:   Float32Array,
  ): void {
    this.#main_camera.position = position
    this.#main_camera.target   = target
  }

  static render() {
    this.#color_attachment[0].view = this.#context.getCurrentTexture().createView()

    this.#device.queue.writeBuffer(
      this.#camera_matrix_buffer,
      0,
      vpm(
        this.#target?.width / this.#target?.height,
        this.#main_camera.position,
        this.#main_camera.target,
      ),
    )

    const commandEncoder = this.#device.createCommandEncoder()
    const renderPass = commandEncoder.beginRenderPass({
      colorAttachments: this.#color_attachment,
      depthStencilAttachment: this.#depth_stencil,
    })

    renderPass.setPipeline(this.#render_pipeline)

    // TODO Figure out how to handle registering and updating vertex buffers 🤔
    // for (let i = 0; i < this.#buffers.length; i++)
    renderPass.setVertexBuffer(0, this.#buffers[0])

    renderPass.setBindGroup(0, this.#camera_matrix_bind_group)
    renderPass.draw(this.#vertices / 3)
    renderPass.end()

    this.#device.queue.submit([commandEncoder.finish()])
  }

  static new_entity(): Entity { return this.#legion.addEntity() }

  static remove_entity(id: Entity): void { this.#legion.removeEntity(id) }

  static add_component(id: Entity, comp: Component): void { this.#legion.addComponent(id, comp) }

  static add_system(s: System): void { this.#legion.addSystem(s) }

  static run(): void {
    this.tick(performance.now())
  }

  static tick(last_tick: number): void {
    requestAnimationFrame(() => {
      this.#vertices = 0
      this.#legion.update((performance.now() - last_tick) * .001)

      Xenon.render()
      Xenon.tick(performance.now())
    })
  }
}