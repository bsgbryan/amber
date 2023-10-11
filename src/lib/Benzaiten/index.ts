type Vector3 = Float32Array

export default class Benzaiten {
  static partition(
    space: Vector3,
    divisions = 2,
    origin    = new Float32Array([0, 0, 0])
  ): Float32Array {
    if (divisions % 2 !== 0) throw new Error('divisions must be a power of 2')

    /**
     * 8 * 8 * 3 because the space will be divided in "half" moving away from each corner,
     * so there will be 8 chunks originating at the:
     * 1. top front left
     * 2. top front right
     * 3. top back right
     * 4. top back left
     * 5. bottom front left
     * 6. bottom front right
     * 7. bottom back right
     * 8. bottom back left
     * 
     * Each chuck will have 8 vertices; each vertex having 3 floats for x, y, and z
     */
    const output = new Float32Array(8 * 8 * 3)

    const x = 0,
          y = 1,
          z = 2

    const extent = 1 / divisions

    const top    =  space[y] * extent,
          bottom = -top,
          left   = -space[x] * extent,
          right  = -left,
          front  =  space[z] * extent, // Facing away from us; far edge of space
          back   = -front              // Facing toward us;    near edge of space

    output[x] = left
    output[y] = top
    output[z] = back
    
    output[3 + x] = right
    output[3 + y] = top
    output[3 + z] = back

    output[6 + x] = right
    output[6 + y] = bottom
    output[6 + z] = back

    output[9 + x] = left
    output[9 + y] = bottom
    output[9 + z] = back

    output[12 + x] = left
    output[12 + y] = top
    output[12 + z] = front

    output[15 + x] = right
    output[15 + y] = top
    output[15 + z] = front

    output[18 + x] = right
    output[18 + y] = bottom
    output[18 + z] = front

    output[21 + x] = left
    output[21 + y] = bottom
    output[21 + z] = front

    return output
  }
}