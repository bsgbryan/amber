import {
  cross,
  normalize,
  subtract,
} from "./Vector3D"

export function aim(
  eye:    Float32Array,
  target: Float32Array,
  up:     Float32Array,
): Float32Array {
  const output = new Float32Array(16)

  const zAxis = normalize(subtract(target, eye  ))
  const xAxis = normalize(cross   (up,     zAxis))
  const yAxis = normalize(cross   (zAxis,  xAxis))

  // The first three items here are negated so the X axis isn't inverted
  // (I have no idea why this happens, but it's super confusing and disorienting)
  output[ 0] = -xAxis[0]; output[ 1] = -xAxis[1]; output[ 2] = -xAxis[2]; output[ 3] = 0;
  output[ 4] =  yAxis[0]; output[ 5] =  yAxis[1]; output[ 6] =  yAxis[2]; output[ 7] = 0;
  output[ 8] =  zAxis[0]; output[ 9] =  zAxis[1]; output[10] =  zAxis[2]; output[11] = 0;
  output[12] =    eye[0]; output[13] =    eye[1]; output[14] =    eye[2]; output[15] = 1;

  return output
}

export function look_at(
  eye:    Float32Array,
  target: Float32Array,
  up:     Float32Array,
): Float32Array {
  const output = new Float32Array(16)

  const zAxis = normalize(subtract(eye,   target)),
        xAxis = normalize(cross   (up,    zAxis )),
        yAxis = normalize(cross   (zAxis, xAxis ))

  const x_eye = -(xAxis[0] * eye[0] + xAxis[1] * eye[1] + xAxis[2] * eye[2]),
        y_eye = -(yAxis[0] * eye[0] + yAxis[1] * eye[1] + yAxis[2] * eye[2]),
        z_eye = -(zAxis[0] * eye[0] + zAxis[1] * eye[1] + zAxis[2] * eye[2])

  // The first three items here are negated so the X axis isn't inverted
  // (I have no idea why this happens, but it's super confusing and disorienting)
  output[ 0] = -xAxis[0]; output[ 1] = -yAxis[0]; output[ 2] = -zAxis[0]; output[ 3] = 0;
  output[ 4] =  xAxis[1]; output[ 5] =  yAxis[1]; output[ 6] =  zAxis[1]; output[ 7] = 0;
  output[ 8] =  xAxis[2]; output[ 9] =  yAxis[2]; output[10] =  zAxis[2]; output[11] = 0;
  output[12] =  x_eye;    output[13] =  y_eye;    output[14] =  z_eye;    output[15] = 1;

  return output
}

export function multiply(
  a: Float32Array,
  b: Float32Array,
): Float32Array {
  const output = new Float32Array(16)

  const b00 = b[0 * 4 + 0]
  const b01 = b[0 * 4 + 1]
  const b02 = b[0 * 4 + 2]
  const b03 = b[0 * 4 + 3]
  const b10 = b[1 * 4 + 0]
  const b11 = b[1 * 4 + 1]
  const b12 = b[1 * 4 + 2]
  const b13 = b[1 * 4 + 3]
  const b20 = b[2 * 4 + 0]
  const b21 = b[2 * 4 + 1]
  const b22 = b[2 * 4 + 2]
  const b23 = b[2 * 4 + 3]
  const b30 = b[3 * 4 + 0]
  const b31 = b[3 * 4 + 1]
  const b32 = b[3 * 4 + 2]
  const b33 = b[3 * 4 + 3]
  const a00 = a[0 * 4 + 0]
  const a01 = a[0 * 4 + 1]
  const a02 = a[0 * 4 + 2]
  const a03 = a[0 * 4 + 3]
  const a10 = a[1 * 4 + 0]
  const a11 = a[1 * 4 + 1]
  const a12 = a[1 * 4 + 2]
  const a13 = a[1 * 4 + 3]
  const a20 = a[2 * 4 + 0]
  const a21 = a[2 * 4 + 1]
  const a22 = a[2 * 4 + 2]
  const a23 = a[2 * 4 + 3]
  const a30 = a[3 * 4 + 0]
  const a31 = a[3 * 4 + 1]
  const a32 = a[3 * 4 + 2]
  const a33 = a[3 * 4 + 3]

  output[ 0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30
  output[ 1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31
  output[ 2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32
  output[ 3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33

  output[ 4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30
  output[ 5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31
  output[ 6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32
  output[ 7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33

  output[ 8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30
  output[ 9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31
  output[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32
  output[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33

  output[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30
  output[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31
  output[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32
  output[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33

  return output
}

export function perspective(
  fov:    f32,
  aspect: f32,
  near:   f32,
  far:    f32,
): Float32Array {
  const output  = new Float32Array(16),
        f       = Math.tan(Math.PI * 0.5 - 0.5 * fov) as f32,
        inverse = 1.0 as f32 / (near - far)

  output[ 0] = f / aspect
  output[ 1] = 0.0
  output[ 2] = 0.0
  output[ 3] = 0.0

  output[ 4] = 0.0
  output[ 5] = f
  output[ 6] = 0.0
  output[ 7] = 0.0

  output[ 8] =  0.0
  output[ 9] =  0
  output[10] =  far * inverse
  output[11] = -1.0

  output[12] = 0.0
  output[13] = 0.0
  output[14] = near * far * inverse
  output[15] = 0.0

  return output
}