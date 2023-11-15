import {
  look_at,
  multiply,
  perspective,
} from "../Sunya/Matrix4x4"

import { add } from "../Sunya/Vector3D"

import { UP, degrees_to_radians } from "../Sunya/helpers"

export function view_projection_matrix(
  aspect_ratio: f32,
  location:     Float32Array,
  sphere:       Float32Array,
  fov:        f32,
  near_plane: f32,
  far_plane:  f32,
): Float32Array {
  return multiply(
    perspective(
      degrees_to_radians(fov),
      aspect_ratio,
      near_plane,
      far_plane,
    ),
    look_at(
      location,
      add(sphere, location),
      UP(),
    ),
  )
}