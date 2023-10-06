import Xenon, { System } from ".."

import Geometry from "../components/Geometry"

import { Entity } from "../types"

export default class RefreshGeometry extends System {
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