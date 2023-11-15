import Kali from "@/Kali"
import Mabueth from "@/Mabeuth"

import { RotationAxes } from "@/Finesse/types"

import RotationInputProcessor from "@/Finesse/input_processors/rotation/Base"

export default class Keyboard extends RotationInputProcessor {
  static #active = false

  static #rotation = {
    processed: false,
    x:         0,
    y:         0,
  }

  static init(): void {
    Mabueth.on_mouse_move = e => {
      if (this.#active === false) this.#active = true
  
      this.#rotation.y         = e.x
      this.#rotation.x         = e.y
      this.#rotation.processed = false
    }
  }

  static get is_active(): boolean {
    return this.#active
  }

  static override get value(): RotationAxes {
    const x_input = this.#rotation.x
    const y_input = this.#rotation.y

    if (this.#rotation.processed === false) {
      this.#rotation = {
        processed: true,
        x:         0,
        y:         0,
      }
    }
  
    super.process_x_rotation(
     'Mouse',
     -x_input,
      Kali.delta_seconds.unscaled,
    )

    super.process_y_rotation(
     'Mouse',
      y_input,
      Kali.delta_seconds.unscaled,
    )

    return super.rotation
  }
}