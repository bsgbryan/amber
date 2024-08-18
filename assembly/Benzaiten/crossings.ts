import { __SHAPES__ } from "./shapes"

const EMPTY = 0.0 as f32

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
        surface = __SHAPES__[shape],
        output  = new Float32Array(5)

  let count = 0.0 as f32

  for (let i = 0; i < 4; i++) {
    const Y = sides[i === 0 || i === 3 ? 1 : 4],
          Z = sides[i  <  2            ? 2 : 5],
          s = surface(L, Y, Z, params),
          e = surface(R, Y, Z, params),
          c = crosses(s, e)

    if (c) output[i] = L < 0 ? -1 : 1, count++
    else   output[i] = EMPTY
  }

  output[4] = count

  return output
}

export function y_crossings(
  shape:  i32,
  params: Float32Array,
  sides:  Float32Array,
): Float32Array {
  const B       = sides[1],
        T       = sides[4],
        surface =  __SHAPES__[shape],
        output  = new Float32Array(5)

  let count = 0.0 as f32

  for (let i = 0; i < 4; i++) {
    const X = sides[i === 0 || i === 3 ? 0 : 3],
          Z = sides[i  <  2            ? 2 : 5],
          s = surface(X, B, Z, params),
          e = surface(X, T, Z, params),
          c = crosses(s, e)

    if (c) output[i] = B < 0 ? -1 : 1, count++
    else   output[i] = EMPTY
  }

  output[4] = count

  return output
}

export function z_crossings(
  shape:  i32,
  params: Float32Array,
  sides:  Float32Array,
): Float32Array {
  const B       = sides[2],
        F       = sides[5],
        surface =  __SHAPES__[shape],
        output  = new Float32Array(5)

  let count = 0.0 as f32

  for (let i = 0; i < 4; i++) {
    const X = sides[i === 0 || i === 3 ? 0 : 3],
          Y = sides[i  <  2            ? 1 : 4],
          s = surface(X, Y, B, params),
          e = surface(X, Y, F, params),
          c = crosses(s, e)

    if (c) output[i] = B < 0 ? -1 : 1, count++
    else   output[i] = EMPTY
  }

  output[4] = count

  return output
}