import Input from "@/Finesse/settings"

import {
  MovementAxes,
  MovementMode,
} from "@/Finesse/types"

export default class MovementInputProcessor {
  protected static current: MovementAxes = new Float32Array([0, 0, 0])
 
  static get is_active(): boolean      { return false        }
  static get value():     MovementAxes { return this.current }

  protected static process_x_movement(
    mode:          MovementMode,
    value:         number,
    delta_seconds: number,
    dead_zone = 0,
  ): number {
    return Math.abs(value) > dead_zone ?
      (value - dead_zone) * (1 + dead_zone) * delta_seconds * Input[mode].Movement.X.Multiplier
       :
       0
  }

  protected static process_y_movement(
    mode:          MovementMode,
    value:         number,
    delta_seconds: number,
    dead_zone = 0,
  ): number {
    return Math.abs(value) > dead_zone ?
      (value - dead_zone) * (1 + dead_zone) * delta_seconds * Input[mode].Movement.Y.Multiplier
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