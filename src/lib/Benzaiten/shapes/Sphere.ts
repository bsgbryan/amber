import { vec3 } from "@/Sunya"

import { Shape } from "@/Benzaiten/shapes/types"

const zero = vec3.zero()

const Sphere = (radius = .475): Shape =>
  (x, y, z) =>
    vec3.distance(zero, vec3.create(x, y, z)) - radius

export default Sphere