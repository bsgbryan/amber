import { Vector3 } from "../Sunya/types"

import { Shape } from "./shapes/types"

type TestResults = {
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
    if (divisions % 2 !== 0) throw new Error('divisions must be a power of 2')

    const x = 0,
          y = 1,
          z = 2

    const extent = {
      x: space[x] * .5,
      y: space[y] * .5,
      z: space[z] * .5,
    }

    const chunk      = 1 / divisions,
          level      = divisions * divisions,
          iterations = level * divisions,
          outside    = [] as Array<number>,
          inside     = [] as Array<number>

    for (let i = 0, v = 0; i < iterations; i++) {
      const x_offset = i % divisions,
            y_offset = Math.floor(i / level),
            z_offset = Math.floor((i % level) / divisions)

      const left  = -(space[x] - extent.x) + (x_offset * (space[x] * chunk)),
            top   =  (space[y] - extent.y) - (y_offset * (space[y] * chunk)),
            front = -(space[z] - extent.z) + (z_offset * (space[z] * chunk)),
            test  = new Float32Array([left, top, front])

      shape(test) > 0 ? add(outside, test) : add(inside, test)
    }

    return {
      inside:  new Float32Array(inside),
      outside: new Float32Array(outside),
    }
  }
}