import { Vector3 } from "../Sunya/types"

import { Shape } from "./shapes/types"

type TestResults = {
  debug:   Float32Array
  inside:  Float32Array
  outside: Float32Array
}

const add = (
  context: Array<number>,
  vec:     Vector3,
) => {
  context.push(vec[0])
  context.push(vec[1])
  context.push(vec[2])
}

export default class Benzaiten {
  static partition(
    shape: Shape,
    divisions: number  = 2,
    space:     Vector3 = new Float32Array([1, 1, 1]),
  ): TestResults {
    const x = 0,
          y = 1,
          z = 2

    const radius = {
      x: space[x] * .5,
      y: space[y] * .5,
      z: space[z] * .5,
    }

    const chunk      = 1 / divisions,
          level      = divisions * divisions,
          iterations = level * divisions
          
    const outside = [] as Array<number>,
          inside  = [] as Array<number>,
          debug   = [] as Array<number>

    const extra_x =   divisions * chunk  * .5,
          extra_y = -(divisions * chunk) * .5,
          extra_z =   divisions * chunk  * .5

    for (let i = 0, v = 0; i < iterations; i++) {
      const x_offset = i % divisions,
            y_offset = Math.floor(i / level),
            z_offset = Math.floor((i % level) / divisions)

      const left  = -(space[x] - radius.x) + (x_offset * (space[x] * chunk)),
            top   =  (space[y] - radius.y) - (y_offset * (space[y] * chunk)),
            front = -(space[z] - radius.z) + (z_offset * (space[z] * chunk))
            
      const offset = chunk * .5,
            test   = new Float32Array([left + offset, top - offset, front + offset])

      shape(test) > 0 ? add(outside, test) : add(inside, test)

      add(debug, new Float32Array([left, top, front]))

      if (x_offset === 0) {
                            add(debug, new Float32Array([extra_x, top,     front]))
        if (y_offset === 0) add(debug, new Float32Array([extra_x, extra_y, front]))
      }

      if (y_offset === 0) add(debug, new Float32Array([left, extra_y, front]))

      if (z_offset === 0) {
                            add(debug, new Float32Array([left,    top,     extra_z]))
        if (x_offset === 0) add(debug, new Float32Array([extra_x, top,     extra_z]))
        if (y_offset === 0) add(debug, new Float32Array([left,    extra_y, extra_z]))
      }
    }

    add(debug, new Float32Array([extra_x, extra_y, extra_z]))

    return {
      debug:   new Float32Array(debug),
      inside:  new Float32Array(inside),
      outside: new Float32Array(outside),
    }
  }
}