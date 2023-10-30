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
      Math.abs(this.#input?.x) > Input.GamePad.Movement.ActiveThreshhold ||
      Math.abs(this.#input?.z) > Input.GamePad.Movement.ActiveThreshhold
    ) return true
    else return false
  }

  static override get value(): MovementAxes {
    return {
      x: super.process_x_movement(
       'GamePad',
        this.#input.x,
        Kali.delta_seconds.unscaled,
        Input.GamePad.Movement.X.DeadZone,
      ),
      y: 0,
      z: super.process_z_movement(
       'GamePad',
       -this.#input.z,
        Kali.delta_seconds.unscaled,
        Input.GamePad.Movement.Z.DeadZone,
      ),
    }
  }
}