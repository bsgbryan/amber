import {
  MovementAxes,
  RotationAxes,
} from "@/Finesse/types"

import MovementInputProcessor from "@/Finesse/input_processors/movement/Base"
import RotationInputProcessor from "@/Finesse/input_processors/rotation/Base"

import GamePadMovementProcessor   from "@/Finesse/input_processors/movement/GamePad"
import KeyboardMovementProcessor  from "@/Finesse/input_processors/movement/Keyboard"
import MouseWheelAugmentProcessor from "@/Finesse/input_processors/augment/MouseWheel"

import GamePadRotationProcessor from "@/Finesse/input_processors/rotation/GamePad"
import MouseRotationProcessor   from "@/Finesse/input_processors/rotation/Mouse"

import AugmentMovementProcessor from "@/Finesse/input_processors/augment/Movement"

export default class Finesse {
  static init() {
    KeyboardMovementProcessor.init()
    MouseRotationProcessor.init()
    MouseWheelAugmentProcessor.init()
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

  static get #augment_processor(): typeof AugmentMovementProcessor {
    return MouseWheelAugmentProcessor.is_active ?
      MouseWheelAugmentProcessor
      :
      MouseWheelAugmentProcessor // TODO: Change this when I add another augment processor
  }

  static get movement(): MovementAxes {
    return this.#movement_processor.value
  }

  static get rotation(): RotationAxes {
    return this.#rotation_processor.value
  }

  static get augment(): RotationAxes {
    return this.#augment_processor.value
  }
}