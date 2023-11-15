import Kali from "@/Kali"
import Mabueth from "@/Mabeuth"

import Input from "@/Finesse/settings"

import { MovementAxes } from "@/Finesse/types"

import MovementInputProcessor from "@/Finesse/input_processors/movement/Base"

export default class GamePad extends MovementInputProcessor {
  static get #input(): MovementAxes {
    return Mabueth.controller.Move
  }

  static get is_active(): boolean {
    if (
      Math.abs(this.#input[0] || 0) > Input.GamePad.Movement.ActiveThreshhold ||
      Math.abs(this.#input[2] || 0) > Input.GamePad.Movement.ActiveThreshhold
    ) return true
    else return false
  }

  static override get value(): MovementAxes {
    this.current[0] = super.process_x_movement(
      'GamePad',
      this.#input[0],
      Kali.delta_seconds.unscaled,
      Input.GamePad.Movement.X.DeadZone,
    )

    this.current[2] = super.process_z_movement(
      'GamePad',
      this.#input[2],
      Kali.delta_seconds.unscaled,
      Input.GamePad.Movement.Z.DeadZone,
    )

    return super.value
  }
}