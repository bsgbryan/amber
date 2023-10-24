import { Vector3 } from "@/Sunya/types"

import { vec3 } from "@/Sunya"

import { Shape } from "@/Benzaiten/shapes/types"

import { EMPTY } from "@/Benzaiten/CONSTANTS"
import { Sides } from "@/Benzaiten/types"

const x = ['left', 'right' ],
      y = ['top',  'bottom'],
      z = ['back', 'front' ]

export const crosses = (
  a: number,
  b: number,
): boolean => {
  return (a > 0 && b < 0) ||
         (a < 0 && b > 0) ||
          a === 0         ||
          b === 0
}

const zero = vec3.zero(),
      v3   = vec3.create

const surface_vertex = (
  x: number,
  y: number,
  z: number,
): Vector3 =>
  vec3.multiply(
  v3(.475, .475, .475),
    vec3.add(
    zero,
    vec3.normalize(
      vec3.subtract(
        v3(x, y, z),
          zero,
        )
      )
    )
  )

export const x_recursion_edge = (
  distance: Shape,
  sides:    Sides,
): number => {
  // NOTE: The order of the iteration here matters:
  // Iteration needs to happen downward to guarantee
  // that 3 is returned if a vertex should be added
  // by surface_x_vertex below.
  // The number 3 is important because it corresponds to
  // y['bottom'] and z['front'] on lines 13 & 14 above.
  // These are the idices surface_x_vertex uses when 
  // building a vertex; so, when returning 3, this function
  // is saying "Yes, surface_x_vertex absolutely should create
  // a vertex" - and guarantees that surface_x_vertex will have
  // the correct data to generate the proper vertex.
  // Iterating downward is also the most efficient way to do it
  // since only a single iteration of the loop will execute
  // whenever a vertex should be generated!
    for (let i = 3; i > -1; i--) {
    const Y = sides[y[i % 2]],
          Z = sides[z[Math.floor(i / 2)]],
          L = sides[x[0]],
          R = sides[x[1]],
          a = distance(L, Y, Z)

        if (crosses(a, distance(R, Y, Z))) return i
  }
  
  return -1
}

export const y_recursion_edge = (
  distance: Shape,
  sides:    Sides,
): number => {
  // NOTE: The order of the iteration here matters:
  // Iteration needs to happen downward to guarantee
  // that 3 is returned if a vertex should be added
  // by surface_y_vertex below.
  // The number 3 is important because it corresponds to
  // x['right'] and z['front'] on lines 12 & 14 above.
  // These are the idices surface_y_vertex uses when 
  // building a vertex; so, when returning 3, this function
  // is saying "Yes, surface_y_vertex absolutely should create
  // a vertex" - and guarantees that surface_y_vertex will have
  // the correct data to generate the proper vertex.
  // Iterating downward is also the most efficient way to do it
  // since only a single iteration of the loop will execute
  // whenever a vertex should be generated!
  for (let i = 3; i > -1; i--) {
    const X = sides[x[i % 2]],
          Z = sides[z[Math.floor(i / 2)]],
          T = sides[y[0]],
          B = sides[y[1]],
          a = distance(X, T, Z)

    if (crosses(a, distance(X, B, Z))) return i
  }

  return -1
}

export const z_recursion_edge = (
  distance: Shape,
  sides:    Sides,
): number => {
  // NOTE: The order of the iteration here matters:
  // Iteration needs to happen downward to guarantee
  // that 3 is returned if a vertex should be added
  // by surface_z_vertex below.
  // The number 3 is important because it corresponds to
  // x['right'] and y['bottom'] on lines 12 & 13 above.
  // These are the idices surface_z_vertex uses when 
  // building a vertex; so, when returning 3, this function
  // is saying "Yes, surface_z_vertex absolutely should create
  // a vertex" - and guarantees that surface_z_vertex will have
  // the correct data to generate the proper vertex.
  // Iterating downward is also the most efficient way to do it
  // since only a single iteration of the loop will execute
  // whenever a vertex should be generated!
  for (let i = 3; i > -1; i--) {
    const X = sides[x[i % 2]],
          Y = sides[y[Math.floor(i / 2)]],
          B = sides[z[0]],
          F = sides[z[1]],
          a = distance(X, Y, B)

    if (crosses(a, distance(X, Y, F))) return i
  }

  return -1
}

export const surface_x_vertex = (
  distance: Shape,
  sides:    Sides,
): Vector3 => {
  const Y = sides[y[1]],
        Z = sides[z[1]],
        L = sides[x[0]]

  return surface_vertex(L + Math.abs(distance(L, Y, Z)), Y, Z)
}

export const surface_y_vertex = (
  distance: Shape,
  sides:    Sides,
): Vector3 => {
  const X = sides[x[1]],
        Z = sides[z[1]],
        T = sides[y[0]]

  return surface_vertex(X, T - Math.abs(distance(X, T, Z)), Z)
}

export const surface_z_vertex = (
  distance: Shape,
  sides:    Sides,
): Vector3 => {
  const X = sides[x[1]],
        Y = sides[y[1]],
        B = sides[z[0]]

  return surface_vertex(X, Y, B + Math.abs(distance(X, Y, B)))
}

export const merge = (
  x?: Vector3,
  y?: Vector3,
  z?: Vector3, 
): Vector3 => {
    const vectors: Array<Vector3> = []

  if (x) vectors.push(x)
  if (y) vectors.push(y)
  if (z) vectors.push(z)

  if (vectors.length === 0) return new Float32Array()

  if (vectors.length === 1) return vectors[0]

  if (vectors.length === 2)
    return vec3.divide_by_scalar(vec3.add(vectors[0], vectors[1]), 2)

  if (vectors.length === 3) {
    const m = vec3.divide_by_scalar(vec3.add(vectors[0], vectors[1]), 2)

    return vec3.divide_by_scalar(vec3.add(vectors[2], m), 2)
  }
}

export const index = (
  position: number,
  chunk:    number,
  segment:  number,
): number => {
  const g = 1 / chunk,
        d = g * segment

  return (position * d) + g
}

export const grid_index = (
  x:     number,
  y:     number,
  z:     number,
  width: number,
  depth: number,
) => x + (z * width) + (y * width * depth)

export const to_3D = (
  index:  number,
  width:  number,
  depth:  number, 
) => ({
  x: index % width,
  y: Math.floor(index / (width  * depth)),
  z: Math.floor(index /  width) % depth
})

export const neighbors = (
  x:      number,
  y:      number,
  z:      number,
  width:  number,
  height: number,
  depth:  number,
  grid:   Uint16Array,
): Array<Array<number>> => {
  const output: Array<Array<number>> = []

  if (z > 0 && x > 0) {
    // console.log(y)
    if (y === 0) {
      const t1 = []
      const t2 = []
  
      const v1 = grid_index(x, y, z - 1, width, depth)
  
      if (grid[v1] !== EMPTY) t1.push(v1)
  
      const v2 = grid_index(x - 1, y, z - 1, width, depth)
  
      if (grid[v2] !== EMPTY) {
        t1.push(v2)
        t2.push(v2)
  
        if (t1.length === 2)
          output.push(-y * 2 > height ? t1.reverse() : t1)
      }

      const v3 = grid_index(x - 1, y, z, width, depth)

      if (grid[v3] !== EMPTY) {
        t2.push(v3)
  
        if (t2.length === 2)
          output.push(-y * 2 > height ? t2.reverse() : t2)
      }
    }

    if (y > 0) {
      { // Z axis
        const t1 = []
        const t2 = []
    
        const v1 = grid_index(x, y, z - 1, width, depth)
    
        if (grid[v1] !== EMPTY) t1.push(v1)
    
        const v2 = grid_index(x, y - 1, z - 1, width, depth)
    
        if (grid[v2] !== EMPTY) {
          t1.push(v2)
          t2.push(v2)
    
          if (t1.length === 2)
            output.push(x * 2 > width ? t1 : t1.reverse())
        }
  
        const v3 = grid_index(x, y - 1, z, width, depth)
  
        if (grid[v3] !== EMPTY) {
          t2.push(v3)
  
          if (t2.length === 2)
            output.push(x * 2 > width ? t2 : t2.reverse())
        }
      }

      { // X axis
        const t3 = []
        const t4 = []
    
        const v4 = grid_index(x - 1, y, z, width, depth)
    
        if (grid[v4] !== EMPTY) t3.push(v4)
    
        const v5 = grid_index(x - 1, y, z - 1, width, depth)
    
        if (grid[v5] !== EMPTY) {
          t3.push(v5)
          t4.push(v5)
    
          if (t3.length === 2)
            output.push(t3)
        }
  
        const v6 = grid_index(x, y, z - 1, width, depth)
  
        if (grid[v6] !== EMPTY) {
          t4.push(v6)
  
          if (t4.length === 2)
            output.push(t4)
        }
      }

      // { // XY axis
      //   const t3 = []
      //   const t4 = []
    
      //   const v4 = grid_index(x - 1, y, z - 1, width, depth)
    
      //   if (grid[v4] !== EMPTY) t3.push(v4)
    
      //   const v5 = grid_index(x - 1, y - 1, z - 1, width, depth)
    
      //   if (grid[v5] !== EMPTY) {
      //     t3.push(v5)
      //     t4.push(v5)
    
      //     if (t3.length === 2)
      //       output.push(z * 2 > depth ? t3 : t3.reverse())
      //   }
  
      //   const v6 = grid_index(x, y - 1, z, width, depth)
  
      //   if (grid[v6] !== EMPTY) {
      //     t4.push(v6)
  
      //     if (t4.length === 2)
      //       output.push(z * 2 > depth ? t4 : t4.reverse())
      //   }
      // }
    }
  }

  return output
}