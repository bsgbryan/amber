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
  merge,
  index,
  extract_neighbor_axes,
  grid_index,
  neighbors,
} from "./helpers"

import { OCCUPIED } from "./CONSTANTS"

import { Sides } from "./types"

const x = 0,
      y = 1,
      z = 2

const half = .5

const v3 = vec3.create

export default class Benzaiten {
  #shape:     Shape
  #divisions: number
  #segments:  Vector3

  #grid: Int8Array

  constructor(
    shape:     Shape,
    divisions: number  = 2,
    segments:  Vector3 = v3(2, 2, 2),
  ) {
    this.#shape     = shape
    this.#divisions = divisions
    this.#segments  = segments

    const x_factor = divisions * segments[0],
          y_factor = divisions * segments[1],
          z_factor = divisions * segments[2]

    this.#grid = new Int8Array(
      divisions * x_factor *
      divisions * y_factor *
      divisions * z_factor
    )
  }

  extract_surface(
    space:      Vector3 = v3(1, 1, 1),
    origin:     Vector3 = v3(0, 0, 0),
    recursions: number  = 1,
  ): Float32Array {
    let output: Array<number> = []
    
    const extent_x = space[x] / this.#segments[x],
          extent_y = space[y] / this.#segments[y],
          extent_z = space[z] / this.#segments[z]

    const start_x = origin[x] - (space[x] * half),
          start_y = origin[y] + (space[y] * half),
          start_z = origin[z] - (space[z] * half)

    const level      = this.#segments[x] * this.#segments[y],
          iterations = level             * this.#segments[z]

    for (let i = 0; i < iterations; i++) {
      const current_x =             i % this.#segments[x],
            current_y = Math.floor( i / level              % this.#segments[y]),
            current_z = Math.floor((i / this.#segments[x]) % this.#segments[z])

      const sides: Sides = {
        left:   start_x + ( current_x      * extent_x),
        top:    start_y - ( current_y      * extent_y),
        back:   start_z + ( current_z      * extent_z),
        right:  start_x + ((current_x + 1) * extent_x),
        bottom: start_y - ((current_y + 1) * extent_y),
        front:  start_z + ((current_z + 1) * extent_z),
      }

      const x_cross_edge = x_recursion_edge(this.#shape, sides),
            y_cross_edge = y_recursion_edge(this.#shape, sides),
            z_cross_edge = z_recursion_edge(this.#shape, sides)

      const recurse = x_cross_edge > -1 || y_cross_edge > -1 || z_cross_edge > -1

      if (recurse && recursions + 1 <= this.#divisions) {
        const origin_x = sides.left + (extent_x * half),
              origin_y = sides.top  - (extent_y * half),
              origin_z = sides.back + (extent_z * half)

        const recursion_output = this.extract_surface(
          v3(extent_x, extent_y, extent_z),
          v3(origin_x, origin_y, origin_z),
          recursions + 1,
        )

        output = [...output, ...recursion_output]
      }
      
      if ((recursions === this.#divisions) && (x_cross_edge === 3 || y_cross_edge === 3 || z_cross_edge === 3)) {
        output = [
          ...output,
          ...merge(
            x_cross_edge === 3 && surface_x_vertex(this.#shape, sides),
            y_cross_edge === 3 && surface_y_vertex(this.#shape, sides),
            z_cross_edge === 3 && surface_z_vertex(this.#shape, sides),
          ),
        ]

        const x_index = index( sides.left, space[x], this.#segments[x]),
              y_index = index(-sides.top,  space[y], this.#segments[y]),
              z_index = index( sides.back, space[z], this.#segments[z]),
              width  = 1 / extent_x,
              depth  = 1 / extent_z,
              vertex  = grid_index(x_index, y_index, z_index, width, depth)

        this.#grid[vertex] = OCCUPIED

        const n = neighbors(x_index, y_index, z_index, width, 1 / extent_y, depth, this.#grid)

        if (n.length > 2) {
          for (let _ = 0; _ < n.length;) {
            const {
              x: x_offset,
              y: y_offset,
              z: z_offset,
            } = extract_neighbor_axes(n[_++])
  
            const vertex = n[_++]
  
            // TODO: Build up triangle index list
          }
        }
      }
    }

    return new Float32Array(output)
  }
}