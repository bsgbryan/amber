import { Entity } from "../../Legion/types"
import { System } from "../../Legion"

import Xenon from ".."

import {
  Vector,
  degrees_to_radians,
  quat,
  vec3,
} from "../math"

import Finesse    from "../../Finesse"
import MainCamera from "../components/MainCamera"
import Position   from "../components/Position"

export default class Update_MainCamera_Position_and_LookDirection extends System {
  componentsRequired = new Set<Function>([Position, MainCamera]);

  update(entities: Set<Entity>): void {
    if (entities.size === 0) throw new Error('Must have a main camera')
    if (entities.size >   1) throw new Error('Cannot have more than 1 main camera')
  
    const position = this.ecs.getComponents(entities.values().next().value).get(Position)
    const movement = Finesse.movement
    const rotation = Finesse.rotation

    const q       = quat.from_axis_angle(Vector.Up, degrees_to_radians(rotation.y))
    const rotated = quat.rotate(new Float32Array([movement.x, 0, movement.z]), q)
    const updated = vec3.add(rotated, new Float32Array([position.x, position.y, position.z]))

    Xenon.update_main_camera(
      updated,
      vec3.spherical(rotation.x, rotation.y)
    )

    position.x = updated[0]
    position.y = updated[1]
    position.z = updated[2]
  }
}