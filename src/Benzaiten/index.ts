import ColoredPoint from "@/Athenaeum/materials/ColoredPoint"
import Color        from "@/Athenaeum/Color"

import { Shape } from "@/Benzaiten/shapes/types"

import {
  x_crossings,
  y_crossings,
  z_crossings,
} from "@/Benzaiten/helpers"

import {
  Mesh,
  Vector3,
} from "@/Benzaiten/types"

const x = 0,
      y = 1,
      z = 2

const half = .5

export default class Benzaiten {
  #shape:     Shape
  #divisions: number
  #segments:  Vector3
  #vertices: Float32Array

  constructor(
    shape:     Shape,
    divisions: number  = 2,
    segments:  Vector3 = new Float32Array([2, 2, 2]),
  ) {
    this.#shape     = shape
    this.#divisions = divisions
    this.#segments  = segments
    this.#vertices  = new Float32Array()
  }

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

      const sides = [
        /* left:   */ start_x + ( current_x      * extent_x),
        /* bottom: */ start_y + ( current_y      * extent_y),
        /* back:   */ start_z + ( current_z      * extent_z),
        /* right:  */ start_x + ((current_x + 1) * extent_x),
        /* top:    */ start_y + ((current_y + 1) * extent_y),
        /* front:  */ start_z + ((current_z + 1) * extent_z),
      ]

      const x_crosses = x_crossings(this.#shape, sides),
            y_crosses = y_crossings(this.#shape, sides),
            z_crosses = z_crossings(this.#shape, sides)

      if (x_crosses[4] > 0 || y_crosses[4] > 0 || z_crosses[4] > 0) {
        if (recursions + 1 <= this.#divisions) {
          const origin_x = sides[0] + half_x,
                origin_y = sides[1] + half_y,
                origin_z = sides[2] + half_z
  
          this.extract_surface(
            new Float32Array([extent_x, extent_y, extent_z]),
            new Float32Array([origin_x, origin_y, origin_z]),
            recursions + 1,
          )
        }
        else {
          const cube = [
                  /* Vertex 0 */ x_crosses[0] === -1 || y_crosses[0] === -1 || z_crosses[0] === -1,
                  /* Vertex 1 */ x_crosses[0] ===  1 || y_crosses[1] === -1 || z_crosses[1] === -1,
                  /* Vertex 2 */ x_crosses[3] ===  1 || y_crosses[2] === -1 || z_crosses[1] ===  1,
                  /* Vertex 3 */ x_crosses[3] === -1 || y_crosses[3] === -1 || z_crosses[0] ===  1,
                  /* Vertex 4 */ x_crosses[1] === -1 || y_crosses[0] ===  1 || z_crosses[3] === -1,
                  /* Vertex 5 */ x_crosses[1] ===  1 || y_crosses[1] ===  1 || z_crosses[2] === -1,
                  /* Vertex 6 */ x_crosses[2] ===  1 || y_crosses[2] ===  1 || z_crosses[2] ===  1,
                  /* Vertex 7 */ x_crosses[2] === -1 || y_crosses[3] ===  1 || z_crosses[3] ===  1,
                ],
                temp = []
          
          // BOTTOM
          if (sides[1] < 0) {
            // BOTTOM BACK RIGHT CORNER FACE
            if (cube[0] && cube[2] && cube[3]) {
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[2])

              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[5])
  
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[5])
            } // BOTTOM FRONT RIGHT CORNER FACE
            else if (cube[0] && cube[1] && cube[3]) {
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[2])

              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[5])
            } // BOTTOM FRONT LEFT CORNER FACE
            else if (cube[0] && cube[1] && cube[2]) {
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[2])

              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[5])
            } // BOTTOM BACK LEFT CORNER FACE
            else if (cube[1] && cube[2] && cube[3]) {
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[2])
              
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[5])

              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[5])
            }

            // BOTTOM FACE
            if (cube[0] && cube[1] && cube[2] && cube[3]) {
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[2])

              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[2])

              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[5])

              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[2])

              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[5])

              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[5])
            } // BOTTOM-BACK FACE
            else if (cube[2] && cube[3] && cube[4] && cube[5]) {
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[5])
  
              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[2])
  
              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[2])
  
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[5])
  
              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[2])
  
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[5])
            } // BOTTOM-RIGHT-BACK FACE
            else if (cube[3] && cube[4] && cube[6]) {
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[5])
  
              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[2])

              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[5])
            } // BOTTOM-RIGHT-BACK FACE
            else if (cube[0] && cube[5] && cube[2]) {
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[2])

              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[5])
            } // BOTTOM-RIGHT FACE
            else if (cube[0] && cube[3] && cube[5] && cube[6]) {
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[2])
  
              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[5])
  
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[5])
  
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[5])
            } // BOTTOM-RIGHT-FRONT FACE
            else if (cube[1] && cube[6] && cube[3]) {
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[5])

              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[5])
            } // BOTTOM-RIGHT-FRONT FACE
            else if (cube[0] && cube[5] && cube[7]) {
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[2])

              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[5])
            } // BOTTOM-FRONT FACE
            else if (cube[0] && cube[1] && cube[6] && cube[7]) {
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[5])
  
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[5])
  
              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[5])
            } // BOTTOM-LEFT-FRONT FACE
            else if (cube[1] && cube[6] && cube[4]) {
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[5])

              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[2])
            } // BOTTOM-LEFT-FRONT FACE
            else if (cube[0] && cube[2] && cube[7]) {
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[5])

              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[5])
            }  // BOTTOM-LEFT FACE
            else if (cube[1] && cube[2] && cube[4] && cube[7]) {
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[5])
  
              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[5])
  
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[5])
  
              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[2])
            } // BOTTOM-LEFT-BACK FACE
            else if (cube[2] && cube[7] && cube[5]) {
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[5])
  
              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[5])

              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[2])
            } // BOTTOM-LEFT-BACK FACE
            else if (cube[1] && cube[3] && cube[4]) {
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[5])

              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[2])
            }
          }
          // TOP
          else if (sides[1] > 0) {
            // TOP BACK RIGHT CORNER FACE
            if (cube[4] && cube[7] && cube[6]) {
              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[2])
  
              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[5])

              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[5])
            } // TOP FRONT RIGHT CORNER FACE
            else if (cube[4] && cube[7] && cube[5]) {
              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[2])
  
              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[5])

              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[2])
            } // TOP FRONT LEFT CORNER FACE
            else if (cube[4] && cube[6] && cube[5]) {
              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[2])
  
              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[5])

              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[2])
            } // TOP BACK LEFT CORNER FACE
            else if (cube[5] && cube[7] && cube[6]) {
              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[2])

              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[5])
  
              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[5])
            }

            // TOP FACE
            if (cube[4] && cube[5] && cube[6] && cube[7]) {
              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[2])
  
              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[5])
  
              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[5])
  
              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[2])
  
              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[5])
  
              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[2])
            } // TOP-BACK FACE
            else if (cube[0] && cube[1] && cube[6] && cube[7]) {
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[5])
  
              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[5])
  
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[5])
  
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[2])
            } // TOP-RIGHT-BACK FACE
            else if (cube[0] && cube[2] && cube[7]) {
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[5])

              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[5])
            } // TOP-RIGHT-BACK FACE
            else if (cube[1] && cube[4] && cube[6]) {
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[2])

              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[5])
            } // TOP-RIGHT FACE
            else if (cube[1] && cube[2] && cube[4] && cube[7]) {
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[2])
  
              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[5])
  
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[5])
  
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[5])
            } // TOP-RIGHT-FRONT FACE
            else if (cube[2] && cube[5] && cube[7]) {
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[5])
  
              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[2])

              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[5])
            } // TOP-RIGHT-FRONT FACE
            else if (cube[1] && cube[3] && cube[4]) {
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[2])

              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[5])
            } // TOP-FRONT FACE
            else if (cube[2] && cube[3] && cube[4] && cube[5]) {
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[5])
  
              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[2])
  
              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[2])
  
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[5])
  
              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[2])
  
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[5])
            } // TOP-LEFT-FRONT FACE
            else if (cube[0] && cube[2] && cube[5]) {
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[5])

              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[2])
            } // TOP-LEFT-FRONT FACE
            else if (cube[3] && cube[4] && cube[6]) {
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[5])
  
              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[5])

              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[2])
            } // TOP-LEFT FACE
            else if (cube[0] && cube[3] && cube[5] && cube[6]) {
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[5])
  
              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[5])
  
              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[2])
  
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[5])
  
              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[2])
  
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[2])
            } // TOP-LEFT-BACK FACE
            else if (cube[0] && cube[7] && cube[5]) {
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[5])

              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[2])
            } // TOP-LEFT-BACK FACE
            else if (cube[1] && cube[3] && cube[6]) {
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[5])

              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[5])
            }
          }

          // BACK
          if (sides[2] < 0) {
            // BACK BOTTOM RIGHT CORNER FACE
            if (cube[0] && cube[4] && cube[5]) {
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[2])

              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[2])
            } // BACK TOP RIGHT CORNER FACE
            else if (cube[0] && cube[4] && cube[1]) {
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[2])

              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[2])
            } // BACK TOP LEFT CORNER FACE
            else if (cube[0] && cube[5] && cube[1]) {
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[2])

              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[2])
            } // BACK BOTTOM LEFT CORNER FACE
            else if (cube[1] && cube[4] && cube[5]) {
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[2])

              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[2])
            }

            // BACK FACE
            if (cube[0] && cube[1] && cube[4] && cube[5]) {
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[2])

              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[2])

              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[2])

              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[2])

              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[2])

              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[2])
            }

            // BACK-RIGHT FACE
            if (sides[0] > 0) {
              if (cube[0] && cube[2] && cube[4] && cube[6] && sides[2] < 0) {
                temp.push(sides[0])
                temp.push(sides[1])
                temp.push(sides[2])
  
                temp.push(sides[0])
                temp.push(sides[4])
                temp.push(sides[2])
  
                temp.push(sides[3])
                temp.push(sides[1])
                temp.push(sides[5])
  
                temp.push(sides[3])
                temp.push(sides[1])
                temp.push(sides[5])
  
                temp.push(sides[0])
                temp.push(sides[4])
                temp.push(sides[2])
  
                temp.push(sides[3])
                temp.push(sides[4])
                temp.push(sides[5])
              }
            }
            // BACK-LEFT FACE
            else if (sides[2] < 0) {
              if (cube[1] && cube[3] && cube[5] && cube[7] && sides[2] < 0) {
                temp.push(sides[3])
                temp.push(sides[1])
                temp.push(sides[2])
    
                temp.push(sides[0])
                temp.push(sides[1])
                temp.push(sides[5])
    
                temp.push(sides[0])
                temp.push(sides[4])
                temp.push(sides[5])
    
                temp.push(sides[3])
                temp.push(sides[1])
                temp.push(sides[2])
    
                temp.push(sides[0])
                temp.push(sides[4])
                temp.push(sides[5])
    
                temp.push(sides[3])
                temp.push(sides[4])
                temp.push(sides[2])
              }
            }
          }
          // FRONT
          else if (sides[2] > 0) {
            // FRONT BOTTOM RIGHT CORNER FACE
            if (cube[3] && cube[6] && cube[7]) {
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[5])
  
              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[5])

              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[5])
            } // FRONT TOP RIGHT CORNER FACE
            else if (cube[2] && cube[7] && cube[3]) {
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[5])
  
              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[5])

              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[5])
            } // FRONT TOP LEFT CORNER FACE
            else if (cube[2] && cube[6] && cube[3]) {
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[5])

              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[5])

              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[5])
            } // FRONT BOTTOM LEFT CORNER FACE
            else if (cube[2] && cube[6] && cube[7]) {
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[5])

              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[5])

              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[5])
            }

            // FRONT FACE
            if (cube[2] && cube[3] && cube[6] && cube[7]) {
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[5])

              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[5])

              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[5])

              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[5])

              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[5])

              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[5])
            }

            // RIGHT-FRONT
            if (sides[0] > 0) {
              if (cube[1] && cube[3] && cube[5] && cube[7] && sides[2] >= 0) {
                temp.push(sides[3])
                temp.push(sides[1])
                temp.push(sides[2])
    
                temp.push(sides[0])
                temp.push(sides[4])
                temp.push(sides[5])
    
                temp.push(sides[0])
                temp.push(sides[1])
                temp.push(sides[5])
    
                temp.push(sides[3])
                temp.push(sides[1])
                temp.push(sides[2])
    
                temp.push(sides[3])
                temp.push(sides[4])
                temp.push(sides[2])
    
                temp.push(sides[0])
                temp.push(sides[4])
                temp.push(sides[5])
              }
            }
            // FRONT-LEFT
            else if (sides[0] < 0) {
              if (cube[0] && cube[2] && cube[4] && cube[6] && sides[2] >= 0) {
                temp.push(sides[0])
                temp.push(sides[1])
                temp.push(sides[2])
    
                temp.push(sides[3])
                temp.push(sides[1])
                temp.push(sides[5])
    
                temp.push(sides[3])
                temp.push(sides[4])
                temp.push(sides[5])
    
                temp.push(sides[0])
                temp.push(sides[1])
                temp.push(sides[2])
    
                temp.push(sides[3])
                temp.push(sides[4])
                temp.push(sides[5])
    
                temp.push(sides[0])
                temp.push(sides[4])
                temp.push(sides[2])
              }
            }
          }

          // LEFT
          if (sides[0] < 0) {
            // LEFT BOTTOM RIGHT CORNER FACE
            if (cube[0] && cube[7] && cube[4]) {
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[2])

              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[5])

              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[2])
            } // LEFT TOP RIGHT CORNER FACE
            else if (cube[0] && cube[3] && cube[4]) {
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[2])

              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[5])

              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[2])
            } // LEFT TOP LEFT CORNER FACE
            else if (cube[0] && cube[3] && cube[7]) {
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[2])

              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[5])

              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[5])
            } // LEFT BOTTOM LEFT CORNER FACE
            else if (cube[3] && cube[7] && cube[4]) {
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[5])

              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[5])

              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[2])
            }

            // LEFT FACE
            if (cube[0] && cube[3] && cube[4] && cube[7]) {
              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[2])

              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[5])

              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[5])

              temp.push(sides[0])
              temp.push(sides[1])
              temp.push(sides[2])

              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[5])

              temp.push(sides[0])
              temp.push(sides[4])
              temp.push(sides[2])
            }
          }
          // RIGHT
          else if (sides[0] > 0) {
            // RIGHT BOTTOM RIGHT CORNER FACE
            if (cube[2] && cube[5] && cube[6]) {
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[5])

              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[2])

              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[5])
            } // RIGHT TOP RIGHT CORNER FACE
            else if (cube[1] && cube[6] && cube[2]) {
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[2])

              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[5])

              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[5])
            } // RIGHT TOP LEFT CORNER FACE
            else if (cube[1] && cube[5] && cube[2]) {
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[2])

              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[2])

              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[5])
            } // RIGHT BOTTOM LEFT CORNER FACE
            else if (cube[1] && cube[5] && cube[6]) {
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[2])

              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[2])

              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[5])
            }

            // RIGHT FACE
            if (cube[1] && cube[2] && cube[5] && cube[6]) {
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[2])
  
              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[5])
  
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[2])
  
              temp.push(sides[3])
              temp.push(sides[4])
              temp.push(sides[5])
  
              temp.push(sides[3])
              temp.push(sides[1])
              temp.push(sides[5])
            }
          }

          if (temp.length > 0)
            this.#vertices = new Float32Array([...this.#vertices, ...temp])
        }
      } 
    }

    if (recursions === 1) {
      new ColoredPoint(Color.from_html_rgb(255, 192, 64), .5).apply_to({
        vertices: new Float32Array([-1, 0, 0]),
      })

      new ColoredPoint(Color.from_html_rgb(255, 64, 192), .5).apply_to({
        vertices: new Float32Array([0, -1, 0]),
      })

      new ColoredPoint(Color.from_html_rgb(64, 192, 255), .5).apply_to({
        vertices: new Float32Array([0, 0, -1])
      })

      new ColoredPoint(Color.from_html_rgb(192, 64, 255), .25).apply_to({
        vertices: this.#vertices,
      })
    }

    return {
      vertices: this.#vertices,
    }
  }
}