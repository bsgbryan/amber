import { VertexBufferLayout } from "@/Xenon/helpers"

import vertex   from '@/Athenaeum/shaders/vertex/PositionBasedGradient.wgsl'
import fragment from '@/Athenaeum/shaders/fragment/SingleColor.wgsl'

import Material from "@/Athenaeum/materials/Material"
import { Mesh } from "@/Benzaiten/types"

export default class SimpleVertexColor extends Material {
  static #buffer_layouts = [] as Array<GPUVertexBufferLayout>

  static {
    this.#buffer_layouts = [
      VertexBufferLayout(0, 12, 'float32x3') // Position
    ]
  }

  #buffer_slot_map = new Map<number, number>()

  #position_index: number

  constructor() {
    super(
      'SimpleVertexColor',
      { vertex, fragment },
      { vertex: {
        layouts: SimpleVertexColor.#buffer_layouts,
      }}
    )

    this.#position_index = Material.next_buffer_index

    this.#buffer_slot_map.set(0, this.#position_index)

    super.register_render_encoding(this.#buffer_slot_map)
  }

  apply_to(mesh: Mesh) {
    super.apply_to(mesh, this.#position_index)
  }
}
