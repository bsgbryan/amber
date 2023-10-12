import { vec3 } from "../../Sunya"
import { Shape } from "./types"

const Sphere = (raduis = .475): Shape =>
  (point: Float32Array) => Math.abs(vec3.distance(new Float32Array([0, 0, 0]), point)) - raduis

export default Sphere