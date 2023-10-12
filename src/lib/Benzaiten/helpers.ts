import { Shape } from "./shapes/types"

import {
  Sides,
  TestResult,
} from "./types"

const x = ['left', 'right' ],
      y = ['top',  'bottom'],
      z = ['back', 'front' ]

const crosses = (
  a: number,
  b: number,
): boolean => {
  return (a > 0 && b < 0) ||
         (a < 0 && b > 0) ||
          a === 0         ||
          b === 0
}

export const test_x = (
  shape:      Shape,
  sides:      Sides,
  recursions: number,
  divisions:  number,
): TestResult => {
  for (let i = 0; i < 4; i++) {
    const I = i % 2,
          Y = sides[y[I]],
          Z = sides[z[I]],
          L = sides[x[0]],
          R = sides[x[1]],
          a = shape(new Float32Array([L, Y, Z]))

    if (crosses(a, shape(new Float32Array([R, Y, Z]))))
      return recursions === divisions ?
        new Float32Array([L + (a < 0 ? -a : a), Y, Z])
        :
        null
  }
}

export const test_y = (
  shape:      Shape,
  sides:      Sides,
  recursions: number,
  divisions:  number,
): TestResult => {
  for (let i = 0; i < 4; i++) {
    const I = i % 2,
          X = sides[x[I]],
          Z = sides[z[I]],
          T = sides[y[0]],
          B = sides[y[1]],
          a = shape(new Float32Array([X, T, Z]))

    if (crosses(a, shape(new Float32Array([X, B, Z]))))
      return recursions === divisions ?
        new Float32Array([X, T - (a < 0 ? -a : a), Z])
        :
        null
  }
}

export const test_z = (
  shape:      Shape,
  sides:      Sides,
  recursions: number,
  divisions:  number,
): TestResult => {
  for (let i = 0; i < 4; i++) {
    const I = i % 2,
          X = sides[x[I]],
          Y = sides[y[I]],
          B = sides[z[0]],
          F = sides[z[1]],
          a = shape(new Float32Array([X, Y, B]))

    if (crosses(a, shape(new Float32Array([X, Y, F]))))
      return recursions === divisions ?
        new Float32Array([X, Y, B + (a < 0 ? -a : a)])
        :
        null
  }
}