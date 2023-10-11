import { VertexBufferLayout } from "../../Xenon/helpers"

import vertex   from '../shaders/vertex/PositionBasedGradient.wgsl?raw'
import fragment from '../shaders/fragment/SingleColor.wgsl?raw'

import Material from "./Material"

export default class SimpleVertexColor extends Material {
  static #buffer_layouts = [] as Array<GPUVertexBufferLayout>

  static {
    this.#buffer_layouts = [
      VertexBufferLayout(0, 12, 'float32x3') // Position
    ]
  }

  #buffer_slot_map = new Map<number, number>()

  #position: number

  constructor() {
    super(
      'SimpleVertexColor',
      { vertex, fragment },
      { vertex: {
        layouts: SimpleVertexColor.#buffer_layouts,
      }}
    )
    
    this.#position = Material.next_buffer_index

    this.#buffer_slot_map.set(0, this.#position)

    super.register_render_encoding(this.#buffer_slot_map)
  }

  override reset(vertices: Float32Array): void {
    super.reset(vertices, this.#position)
  }

  override apply_to(vertices: Float32Array): void {
    super.apply_to(vertices, this.#position)
  }
}