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

export default class Benzaiten {
  static partition(
    shape: Shape,
    divisions: number  = 4,
    space:     Vector3 = new Float32Array([1, 1, 1]),
    origin:    Vector3 = new Float32Array([0, 0, 0]),
    recursions: number = 1,
  ): TestResults {
    const output: Output = {
      debug:   [] as Array<number>,
      x_cross: [] as Array<number>,
      y_cross: [] as Array<number>,
      z_cross: [] as Array<number>,
    }

    const extent = {
      x: space[x] / 2,
      y: space[y] / 2,
      z: space[z] / 2,
    }

    const level      = 4,
          iterations = 8

    let needs_recursion = false

    const offset_x = space[x] - extent.x,
          offset_y = space[y] - extent.y,
          offset_z = space[z] - extent.z

    for (let i = 0; i < iterations; i++) {
      const x_offset = i % 2,
            y_offset = Math.floor(i / level),
            z_offset = Math.floor(i / iterations * level % 2)

      const sides: Sides = {
        left:   origin[x] - offset_x + ( x_offset      * extent.x),
        top:    origin[y] + offset_y - ( y_offset      * extent.y),
        back:   origin[z] - offset_z + ( z_offset      * extent.z),
        right:  origin[x] - offset_x + ((x_offset + 1) * extent.x),
        bottom: origin[y] + offset_y - ((y_offset + 1) * extent.y),
        front:  origin[z] - offset_z + ((z_offset + 1) * extent.z)
      }

      add(output.debug, new Float32Array([sides.left, sides.top, sides.back]))

      needs_recursion ||= test_x(shape, extent.x, sides, output, recursions, divisions)
      needs_recursion ||= test_y(shape, extent.y, sides, output, recursions, divisions) 
      needs_recursion ||= test_z(shape, extent.z, sides, output, recursions, divisions)

      if (x_offset === 0) { add(output.debug, new Float32Array([sides.right, sides.top,    sides.back]))
        if (y_offset === 0) add(output.debug, new Float32Array([sides.right, sides.bottom, sides.back]))
      }

      if (y_offset === 0) add(output.debug, new Float32Array([sides.left, sides.bottom, sides.back]))

      if (z_offset === 0) { add(output.debug, new Float32Array([sides.left,  sides.top,    sides.front]))
        if (x_offset === 0) add(output.debug, new Float32Array([sides.right, sides.top,    sides.front]))
        if (y_offset === 0) add(output.debug, new Float32Array([sides.left,  sides.bottom, sides.front]))
      }

      if (needs_recursion && recursions + 1 <= divisions) {
        const divided_origin   = new Float32Array([sides.left + (extent.x * .5), sides.top - (extent.y * .5), sides.back + (extent.z * .5)]),
              divided_space    = new Float32Array([extent.x, extent.y, extent.z]),
              recursion_output = Benzaiten.partition(shape, divisions, divided_space, divided_origin, recursions + 1)

        output.debug   = [...output.debug,   ...recursion_output.debug  ]
        output.x_cross = [...output.x_cross, ...recursion_output.x_cross]
        output.y_cross = [...output.y_cross, ...recursion_output.y_cross]
        output.z_cross = [...output.z_cross, ...recursion_output.z_cross]
      }
    }

    add(output.debug, new Float32Array([extent.x, extent.y, extent.z]))

    return {
      debug:   new Float32Array(output.debug  ),
      x_cross: new Float32Array(output.x_cross),
      y_cross: new Float32Array(output.y_cross),
      z_cross: new Float32Array(output.z_cross),
    }
  }
}