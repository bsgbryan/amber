import Kali from "@/Kali"

import Input from "@/Finesse/settings"

import { MovementAxes } from "@/Finesse/types"

import MovementInputProcessor from "@/Finesse/input_processors/movement/Base"

import { InputAxes } from "@/Finesse/input_processors/types"

export default class GamePad extends MovementInputProcessor {
  static get #input(): InputAxes {
    const gp = navigator.getGamepads()[0]

    return {
      x: gp?.axes[0],
      y: gp?.axes[1],
    }
  }

  static get is_active(): boolean {
    if (
      Math.abs(this.#input?.x) > Input.GamePad.Movement.ActiveThreshhold ||
      Math.abs(this.#input?.y) > Input.GamePad.Movement.ActiveThreshhold
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
        this.#input.y,
        Kali.delta_seconds.unscaled,
        Input.GamePad.Movement.Z.DeadZone,
      ),
    }
  }
}