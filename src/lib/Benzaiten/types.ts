import { Vector3 } from "../Sunya/types"

export type TestResult = Vector3 | null | undefined

export type Output = {
  debug:   Array<number>
  x_cross: Array<number>
  y_cross: Array<number>
  z_cross: Array<number>
}

type Side =
  'back'   |
  'bottom' |
  'front'  |
  'left'   |
  'right'  |
  'top'

export type Sides = {
  [SIDE in Side as string]: number
}

export type Mesh = {
  vertices: Float32Array
  indices:  Uint16Array
}