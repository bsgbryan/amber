import { InstancedVertexBufferLayout } from "../../Xenon/helpers"
import   Xenon                         from "../../Xenon"

import fragment from '../shaders/fragment/SingleColor.wgsl?raw'
import vertex   from '../shaders/vertex/ColoredPoint.wgsl?raw'

import Color from "../Color"

import Material from "./Material"

export default class ColoredPoint extends Material {
  static #buffer_slot_map = new Map<number, number>()
  static #buffer_layouts  = [] as Array<GPUVertexBufferLayout>

  static {
    this.#buffer_slot_map.set(0, 0)
    this.#buffer_slot_map.set(1, 1)
    this.#buffer_slot_map.set(2, 2)

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
      }}
    )
  }

  override reset(vertices: Float32Array): void {
    super.reset(vertices)

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
    super.apply_to(vertices)

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
    Xenon.refresh_buffer(this.#sizes,  1)
    Xenon.refresh_buffer(this.#colors, 2)
  }
}