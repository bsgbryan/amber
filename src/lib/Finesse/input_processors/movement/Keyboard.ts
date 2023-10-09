import Xenon from "../../../Xenon"
import Input from "../../settings"
import { MovementAxes } from "../../types"

import MovementInputProcessor from "./Base"

export default class Keyboard extends MovementInputProcessor {
  static #active_keys = {
    Backward: false,
    Forward:  false,
    Left:     false,
    Right:    false,
  }

  static #active = false

  static init() {
    document.addEventListener('keydown', e => {
      if (this.#active === false) this.#active = true

      switch (e.key) {
        case Input.Keyboard.Movement.Bindings.Backward:
          if (this.#active_keys.Backward === false) this.#active_keys.Backward = true
          break
        case Input.Keyboard.Movement.Bindings.Forward:
          if (this.#active_keys.Forward === false) this.#active_keys.Forward = true
          break
        case Input.Keyboard.Movement.Bindings.Left:
          if (this.#active_keys.Left === false) this.#active_keys.Left = true
          break
        case Input.Keyboard.Movement.Bindings.Right:
          if (this.#active_keys.Right === false) this.#active_keys.Right = true
          break
        case 'Escape':
          document.exitPointerLock()
          break
        default:
          console.log(e.key)
          break
      }
    })

    document.addEventListener('keyup', e => {
      switch (e.key) {
        case Input.Keyboard.Movement.Bindings.Backward:
          if (this.#active_keys.Backward === true) this.#active_keys.Backward = false
          break
        case Input.Keyboard.Movement.Bindings.Forward:
          if (this.#active_keys.Forward === true) this.#active_keys.Forward = false
          break
        case Input.Keyboard.Movement.Bindings.Left:
          if (this.#active_keys.Left === true) this.#active_keys.Left = false
          break
        case Input.Keyboard.Movement.Bindings.Right:
          if (this.#active_keys.Right === true) this.#active_keys.Right = false
          break
        default: break
      }
    })
  }

  static override get is_active(): boolean {
    return this.#active
  }

  static override get value(): MovementAxes {
    let x_input = 0
    let z_input = 0

    if (this.#active_keys.Backward) z_input += 1
    else z_input -= 1

    if (this.#active_keys.Forward) z_input -= 1
    else z_input += 1

    if (this.#active_keys.Left) x_input -= 1
    else x_input += 1

    if (this.#active_keys.Right) x_input += 1
    else x_input -= 1

    return {
      x: this.process_x_movement(
        'Keyboard',
        x_input,
        Xenon.delta_seconds.unscaled
      ),
      z: this.process_z_movement(
        'Keyboard',
        z_input,
        Xenon.delta_seconds.unscaled
      ),
    }
  }
}