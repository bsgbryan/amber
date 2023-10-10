import {
  Vector,
  degrees_to_radians,
  mat4,
  vec3,
} from './math'

import { VPM } from './settings'

export const InstancedVertexBufferLayout = (
  location: number,
  stride:   number,
  format:   GPUVertexFormat,
  offset = 0,
): GPUVertexBufferLayout => ({
  arrayStride: stride,
  stepMode: 'instance',
  attributes: [{
    shaderLocation: location,
    format,
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