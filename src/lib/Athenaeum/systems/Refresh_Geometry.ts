import { Entity } from "../../Legion/types"
import Legion, { System } from "../../Legion"

import Xenon from ".."

import Geometry from "../../Athenaeum/components/Geometry"

export default class Refresh_Geometry extends System {
  components_required = new Set<Function>([Geometry]);

  update(entities: Set<Entity>): void {
    for (const e of entities) {
      const geometry = Legion.get_components(e).get(Geometry)

      Xenon.refresh_buffer(
        geometry.vertices,
        geometry.buffer_index,
      )

      Xenon.refresh_buffer(
        new Float32Array([50, 50, 50, 50, 50, 50, 50, 50]),
        1,
      )
    }
  }
}