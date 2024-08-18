import { from_axis_angle } from "../Sunya/Quaternion"
import { UP } from "../Sunya/helpers"

// NOTE: This is identical to the updated Quaternion.from_axis_angle.
//       I'm keeping it here as a test control, and second point of data.
function simd_from_axis_angle(
  axis:    Float32Array,
  radians: f32,
): Float32Array {
  const output = new Float32Array(4)

  radians *= .5

  const s  = Math.sin(radians) as f32,
        v0 = f32x4(axis[0], axis[1], axis[2], 0),
        v1 = f32x4(s,       s,       s,       0),
        r  = f32x4.mul(v0, v1)

  output[0] = f32x4.extract_lane(r, 0)
  output[1] = f32x4.extract_lane(r, 1)
  output[2] = f32x4.extract_lane(r, 2)
  output[3] = Math.cos(radians) as f32

  return output
}

const limit = 1_000_000,
      up    = UP()

export function execute(): f64 {
  const start = performance.now()

  for (let i = 0; i < limit; i++)
    from_axis_angle(up, 45)

  return performance.now() - start
}

export function execute_simd(): f64 {
  const start = performance.now()

  for (let i = 0; i < limit; i++)
    simd_from_axis_angle(up, 45)

  return performance.now() - start
}