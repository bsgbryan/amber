import { Vector3 } from "../Sunya/types"

import { Shape } from "./shapes/types"

import {
  add,
  test_x,
  test_y,
  test_z,
} from "./helpers"

import { Output, Sides, TestResults } from "./types"

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
  ): TestResults {
    const output: Output = {
      debug:   [] as Array<number>,
      x_cross: [] as Array<number>,
      y_cross: [] as Array<number>,
      z_cross: [] as Array<number>,
    }

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

      add(output.debug, new Float32Array([sides.left, sides.top, sides.back]))

      let needs_recursion = false

      needs_recursion ||= test_x(shape, extent_x, sides, output, recursions, divisions)
      needs_recursion ||= test_y(shape, extent_y, sides, output, recursions, divisions)
      needs_recursion ||= test_z(shape, extent_z, sides, output, recursions, divisions)

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

        output.debug   = [...output.debug,   ...recursion_output.debug  ]
        output.x_cross = [...output.x_cross, ...recursion_output.x_cross]
        output.y_cross = [...output.y_cross, ...recursion_output.y_cross]
        output.z_cross = [...output.z_cross, ...recursion_output.z_cross]
      }
    }

    return {
      debug:   new Float32Array(output.debug  ),
      x_cross: new Float32Array(output.x_cross),
      y_cross: new Float32Array(output.y_cross),
      z_cross: new Float32Array(output.z_cross),
    }
  }
}