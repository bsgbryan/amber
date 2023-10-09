import Scale from "./Scale"

import { DeltaTime } from "./types"

export default class Kali {
  static #scaled_delta_seconds   = 0
  static #unscaled_delta_seconds = 0

  static #last_tick = 0
  static #tick      = 0

  static get delta_seconds(): DeltaTime {
    return {
      scaled:   this.#scaled_delta_seconds,
      unscaled: this.#unscaled_delta_seconds,
    }
  }

  static update(): void {
    this.#last_tick = this.#tick
    this.#tick      = performance.now()

    const unscaled_delta_seconds = (this.#tick - this.#last_tick) * .001
    const scaled_delta_seconds   = unscaled_delta_seconds * Scale.value

    this.#scaled_delta_seconds   = scaled_delta_seconds
    this.#unscaled_delta_seconds = unscaled_delta_seconds
  }
}