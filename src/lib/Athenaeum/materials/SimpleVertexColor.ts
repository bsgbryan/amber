import { VertexBufferLayout } from "../../Xenon/helpers"

import vertex   from '../shaders/vertex/PositionBasedGradient.wgsl?raw'
import fragment from '../shaders/fragment/SingleColor.wgsl?raw'

import Material from "./Material"

export default class SimpleVertexColor extends Material {
  static #buffer_slot_map = new Map<number, number>()
  static #buffer_layouts  = [] as Array<GPUVertexBufferLayout>

  static #position: number

  static {
    this.#position = super.next_buffer_index

    this.#buffer_slot_map.set(0, this.#position)

    this.#buffer_layouts = [
      VertexBufferLayout(0, 12, 'float32x3', 0) // Position
    ]
  }

  constructor() {
    super(
      'SimpleVertexColor',
      { vertex, fragment },
      { vertex: {
        slot_map: SimpleVertexColor.#buffer_slot_map,
        layouts:  SimpleVertexColor.#buffer_layouts,
      }}
    )
  }

  override reset(vertices: Float32Array): void {
    super.reset(vertices, SimpleVertexColor.#position)
  }

  override apply_to(vertices: Float32Array): void {
    super.apply_to(vertices, SimpleVertexColor.#position)
  }
}