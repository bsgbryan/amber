import { degrees_to_radians } from "./helpers"

export function add(
  a: Float32Array,
  b: Float32Array,
): Float32Array {
  const output = new Float32Array(3),
        v0     = f32x4(a[0], a[1], a[2], 0),
        v1     = f32x4(b[0], b[1], b[2], 0),
        r      = f32x4.add(v0, v1)

  output[0] = f32x4.extract_lane(r, 0)
  output[1] = f32x4.extract_lane(r, 1)
  output[2] = f32x4.extract_lane(r, 2)

  return output
}

export function cross(
  a: Float32Array,
  b: Float32Array,
): Float32Array {
  const output = new Float32Array(3),
        v0     = f32x4(a[1], a[2], a[0], 0),
        v1     = f32x4(b[2], b[0], b[1], 0),
        r0     = f32x4.mul(v0, v1),
        v2     = f32x4(a[2], a[0], a[1], 0),
        v3     = f32x4(b[1], b[2], b[0], 0),
        r1     = f32x4.mul(v2, v3),
        r2     = f32x4.sub(r0, r1)

  output[0] = f32x4.extract_lane(r2, 0)
  output[1] = f32x4.extract_lane(r2, 1)
  output[2] = f32x4.extract_lane(r2, 2)

  return output
}

export function divide_by_scalar(
  a: Float32Array,
  s: f32,
): Float32Array {
  const output = new Float32Array(3),
        d      = 1 as f32 / s,
        v0     = f32x4(a[0], a[1], a[2], 0),
        v1     = f32x4(d,    d,    d,    0),
        r      = f32x4.mul(v0, v1)

  output[0] = f32x4.extract_lane(r, 0)
  output[1] = f32x4.extract_lane(r, 1)
  output[2] = f32x4.extract_lane(r, 2)

  return output
}

export function distance(
  a: Float32Array,
  b: Float32Array,
): f32 {
  const v0 = f32x4(a[0], a[1], a[2], 0),
        v1 = f32x4(b[0], b[1], b[2], 0),
        r0 = f32x4.sub(v1, v0),
        v2 = f32x4(
          f32x4.extract_lane(r0, 0),
          f32x4.extract_lane(r0, 1),
          f32x4.extract_lane(r0, 2),
          0,
        ),
        r1 = f32x4.mul(v2, v2),
        x  = f32x4.extract_lane(r1, 0),
        y  = f32x4.extract_lane(r1, 1),
        z  = f32x4.extract_lane(r1, 2)

  return Math.sqrt(x + y + z) as f32
}

export function multiply(
  a: Float32Array,
  b: Float32Array,
): Float32Array {
  const output = new Float32Array(3),
        v0     = f32x4(a[0], a[1], a[2], 0),
        v1     = f32x4(b[0], b[1], b[2], 0),
        r      = f32x4.mul(v0, v1)

output[0] = f32x4.extract_lane(r, 0)
output[1] = f32x4.extract_lane(r, 1)
output[2] = f32x4.extract_lane(r, 2)

  return output
}

export function normalize(
  v: Float32Array,
): Float32Array {
  const output = new Float32Array(3),
        v0     = f32x4(v[0], v[1], v[2], 0),
        r0     = f32x4.mul(v0, v0),
        x      = f32x4.extract_lane(r0, 0),
        y      = f32x4.extract_lane(r0, 1),
        z      = f32x4.extract_lane(r0, 2),
        length = Math.sqrt(x + y + z) as f32

  if (length > f32.EPSILON) {
    const v1 = f32x4(length, length, length, 1),
          r1 = f32x4.div(v0, v1)

    output[0] = f32x4.extract_lane(r1, 0)
    output[1] = f32x4.extract_lane(r1, 1)
    output[2] = f32x4.extract_lane(r1, 2)
  } else {
    output[0] = 0.0
    output[1] = 0.0
    output[2] = 0.0
  }

  return output
}

export function spherical(
  x:      f32,
  y:      f32,
  radius: f32,
): Float32Array {
  const output = new Float32Array(3),
        phi    = degrees_to_radians(90.0 - x),
        theta  = degrees_to_radians(y),
        angle  = Math.sin(phi) * radius as f32,
        cosphi = Math.cos(phi)          as f32,
        sinthe = Math.sin(theta)        as f32,
        costhe = Math.cos(theta)        as f32

  const v0 = f32x4(angle,  cosphi, angle,  0),
        v1 = f32x4(sinthe, radius, costhe, 0),
        r  = f32x4.mul(v0, v1)

  output[0] = f32x4.extract_lane(r, 0)
  output[1] = f32x4.extract_lane(r, 1)
  output[2] = f32x4.extract_lane(r, 2)

  return output
}

export function subtract(
  a: Float32Array,
  b: Float32Array,
): Float32Array {
  const output = new Float32Array(3),
        v0     = f32x4(a[0], a[1], a[2], 0),
        v1     = f32x4(b[0], b[1], b[2], 0),
        r      = f32x4.sub(v0, v1)

  output[0] = f32x4.extract_lane(r, 0)
  output[1] = f32x4.extract_lane(r, 1)
  output[2] = f32x4.extract_lane(r, 2)

  return output
}