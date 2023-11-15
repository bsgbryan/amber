import Input from "@/Finesse/settings"

import {
  MovementAxes,
  MovementMode,
} from "@/Finesse/types"

export default class AugmentMovementProcessor {
  static get is_active(): boolean      { return false                       }
  static get value():     MovementAxes { return new Float32Array([0, 0, 0]) }

  protected static augment_y_input(
    mode:  MovementMode,
    value: number,
  ): number {
    return -(value * Math.abs(1 / value)) * Input[mode].Augment.Y.Multiplier
  }
}