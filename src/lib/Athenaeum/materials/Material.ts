import {
  RenderEncoding,
  ShaderBuffers,
  ShadersSources,
} from "../../Xenon/types"
import Xenon from "../../Xenon"

let buffer_index = 0

export default class Material {
  protected static get next_buffer_index(): number { return buffer_index++ }

  protected pass:     RenderEncoding
  protected pipeline: GPURenderPipeline
  protected vertices: Float32Array = new Float32Array([])

  constructor(
    name:    string,
    sources: ShadersSources,
    buffers: ShaderBuffers,
    instances = -1,
  ) {
    this.pipeline = Xenon.register_render_pipeline(`Material:${name}`, sources, buffers)

    if (instances === -1)
      this.pass = Xenon.register_render_encoding(this.pipeline, buffers.vertex.slot_map)
    else
      this.pass = Xenon.register_instanced_render_encoding(instances, this.pipeline, buffers.vertex.slot_map)
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

  protected reset(
    vertices:     Float32Array,
    buffer_index: number,
  ): void {
    this.vertices = vertices

    this.#refresh_context(buffer_index)
  }

  protected apply_to(
    vertices:     Float32Array,
    buffer_index: number,
  ): void {
    this.vertices = new Float32Array([...this.vertices, ...vertices])

    this.#refresh_context(buffer_index)
  }

  #refresh_context(buffer_index: number): void {
    Xenon.refresh_buffer(this.vertices, buffer_index)

    this.pass.vertices = this.vertices.length
  }
}