import { System } from "../../Legion"
import { Entity } from "../../Legion/types"

import Xenon from ".."

import Geometry from "../components/Geometry"

export default class Refresh_Geometry extends System {
  componentsRequired = new Set<Function>([Geometry]);

  update(entities: Set<Entity>): void {
    for (const e of entities) {
      const geometry = this.ecs.getComponents(e).get(Geometry)

      Xenon.refresh_buffer(
        geometry.vertices,
        geometry.buffer_index,
      )

    }
  }
}