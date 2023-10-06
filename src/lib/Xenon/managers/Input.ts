import { Camera, Input } from "../settings"

export default class InputManager {
  static #x_rotation = 0
  static #y_rotation = 0

  static movement(delta_seconds: number): {x: number, z: number} {
    const gp = navigator.getGamepads()[0]

    if (gp) {
      return {
        x: Math.abs(gp?.axes[0]) > Input.AxisDeadZone ? gp?.axes[0] * delta_seconds * Input.XMovementSpeedMultiplier : 0,
        z: Math.abs(gp?.axes[1]) > Input.AxisDeadZone ? gp?.axes[1] * delta_seconds * Input.ZMovementSpeedMultiplier : 0,
      }
    }
    else return {
      x: 0,
      z: 0,
    }
  }

  static rotation(delta_seconds: number): {x: number, y: number} {
    const gp = navigator.getGamepads()[0]

    if (gp) {
      this.#y_rotation -= Math.abs(gp?.axes[2]) > .1 ? gp?.axes[2] * delta_seconds * Input.HorizontalLookSpeedMultiplier : 0
      this.#x_rotation += Math.abs(gp?.axes[3]) > .1 ? gp?.axes[3] * delta_seconds * Input.VerticalLookSpeedMultiplier   : 0
    }

    this.#x_rotation = Math.min(this.#x_rotation,  Camera.VerticalLookLimit)
    this.#x_rotation = Math.max(this.#x_rotation, -Camera.VerticalLookLimit)

    return {
      x: this.#x_rotation,
      y: this.#y_rotation,
    }
  }
}