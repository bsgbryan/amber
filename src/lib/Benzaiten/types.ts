export type TestResults = {
  debug:   Float32Array
  x_cross: Float32Array
  y_cross: Float32Array
  z_cross: Float32Array
}

export type Output = {
  debug:   Array<number>
  x_cross: Array<number>
  y_cross: Array<number>
  z_cross: Array<number>
}

export type Sides = {
  left:   number
  top:    number
  back:   number
  right:  number
  bottom: number
  front:  number
}