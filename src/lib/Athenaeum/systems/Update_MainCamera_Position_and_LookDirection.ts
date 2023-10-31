import {
  add,
  spherical,
} from "#/Sunya/Vector3D"

import { degrees_to_radians } from "#/Sunya/helpers"

import { Entity } from "@/Legion/types"
import Legion, { System } from "@/Legion"

import Finesse from "@/Finesse"

import MainCamera from "@/Athenaeum/components/MainCamera"
import Position   from "@/Athenaeum/components/Position"

import {
  Vector,
  quat,
} from "@/Sunya"

export default class Update_MainCamera_Position_and_LookDirection extends System {
  components_required = new Set<Function>([Position, MainCamera])

  update(entities: Set<Entity>): void {
    if (entities.size === 0) throw new Error('Must have a main camera')
    if (entities.size >   1) throw new Error('Cannot have more than 1 main camera')

    const e = entities.values().next().value

    const position = Legion.get_components(e).get(Position)
    const camera   = Legion.get_components(e).get(MainCamera)
    const movement = Finesse.movement
    const rotation = Finesse.rotation
    const augment  = Finesse.augment

    const q       = quat.from_axis_angle(Vector.Up, degrees_to_radians(rotation.y))
    const rotated = quat.rotate(new Float32Array([movement.x * augment.y, movement.y * augment.y, movement.z * augment.y]), q)
    const updated = add(rotated, new Float32Array([position.x, position.y, position.z]))

    camera.position = updated
    camera.target   = spherical(rotation.x, rotation.y, 1.0)

    position.x = updated[0]
    position.y = updated[1]
    position.z = updated[2]
  }
}