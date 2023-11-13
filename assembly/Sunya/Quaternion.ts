export function from_axis_angle(
  axis:    Float32Array,
  radians: f32,
): Float32Array {
  const output = new Float32Array(4)

  radians *= .5

  const s = Math.sin(radians) as f32

  output[0] = s * axis[0]
  output[1] = s * axis[1]
  output[2] = s * axis[2]
  output[3] = Math.cos(radians) as f32

  return output
}

export function multiply(
  a: Float32Array,
  b: Float32Array,
): Float32Array {
  const output = new Float32Array(4)

  const v0 = f32x4(a[0], a[3], a[1], a[2]),
        v1 = f32x4(b[3], b[0], b[2], b[1]),
        r0 = f32x4.mul(v0, v1)

  output[0] = f32x4.extract_lane(r0, 0) + f32x4.extract_lane(r0, 1) + f32x4.extract_lane(r0, 2) - f32x4.extract_lane(r0, 3)

  const v2 = f32x4(a[1], a[3], a[2], a[0]),
        v3 = f32x4(b[3], b[1], b[0], b[2]),
        r1 = f32x4.mul(v2, v3)

  output[1] = f32x4.extract_lane(r1, 0) + f32x4.extract_lane(r1, 1) + f32x4.extract_lane(r1, 2) - f32x4.extract_lane(r1, 3)

  const v4 = f32x4(a[2], a[3], a[0], a[1]),
        v5 = f32x4(b[3], b[2], b[1], b[0]),
        r2 = f32x4.mul(v4, v5)

  output[2] = f32x4.extract_lane(r2, 0) + f32x4.extract_lane(r2, 1) + f32x4.extract_lane(r2, 2) - f32x4.extract_lane(r2, 3)

  const v6 = f32x4(a[3], a[0], a[1], a[2]),
        v7 = f32x4(b[3], b[0], b[1], b[2]),
        r3 = f32x4.mul(v6, v7)

  output[3] = f32x4.extract_lane(r3, 0) - f32x4.extract_lane(r3, 1) - f32x4.extract_lane(r3, 2) - f32x4.extract_lane(r3, 3)

  return output
}

export function rotate(
  point: Float32Array,
  angle: Float32Array,
): Float32Array {
  const output = new Float32Array(3),
        one    = new Float32Array(4),
        two    = new Float32Array(4)
  
  one[0] =  0
  one[1] =  point[0]
  one[2] =  point[1]
  one[3] = -point[2]

  two[0] =  angle[0]
  two[1] = -angle[1]
  two[2] = -angle[2]
  two[3] = -angle[3]

  const result = multiply(multiply(angle, one), two)

  output[0] = result[1]
  output[1] = result[2]
  output[2] = result[3]

  return output
}