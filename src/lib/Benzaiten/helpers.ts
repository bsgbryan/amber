// import { Vector3 } from "@/Sunya/types"

import { Shape } from "@/Benzaiten/shapes/types"

import { EMPTY } from "@/Benzaiten/CONSTANTS"
import { Sides } from "@/Benzaiten/types"

// import {
//   add,
//   divide_by_scalar,
//   multiply,
//   normalize,
//   subtract,
// } from "#/Sunya/Vector3D"

const x = ['left',    'right' ],
      y = ['bottom',  'top'   ],
      z = ['back',    'front' ]

export const crosses = (
  a: number,
  b: number,
): boolean => {
  return (a > 0 && b < 0) ||
         (a < 0 && b > 0) ||
          a === 0         ||
          b === 0
}

// const surface_vertex = (
//   x: number,
//   y: number,
//   z: number,
// ): Vector3 =>
//   multiply(
//     new Float32Array([.475, .475, .475]),
//     add(
//       new Float32Array([0, 0, 0]),
//       normalize(
//         subtract(
//           new Float32Array([x, y, z]),
//           new Float32Array([0, 0, 0]),
//         )
//       )
//     )
//   )

export const x_crossings = (
  distance: Shape,
  sides:    Sides,
): Float32Array => {
  const output = new Float32Array(13)

  let count = 0

  for (let i = 3; i > -1; i--) {
    const Y = sides[y[Math.abs(Math.floor((i - 1) / 2))]],
          Z = sides[z[Math.floor(i / 2)]],
          L = sides[x[0]],
          R = sides[x[1]],
          c = (i + 1) * 3

    if (crosses(distance(L, Y, Z), distance(R, Y, Z))) {
      count++

      output[c - 2] = L < 0 ? L : R
      output[c - 1] = Y
      output[c - 0] = Z
    }
    else {
      output[c - 2] = EMPTY
      output[c - 1] = EMPTY
      output[c - 0] = EMPTY
    }
  }

  output[0] = count

  return output
}

export const y_crossings = (
  distance: Shape,
  sides:    Sides,
): Float32Array => {
  const output = new Float32Array(13)

  let count = 0

  for (let i = 3; i > -1; i--) {
    const X = sides[x[Math.abs(Math.floor((i - 1) / 2))]],
          Z = sides[z[Math.floor(i / 2)]],
          B = sides[y[0]],
          T = sides[y[1]],
          c = (i + 1) * 3

    if (crosses(distance(X, B, Z), distance(X, T, Z))) {
      count++

      output[c - 2] = X
      output[c - 1] = B < 0 ? B : T
      output[c - 0] = Z
    }
    else {
      output[c - 2] = EMPTY
      output[c - 1] = EMPTY
      output[c - 0] = EMPTY
    }
  }

  output[0] = count

  return output
}

export const z_crossings = (
  distance: Shape,
  sides:    Sides,
): Float32Array => {
  const output = new Float32Array(13)

  let count = 0

  for (let i = 3; i > -1; i--) {
    const X = sides[x[Math.abs(Math.floor((i - 1) / 2))]],
          Y = sides[y[Math.floor(i / 2)]],
          B = sides[z[0]],
          F = sides[z[1]],
          c = (i + 1) * 3

    if (crosses(distance(X, Y, B), distance(X, Y, F))) {
      count++

      output[c - 2] = X
      output[c - 1] = Y
      output[c - 0] = B < 0 ? B : F
    }
    else {
      output[c - 2] = EMPTY
      output[c - 1] = EMPTY
      output[c - 0] = EMPTY
    }
  }

  output[0] = count

  return new Float32Array(output)
}

// export const x_recursion_edge = (
//   distance: Shape,
//   sides:    Sides,
// ): number => {
//   for (let i = 3; i > -1; i--) {
//     const Y = sides[y[Math.abs(Math.floor((i - 1) / 2))]],
//           Z = sides[z[Math.floor(i / 2)]],
//           L = sides[x[0]],
//           R = sides[x[1]]

//     if (crosses(distance(L, Y, Z), distance(R, Y, Z))) return i
//   }
  
//   return -1
// }

// export const y_recursion_edge = (
//   distance: Shape,
//   sides:    Sides,
// ): number => {
//   for (let i = 3; i > -1; i--) {
//     const X = sides[x[Math.abs(Math.floor((i - 1) / 2))]],
//           Z = sides[z[Math.floor(i / 2)]],
//           B = sides[y[0]],
//           T = sides[y[1]]

//     if (crosses(distance(X, B, Z), distance(X, T, Z))) return i
//   }

//   return -1
// }

// export const z_recursion_edge = (
//   distance: Shape,
//   sides:    Sides,
// ): number => {
//   for (let i = 3; i > -1; i--) {
//     const X = sides[x[Math.abs(Math.floor((i - 1) / 2))]],
//           Y = sides[y[Math.floor(i / 2)]],
//           B = sides[z[0]],
//           F = sides[z[1]]

//     if (crosses(distance(X, Y, B), distance(X, Y, F))) return i
//   }

//   return -1
// }

// export const surface_x_vertex = (
//   distance: Shape,
//   sides:    Sides,
// ): Vector3 => {
//   const Y = sides[y[1]],
//         Z = sides[z[1]],
//         L = sides[x[0]]

//   return surface_vertex(L + Math.abs(distance(L, Y, Z)), Y, Z)
// }

// export const surface_y_vertex = (
//   distance: Shape,
//   sides:    Sides,
// ): Vector3 => {
//   const X = sides[x[1]],
//         Z = sides[z[1]],
//         T = sides[y[0]]

//   return surface_vertex(X, T - Math.abs(distance(X, T, Z)), Z)
// }

// export const surface_z_vertex = (
//   distance: Shape,
//   sides:    Sides,
// ): Vector3 => {
//   const X = sides[x[1]],
//         Y = sides[y[1]],
//         B = sides[z[0]]

//   return surface_vertex(X, Y, B + Math.abs(distance(X, Y, B)))
// }

// export const merge = (
//   x?: Vector3,
//   y?: Vector3,
//   z?: Vector3, 
// ): Vector3 => {
//     const vectors: Array<Vector3> = []

//   if (x) vectors.push(x)
//   if (y) vectors.push(y)
//   if (z) vectors.push(z)

//   if (vectors.length === 0) return new Float32Array()

//   if (vectors.length === 1) return vectors[0]

//   if (vectors.length === 2)
//     return divide_by_scalar(add(vectors[0], vectors[1]), 2)

//   if (vectors.length === 3) {
//     const m = divide_by_scalar(add(vectors[0], vectors[1]), 2)

//     return divide_by_scalar(add(vectors[2], m), 2)
//   }
// }

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

// export const to_3D = (
//   index:  number,
//   width:  number,
//   depth:  number, 
// ) => ({
//   x: index % width,
//   y: Math.floor(index / (width  * depth)),
//   z: Math.floor(index /  width) % depth
// })

// export const neighbors = (
//   x:      number,
//   y:      number,
//   z:      number,
//   width:  number,
//   height: number,
//   depth:  number,
//   grid:   Uint16Array,
// ): Array<Array<number>> => {
//   const output: Array<Array<number>> = []

//   if (z > 0 && x > 0) {
//     // console.log(y)
//     if (y === 0) {
//       const t1 = []
//       const t2 = []
  
//       const v1 = grid_index(x, y, z - 1, width, depth)
  
//       if (grid[v1] !== EMPTY) t1.push(v1)
  
//       const v2 = grid_index(x - 1, y, z - 1, width, depth)
  
//       if (grid[v2] !== EMPTY) {
//         t1.push(v2)
//         t2.push(v2)
  
//         if (t1.length === 2)
//           output.push(-y * 2 > height ? t1.reverse() : t1)
//       }

//       const v3 = grid_index(x - 1, y, z, width, depth)

//       if (grid[v3] !== EMPTY) {
//         t2.push(v3)
  
//         if (t2.length === 2)
//           output.push(-y * 2 > height ? t2.reverse() : t2)
//       }
//     }

//     if (y > 0) {
//       { // Z axis
//         const t1 = []
//         const t2 = []
    
//         const v1 = grid_index(x, y, z - 1, width, depth)
    
//         if (grid[v1] !== EMPTY) t1.push(v1)
    
//         const v2 = grid_index(x, y - 1, z - 1, width, depth)
    
//         if (grid[v2] !== EMPTY) {
//           t1.push(v2)
//           t2.push(v2)
    
//           if (t1.length === 2)
//             output.push(x * 2 > width ? t1 : t1.reverse())
//         }
  
//         const v3 = grid_index(x, y - 1, z, width, depth)
  
//         if (grid[v3] !== EMPTY) {
//           t2.push(v3)
  
//           if (t2.length === 2)
//             output.push(x * 2 > width ? t2 : t2.reverse())
//         }
//       }

//       { // X axis
//         const t3 = []
//         const t4 = []
    
//         const v4 = grid_index(x - 1, y, z, width, depth)
    
//         if (grid[v4] !== EMPTY) t3.push(v4)
    
//         const v5 = grid_index(x - 1, y, z - 1, width, depth)
    
//         if (grid[v5] !== EMPTY) {
//           t3.push(v5)
//           t4.push(v5)
    
//           if (t3.length === 2)
//             output.push(t3)
//         }
  
//         const v6 = grid_index(x, y, z - 1, width, depth)
  
//         if (grid[v6] !== EMPTY) {
//           t4.push(v6)
  
//           if (t4.length === 2)
//             output.push(t4)
//         }
//       }

//       // { // XY axis
//       //   const t3 = []
//       //   const t4 = []
    
//       //   const v4 = grid_index(x - 1, y, z - 1, width, depth)
    
//       //   if (grid[v4] !== EMPTY) t3.push(v4)
    
//       //   const v5 = grid_index(x - 1, y - 1, z - 1, width, depth)
    
//       //   if (grid[v5] !== EMPTY) {
//       //     t3.push(v5)
//       //     t4.push(v5)
    
//       //     if (t3.length === 2)
//       //       output.push(z * 2 > depth ? t3 : t3.reverse())
//       //   }
  
//       //   const v6 = grid_index(x, y - 1, z, width, depth)
  
//       //   if (grid[v6] !== EMPTY) {
//       //     t4.push(v6)
  
//       //     if (t4.length === 2)
//       //       output.push(z * 2 > depth ? t4 : t4.reverse())
//       //   }
//       // }
//     }
//   }

//   return output
// }