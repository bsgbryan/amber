import Xenon, { System } from ".."

import InputManager from "../managers/Input"
import MainCamera   from "../components/MainCamera"
import Position     from "../components/Position"

import {
  Vector,
  degrees_to_radians,
  quat,
  vec3,
} from "../math"

import { Entity } from "../types"

export default class MainCameraManager extends System {
  componentsRequired = new Set<Function>([Position, MainCamera]);

  update(entities: Set<Entity>, delta_seconds: number): void {
    if (entities.size === 0) throw new Error('Must have a main camera')
    if (entities.size >   1) throw new Error('Cannot have more than 1 main camera')
  
    const position = this.ecs.getComponents(entities.values().next().value).get(Position)
    const movement = InputManager.movement(delta_seconds)
    const rotation = InputManager.rotation(delta_seconds)

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