import { degrees_to_radians } from "./helpers"

export function add(a: Float32Array, b: Float32Array): Float32Array {
  const output = new Float32Array(3)

  output[0] = a[0] + b[0]
  output[1] = a[1] + b[1]
  output[2] = a[2] + b[2]

  return output
}

export function cross(a: Float32Array, b: Float32Array): Float32Array {
  const output = new Float32Array(3)

  output[0] = a[1] * b[2] - a[2] * b[1]
  output[1] = a[2] * b[0] - a[0] * b[2]
  output[2] = a[0] * b[1] - a[1] * b[0]

  return output
}

export function divide_by_scalar(a: Float32Array, s: f32): Float32Array {
  const output = new Float32Array(3),
        d      = 1 as f32 / s

  output[0] = a[0] * d
  output[1] = a[1] * d
  output[2] = a[2] * d

  return output
}

export function distance(a: Float32Array, b: Float32Array): number {
  const x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2]

  return Math.sqrt(x * x + y * y + z * z)
}

export function identity(): Float32Array {
  const output = new Float32Array(3)

  output[0] = 1.0
  output[1] = 1.0
  output[2] = 1.0

  return output
}

export function multiply(a: Float32Array, b: Float32Array): Float32Array {
  const output = new Float32Array(3)

  output[0] = a[0] * b[0]
  output[1] = a[1] * b[1]
  output[2] = a[2] * b[2]

  return output
}

export function normalize(v: Float32Array): Float32Array {
  const output = new Float32Array(3),
        length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) as f32

  if (length > f32.EPSILON) {
    output[0] = v[0] / length
    output[1] = v[1] / length
    output[2] = v[2] / length
  } else {
    output[0] = 0.0
    output[1] = 0.0
    output[2] = 0.0
  }

  return output
}

export function spherical(x: f32, y: f32, radius: f32): Float32Array {
  const output = new Float32Array(3),
        phi    = degrees_to_radians(90.0 - x),
        theta  = degrees_to_radians(y),
        angle  = Math.sin(phi) * radius

  output[0] = angle * Math.sin(theta) as f32
  output[1] = Math.cos(phi) as f32 * radius
  output[2] = angle * Math.cos(theta) as f32

  return output
}

export function subtract(a: Float32Array, b: Float32Array): Float32Array {
  const output = new Float32Array(3)

  output[0] = a[0] - b[0]
  output[1] = a[1] - b[1]
  output[2] = a[2] - b[2]

  return output
}

export function zero(): Float32Array {
  const output = new Float32Array(3)

  output[0] = 0.0
  output[1] = 0.0
  output[2] = 0.0

  return output
}