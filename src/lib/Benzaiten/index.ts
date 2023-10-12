import { Vector3 } from "../Sunya/types"

import { Shape } from "./shapes/types"

type TestResults = {
  debug:   Float32Array
  x_cross: Float32Array
  y_cross: Float32Array
  z_cross: Float32Array
}

const add = (
  context: Array<number>,
  vec:     Vector3,
) => {
  context.push(vec[0])
  context.push(vec[1])
  context.push(vec[2])
}

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
    const output = {
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

      const left   = origin[x] - offset_x + ( x_offset      * extent.x),
            top    = origin[y] + offset_y - ( y_offset      * extent.y),
            back   = origin[z] - offset_z + ( z_offset      * extent.z),
            right  = origin[x] - offset_x + ((x_offset + 1) * extent.x),
            bottom = origin[y] + offset_y - ((y_offset + 1) * extent.y),
            front  = origin[z] - offset_z + ((z_offset + 1) * extent.z)

      add(output.debug, new Float32Array([left, top, back]))

      // Testing along X axis
      {
        const result_x_one = shape(new Float32Array([left,  top, back])),
              result_x_two = shape(new Float32Array([right, top, back])),
              x_point      = new Float32Array([left + (extent.x * .5), top, back])
  
        if ((result_x_one > 0 && result_x_two < 0) ||
            (result_x_one < 0 && result_x_two > 0) ||
             result_x_one === 0                    ||
             result_x_two === 0
        ) {
          if (recursions === divisions) add(output.x_cross, x_point)
          else needs_recursion = true
        }
      }

      {
        const result_x_one = shape(new Float32Array([left,  bottom, back])),
              result_x_two = shape(new Float32Array([right, bottom, back])),
              x_point      = new Float32Array([left + (extent.x * .5), bottom, back])
  
        if ((result_x_one > 0 && result_x_two < 0) ||
            (result_x_one < 0 && result_x_two > 0) ||
             result_x_one === 0                    ||
             result_x_two === 0
        ) {
          if (recursions === divisions) add(output.x_cross, x_point)
          else needs_recursion = true
        }
      }

      {
        const result_x_one = shape(new Float32Array([left,  top, front])),
              result_x_two = shape(new Float32Array([right, top, front])),
              x_point      = new Float32Array([left + (extent.x * .5), top, front])
  
        if ((result_x_one > 0 && result_x_two < 0) ||
            (result_x_one < 0 && result_x_two > 0) ||
             result_x_one === 0                    ||
             result_x_two === 0
        ) {
          if (recursions === divisions) add(output.x_cross, x_point)
          else needs_recursion = true
        }
      }

      {
        const result_x_one = shape(new Float32Array([left,  bottom, front])),
              result_x_two = shape(new Float32Array([right, bottom, front])),
              x_point      = new Float32Array([left + (extent.x * .5), bottom, front])
  
        if ((result_x_one > 0 && result_x_two < 0) ||
            (result_x_one < 0 && result_x_two > 0) ||
             result_x_one === 0                    ||
             result_x_two === 0
        ) {
          if (recursions === divisions) add(output.x_cross, x_point)
          else needs_recursion = true
        }
      }

      // Testing along Y axis
      {
        const result_y_one = shape(new Float32Array([left, top,    back])),
              result_y_two = shape(new Float32Array([left, bottom, back])),
              y_point      = new Float32Array([left, top - (extent.y * .5), back])

        if ((result_y_one > 0 && result_y_two < 0) ||
            (result_y_one < 0 && result_y_two > 0) ||
            result_y_one === 0                    ||
            result_y_two === 0
        ) {
          if (recursions === divisions) add(output.y_cross, y_point)
          else needs_recursion = true
        }
      }

      {
        const result_y_one = shape(new Float32Array([right, top,    back])),
              result_y_two = shape(new Float32Array([right, bottom, back])),
              y_point      = new Float32Array([right, top - (extent.y * .5), back])
  
        if ((result_y_one > 0 && result_y_two < 0) ||
            (result_y_one < 0 && result_y_two > 0) ||
             result_y_one === 0                    ||
             result_y_two === 0
        ) {
          if (recursions === divisions) add(output.y_cross, y_point)
          else needs_recursion = true
        }
      }

      {
        const result_y_one = shape(new Float32Array([left, top,    front])),
              result_y_two = shape(new Float32Array([left, bottom, front])),
              y_point      = new Float32Array([left, top - (extent.y * .5), front])

        if ((result_y_one > 0 && result_y_two < 0) ||
            (result_y_one < 0 && result_y_two > 0) ||
            result_y_one === 0                    ||
            result_y_two === 0
        ) {
          if (recursions === divisions) add(output.y_cross, y_point)
          else needs_recursion = true
        }
      }

      {
        const result_y_one = shape(new Float32Array([right, top,    front])),
              result_y_two = shape(new Float32Array([right, bottom, front])),
              y_point      = new Float32Array([right, top - (extent.y * .5), front])
  
        if ((result_y_one > 0 && result_y_two < 0) ||
            (result_y_one < 0 && result_y_two > 0) ||
             result_y_one === 0                    ||
             result_y_two === 0
        ) {
          if (recursions === divisions) add(output.y_cross, y_point)
          else needs_recursion = true
        }
      }

      // Testing along Z axis
      {
        const result_z_one = shape(new Float32Array([left, top, back ])),
              result_z_two = shape(new Float32Array([left, top, front])),
              z_point      = new Float32Array([left, top, back + (extent.z * .5)])
  
        if ((result_z_one > 0 && result_z_two < 0) ||
            (result_z_one < 0 && result_z_two > 0) ||
             result_z_one === 0                    ||
             result_z_two === 0
        ) {
          if (recursions === divisions) add(output.z_cross, z_point)
          else needs_recursion = true
        }
      }

      {
        const result_z_one = shape(new Float32Array([right, top, back ])),
              result_z_two = shape(new Float32Array([right, top, front])),
              z_point      = new Float32Array([right, top, back + (extent.z * .5)])
  
        if ((result_z_one > 0 && result_z_two < 0) ||
            (result_z_one < 0 && result_z_two > 0) ||
             result_z_one === 0                    ||
             result_z_two === 0
        ) {
          if (recursions === divisions) add(output.z_cross, z_point)
          else needs_recursion = true
        }
      }

      {
        const result_z_one = shape(new Float32Array([left, bottom, back ])),
              result_z_two = shape(new Float32Array([left, bottom, front])),
              z_point      = new Float32Array([left, bottom, back + (extent.z * .5)])
  
        if ((result_z_one > 0 && result_z_two < 0) ||
            (result_z_one < 0 && result_z_two > 0) ||
             result_z_one === 0                    ||
             result_z_two === 0
        ) {
          if (recursions === divisions) add(output.z_cross, z_point)
          else needs_recursion = true
        }
      }

      {
        const result_z_one = shape(new Float32Array([right, bottom, back ])),
              result_z_two = shape(new Float32Array([right, bottom, front])),
              z_point      = new Float32Array([right, bottom, back + (extent.z * .5)])
  
        if ((result_z_one > 0 && result_z_two < 0) ||
            (result_z_one < 0 && result_z_two > 0) ||
             result_z_one === 0                    ||
             result_z_two === 0
        ) {
          if (recursions === divisions) add(output.z_cross, z_point)
          else needs_recursion = true
        }
      }

      if (x_offset === 0) { add(output.debug, new Float32Array([right, top,    back]))
        if (y_offset === 0) add(output.debug, new Float32Array([right, bottom, back]))
      }

      if (y_offset === 0) add(output.debug, new Float32Array([left, bottom, back]))

      if (z_offset === 0) { add(output.debug, new Float32Array([left,  top,    front]))
        if (x_offset === 0) add(output.debug, new Float32Array([right, top,    front]))
        if (y_offset === 0) add(output.debug, new Float32Array([left,  bottom, front]))
      }

      if (needs_recursion && recursions + 1 <= divisions) {
        const divided_origin   = new Float32Array([left + (extent.x * .5), top - (extent.y * .5), back + (extent.z * .5)]),
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