export const degrees_to_radians = (input: number): number => input * (Math.PI / 180)

export const vec3 = {
  identity(dst?: Float32Array): Float32Array {
    dst = dst || new Float32Array(3)

    dst[0] = 1
    dst[1] = 1
    dst[2] = 1

    return dst
  },
  zero(dst?: Float32Array) {
    dst = dst || new Float32Array(3)

    dst[0] = 0
    dst[1] = 0
    dst[2] = 0

    return dst
  },
  add(a: Float32Array, b: Float32Array, dst?: Float32Array): Float32Array {
    dst = dst || new Float32Array(3)

    dst[0] = a[0] + b[0]
    dst[1] = a[1] + b[1]
    dst[2] = a[2] + b[2]

    return dst
  },
  multiply(a: Float32Array, b: Float32Array, dst?: Float32Array): Float32Array {
    dst = dst || new Float32Array(3)

    dst[0] = a[0] * b[0]
    dst[1] = a[1] * b[1]
    dst[2] = a[2] * b[2]

    return dst
  },
  cross(a: Float32Array, b: Float32Array, dst?: Float32Array): Float32Array {
    dst = dst || new Float32Array(3)

    const t0 = a[1] * b[2] - a[2] * b[1]
    const t1 = a[2] * b[0] - a[0] * b[2]
    const t2 = a[0] * b[1] - a[1] * b[0]

    dst[0] = t0
    dst[1] = t1
    dst[2] = t2

    return dst
  },
  subtract(a: Float32Array, b: Float32Array, dst?: Float32Array): Float32Array {
    dst = dst || new Float32Array(3)

    dst[0] = a[0] - b[0]
    dst[1] = a[1] - b[1]
    dst[2] = a[2] - b[2]

    return dst
  },
  normalize(v: Float32Array, dst?: Float32Array): Float32Array {
    dst = dst || new Float32Array(3)

    const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])

    // make sure we don't divide by 0.
    if (length > 0.00001) {
      dst[0] = v[0] / length
      dst[1] = v[1] / length
      dst[2] = v[2] / length
    } else {
      dst[0] = 0
      dst[1] = 0
      dst[2] = 0
    }

    return dst
  },
  spherical(x: number, y: number, radius: number = 1, dst?: Float32Array): Float32Array {
    dst = dst || new Float32Array(3)

    const phi   = degrees_to_radians(90 - x)
    const theta = degrees_to_radians(y)
    const foo   = Math.sin(phi) * radius

    dst[0] = foo * Math.sin(theta)
    dst[1] = Math.cos(phi) * radius
    dst[2] = foo * Math.cos(theta)

    return dst
  },
  rotateY(a: Float32Array, rad: number, dst?: Float32Array): Float32Array {
    dst = dst || new Float32Array(3)

    dst[0] = a[2] * Math.sin(rad) + a[0] * Math.cos(rad)
    dst[1] = a[1]
    dst[2] = a[2] * Math.cos(rad) - a[0] * Math.sin(rad)

    return dst
  },
  distance(a: Float32Array, b: Float32Array): number {
    const x = b[0] - a[0],
          y = b[1] - a[1],
          z = b[2] - a[2]

    return Math.sqrt(x * x + y * y + z * z)
  }
}

export const mat4 = {
  projection(width: number, height: number, depth: number, dst?: Float32Array): Float32Array {
    // Note: This matrix flips the Y axis so that 0 is at the top.
    return mat4.ortho(0, width, height, 0, depth, -depth, dst)
  },

  perspective(fieldOfViewYInRadians: number, aspect: number, zNear: number, zFar: number, dst?: Float32Array): Float32Array {
    dst = dst || new Float32Array(16)

    const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewYInRadians)
    const rangeInv = 1 / (zNear - zFar)

    dst[0] = f / aspect
    dst[1] = 0
    dst[2] = 0
    dst[3] = 0

    dst[4] = 0
    dst[5] = f
    dst[6] = 0
    dst[7] = 0

    dst[8] = 0
    dst[9] = 0
    dst[10] = zFar * rangeInv
    dst[11] = -1

    dst[12] = 0
    dst[13] = 0
    dst[14] = zNear * zFar * rangeInv
    dst[15] = 0

    return dst
  },

  ortho(left: number, right: number, bottom: number, top: number, near: number, far: number, dst?: Float32Array): Float32Array {
    dst = dst || new Float32Array(16)

    dst[0] = 2 / (right - left)
    dst[1] = 0
    dst[2] = 0
    dst[3] = 0

    dst[4] = 0
    dst[5] = 2 / (top - bottom)
    dst[6] = 0
    dst[7] = 0

    dst[8] = 0
    dst[9] = 0
    dst[10] = 1 / (near - far)
    dst[11] = 0

    dst[12] = (right + left) / (left - right)
    dst[13] = (top + bottom) / (bottom - top)
    dst[14] = near / (near - far)
    dst[15] = 1

    return dst;
  },

  identity(dst?: Float32Array): Float32Array {
    dst = dst || new Float32Array(16)

    dst[ 0] = 1; dst[ 1] = 0; dst[ 2] = 0; dst[ 3] = 0;
    dst[ 4] = 0; dst[ 5] = 1; dst[ 6] = 0; dst[ 7] = 0;
    dst[ 8] = 0; dst[ 9] = 0; dst[10] = 1; dst[11] = 0;
    dst[12] = 0; dst[13] = 0; dst[14] = 0; dst[15] = 1;

    return dst
  },

  multiply(a: Float32Array, b: Float32Array, dst?: Float32Array): Float32Array {
    dst = dst || new Float32Array(16)

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

    dst[ 0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30
    dst[ 1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31
    dst[ 2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32
    dst[ 3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33

    dst[ 4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30
    dst[ 5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31
    dst[ 6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32
    dst[ 7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33

    dst[ 8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30
    dst[ 9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31
    dst[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32
    dst[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33

    dst[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30
    dst[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31
    dst[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32
    dst[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33

    return dst
  },

  inverse(m: Float32Array, dst?: Float32Array): Float32Array {
    dst = dst || new Float32Array(16)

    const m00 = m[0 * 4 + 0]
    const m01 = m[0 * 4 + 1]
    const m02 = m[0 * 4 + 2]
    const m03 = m[0 * 4 + 3]
    const m10 = m[1 * 4 + 0]
    const m11 = m[1 * 4 + 1]
    const m12 = m[1 * 4 + 2]
    const m13 = m[1 * 4 + 3]
    const m20 = m[2 * 4 + 0]
    const m21 = m[2 * 4 + 1]
    const m22 = m[2 * 4 + 2]
    const m23 = m[2 * 4 + 3]
    const m30 = m[3 * 4 + 0]
    const m31 = m[3 * 4 + 1]
    const m32 = m[3 * 4 + 2]
    const m33 = m[3 * 4 + 3]

    const tmp0  = m22 * m33
    const tmp1  = m32 * m23
    const tmp2  = m12 * m33
    const tmp3  = m32 * m13
    const tmp4  = m12 * m23
    const tmp5  = m22 * m13
    const tmp6  = m02 * m33
    const tmp7  = m32 * m03
    const tmp8  = m02 * m23
    const tmp9  = m22 * m03
    const tmp10 = m02 * m13
    const tmp11 = m12 * m03
    const tmp12 = m20 * m31
    const tmp13 = m30 * m21
    const tmp14 = m10 * m31
    const tmp15 = m30 * m11
    const tmp16 = m10 * m21
    const tmp17 = m20 * m11
    const tmp18 = m00 * m31
    const tmp19 = m30 * m01
    const tmp20 = m00 * m21
    const tmp21 = m20 * m01
    const tmp22 = m00 * m11
    const tmp23 = m10 * m01

    const t0 =
      (tmp0 * m11 + tmp3 * m21 + tmp4 * m31) -
      (tmp1 * m11 + tmp2 * m21 + tmp5 * m31)
    const t1 =
      (tmp1 * m01 + tmp6 * m21 + tmp9 * m31) -
      (tmp0 * m01 + tmp7 * m21 + tmp8 * m31)
    const t2 =
      (tmp2 * m01 + tmp7 * m11 + tmp10 * m31) -
      (tmp3 * m01 + tmp6 * m11 + tmp11 * m31)
    const t3 =
      (tmp5 * m01 + tmp8 * m11 + tmp11 * m21) -
      (tmp4 * m01 + tmp9 * m11 + tmp10 * m21)

    const d = 1 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3)

    dst[0] = d * t0
    dst[1] = d * t1
    dst[2] = d * t2
    dst[3] = d * t3

    dst[4] = d * (
      (tmp1 * m10 + tmp2 * m20 + tmp5 * m30) -
      (tmp0 * m10 + tmp3 * m20 + tmp4 * m30)
    )
    dst[5] = d * (
      (tmp0 * m00 + tmp7 * m20 + tmp8 * m30) -
      (tmp1 * m00 + tmp6 * m20 + tmp9 * m30)
    )
    dst[6] = d * (
      (tmp3 * m00 + tmp6 * m10 + tmp11 * m30) -
      (tmp2 * m00 + tmp7 * m10 + tmp10 * m30)
    )
    dst[7] = d * (
      (tmp4 * m00 + tmp9 * m10 + tmp10 * m20) -
      (tmp5 * m00 + tmp8 * m10 + tmp11 * m20)
    )

    dst[8] = d * (
      (tmp12 * m13 + tmp15 * m23 + tmp16 * m33) -
      (tmp13 * m13 + tmp14 * m23 + tmp17 * m33)
    )
    dst[9] = d * (
      (tmp13 * m03 + tmp18 * m23 + tmp21 * m33) -
      (tmp12 * m03 + tmp19 * m23 + tmp20 * m33)
    )
    dst[10] = d * (
      (tmp14 * m03 + tmp19 * m13 + tmp22 * m33) -
      (tmp15 * m03 + tmp18 * m13 + tmp23 * m33)
    )
    dst[11] = d * (
      (tmp17 * m03 + tmp20 * m13 + tmp23 * m23) -
      (tmp16 * m03 + tmp21 * m13 + tmp22 * m23)
    )

    dst[12] = d * (
      (tmp14 * m22 + tmp17 * m32 + tmp13 * m12) -
      (tmp16 * m32 + tmp12 * m12 + tmp15 * m22)
    )
    dst[13] = d * (
      (tmp20 * m32 + tmp12 * m02 + tmp19 * m22) -
      (tmp18 * m22 + tmp21 * m32 + tmp13 * m02)
    )
    dst[14] = d * (
      (tmp18 * m12 + tmp23 * m32 + tmp15 * m02) -
      (tmp22 * m32 + tmp14 * m02 + tmp19 * m12)
    )
    dst[15] = d * (
      (tmp22 * m22 + tmp16 * m02 + tmp21 * m12) -
      (tmp20 * m12 + tmp23 * m22 + tmp17 * m02)
    )

    return dst
  },

  aim(eye: Float32Array, target: Float32Array, up: Float32Array, dst?: Float32Array): Float32Array {
    dst = dst || new Float32Array(16)

    const zAxis = vec3.normalize(vec3.subtract(target, eye))
    const xAxis = vec3.normalize(vec3.cross(up,    zAxis))
    const yAxis = vec3.normalize(vec3.cross(zAxis, xAxis))

    dst[ 0] = xAxis[0]; dst[ 1] = xAxis[1]; dst[ 2] = xAxis[2]; dst[ 3] = 0;
    dst[ 4] = yAxis[0]; dst[ 5] = yAxis[1]; dst[ 6] = yAxis[2]; dst[ 7] = 0;
    dst[ 8] = zAxis[0]; dst[ 9] = zAxis[1]; dst[10] = zAxis[2]; dst[11] = 0;
    dst[12] =   eye[0]; dst[13] =   eye[1]; dst[14] =   eye[2]; dst[15] = 1;

    return dst
  },

  cameraAim(eye: Float32Array, target: Float32Array, up: Float32Array, dst?: Float32Array): Float32Array {
    dst = dst || new Float32Array(16)

    const zAxis = vec3.normalize(vec3.subtract(eye, target))
    const xAxis = vec3.normalize(vec3.cross(up,    zAxis))
    const yAxis = vec3.normalize(vec3.cross(zAxis, xAxis))

    dst[ 0] = xAxis[0]; dst[ 1] = xAxis[1]; dst[ 2] = xAxis[2]; dst[ 3] = 0;
    dst[ 4] = yAxis[0]; dst[ 5] = yAxis[1]; dst[ 6] = yAxis[2]; dst[ 7] = 0;
    dst[ 8] = zAxis[0]; dst[ 9] = zAxis[1]; dst[10] = zAxis[2]; dst[11] = 0;
    dst[12] =   eye[0]; dst[13] =   eye[1]; dst[14] =   eye[2]; dst[15] = 1;

    return dst
  },

  lookAt(eye: Float32Array, target: Float32Array, up: Float32Array, dst?: Float32Array): Float32Array {
    return mat4.inverse(mat4.cameraAim(eye, target, up, dst), dst)
  },

  translation([tx, ty, tz]: Float32Array, dst?: Float32Array): Float32Array {
    dst = dst || new Float32Array(16)

    dst[ 0] =  1; dst[ 1] =  0; dst[ 2] =  0; dst[ 3] = 0;
    dst[ 4] =  0; dst[ 5] =  1; dst[ 6] =  0; dst[ 7] = 0;
    dst[ 8] =  0; dst[ 9] =  0; dst[10] =  1; dst[11] = 0;
    dst[12] = tx; dst[13] = ty; dst[14] = tz; dst[15] = 1;

    return dst
  },

  rotationX(angleInRadians: number, dst?: Float32Array): Float32Array {
    const c = Math.cos(angleInRadians)
    const s = Math.sin(angleInRadians)

    dst = dst || new Float32Array(16)

    dst[ 0] = 1; dst[ 1] =  0; dst[ 2] = 0; dst[ 3] = 0;
    dst[ 4] = 0; dst[ 5] =  c; dst[ 6] = s; dst[ 7] = 0;
    dst[ 8] = 0; dst[ 9] = -s; dst[10] = c; dst[11] = 0;
    dst[12] = 0; dst[13] =  0; dst[14] = 0; dst[15] = 1;

    return dst
  },

  rotationY(angleInRadians: number, dst?: Float32Array): Float32Array {
    const c = Math.cos(angleInRadians)
    const s = Math.sin(angleInRadians)

    dst = dst || new Float32Array(16)

    dst[ 0] = c; dst[ 1] = 0; dst[ 2] = -s; dst[ 3] = 0;
    dst[ 4] = 0; dst[ 5] = 1; dst[ 6] =  0; dst[ 7] = 0;
    dst[ 8] = s; dst[ 9] = 0; dst[10] =  c; dst[11] = 0;
    dst[12] = 0; dst[13] = 0; dst[14] =  0; dst[15] = 1;

    return dst
  },

  rotationZ(angleInRadians: number, dst?: Float32Array): Float32Array {
    const c = Math.cos(angleInRadians)
    const s = Math.sin(angleInRadians)

    dst = dst || new Float32Array(16)

    dst[ 0] =  c; dst[ 1] = s; dst[ 2] = 0; dst[ 3] = 0;
    dst[ 4] = -s; dst[ 5] = c; dst[ 6] = 0; dst[ 7] = 0;
    dst[ 8] =  0; dst[ 9] = 0; dst[10] = 1; dst[11] = 0;
    dst[12] =  0; dst[13] = 0; dst[14] = 0; dst[15] = 1;

    return dst
  },

  scaling([sx, sy, sz]: Float32Array, dst?: Float32Array): Float32Array {
    dst = dst || new Float32Array(16);
    dst[0] = sx; dst[1] = 0; dst[2] = 0; dst[3] = 0;
    dst[4] = 0; dst[5] = sy; dst[6] = 0; dst[7] = 0;
    dst[8] = 0; dst[9] = 0; dst[10] = sz; dst[11] = 0;
    dst[12] = 0; dst[13] = 0; dst[14] = 0; dst[15] = 1;
    return dst;
  },

  translate(m: Float32Array, translation: Float32Array, dst?: Float32Array): Float32Array {
    return mat4.multiply(m, mat4.translation(translation), dst)
  },

  rotateX(m: Float32Array, angleInRadians: number, dst?: Float32Array): Float32Array {
    return mat4.multiply(m, mat4.rotationX(angleInRadians), dst)
  },

  rotateY(m: Float32Array, angleInRadians: number, dst?: Float32Array): Float32Array {
    return mat4.multiply(m, mat4.rotationY(angleInRadians), dst)
  },

  rotateZ(m: Float32Array, angleInRadians: number, dst?: Float32Array): Float32Array {
    return mat4.multiply(m, mat4.rotationZ(angleInRadians), dst)
  },

  scale(m: Float32Array, scale: Float32Array, dst?: Float32Array): Float32Array {
    return mat4.multiply(m, mat4.scaling(scale), dst)
  },
}

export const quat = {
  from_axis_angle(axis: Float32Array, rad: number, dst?: Float32Array): Float32Array {
    dst = dst || new Float32Array(4)

    rad *= .5

    const s = Math.sin(rad)

    dst[0] = s * axis[0]
    dst[1] = s * axis[1]
    dst[2] = s * axis[2]
    dst[3] = Math.cos(rad)

    return dst
  },
  multiply(a: Float32Array, b: Float32Array, dst?: Float32Array): Float32Array {
    dst = dst || new Float32Array(4)

    const
      ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3]
    const
      bx = b[0],
      by = b[1],
      bz = b[2],
      bw = b[3]

    dst[0] = ax * bw + aw * bx + ay * bz - az * by
    dst[1] = ay * bw + aw * by + az * bx - ax * bz
    dst[2] = az * bw + aw * bz + ax * by - ay * bx
    dst[3] = aw * bw - ax * bx - ay * by - az * bz

    return dst
  },
  rotate(point: Float32Array, q: Float32Array, dst?: Float32Array): Float32Array {
    dst = dst || new Float32Array(3)
    
    const r: Float32Array = new Float32Array([0, ...point])
    const c: Float32Array = new Float32Array([q[0], -q[1], -q[2], -q[3]])
    const _: Float32Array = quat.multiply(quat.multiply(q, r), c)

    dst[0] = _[1]
    dst[1] = _[2]
    dst[2] = _[3]

    return dst
  }
}

export const Vector = {
  Up: new Float32Array([0, 1, 0])
}