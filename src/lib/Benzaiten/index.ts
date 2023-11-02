import { Vector3 } from "@/Sunya/types"

import { Shape } from "@/Benzaiten/shapes/types"

import {
  index,
  grid_index,
  // neighbors,
  // to_3D,
  // x_recursion_edge,
  // y_recursion_edge,
  // z_recursion_edge,
  // surface_x_vertex,
  // surface_y_vertex,
  // surface_z_vertex,
  // merge,
  x_crossings,
  y_crossings,
  z_crossings,
} from "@/Benzaiten/helpers"

import ColoredPoint from "@/Athenaeum/materials/ColoredPoint"
import Color        from "@/Athenaeum/Color"

import { EMPTY } from "@/Benzaiten/CONSTANTS"

import {
  Mesh,
  Sides,
} from "./types"

const x = 0,
      y = 1,
      z = 2

const half = .5

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
    segments:  Vector3 = new Float32Array([2, 2, 2]),
  ) {
    this.#shape     = shape
    this.#divisions = divisions
    this.#segments  = segments

    const required = 
      this.#segments[x] ** this.#divisions *
      this.#segments[y] ** this.#divisions *
      this.#segments[z] ** this.#divisions

    // NOTE: This initializes all entries in `this.#grid` to have a value of `0`.
    // `0` is a valid vertex index value, so all vertex indexes are offset by +1
    // when added, and decremented by `1` (to their actual value) when read out.
    this.#grid   = new Uint16Array (required * 3 * 3)
    // this.#voxels = new Float32Array(required * 3)

    this.#vertices = new Float32Array()
    this.#indices  = new Uint16Array()
  }

  // #grid_index_for(vertex: number): number { return this.#grid[vertex] - 1 }

  // #generate_voxel_vertices(sides: Sides) {
  //   const temp = []

  //   for (let i = 3; i > -1; i--) {
  //     const _x = ['left',    'right' ],
  //           _y = ['bottom',  'top'   ],
  //           _z = ['back',    'front' ],
  //            X = sides[_x[Math.abs(Math.floor((i - 1) / 2))]],
  //            Y = sides[_y[Math.floor(i / 2)]],
  //            Z = sides[_z[Math.abs(Math.floor((i - 1) / 2))]]

  //     temp.push(X)
  //     temp.push(Y)
  //     temp.push(Z)
  //   }

  //   this.#voxels = new Float32Array([
  //     ...this.#voxels,
  //     ...temp,
  //   ])
  // }

  extract_surface(
    space:      Vector3 = new Float32Array([1, 1, 1]),
    origin:     Vector3 = new Float32Array([0, 0, 0]),
    recursions: number  = 1,
  ): Mesh {    
    const extent_x = space[x] / this.#segments[x],
          extent_y = space[y] / this.#segments[y],
          extent_z = space[z] / this.#segments[z]

    const half_x = extent_x * half,
          half_y = extent_y * half,
          half_z = extent_z * half

    const start_x = origin[x] - (space[x] * half),
          start_y = origin[y] - (space[y] * half),
          start_z = origin[z] - (space[z] * half)

    const level      = this.#segments[x] * this.#segments[z],
          iterations = level             * this.#segments[y]

    for (let i = 0; i < iterations; i++) {
      const current_x =             i                       % this.#segments[x],
            current_y = Math.floor((i / level)              % this.#segments[y]),
            current_z = Math.floor((i / this.#segments[x])  % this.#segments[z])

      const sides: Sides = {
        left:   start_x + ( current_x      * extent_x),
        bottom: start_y + ( current_y      * extent_y),
        back:   start_z + ( current_z      * extent_z),
        right:  start_x + ((current_x + 1) * extent_x),
        top:    start_y + ((current_y + 1) * extent_y),
        front:  start_z + ((current_z + 1) * extent_z),
      }

      const x_crosses = x_crossings(this.#shape, sides),
            y_crosses = y_crossings(this.#shape, sides),
            z_crosses = z_crossings(this.#shape, sides)

      if (x_crosses[0] > 0 || y_crosses[0] > 0 || z_crosses[0] > 0) {
        if (recursions + 1 <= this.#divisions) {
          const origin_x = sides.left   + half_x,
                origin_y = sides.bottom + half_y,
                origin_z = sides.back   + half_z
  
          this.extract_surface(
            new Float32Array([extent_x, extent_y, extent_z]),
            new Float32Array([origin_x, origin_y, origin_z]),
            recursions + 1,
          )
        }
        else {
          const x_index = index(sides.left,   space[x], this.#segments[x]),
                y_index = index(sides.bottom, space[y], this.#segments[y]),
                z_index = index(sides.back,   space[z], this.#segments[z]),
                width   = 1 / extent_x,
                depth   = 1 / extent_z,
                vertex  = grid_index(x_index, y_index, z_index, width, depth) * 3,
                temp    = []

          if (x_crosses[10] !== EMPTY) {
            temp.push(...x_crosses.subarray(10, 13))

            this.#grid[vertex] = (this.#vertices.length + temp.length) / 3
    
            this.#cache.push(vertex)
          }
          
          if (y_crosses[10] !== EMPTY) {
            temp.push(...y_crosses.subarray(10, 13))

            this.#grid[vertex + 1] = (this.#vertices.length + temp.length) / 3
    
            this.#cache.push(vertex + 1)
          }
          
          if (z_crosses[10] !== EMPTY) {
            temp.push(...z_crosses.subarray(10, 13))

            this.#grid[vertex + 2] = (this.#vertices.length + temp.length) / 3
    
            this.#cache.push(vertex + 2)
          }

          for (let i = 1; i < 10; i += 3) {
            const e = i + 3
          }

          if (temp.length > 0)
            this.#vertices = new Float32Array([...this.#vertices, ...temp])
        }
      } 
    }

    if (recursions === 1) {
      // const width  = this.#segments[x] ** this.#divisions,
      //       height = this.#segments[y] ** this.#divisions,
      //       depth  = this.#segments[z] ** this.#divisions,
      //       temp   = []

      // for (const c of this.#cache) {
      //   const i        = to_3D(c, width, depth),
      //         vertexes = neighbors(i.x, i.y, i.z, width, height, depth, this.#grid)
      
      //   for (const v of vertexes) {
      //     temp.push(this.#grid_index_for(c))
      //     temp.push(this.#grid_index_for(v[0]))
      //     temp.push(this.#grid_index_for(v[1]))
      //   }
      // }

      // this.#indices = new Uint16Array([...this.#indices, ...temp])

      new ColoredPoint(Color.from_html_rgb(255, 192, 64), .5).apply_to({
        vertices: new Float32Array([-1, 0, 0]),
        indices:  new Uint16Array(),
      })

      new ColoredPoint(Color.from_html_rgb(255, 64, 192), .5).apply_to({
        vertices: new Float32Array([0, -1, 0]),
        indices:  new Uint16Array(),
      })

      new ColoredPoint(Color.from_html_rgb(64, 192, 255), .5).apply_to({
        vertices: new Float32Array([0, 0, -1]),
        indices:  new Uint16Array(),
      })

      // new ColoredPoint(Color.from_html_rgb(128, 255, 64), .05).apply_to({
      //   vertices: this.#voxels,
      //   indices:  new Uint16Array(),
      // })

      new ColoredPoint(Color.from_html_rgb(192, 64, 255), .25).apply_to({
        vertices: this.#vertices,
        indices:  new Uint16Array(),
      })
    }

    return {
      vertices: this.#vertices,
      indices:  this.#indices,
    }
  }
}