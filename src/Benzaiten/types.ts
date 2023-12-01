export type Vector3 = Float32Array

export type TestResult = Vector3 | null | undefined

export type Output = {
  debug:   Array<number>
  x_cross: Array<number>
  y_cross: Array<number>
  z_cross: Array<number>
}

export type Mesh = {
  vertices: Float32Array
  indices?: Uint16Array
}