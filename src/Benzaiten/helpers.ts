// import { Vector3 } from "@/Sunya/types"

import { Shape } from "@/Benzaiten/shapes/types"

import { EMPTY } from "@/Benzaiten/CONSTANTS"

// import {
//   add,
//   divide_by_scalar,
//   multiply,
//   normalize,
//   subtract,
// } from "#/Sunya/Vector3D"

export const crosses = (
  a: number,
  b: number,
): boolean => {
  return (a > 0 && b < 0) ||
         (a < 0 && b > 0) ||
          a === 0         ||
          b === 0
}

// const surface_vertex = (
//   x: number,
//   y: number,
//   z: number,
// ): Vector3 =>
//   multiply(
//     new Float32Array([.475, .475, .475]),
//     add(
//       new Float32Array([0, 0, 0]),
//       normalize(
//         subtract(
//           new Float32Array([x, y, z]),
//           new Float32Array([0, 0, 0]),
//         )
//       )
//     )
//   )

export const x_crossings = (
  distance: Shape,
  sides:    Array<number>,
): Float32Array => {
  const output = new Float32Array(5),
        L      = sides[0],
        R      = sides[3]

  let count = 0

  for (let i = 0; i < 4; i++) {
    const Y = sides[Math.abs(Math.floor((i - 1) / 2)) ? 1 : 4],
          Z = sides[i < 2 ? 2 : 5]

    if (crosses(distance(L, Y, Z), distance(R, Y, Z))) {
      count++

      output[i] = L < 0 ? -1 : 1
    }
    else output[i] = EMPTY
  }

  output[4] = count

  return output
}

export const y_crossings = (
  distance: Shape,
  sides:    Array<number>,
): Float32Array => {
  const output = new Float32Array(5),
        B      = sides[1],
        T      = sides[4]

  let count = 0

  for (let i = 0; i < 4; i++) {
    const X = sides[Math.abs(Math.floor((i - 1) / 2)) ? 0 : 3],
          Z = sides[i < 2 ? 2 : 5]

    if (crosses(distance(X, B, Z), distance(X, T, Z))) {
      count++

      output[i] = B < 0 ? -1 : 1
    }
    else output[i] = EMPTY
  }

  output[4] = count

  return output
}

export const z_crossings = (
  distance: Shape,
  sides:    Array<number>,
): Float32Array => {
  const output = new Float32Array(5),
        B      = sides[2],
        F      = sides[5]

  let count = 0

  for (let i = 0; i < 4; i++) {
    const X = sides[Math.abs(Math.floor((i - 1) / 2)) ? 0 : 3],
          Y = sides[i < 2 ? 1 : 4]

    if (crosses(distance(X, Y, B), distance(X, Y, F))) {
      count++

      output[i] = B < 0 ? -1 : 1
    }
    else output[i] = EMPTY
  }

  output[4] = count

  return new Float32Array(output)
}