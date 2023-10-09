import {
  MovementAxes,
  RotationAxes,
} from "./types"

import MovementInputProcessor from "./input_processors/movement/Base"
import RotationInputProcessor from "./input_processors/rotation/Base"

import GamePadMovementProcessor  from "./input_processors/movement/GamePad"
import KeyboardMovementProcessor from "./input_processors/movement/Keyboard"

import GamePadRotationProcessor from "./input_processors/rotation/GamePad"
import MouseRotationProcessor   from "./input_processors/rotation/Mouse"

export default class InputManager {
  static #moved:   MovementAxes = { x: 0, z: 0 }
  static #rotated: RotationAxes = { x: 0, y: 0 }

  static init() {
    KeyboardMovementProcessor.init()
    MouseRotationProcessor.init()
  }

  static capture(): void {
    this.#moved   = this.#movement_processor.value
    this.#rotated = this.#rotation_processor.value
  }

  static get #movement_processor(): typeof MovementInputProcessor {
    return GamePadMovementProcessor.is_active ?
      GamePadMovementProcessor
      :
      KeyboardMovementProcessor
  }
  static get #rotation_processor(): typeof RotationInputProcessor {
    return GamePadRotationProcessor.is_active ?
      GamePadRotationProcessor
      :
      MouseRotationProcessor
  }

  static get movement(): MovementAxes {
    return this.#moved
  }

  static get rotation(): RotationAxes {
    return this.#rotated
  }
}