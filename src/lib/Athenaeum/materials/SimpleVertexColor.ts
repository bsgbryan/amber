import { Mesh } from "@/Benzaiten/types"

import { VertexBufferLayout } from "@/Xenon/helpers"

import vertex   from '@/Athenaeum/shaders/vertex/PositionBasedGradient.wgsl'
import fragment from '@/Athenaeum/shaders/fragment/SingleColor.wgsl'

import Material from "@/Athenaeum/materials/Material"

export default class SimpleVertexColor extends Material {
  static #buffer_layouts = [] as Array<GPUVertexBufferLayout>

  static {
    this.#buffer_layouts = [
      VertexBufferLayout(0, 12, 'float32x3') // Position
    ]
  }

  #buffer_slot_map = new Map<number, number>()

  #buffer_index: number

  constructor() {
    super(
      'SimpleVertexColor',
      { vertex, fragment },
      { vertex: {
        layouts: SimpleVertexColor.#buffer_layouts,
      }}
    )
    
    this.#buffer_index = Material.next_buffer_index

    this.#buffer_slot_map.set(0, this.#buffer_index)

    super.register_render_encoding(this.#buffer_slot_map)
  }

  override apply_to(mesh: Mesh): void {
    super.apply_to(mesh, this.#buffer_index)
  }
}