import Input from "@/Finesse/settings"

import {
  RotationAxes,
  RotationMode,
} from "@/Finesse/types"

/**
  This is required because, for some strange reason,
  static properties are not shared among sublclasses.
  So ... the only way for the Mouse and GamePad rotation
  processors to not clobber each other was to move these
  properties here :-(
**/
let x_rotation = 0
let y_rotation = 0

export default class RotationInputProcessor {
  protected static current: RotationAxes = new Float32Array([x_rotation, y_rotation])

  static get is_active(): boolean       { return false        }
  static get value():     RotationAxes  { return this.current }

  protected static get rotation(): RotationAxes {
    return this.current
  }

  protected static process_x_rotation(
    mode:          RotationMode,
    value:         number,
    delta_seconds: number,
    dead_zone = 0,
  ): void {
    const computed = Math.abs(value) > dead_zone ?
      (value - dead_zone) * (1 + dead_zone) * delta_seconds * Input[mode].Rotation.X.Multiplier
       :
       0

    let updated = x_rotation + computed

    updated = Math.min( Input[mode].Rotation.Y.Limit, updated)
    updated = Math.max(-Input[mode].Rotation.Y.Limit, updated)

    x_rotation = updated

    this.current[0] = x_rotation
    this.current[1] = y_rotation
  }

  protected static process_y_rotation(
    mode:          RotationMode,
    value:         number,
    delta_seconds: number,
    dead_zone = 0,
  ): void {
    y_rotation -= Math.abs(value) > dead_zone ?
      (value - dead_zone) * (1 + dead_zone) * delta_seconds * Input[mode].Rotation.Y.Multiplier
       :
       0
  }
}