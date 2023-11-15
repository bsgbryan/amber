import { Component } from "@/Legion"

import Xenon from "@/Xenon"

const size = 80

export default class Camera extends Component {
  static #buffer_description: GPUBufferDescriptor = {
    size,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  }

  #buffer:     GPUBuffer
  #bind_group: GPUBindGroup

  position: Float32Array
  target:   Float32Array

  get bind_group(): GPUBindGroup { return this.#bind_group }
  get buffer():     GPUBuffer    { return this.#buffer     }

  constructor(
    x: number,
    y: number,
    z: number,
  ) {
    super()

    this.position    = new Float32Array([x, y, z    ])
    this.target      = new Float32Array([x, y, z + 1])
    this.#buffer     = Xenon.create_buffer(Camera.#buffer_description)
    this.#bind_group = Xenon.create_bind_group([{
      binding: 0,
      resource: {
        buffer: this.#buffer,
        offset: 0,
        size,
      }
    }])
  }
}