import { Vector3 } from "../Sunya/types"

import { Shape } from "./shapes/types"

import { Output, Sides } from "./types"

export const add = (
  context: Array<number>,
  vec:     Vector3,
) => {
  context.push(vec[0])
  context.push(vec[1])
  context.push(vec[2])
}

export const test_x = (
  shape:      Shape,
  extent:     number,
  sides:      Sides,
  output:     Output,
  recursions: number,
  divisions:  number,
): boolean => {
  let needs_recursion = false

  {
    const result_x_one = shape(new Float32Array([sides.left,  sides.top, sides.back])),
          result_x_two = shape(new Float32Array([sides.right, sides.top, sides.back])),
          x_point      = new Float32Array([sides.left + (extent * .5), sides.top, sides.back])

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
    const result_x_one = shape(new Float32Array([sides.left,  sides.bottom, sides.back])),
          result_x_two = shape(new Float32Array([sides.right, sides.bottom, sides.back])),
          x_point      = new Float32Array([sides.left + (extent * .5), sides.bottom, sides.back])

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
    const result_x_one = shape(new Float32Array([sides.left,  sides.top, sides.front])),
          result_x_two = shape(new Float32Array([sides.right, sides.top, sides.front])),
          x_point      = new Float32Array([sides.left + (extent * .5), sides.top, sides.front])

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
    const result_x_one = shape(new Float32Array([sides.left,  sides.bottom, sides.front])),
          result_x_two = shape(new Float32Array([sides.right, sides.bottom, sides.front])),
          x_point      = new Float32Array([sides.left + (extent * .5), sides.bottom, sides.front])

    if ((result_x_one > 0 && result_x_two < 0) ||
        (result_x_one < 0 && result_x_two > 0) ||
         result_x_one === 0                    ||
         result_x_two === 0
    ) {
      if (recursions === divisions) add(output.x_cross, x_point)
      else needs_recursion = true
    }
  }

  return needs_recursion
}

export const test_y = (
  shape:      Shape,
  extent:     number,
  sides:      Sides,
  output:     Output,
  recursions: number,
  divisions:  number,
): boolean => {
  let needs_recursion = false
  
  {
    const result_y_one = shape(new Float32Array([sides.left, sides.top,    sides.back])),
          result_y_two = shape(new Float32Array([sides.left, sides.bottom, sides.back])),
          y_point      = new Float32Array([sides.left, sides.top - (extent * .5), sides.back])

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
    const result_y_one = shape(new Float32Array([sides.right, sides.top,    sides.back])),
          result_y_two = shape(new Float32Array([sides.right, sides.bottom, sides.back])),
          y_point      = new Float32Array([sides.right, sides.top - (extent * .5), sides.back])

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
    const result_y_one = shape(new Float32Array([sides.left, sides.top,    sides.front])),
          result_y_two = shape(new Float32Array([sides.left, sides.bottom, sides.front])),
          y_point      = new Float32Array([sides.left, sides.top - (extent * .5), sides.front])

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
    const result_y_one = shape(new Float32Array([sides.right, sides.top,    sides.front])),
          result_y_two = shape(new Float32Array([sides.right, sides.bottom, sides.front])),
          y_point      = new Float32Array([sides.right, sides.top - (extent * .5), sides.front])

    if ((result_y_one > 0 && result_y_two < 0) ||
        (result_y_one < 0 && result_y_two > 0) ||
         result_y_one === 0                    ||
         result_y_two === 0
    ) {
      if (recursions === divisions) add(output.y_cross, y_point)
      else needs_recursion = true
    }
  }

  return needs_recursion
}

export const test_z = (
  shape:      Shape,
  extent:     number,
  sides:      Sides,
  output:     Output,
  recursions: number,
  divisions:  number,
): boolean => {
  let needs_recursion = false

  {
    const result_z_one = shape(new Float32Array([sides.left, sides.top, sides.back ])),
          result_z_two = shape(new Float32Array([sides.left, sides.top, sides.front])),
          z_point      = new Float32Array([sides.left, sides.top, sides.back + (extent * .5)])

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
    const result_z_one = shape(new Float32Array([sides.right, sides.top, sides.back ])),
          result_z_two = shape(new Float32Array([sides.right, sides.top, sides.front])),
          z_point      = new Float32Array([sides.right, sides.top, sides.back + (extent * .5)])

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
    const result_z_one = shape(new Float32Array([sides.left, sides.bottom, sides.back ])),
          result_z_two = shape(new Float32Array([sides.left, sides.bottom, sides.front])),
          z_point      = new Float32Array([sides.left, sides.bottom, sides.back + (extent * .5)])

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
    const result_z_one = shape(new Float32Array([sides.right, sides.bottom, sides.back ])),
          result_z_two = shape(new Float32Array([sides.right, sides.bottom, sides.front])),
          z_point      = new Float32Array([sides.right, sides.bottom, sides.back + (extent * .5)])

    if ((result_z_one > 0 && result_z_two < 0) ||
        (result_z_one < 0 && result_z_two > 0) ||
         result_z_one === 0                    ||
         result_z_two === 0
    ) {
      if (recursions === divisions) add(output.z_cross, z_point)
      else needs_recursion = true
    }
  }

  return needs_recursion
}