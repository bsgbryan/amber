import Kali from "@/Kali"
import Mabueth from "@/Mabeuth"

import Input from "@/Finesse/settings"

import { RotationAxes } from "@/Finesse/types"

import RotationInputProcessor from "@/Finesse/input_processors/rotation/Base"

export default class GamePad extends RotationInputProcessor {
  static get #input(): RotationAxes {
    return Mabueth.controller.Look
  }

  static get is_active(): boolean {
    if (
      Math.abs(this.#input[0]) > Input.GamePad.Rotation.ActiveThreshhold ||
      Math.abs(this.#input[1]) > Input.GamePad.Rotation.ActiveThreshhold
    ) return true
    else return false
  }

  static override get value(): RotationAxes {
    super.process_x_rotation(
     'GamePad',
      this.#input[0],
      Kali.delta_seconds.unscaled,
      Input.GamePad.Rotation.X.DeadZone,
    )

    super.process_y_rotation(
     'GamePad',
      this.#input[1],
      Kali.delta_seconds.unscaled,
      Input.GamePad.Rotation.Y.DeadZone,
    )

    return super.rotation
  }
}