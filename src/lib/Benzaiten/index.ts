import { Vector3 } from "../Sunya/types"

import { Shape } from "./shapes/types"

import { vec3 } from "../Sunya"

import {
  x_recursion_edge,
  y_recursion_edge,
  z_recursion_edge,
  surface_x_vertex,
  surface_y_vertex,
  surface_z_vertex,
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

      const x_cross_edge = x_recursion_edge(shape, sides),
            y_cross_edge = y_recursion_edge(shape, sides),
            z_cross_edge = z_recursion_edge(shape, sides)

      const recurse = x_cross_edge > -1 || y_cross_edge > -1 || z_cross_edge > -1

      if (recurse && recursions + 1 <= divisions) {
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
      
      if (recursions === divisions) {
        const point_x = x_cross_edge === 3 && surface_x_vertex(shape, sides),
              point_y = y_cross_edge === 3 && surface_y_vertex(shape, sides),
              point_z = z_cross_edge === 3 && surface_z_vertex(shape, sides)

        // TODO: Merge multiple points

        output = [
          ...output,
          ...(point_x || []),
          ...(point_y || []),
          ...(point_z || []),
        ]
      }
    }

    return new Float32Array(output)
  }
}