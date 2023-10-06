import {
  Camera,
  Input,
} from "../settings"

import {
  AXIS,
  MODE,
} from "./CONSTANTS"

import {
  Axis,
  Mode,
} from "./types"

const {
  X,
  Y,
  Z,
} = AXIS

const {
  Look,
  Move,
} = MODE

export default class InputManager {
  static #x_rotation = 0
  static #y_rotation = 0

  static #calculate(
    axis:         Axis,
    mode:         Mode,
    value:         number,
    delta_seconds: number,
  ): number {
    return (value * delta_seconds * Input[mode][axis].Multiplier) - Input.AxisDeadZone * (1 + Input.AxisDeadZone)
  }

  static movement(delta_seconds: number): {x: number, z: number} {
    const gp = navigator.getGamepads()[0]

    if (gp) {
      return {
        x: Math.abs(gp?.axes[0]) > Input.AxisDeadZone ? this.#calculate(X, Move, gp.axes[0], delta_seconds) : 0,
        z: Math.abs(gp?.axes[1]) > Input.AxisDeadZone ? this.#calculate(Z, Move, gp.axes[1], delta_seconds) : 0,
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
      this.#y_rotation -= Math.abs(gp?.axes[2]) > .1 ? this.#calculate(Y, Look, gp.axes[2], delta_seconds) : 0
      this.#x_rotation += Math.abs(gp?.axes[3]) > .1 ? this.#calculate(X, Look, gp.axes[3], delta_seconds) : 0

      this.#x_rotation = Math.min(this.#x_rotation,  Camera.VerticalLookLimit)
      this.#x_rotation = Math.max(this.#x_rotation, -Camera.VerticalLookLimit)
    }

    return {
      x: this.#x_rotation,
      y: this.#y_rotation,
    }
  }
}