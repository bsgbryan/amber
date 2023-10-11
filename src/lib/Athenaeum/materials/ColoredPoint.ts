import { InstancedVertexBufferLayout } from "../../Xenon/helpers"
import   Xenon                         from "../../Xenon"

import fragment from '../shaders/fragment/SingleColor.wgsl?raw'
import vertex   from '../shaders/vertex/ColoredPoint.wgsl?raw'

import Color from "../Color"

import Material from "./Material"

export default class ColoredPoint extends Material {
  static #buffer_layouts = [] as Array<GPUVertexBufferLayout>

  static {
    this.#buffer_layouts = [
      InstancedVertexBufferLayout(0, 12, 'float32x3'), // Position
      InstancedVertexBufferLayout(1,  4, 'float32'),   // Point Size
      InstancedVertexBufferLayout(2, 16, 'float32x4'), // Color
    ]
  }

  #buffer_slot_map = new Map<number, number>()

  #position_index: number
  #size_index:     number
  #color_index:    number

  #colors: Float32Array = new Float32Array([])
  #sizes:  Float32Array = new Float32Array([])

  constructor(
    public color: Color,
    public size = 50,
  ) {
    super(
      'ColoredPoint',
      { vertex, fragment },
      { vertex: {
        layouts: ColoredPoint.#buffer_layouts,
      }},
    )

    this.#position_index = Material.next_buffer_index
    this.#size_index     = Material.next_buffer_index
    this.#color_index    = Material.next_buffer_index

    this.#buffer_slot_map.set(0, this.#position_index)
    this.#buffer_slot_map.set(1, this.#size_index)
    this.#buffer_slot_map.set(2, this.#color_index)

    super.register_render_encoding(this.#buffer_slot_map, 6)
  }

  override reset(vertices: Float32Array): void {
    super.reset(vertices, this.#position_index)

    this.#sizes = super.fill(
      vertices.length / 3,
      new Float32Array([this.size]),
    )

    this.#colors = super.fill(
      vertices.length / 3,
      this.color.as_f32_array,
    )

    this.#refresh_context()
  }

  override apply_to(vertices: Float32Array): void {
    super.apply_to(vertices, this.#position_index)

    this.#sizes = new Float32Array([
      ...this.#sizes,
      ...super.fill(
        vertices.length / 3,
        new Float32Array([this.size]),
      )
    ])

    this.#colors = new Float32Array([
      ...this.#colors,
      ...super.fill(
        vertices.length / 3,
        this.color.as_f32_array,
      )
    ])

    this.#refresh_context()
  }

  #refresh_context(): void {
    Xenon.refresh_buffer(this.#sizes,  this.#size_index)
    Xenon.refresh_buffer(this.#colors, this.#color_index)
  }
}