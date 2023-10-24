import { Vector3 } from "@/Sunya/types"

import { Shape } from "@/Benzaiten/shapes/types"

import { vec3 } from "@/Sunya"

import {
  x_recursion_edge,
  y_recursion_edge,
  z_recursion_edge,
  surface_x_vertex,
  surface_y_vertex,
  surface_z_vertex,
  merge,
  index,
  grid_index,
  neighbors,
  to_3D,
} from "@/Benzaiten/helpers"

import {
  Mesh,
  Sides,
} from "./types"
import ColoredPoint from "@/Athenaeum/materials/ColoredPoint"
import Color from "@/Athenaeum/Color"

const x = 0,
      y = 1,
      z = 2

const half = .5

const v3 = vec3.create

export default class Benzaiten {
  #shape:     Shape
  #divisions: number
  #segments:  Vector3

  #grid:  Uint16Array
  #cache: Array<number> = []

  #vertices: Float32Array
  #indices:  Uint16Array
  #voxels:   Float32Array

  constructor(
    shape:     Shape,
    divisions: number  = 2,
    segments:  Vector3 = v3(2, 2, 2),
  ) {
    this.#shape     = shape
    this.#divisions = divisions
    this.#segments  = segments

    // NOTE: This initializes all entries in `this.#grid` to have a value of `0`.
    // `0` is a valid vertex index value, so all vertex indexes are offset by +1
    // when added, and decremented by `1` (to their actual value) when read out.
    this.#grid = new Uint16Array(
      this.#segments[x] ** this.#divisions *
      this.#segments[y] ** this.#divisions *
      this.#segments[z] ** this.#divisions
    )

    this.#vertices = new Float32Array()
    this.#indices  = new Uint16Array()

    this.#voxels = new Float32Array(
      this.#segments[x] ** this.#divisions *
      this.#segments[y] ** this.#divisions *
      this.#segments[z] ** this.#divisions * 3
    )
  }

  #grid_index_for(vertex: number): number { return this.#grid[vertex] - 1 }

  extract_surface(
    space:      Vector3 = v3(1, 1, 1),
    origin:     Vector3 = v3(0, 0, 0),
    recursions: number  = 1,
  ): Mesh {    
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

        this.#voxels = new Float32Array([
          ...this.#voxels,
          sides.left + (extent_x * .5),
          sides.top  - (extent_y * .5),
          sides.back + (extent_z * .5),
        ])

        this.extract_surface(
          v3(extent_x, extent_y, extent_z),
          v3(origin_x, origin_y, origin_z),
          recursions + 1,
        )
      }
      

      const x_index = index( sides.left, space[x], this.#segments[x]),
            y_index = index(-sides.top,  space[y], this.#segments[y]),
            z_index = index( sides.back, space[z], this.#segments[z]),
            width   = 1 / extent_x,
            depth   = 1 / extent_z,
            vertex  = grid_index(x_index, y_index, z_index, width, depth)

      if (recursions === this.#divisions) {
      }
      
      if ((recursions === this.#divisions) && (x_cross_edge === 3 || y_cross_edge === 3 || z_cross_edge === 3)) {
        this.#vertices = new Float32Array([
          ...this.#vertices,
          // ...merge(
          //   x_cross_edge === 3 && surface_x_vertex(this.#shape, sides),
          //   y_cross_edge === 3 && surface_y_vertex(this.#shape, sides),
          //   z_cross_edge === 3 && surface_z_vertex(this.#shape, sides),
          // ),
          sides.left + (extent_x * .5),
          sides.top  - (extent_y * .5),
          sides.back + (extent_z * .5),
        ])

        // NOTE: `this.#grid` stores all its values at +1 offset from their correct value.
        // It does this to compensate for the fact that, on creation, `this.#grid` initializes
        // all its entries to have a value of `0` - which is a valid vertex index. So, instead
        // of `0`, the first vertex that gets added to `this.#grid` is stored with a value of
        // `1` (the value of `this.#vertices.length / 3` after the first vertex is added) - to
        // distinguish it from "empty" `this.#grid` entries.
        this.#grid[vertex] = this.#vertices.length / 3

        this.#cache.push(vertex)
      }
    }

    if (recursions === 1) {
      const width = this.#segments[x] ** this.#divisions
      const height = this.#segments[y] ** this.#divisions
      const depth = this.#segments[z] ** this.#divisions
      const temp = []

      for (const c of this.#cache) {
        const i = to_3D(c, width, depth)

        const vertexes = neighbors(i.x, i.y, i.z, width, height, depth, this.#grid)
      
        for (const v of vertexes) {
          temp.push(this.#grid_index_for(c))
          temp.push(this.#grid_index_for(v[0]))
          temp.push(this.#grid_index_for(v[1]))
        }
      }

      this.#indices = new Uint16Array([...this.#indices, ...temp])

      new ColoredPoint(Color.from_html_rgb(0, 0, 0), .125).apply_to({
        vertices: this.#voxels,
        indices:  new Uint16Array(),
      })

      new ColoredPoint(Color.from_html_rgb(255, 255, 255), .5).apply_to({
        vertices: this.#vertices,
        indices:  new Uint16Array(),
      })
    }

    return {
      vertices: this.#vertices,
      indices:  this.#indices,
      // @ts-ignore
      voxels: this.#voxels,
    }
  }
}