import { execute } from "#/Athenaeum/systems/Update_Camera_and_Target_Positions"

import { Entity } from "@/Legion/types"
import Legion, { System } from "@/Legion"

import MainCamera from "@/Athenaeum/components/MainCamera"
import Finesse    from "@/Finesse"

export default class Update_Camera_and_Target_Positions extends System {
  components_required = new Set<Function>([MainCamera])

  update(entities: Set<Entity>): void {
    if (entities.size === 0) throw new Error('Must have a main camera')
    if (entities.size >   1) throw new Error('Cannot have more than 1 main camera')

    const e       = entities.values().next().value,
          camera  = Legion.get_components(e).get(MainCamera),
          updated = execute(
            camera.position,
            Finesse.movement,
            Finesse.rotation,
            Finesse.augment[1],
          )

    camera.position = updated.subarray(0, 3)
    camera.target   = updated.subarray(3, 6)
  }
}