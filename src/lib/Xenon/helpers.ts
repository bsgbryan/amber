
import {
  look_at,
  multiply,
  perspective,
} from '#/Sunya/Matrix4x4'

import { add } from '#/Sunya/Vector3D'

import { degrees_to_radians } from '#/Sunya/helpers'

import { Vector } from '@/Sunya'

import { VPM } from '@/Xenon/settings'

/**
 * Builds and returns a {@link https://webgpu.rocks/reference/dictionary/gpuvertexbufferlayout/ | GPUVertexBufferLayout}
 * 
 * @param location This needs to match the `@location` directive in your shader for this data.
 * @param stride The number of bytes required to store a single item in the buffer.
 *               For example, a `vec3` has a stride of 12: it is made up of 3 32 bit floats (_32 bits === 4 bytes_) - `4 * 3 = 12`.
 * @param format A string defining the formar of the data in the buffer. For example: `'float32x4'` for a `Color(r,g,b,a)`.
 * @param offset How many bytes from the beginning of the buffer does the actual data start?
 *               Defaults to `0` - meaning the data starts at the beginning of the buffer.
 * 
 * @returns The constructed {@link https://webgpu.rocks/reference/dictionary/gpuvertexbufferlayout/ | GPUVertexBufferLayout} with `'instance'` set for the `stepMode` property
 * 
 * @remarks This _only_ works with **instanced** render encodings. For non-instanced render encodings, please use {@link VertexBufferLayout}
 * 
 * @example 
 * ```ts
 * const example = InstancedVertexBufferLayout(0, 12, 'float32x3')
 * ```
 * 
 * `example` would be a GPUVertexBufferLayout that:
 * 1. Is available to the shader at `@location(0)`
 * 2. Contains 12 byte wide items
 * 3. Expects each item to contain 3 32 bit floating point numbers
 * 4. The data begins at the beginning of the buffer (_its `offset` is `0`; because a value isn't passed for the `offset` parameter, so it defaults to `0`_)
 * 
 * To access a buffer constructed using `example` in your shader you'd write the following:
 * ```wgsl
 * struct Input {
 *   #location(0) position: vec4f, // <- This the the data a buffer created using `example` points to
 *   #location(1) size:     f32,
 *   #location(2) color:    vec4f,
 * }
 * ```
 * 
 * **NOTE** The `#` in the above code sample should be `@` but TSDoc is doing very strange things ... I'm sorry for any confusion.
 * 
 * **NOTE** The data type specified in the shader, `vec4f` here, can be wider (_contain more data_) than what the buffer layout described (_the extra data will just be empty_),
 * but it cannot be narrower (_contain less data_) as that would result in data loss and lead to undefined behavior.
 */
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

/**
 * Builds and returns a {@link https://webgpu.rocks/reference/dictionary/gpuvertexbufferlayout/ | GPUVertexBufferLayout}
 * 
 * @param location This needs to match the `@location` directive in your shader for this data.
 * @param stride The number of bytes required to store a single item in the buffer.
 *               For example, a `vec3` has a stride of 12: it is made up of 3 32 bit floats (_32 bits === 4 bytes_); `4 * 3 = 12`.
 * @param format A string defining the formar of the data in the buffer. For example: `'float32x4'` for a `Color(r,g,b,a)`.
 * @param offset How many bytes from the beginning of the buffer does the actual data start?
 *               Defaults to `0` - meaning the data starts at the beginning of the buffer.
 * 
 * @returns The constructed {@link https://webgpu.rocks/reference/dictionary/gpuvertexbufferlayout/ | GPUVertexBufferLayout} with the `stepMode` property unset (_so it falls back to the default value: `'vertex'`_)
 * 
 * @remarks This _only_ works with **non-instanced** render encodings. For instanced render encodings, please use {@link InstancedVertexBufferLayout}
 * 
 * @example 
 * ```ts
 * const example = VertexBufferLayout(0, 12, 'float32x3')
 * ```
 * 
 * `example` would be a GPUVertexBufferLayout that:
 * 1. Is available to the shader at `@location(0)`
 * 2. Contains 12 byte wide items
 * 3. Expects each item to contain 3 32 bit floating point numbers
 * 4. The data begins at the beginning of the buffer (_its `offset` is `0`; because a value isn't passed for the `offset` parameter, so it defaults to `0`_)
 * 
 * To access a buffer constructed using `example` in your shader you'd write the following:
 * ```wgsl
 * struct Input {
 *   #location(0) position: vec4f, // <- This the the data a buffer created using `example` points to
 *   #location(1) size:     f32,
 *   #location(2) color:    vec4f,
 * }
 * ```
 * 
 * **NOTE** The `#` in the above code sample should be `@` but TSDoc is doing very strange things ... I'm sorry for any confusion.
 * 
 * **NOTE** The data type specified in the shader, `vec4f` here, can be wider (_contain more data_) than what the buffer layout described (_the extra data will just be empty_),
 * but it cannot be narrower (_contain less data_) as that would result in data loss and lead to undefined behavior.
 */
export const VertexBufferLayout = (
  location: number,
  stride:   number,
  format:   GPUVertexFormat,
  offset = 0,
): GPUVertexBufferLayout => ({
  arrayStride: stride,
  attributes: [{
    shaderLocation: location,
    format,
    offset,
  }]
})

/** TODO: Add documentation here */
export const vpm = (
  aspectRatio: number,
  location:    Float32Array,
  sphere:      Float32Array,
): Float32Array =>
  multiply(
    perspective(
      degrees_to_radians(VPM.FieldOfView),
      aspectRatio,
      VPM.NearPlane,
      VPM.FarPlane,
    ),
    look_at(
      location,
      add(sphere, location),
      Vector.Up,
    ),
  )