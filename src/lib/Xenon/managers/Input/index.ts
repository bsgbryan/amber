import Input from "./settings"

import {
  MovementAxes,
  RotationAxes,
} from "./types"

export default class InputManager {
  static #x_rotation = 0
  static #y_rotation = 0

  static movement(delta_seconds: number): MovementAxes {
    const gp = navigator.getGamepads()[0]

    if (gp) {
      const x_dead   = Input.GamePad.Movement.X.DeadZone
      const x_input  = gp.axes[0]
      const x_output = Math.abs(x_input) > Input.GamePad.Movement.X.DeadZone ?
        (x_input - x_dead) * (1 + x_dead) * delta_seconds * Input.GamePad.Movement.X.Multiplier
         :
         0

      const z_dead   = Input.GamePad.Movement.Z.DeadZone
      const z_input  = gp.axes[1]
      const z_output = Math.abs(z_input) > Input.GamePad.Movement.Z.DeadZone ?
        (z_input - z_dead) * (1 + z_dead) * delta_seconds * Input.GamePad.Movement.Z.Multiplier
         :
         0

      return {
        x: x_output,
        z: z_output,
      }
    }
    else return {
      x: 0,
      z: 0,
    }
  }

  static rotation(delta_seconds: number): RotationAxes {
    const gp = navigator.getGamepads()[0]

    if (gp) {
      const x_dead   = Input.GamePad.Rotation.X.DeadZone
      const x_input  = gp.axes[3]
      const x_output = Math.abs(x_input) > Input.GamePad.Rotation.X.DeadZone ?
        (x_input - x_dead) * (1 + x_dead) * delta_seconds * Input.GamePad.Rotation.X.Multiplier
         :
         0

      this.#x_rotation += x_output
      this.#x_rotation  = Math.min(this.#x_rotation,  Input.GamePad.Rotation.Y.Limit)
      this.#x_rotation  = Math.max(this.#x_rotation, -Input.GamePad.Rotation.Y.Limit)

      const y_dead   = Input.GamePad.Rotation.Y.DeadZone
      const y_input  = gp.axes[2]
      const y_output = Math.abs(y_input) > Input.GamePad.Rotation.Y.DeadZone ?
        (y_input - y_dead) * (1 + y_dead) * delta_seconds * Input.GamePad.Rotation.Y.Multiplier
         :
         0

      this.#y_rotation -= y_output
    }

    return {
      x: this.#x_rotation,
      y: this.#y_rotation,
    }
  }
}