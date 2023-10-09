import Input from "../../settings"

import {
  MovementAxes,
  MovementMode,
} from "../../types"

export default class MovementInputProcessor {
  static get is_active(): boolean      { return false          }
  static get value():     MovementAxes { return { x: 0, z: 0 } }

  protected static process_x_movement(
    mode:          MovementMode,
    value:         number,
    delta_seconds: number,
    dead_zone = 0.
  ): number {
    return Math.abs(value) > dead_zone ?
      (value - dead_zone) * (1 + dead_zone) * delta_seconds * Input[mode].Movement.X.Multiplier
       :
       0
  }

  protected static process_z_movement(
    mode:          MovementMode,
    value:         number,
    delta_seconds: number,
    dead_zone = 0,
  ): number {
    return Math.abs(value) > dead_zone ?
      (value - dead_zone) * (1 + dead_zone) * delta_seconds * Input[mode].Movement.Z.Multiplier
       :
       0
  }
}