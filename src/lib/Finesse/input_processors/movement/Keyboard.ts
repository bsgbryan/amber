import Kali from "@/Kali"
import Mabueth from "@/Mabeuth"

import Input from "@/Finesse/settings"

import { MovementAxes } from "@/Finesse/types"

import MovementInputProcessor from "@/Finesse/input_processors/movement/Base"

export default class Keyboard extends MovementInputProcessor {
  static #active_keys = {
    Backward: false,
    Down:     false,
    Forward:  false,
    Left:     false,
    Right:    false,
    Up:       false,
  }

  static #active = false

  static init() {
    Mabueth.on_key_down = e => {
      if (this.#active === false) this.#active = true

      switch (e.key) {
        case Input.Keyboard.Movement.Bindings.Backward:
          if (this.#active_keys.Backward === false) this.#active_keys.Backward = true
          break
        case Input.Keyboard.Movement.Bindings.Down:
          if (this.#active_keys.Down === false) this.#active_keys.Down = true
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
        case Input.Keyboard.Movement.Bindings.Up:
          if (this.#active_keys.Up === false) this.#active_keys.Up = true
          break
        default:
          console.log(e.key)
          break
      }
    }

    Mabueth.on_key_up = e => {
      switch (e.key) {
        case Input.Keyboard.Movement.Bindings.Backward:
          if (this.#active_keys.Backward === true) this.#active_keys.Backward = false
          break
        case Input.Keyboard.Movement.Bindings.Down:
          if (this.#active_keys.Down === true) this.#active_keys.Down = false
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
        case Input.Keyboard.Movement.Bindings.Up:
          if (this.#active_keys.Up === true) this.#active_keys.Up = false
          break
        default: break
      }
    }
  }

  static override get is_active(): boolean {
    return this.#active
  }

  static override get value(): MovementAxes {
    let x_input = 0
    let y_input = 0
    let z_input = 0

    if (this.#active_keys.Backward) z_input -= 1
    else z_input += 1

    if (this.#active_keys.Down) y_input -= 1
    else y_input += 1

    if (this.#active_keys.Forward) z_input += 1
    else z_input -= 1

    if (this.#active_keys.Left) x_input -= 1
    else x_input += 1

    if (this.#active_keys.Right) x_input += 1
    else x_input -= 1

    if (this.#active_keys.Up) y_input += 1
    else y_input -= 1

    this.current[0] = this.process_x_movement(
      'Keyboard',
        x_input,
        Kali.delta_seconds.unscaled
    )

    this.current[1] = -this.process_y_movement(
      'Keyboard',
        y_input,
        Kali.delta_seconds.unscaled
    )

    this.current[2] = this.process_z_movement(
      'Keyboard',
        z_input,
        Kali.delta_seconds.unscaled
    )

    return super.value
  }
}