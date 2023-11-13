import { Component } from "@/Legion"
import { vpm      } from "@/Xenon/helpers"
import { ViewPort } from "@/Xenon/types"
import   Xenon      from "@/Xenon"

const size = 80

export default class Camera extends Component {
  static #buffer_description: GPUBufferDescriptor = {
    size,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  }

  #buffer:     GPUBuffer
  #bind_group: GPUBindGroup

  #position: Float32Array
  #target:   Float32Array
  #viewport: ViewPort

  set position(that: Float32Array) {
    this.#position = that
  }

  set target(that: Float32Array) {
    this.#target = that
  }

  set viewport(that: { height: number, width: number }) {
    this.#viewport = that
  }

  get position():   Float32Array { return this.#position   }
  get bind_group(): GPUBindGroup { return this.#bind_group }
  get buffer():     GPUBuffer    { return this.#buffer     }

  constructor(
    x: number,
    y: number,
    z: number,
  ) {
    super()

    this.#position = new Float32Array([x, y, z])
    this.#buffer   = Xenon.create_buffer(Camera.#buffer_description)
    this.#viewport = Xenon.viewport
    this.#bind_group = Xenon.create_bind_group([{
      binding: 0,
      resource: {
        buffer: this.#buffer,
        offset: 0,
        size,
      }
    }])
  }

  get view_projection_matrix(): Float32Array {
    return new Float32Array([
      ...vpm(
        this.#viewport.width / this.#viewport.height,
        this.#position,
        this.#target,
      ),
      this.#viewport.width,
      this.#viewport.height,
    ])
  }
}