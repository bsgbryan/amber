import { Vector3 } from "../Sunya/types"

import { Shape } from "./shapes/types"

import { vec3 } from "../Sunya"

import {
  needs_x_recursion,
  needs_y_recursion,
  needs_z_recursion,
  surface_x_point,
  surface_y_point,
  surface_z_point,
} from "./helpers"

import { Sides } from "./types"

const x = 0,
      y = 1,
      z = 2

const half = .5

const v3 = vec3.create

export default class Benzaiten {
  static partition(
    shape:      Shape,
    divisions:  number  = 2,
    segments:   Vector3 = v3(2, 2, 2),
    space:      Vector3 = v3(1, 1, 1),
    origin:     Vector3 = v3(0, 0, 0),
    recursions: number = 1,
  ): Float32Array {
    let output: Array<number> = []

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

      const recurse_x = needs_x_recursion(shape, sides),
            recurse_y = needs_y_recursion(shape, sides),
            recurse_z = needs_z_recursion(shape, sides)

      if ((recurse_x || recurse_y || recurse_z) && recursions + 1 <= divisions) {
        const origin_x = sides.left + (extent_x * half),
              origin_y = sides.top  - (extent_y * half),
              origin_z = sides.back + (extent_z * half)

        const recursion_output = Benzaiten.partition(
          shape,
          divisions,
          undefined,
          v3(extent_x, extent_y, extent_z),
          v3(origin_x, origin_y, origin_z),
          recursions + 1,
        )

        output = [...output, ...recursion_output]
      }
      
      if (recursions === divisions)
        output = [
          ...output,  
          ...(surface_x_point(shape, sides) || []),
          ...(surface_y_point(shape, sides) || []),
          ...(surface_z_point(shape, sides) || []),
        ]
    }

    return new Float32Array(output)
  }
}