import { InstancedVertexBufferLayout } from "../../Xenon/helpers"
import   Xenon                         from "../../Xenon"

import fragment from '../shaders/fragment/SingleColor.wgsl?raw'
import vertex   from '../shaders/vertex/ColoredPoint.wgsl?raw'

import Color from "../Color"

import Material from "./Material"

export default class ColoredPoint extends Material {
  static #buffer_slot_map = new Map<number, number>()
  static #buffer_layouts  = [] as Array<GPUVertexBufferLayout>

  static #position: number
  static #size:     number
  static #color:    number

  static {
    this.#position = super.next_buffer_index
    this.#size     = super.next_buffer_index
    this.#color    = super.next_buffer_index

    this.#buffer_slot_map.set(0, this.#position)
    this.#buffer_slot_map.set(1, this.#size)
    this.#buffer_slot_map.set(2, this.#color)

    this.#buffer_layouts = [
      InstancedVertexBufferLayout(0, 12, 'float32x3', 0), // Position
      InstancedVertexBufferLayout(1,  4, 'float32',   0), // Point Size
      InstancedVertexBufferLayout(2, 16, 'float32x4', 0), // Color
    ]
  }

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
        slot_map: ColoredPoint.#buffer_slot_map,
        layouts:  ColoredPoint.#buffer_layouts,
      }}, 6,
    )
  }

  override reset(vertices: Float32Array): void {
    super.reset(vertices, ColoredPoint.#position)

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
    super.apply_to(vertices, ColoredPoint.#position)

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
    Xenon.refresh_buffer(this.#sizes,  ColoredPoint.#size)
    Xenon.refresh_buffer(this.#colors, ColoredPoint.#color)
  }
}