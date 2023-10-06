import {
  Vector,
  degrees_to_radians,
  mat4,
  vec3,
} from './math'

import { VPM } from './settings'

export const VertexBufferLayout = (
  location: number,
  offset = 0,
): GPUVertexBufferLayout => ({
  arrayStride: 12,
  attributes: [{
    shaderLocation: location,
    format: 'float32x3',
    offset,
  }]
})

export const vpm = (
  aspectRatio: number,
  location:    Float32Array,
  sphere:      Float32Array,
): Float32Array =>
  mat4.multiply(
    mat4.perspective(
      degrees_to_radians(VPM.FieldOfView),
      aspectRatio,
      VPM.NearPlane,
      VPM.FarPlane,
    ),
    mat4.lookAt(
      location,
      vec3.add(sphere, location),
      Vector.Up,
    ),
  )