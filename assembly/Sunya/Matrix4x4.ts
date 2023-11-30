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

  const z_axis = normalize(subtract(target, eye   ))
  const x_axis = normalize(cross   (up,     z_axis))
  const y_axis = normalize(cross   (z_axis, x_axis))

  // The first three items here are negated so the X axis isn't inverted
  // (I have no idea why this happens, but it's super confusing and disorienting)
  output[ 0] = -x_axis[0]; output[ 1] = -x_axis[1]; output[ 2] = -x_axis[2]; output[ 3] = 0;
  output[ 4] =  y_axis[0]; output[ 5] =  y_axis[1]; output[ 6] =  y_axis[2]; output[ 7] = 0;
  output[ 8] =  z_axis[0]; output[ 9] =  z_axis[1]; output[10] =  z_axis[2]; output[11] = 0;
  output[12] =     eye[0]; output[13] =     eye[1]; output[14] =     eye[2]; output[15] = 1;

  return output
}

export function look_at(
  eye:    Float32Array,
  target: Float32Array,
  up:     Float32Array,
): Float32Array {
  const output = new Float32Array(16)

  const z_axis = normalize(subtract(eye,    target)),
        x_axis = normalize(cross   (up,     z_axis)),
        y_axis = normalize(cross   (z_axis, x_axis))

  const v0 = f32x4(x_axis[0], x_axis[1], x_axis[2], 0),
        v1 = f32x4(y_axis[0], y_axis[1], y_axis[2], 0),
        v2 = f32x4(z_axis[0], z_axis[1], z_axis[2], 0),
        v3 = f32x4(   eye[0],    eye[1],    eye[2], 0),
        r0 = f32x4.mul(v0, v3),
        r1 = f32x4.mul(v1, v3),
        r2 = f32x4.mul(v2, v3)

  const _x = f32x4(f32x4.extract_lane(r0, 0), f32x4.extract_lane(r1, 0), f32x4.extract_lane(r2, 0), 0),
        _y = f32x4(f32x4.extract_lane(r0, 1), f32x4.extract_lane(r1, 1), f32x4.extract_lane(r2, 1), 0),
        _z = f32x4(f32x4.extract_lane(r0, 2), f32x4.extract_lane(r1, 2), f32x4.extract_lane(r2, 2), 0)

  const e = f32x4.add(f32x4.add(_x, _y), _z)

  const x_eye = -f32x4.extract_lane(e, 0),
        y_eye = -f32x4.extract_lane(e, 1),
        z_eye = -f32x4.extract_lane(e, 2)

  // The first three items here are negated so the X axis isn't inverted
  // (I have no idea why this happens, but it's super confusing and disorienting)
  output[ 0] = -x_axis[0]; output[ 1] = -y_axis[0]; output[ 2] = -z_axis[0]; output[ 3] = 0;
  output[ 4] =  x_axis[1]; output[ 5] =  y_axis[1]; output[ 6] =  z_axis[1]; output[ 7] = 0;
  output[ 8] =  x_axis[2]; output[ 9] =  y_axis[2]; output[10] =  z_axis[2]; output[11] = 0;
  output[12] =  x_eye;     output[13] =  y_eye;     output[14] =  z_eye;     output[15] = 1;

  return output
}

export function multiply(
  a: Float32Array,
  b: Float32Array,
): Float32Array {
  const output = new Float32Array(16)

  const a0 = f32x4(a[0], a[4], a[ 8], a[12]),
        a1 = f32x4(a[1], a[5], a[ 9], a[13]),
        a2 = f32x4(a[2], a[6], a[10], a[14]),
        a3 = f32x4(a[3], a[7], a[11], a[15])

  const b0 = f32x4(b[0], b[1], b[2], b[3])

  const r0 = f32x4.mul(a0, b0),
        r1 = f32x4.mul(a1, b0),
        r2 = f32x4.mul(a2, b0),
        r3 = f32x4.mul(a3, b0)

  const v0 = f32x4(f32x4.extract_lane(r0, 0), f32x4.extract_lane(r1, 0), f32x4.extract_lane(r2, 0), f32x4.extract_lane(r3, 0)),
        v1 = f32x4(f32x4.extract_lane(r0, 1), f32x4.extract_lane(r1, 1), f32x4.extract_lane(r2, 1), f32x4.extract_lane(r3, 1)),
        v2 = f32x4(f32x4.extract_lane(r0, 2), f32x4.extract_lane(r1, 2), f32x4.extract_lane(r2, 2), f32x4.extract_lane(r3, 2)),
        v3 = f32x4(f32x4.extract_lane(r0, 3), f32x4.extract_lane(r1, 3), f32x4.extract_lane(r2, 3), f32x4.extract_lane(r3, 3))

  const _0 = f32x4.add(f32x4.add(f32x4.add(v0, v1), v2), v3)

  output[0] = f32x4.extract_lane(_0, 0)
  output[1] = f32x4.extract_lane(_0, 1)
  output[2] = f32x4.extract_lane(_0, 2)
  output[3] = f32x4.extract_lane(_0, 3)

  const b1 = f32x4(b[4], b[5], b[6], b[7])

  const r4 = f32x4.mul(a0, b1),
        r5 = f32x4.mul(a1, b1),
        r6 = f32x4.mul(a2, b1),
        r7 = f32x4.mul(a3, b1)

  const v4 = f32x4(f32x4.extract_lane(r4, 0), f32x4.extract_lane(r5, 0), f32x4.extract_lane(r6, 0), f32x4.extract_lane(r7, 0)),
        v5 = f32x4(f32x4.extract_lane(r4, 1), f32x4.extract_lane(r5, 1), f32x4.extract_lane(r6, 1), f32x4.extract_lane(r7, 1)),
        v6 = f32x4(f32x4.extract_lane(r4, 2), f32x4.extract_lane(r5, 2), f32x4.extract_lane(r6, 2), f32x4.extract_lane(r7, 2)),
        v7 = f32x4(f32x4.extract_lane(r4, 3), f32x4.extract_lane(r5, 3), f32x4.extract_lane(r6, 3), f32x4.extract_lane(r7, 3))

  const _1 = f32x4.add(f32x4.add(f32x4.add(v4, v5), v6), v7)

  output[4] = f32x4.extract_lane(_1, 0)
  output[5] = f32x4.extract_lane(_1, 1)
  output[6] = f32x4.extract_lane(_1, 2)
  output[7] = f32x4.extract_lane(_1, 3)

  const b2 = f32x4(b[8], b[9], b[10], b[11])

  const r8  = f32x4.mul(a0, b2),
        r9  = f32x4.mul(a1, b2),
        r10 = f32x4.mul(a2, b2),
        r11 = f32x4.mul(a3, b2)

  const v8  = f32x4(f32x4.extract_lane(r8, 0), f32x4.extract_lane(r9, 0), f32x4.extract_lane(r10, 0), f32x4.extract_lane(r11, 0)),
        v9  = f32x4(f32x4.extract_lane(r8, 1), f32x4.extract_lane(r9, 1), f32x4.extract_lane(r10, 1), f32x4.extract_lane(r11, 1)),
        v10 = f32x4(f32x4.extract_lane(r8, 2), f32x4.extract_lane(r9, 2), f32x4.extract_lane(r10, 2), f32x4.extract_lane(r11, 2)),
        v11 = f32x4(f32x4.extract_lane(r8, 3), f32x4.extract_lane(r9, 3), f32x4.extract_lane(r10, 3), f32x4.extract_lane(r11, 3))

  const _2 = f32x4.add(f32x4.add(f32x4.add(v8, v9), v10), v11)

  output[ 8] = f32x4.extract_lane(_2, 0)
  output[ 9] = f32x4.extract_lane(_2, 1)
  output[10] = f32x4.extract_lane(_2, 2)
  output[11] = f32x4.extract_lane(_2, 3)

  const b3 = f32x4(b[12], b[13], b[14], b[15])

  const r12 = f32x4.mul(a0, b3),
        r13 = f32x4.mul(a1, b3),
        r14 = f32x4.mul(a2, b3),
        r15 = f32x4.mul(a3, b3)

  const v12 = f32x4(f32x4.extract_lane(r12, 0), f32x4.extract_lane(r13, 0), f32x4.extract_lane(r14, 0), f32x4.extract_lane(r15, 0)),
        v13 = f32x4(f32x4.extract_lane(r12, 1), f32x4.extract_lane(r13, 1), f32x4.extract_lane(r14, 1), f32x4.extract_lane(r15, 1)),
        v14 = f32x4(f32x4.extract_lane(r12, 2), f32x4.extract_lane(r13, 2), f32x4.extract_lane(r14, 2), f32x4.extract_lane(r15, 2)),
        v15 = f32x4(f32x4.extract_lane(r12, 3), f32x4.extract_lane(r13, 3), f32x4.extract_lane(r14, 3), f32x4.extract_lane(r15, 3))

  const _3 = f32x4.add(f32x4.add(f32x4.add(v12, v13), v14), v15)

  output[12] = f32x4.extract_lane(_3, 0)
  output[13] = f32x4.extract_lane(_3, 1)
  output[14] = f32x4.extract_lane(_3, 2)
  output[15] = f32x4.extract_lane(_3, 3)

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