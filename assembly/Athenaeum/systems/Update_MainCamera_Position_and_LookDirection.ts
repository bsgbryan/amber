import {
  from_axis_angle,
  rotate,
} from "../../Sunya/Quaternion"

import {
  add,
  spherical,
} from "../../Sunya/Vector3D"

import {
  UP,
  degrees_to_radians,
} from "../../Sunya/helpers"

export function execute(
  position: Float32Array,
  movement: Float32Array,
  rotation: Float32Array,
  augment:  f32,
): Float32Array {
  const q  = from_axis_angle(UP(), degrees_to_radians(rotation[1])),
        v0 = f32x4(movement[0], movement[1], movement[2], 0),
        v1 = f32x4(augment,     augment,     augment,     0),
        r  = f32x4.mul(v0, v1),
        m  = new Float32Array(3)

  m[0] = f32x4.extract_lane(r, 0)
  m[1] = f32x4.extract_lane(r, 1)
  m[2] = f32x4.extract_lane(r, 2)

  const rotated = rotate(m, q),
        updated = add(rotated, position),
        target  = spherical(rotation[0], rotation[1], 1.0),
        output  = new Float32Array(6)

  output[0] = updated[0]
  output[1] = updated[1]
  output[2] = updated[2]

  output[3] = target[0]
  output[4] = target[1]
  output[5] = target[2]

  return output
}