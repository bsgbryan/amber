import { Component } from "../../Legion"

import { RenderPass, ShaderBuffers, ShadersSources } from "../../Xenon/types"
import Xenon from "../../Xenon"

export default class Material extends Component {
  protected pass:     RenderPass
  protected pipeline: GPURenderPipeline
  protected vertices: Float32Array = new Float32Array([])

  constructor(
    name:    string,
    sources: ShadersSources,
    buffers: ShaderBuffers,
  ) {
    super()

    this.pipeline = Xenon.register_render_pipeline(`Material:${name}`, sources, buffers)
    this.pass     = Xenon.register_instanced_render_pass(6, this.pipeline, buffers.vertex.slot_map)
  }

  protected fill(
    count: number,
    items: Float32Array
  ): Float32Array {
    const output = new Float32Array(count * items.length)

    for (let c = 0; c < output.length; c++)
      for (let i = 0; i < items.length; i++)
        output[(c * items.length) + i] = items[i]

    return output
  }

  protected reset(vertices: Float32Array): void {
    this.vertices = vertices

    this.#refresh_context()
  }

  protected apply_to(vertices: Float32Array): void {
    this.vertices = new Float32Array([...this.vertices, ...vertices])

    this.#refresh_context()
  }

  #refresh_context(): void {
    Xenon.refresh_buffer(this.vertices, 0)

    this.pass.vertices = this.vertices.length

    this.dirty = true
  }
}