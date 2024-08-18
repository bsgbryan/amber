import { distance } from "../Sunya/Vector3D"

export const __SHAPES__ = [
  /* Sphere */ function(x: f32, y: f32, z: f32, params: Float32Array): f32 {
    const point = new Float32Array(3)

    point[0] = x
    point[1] = y
    point[2] = z

    return distance(new Float32Array(3), point) - params[0]
  }
]

export function Sphere(): i32 { return 0 }