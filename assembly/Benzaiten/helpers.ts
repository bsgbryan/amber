import { __SHAPES__ } from "./shapes"

const EMPTY  = 0.0 as f32,
      output = new Float32Array(5)

function crosses(
  a: f32,
  b: f32,
): boolean {
  return (a > 0 && b < 0) ||
         (a < 0 && b > 0) ||
          a === 0         ||
          b === 0
}

export function x_crossings(
  shape:  i32,
  params: Float32Array,
  sides:  Float32Array,
): Float32Array {
  const L       = sides[0],
        R       = sides[3],
        surface = __SHAPES__[shape]

  let count = 0.0 as f32

  for (let i = 0; i < 4; i++) {
    const Y = sides[i === 0 || i === 3 ? 1 : 4],
          Z = sides[i   < 2            ? 2 : 5]

    if (crosses(surface(L, Y, Z, params), surface(R, Y, Z, params))) {
      count++

      output[i] = L < 0 ? -1 : 1
    }
    else output[i] = EMPTY
  }

  output[4] = count

  return output
}

export function y_crossings(
  shape:  i32,
  params: Float32Array,
  sides:  Float32Array,
): Float32Array {
  const B        = sides[1],
        T        = sides[4],
        distance =  __SHAPES__[shape]

  let count = 0.0 as f32

  for (let i = 0; i < 4; i++) {
    const X = sides[i === 0 || i === 3 ? 0 : 3],
          Z = sides[i   < 2            ? 2 : 5]

    if (crosses(distance(X, B, Z, params), distance(X, T, Z, params))) {
      count++

      output[i] = B < 0 ? -1 : 1
    }
    else output[i] = EMPTY
  }

  output[4] = count

  return output
}

export function z_crossings(
  shape:  i32,
  params: Float32Array,
  sides:  Float32Array,
): Float32Array {
  const B        = sides[2],
        F        = sides[5],
        distance =  __SHAPES__[shape]

  let count = 0.0 as f32

  for (let i = 0; i < 4; i++) {
    const X = sides[i === 0 || i === 3 ? 0 : 3],
          Y = sides[i   < 2            ? 1 : 4]

    if (crosses(distance(X, Y, B, params), distance(X, Y, F, params))) {
      count++

      output[i] = B < 0 ? -1 : 1
    }
    else output[i] = EMPTY
  }

  output[4] = count

  return output
}