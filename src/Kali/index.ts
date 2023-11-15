import Scale from "@/Kali/Scale"

import { DeltaTime } from "@/Kali/types"

export default class Kali {
  static #scaled_delta_seconds   = 0
  static #unscaled_delta_seconds = 0

  static #last_tick = 0
  static #tick      = 0

  /**
   * The number of seconds between frame engine ticks
   * 
   * @remarks
   * Both the unscaled and scaled values are returned
   * 
   * @returns The scaled and unscaled seconds fetween engine ticks as a {@link DeltaTime} instance
   */
  static get delta_seconds(): DeltaTime {
    return {
      scaled:   this.#scaled_delta_seconds,
      unscaled: this.#unscaled_delta_seconds,
    }
  }

  /**
   * Updates the scaled and unscaled seconds between engine ticks
   */
  static update(): void {
    this.#last_tick = this.#tick
    this.#tick      = performance.now()

    const unscaled_delta_seconds = (this.#tick - this.#last_tick) * .001
    const scaled_delta_seconds   = unscaled_delta_seconds * Scale.value

    this.#scaled_delta_seconds   = scaled_delta_seconds
    this.#unscaled_delta_seconds = unscaled_delta_seconds
  }
}