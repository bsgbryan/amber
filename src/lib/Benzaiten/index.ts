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

type Mesh = {
  vertices: Float32Array
  indexes:  Uint16Array
}

export default class Benzaiten {
  #shape:     Shape
  #divisions: number
  #segments:  Vector3

  #grid: Uint16Array

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

    // NOTE: This initializes all entries in `this.#grid` to have a value of `0`.
    // `0` is a valid vertex index value, so all vertex indexes are offset by +1
    // when added, and decremented by `1` (to their actual value) when read out.
    this.#grid = new Uint16Array(
      divisions * x_factor *
      divisions * y_factor *
      divisions * z_factor
    )
  }

  extract_surface(
    space:      Vector3 = v3(1, 1, 1),
    origin:     Vector3 = v3(0, 0, 0),
    recursions: number  = 1,
  ): Mesh {
    let vertices: Float32Array = new Float32Array()
    let indexes:  Uint16Array  = new Uint16Array()
    
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

        vertices = new Float32Array([...vertices, ...recursion_output.vertices])
      }
      
      if ((recursions === this.#divisions) && (x_cross_edge === 3 || y_cross_edge === 3 || z_cross_edge === 3)) {
        vertices = new Float32Array([
          ...vertices,
          ...merge(
            x_cross_edge === 3 && surface_x_vertex(this.#shape, sides),
            y_cross_edge === 3 && surface_y_vertex(this.#shape, sides),
            z_cross_edge === 3 && surface_z_vertex(this.#shape, sides),
          ),
        ])

        const x_index = index( sides.left, space[x], this.#segments[x]),
              y_index = index(-sides.top,  space[y], this.#segments[y]),
              z_index = index( sides.back, space[z], this.#segments[z]),
              width   = 1 / extent_x,
              depth   = 1 / extent_z,
              vertex  = grid_index(x_index, y_index, z_index, width, depth)

        // NOTE: `this.#grid` stores all its values at +1 offset from their correct value.
        // It does this to compensate for the fact that, on creation, `this.#grid` initializes
        // all its entries to have a value of `0` - which is a valid vertex index. So, instead
        // of `0`, the first vertex that gets added to `this.#grid` is stored with a value of
        // `1` (the value of `vertices.length / 3` after the first vertex is added) - to
        // distinguish it from "empty" `this.#grid` entries.
        this.#grid[vertex] = vertices.length / 3

        const n = neighbors(x_index, y_index, z_index, width, 1 / extent_y, depth, this.#grid)

        if (n.length > 2)
          for (let _ = n.length - 1; _ > -1; _ -= 2) {
            const {
              x: x_offset,
              y: y_offset,
              z: z_offset,
            } = extract_neighbor_axes(n[_ - 1])
  
            // TODO: Build up triangle index list
          }
      }
    }

    return {vertices, indexes}
  }
}