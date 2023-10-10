import { clamp } from "./helpers"

export default class Color {
  static Red   = new Color(1, 0, 0, 1)
  static Green = new Color(0, 1, 0, 1)
  static Blue  = new Color(0, 0, 1, 1)

  #r: number
  #g: number
  #b: number
  #a: number

  static from_html_rgb(
    red:   number,
    green: number,
    blue:  number,
  ): Color {
    return new Color(
      red   / 255,
      green / 255,
      blue  / 255,
      1,
    )
  }

  constructor(
    red   = 0,
    green = 0,
    blue  = 0,
    alpha = 1,
  ) {
    this.#r = clamp(red,   0, 1)
    this.#g = clamp(green, 0, 1)
    this.#b = clamp(blue,  0, 1)
    this.#a = clamp(alpha, 0, 1)
  }

  get as_f32_array(): Float32Array {
    return new Float32Array([
      this.#r,
      this.#g,
      this.#b,
      this.#a,
    ])
  }
}