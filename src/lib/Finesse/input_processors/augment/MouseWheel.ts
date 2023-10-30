import Mabueth from "@/Mabeuth"

import AugmentMovementProcessor from "@/Finesse/input_processors/augment/Movement"

import { AugmentAxes } from "./types"

export default class MouseWheel extends AugmentMovementProcessor {
  static #active  = false
  static #augment = 1

  static override get is_active() { return this.#active }

  static override get value(): AugmentAxes { return { x: 0, y: this.#augment, z: 0 } }

  static init() {
    Mabueth.on_mouse_wheel = e => {
      if (this.#active === false) this.#active = true

      this.#augment = Math.min(3, Math.max(0, this.#augment + this.augment_y_input('Mouse', e.y)))
    }
  }
}