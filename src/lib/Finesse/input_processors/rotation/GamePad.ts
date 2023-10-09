import Kali from "../../../Kali"

import Input from "../../settings"

import { RotationAxes } from "../../types"

import { InputAxes } from "../types"

import RotationInputProcessor from "./Base"

export default class GamePad extends RotationInputProcessor {
  static get #input(): InputAxes {
    const gp = navigator.getGamepads()[0]

    return {
      x: gp?.axes[3],
      y: gp?.axes[2],
    }
  }

  static get is_active(): boolean {
    if (
      Math.abs(this.#input?.x) > Input.GamePad.Rotation.ActiveThreshhold ||
      Math.abs(this.#input?.y) > Input.GamePad.Rotation.ActiveThreshhold
    ) return true
    else return false
  }

  static override get value(): RotationAxes {
    super.process_x_rotation(
     'GamePad',
      this.#input.x,
      Kali.delta_seconds.unscaled,
      Input.GamePad.Rotation.X.DeadZone,
    )

    super.process_y_rotation(
     'GamePad',
      this.#input.y,
      Kali.delta_seconds.unscaled,
      Input.GamePad.Rotation.Y.DeadZone,
    )

    return super.rotation
  }
}