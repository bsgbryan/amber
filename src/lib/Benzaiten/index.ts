import { Vector3 } from "../Sunya/types"

import { Shape } from "./shapes/types"

import {
  test_x,
  test_y,
  test_z,
} from "./helpers"

import { Sides } from "./types"

const x = 0,
      y = 1,
      z = 2

const half = .5

export default class Benzaiten {
  static partition(
    shape: Shape,
    divisions:  number  = 2,
    segments:   Vector3 = new Float32Array([2, 2, 2]),
    space:      Vector3 = new Float32Array([1, 1, 1]),
    origin:     Vector3 = new Float32Array([0, 0, 0]),
    recursions: number = 1,
  ): Float32Array {
    let output: Float32Array = new Float32Array()

    const extent_x = space[x] / segments[x],
          extent_y = space[y] / segments[y],
          extent_z = space[z] / segments[z]

    const start_x = origin[x] - (space[x] * half),
          start_y = origin[y] + (space[y] * half),
          start_z = origin[z] - (space[z] * half)

    const iterations = segments[x] * segments[y] * segments[z]

    for (let i = 0; i < iterations; i++) {
      const current_x =             i %  segments[x],
            current_y = Math.floor((i /  segments[x]) % segments[y]),
            current_z = Math.floor( i / (segments[x]  * segments[y]) % segments[z])

      const sides: Sides = {
        left:   start_x + ( current_x      * extent_x),
        top:    start_y - ( current_y      * extent_y),
        back:   start_z + ( current_z      * extent_z),
        right:  start_x + ((current_x + 1) * extent_x),
        bottom: start_y - ((current_y + 1) * extent_y),
        front:  start_z + ((current_z + 1) * extent_z),
      }

      const x_result = test_x(shape, sides, recursions, divisions),
            y_result = test_y(shape, sides, recursions, divisions),
            z_result = test_z(shape, sides, recursions, divisions)

      let temp: Array<number> = []

      if (x_result instanceof Float32Array) temp = [...temp, ...x_result]
      if (y_result instanceof Float32Array) temp = [...temp, ...y_result]
      if (z_result instanceof Float32Array) temp = [...temp, ...z_result]

      const needs_recursion = x_result === null || y_result === null || z_result === null

      if (needs_recursion && recursions + 1 <= divisions) {
        const origin_x = sides.left + (extent_x * half),
              origin_y = sides.top  - (extent_y * half),
              origin_z = sides.back + (extent_z * half)

        const recursion_output = Benzaiten.partition(
          shape,
          divisions,
          undefined,
          new Float32Array([extent_x, extent_y, extent_z]),
          new Float32Array([origin_x, origin_y, origin_z]),
          recursions + 1,
        )

        output = new Float32Array([...output, ...recursion_output])
      }
      else output = new Float32Array([...output, ...temp])
    }

    return new Float32Array(output)
  }
}