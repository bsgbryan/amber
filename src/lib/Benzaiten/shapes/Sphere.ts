import { distance } from "#/Sunya/Vector3D"

import { Shape } from "@/Benzaiten/shapes/types"

const Sphere = (radius = .475): Shape =>
  (x, y, z) =>
    distance(new Float32Array([0, 0, 0]), new Float32Array([x, y, z])) - radius

export default Sphere