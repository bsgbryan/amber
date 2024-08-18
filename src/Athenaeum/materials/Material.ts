import { Mesh } from "@/Benzaiten/types"

import {
  RenderEncoding,
  ShaderBuffers,
  ShadersSources,
} from "@/Xenon/types"

import Xenon from "@/Xenon"

let buffer_index = 0

export default class Material {
  protected static get next_buffer_index(): number { return buffer_index++ }

  protected pass:     RenderEncoding
  protected pipeline: GPURenderPipeline
  protected vertices: Float32Array = new Float32Array([])
  protected indices:  Uint16Array  = new Uint16Array([])

  constructor(
    name:    string,
    sources: ShadersSources,
    buffers: ShaderBuffers,
  ) {
    this.pipeline = Xenon.register_render_pipeline(`Material:${name}`, sources, buffers)
  }

  protected register_render_encoding(
    slot_map: Map<number, number>,
    instances = -1,
  ): void {
    if (instances === -1)
      this.pass = Xenon.register_render_encoding(this.pipeline, slot_map)
    else
      this.pass = Xenon.register_instanced_render_encoding(instances, this.pipeline, slot_map)
  }

  protected fill(
    count: number,
    items: Float32Array,
  ): Float32Array {
    const output = new Float32Array(count * items.length)

    for (let c = 0; c < output.length; c++)
      for (let i = 0; i < items.length; i++)
        output[(c * items.length) + i] = items[i]

    return output
  }

  protected apply_to(
    mesh:         Mesh,
    buffer_index: number,
  ): void {
    this.vertices = new Float32Array([...this.vertices, ...mesh.vertices])
    // TODO: Create a IndexedMaterial if needed
    // this.indices  = new Uint16Array ([...this.indices,  ...mesh.indices ])

    this.#refresh_context(buffer_index)
  }

  #refresh_context(buffer_index: number): void {
    Xenon.create_vertex_buffer(this.vertices, buffer_index)
    // Xenon.create_index_buffer (this.indices,  buffer_index)

    this.pass.vertices = this.vertices.length
    // this.pass.indices  = this.indices.length
  }
}
