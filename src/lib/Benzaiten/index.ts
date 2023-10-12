type Vector3 = Float32Array

export default class Benzaiten {
  static partition(
    space: Vector3,
    divisions = 2,
    origin    = new Float32Array([0, 0, 0])
  ): Float32Array {
    if (divisions % 2 !== 0) throw new Error('divisions must be a power of 2')

    const x = 0,
          y = 1,
          z = 2

    const extent = {
      x: space[x] * .5,
      y: space[y] * .5,
      z: space[z] * .5,
    }

    const chunk = {
      x: 1 / divisions,
      y: 1 / divisions,
      z: 1 / divisions,
    }

    const per_row    = divisions * divisions
    const iterations = divisions * divisions * divisions,
          output     = new Float32Array(iterations * 3)

    for (let i = 0, v = 0; i < iterations; i++) {
      const x_offset = i % divisions,
            y_offset = Math.floor(i / per_row),
            z_offset = Math.floor((i % per_row) / divisions)

      const top   =  (space[y] - extent.y) - (y_offset * (space[y] * chunk.y)),
            left  = -(space[x] - extent.x) + (x_offset * (space[x] * chunk.x)),
            front = -(space[z] - extent.z) + (z_offset * (space[z] * chunk.z))

      console.log({ top, left, front })

      output[v++] = left
      output[v++] = top
      output[v++] = front
    }

    return output
  }
}