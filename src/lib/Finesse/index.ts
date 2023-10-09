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

  static init() {
    KeyboardMovementProcessor.init()
    MouseRotationProcessor.init()
  }

  static get movement(): MovementAxes {
    return this.#movement_processor.value
  }

  static get rotation(): RotationAxes {
    return this.#rotation_processor.value
  }
}