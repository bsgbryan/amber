/**
 * Code originally taken from https://maxwellforbes.com/posts/typescript-ecs-implementation/
 */

import {
  ComponentClass,
  Entity,
} from "./types"

export abstract class Component { }

export abstract class System {
  abstract componentsRequired: Set<Function>
  abstract update(entities: Set<Entity>, delta_seconds: number): void

  ecs: Legion
}

export class ComponentContainer {
  #map = new Map<Function, Component>()

  add(component: Component): void {
    this.#map.set(component.constructor, component)
  }

  get<T extends Component>(
    componentClass: ComponentClass<T>
  ): T {
    return this.#map.get(componentClass) as T
  }

  has(componentClass: Function): boolean {
    return this.#map.has(componentClass)
  }

  hasAll(componentClasses: Iterable<Function>): boolean {
    for (let cls of componentClasses) {
      if (!this.#map.has(cls)) {
        return false
      }
    }
    return true
  }

  delete(componentClass: Function): void {
    this.#map.delete(componentClass)
  }
}

export default class Legion {
  // Main state
  #entities = new Map<Entity, ComponentContainer>()
  #systems = new Map<System, Set<Entity>>()

  // Bookkeeping for entities.
  #nextEntityID = 0
  #entitiesToDestroy = new Array<Entity>()

  // API: Entities

  addEntity(): Entity {
    let entity = this.#nextEntityID
    this.#nextEntityID++
    this.#entities.set(entity, new ComponentContainer())
    return entity
  }

  /**
   * Marks `entity` for removal. The actual removal happens at the end
   * of the next `update()`. This way we avoid subtle bugs where an
   * Entity is removed mid-`update()`, with some Systems seeing it and
   * others not.
   */
  removeEntity(entity: Entity): void {
    this.#entitiesToDestroy.push(entity)
  }

  // API: Components

  addComponent(entity: Entity, component: Component): void {
    this.#entities.get(entity).add(component)
    this.#checkE(entity)
  }

  getComponents(entity: Entity): ComponentContainer {
    return this.#entities.get(entity)
  }

  removeComponent(
    entity: Entity, componentClass: Function
  ): void {
    this.#entities.get(entity).delete(componentClass)
    this.#checkE(entity)
  }

  // API: Systems

  addSystem(system: System): void {
    // Checking invariant: systems should not have an empty
    // Components list, or they'll run on every entity. Simply remove
    // or special case this check if you do want a System that runs
    // on everything.
    if (system.componentsRequired.size == 0) {
      console.warn("System not added: empty Components list.")
      console.warn(system)
      return
    }

    // Give system a reference to the Legion so it can actually do
    // anything.
    system.ecs = this

    // Save system and set who it should track immediately.
    this.#systems.set(system, new Set())
    for (let entity of this.#entities.keys()) {
      this.#checkES(entity, system)
    }
  }

  /**
   * Note: I never actually had a removeSystem() method for the entire
   * time I was programming the game Fallgate (2 years!). I just added
   * one here for a specific testing reason (see the next post).
   * Because it's just for demo purposes, this requires an actual
   * instance of a System to remove (which would be clunky as a real
   * API).
   */
  removeSystem(system: System): void {
    this.#systems.delete(system)
  }

  /**
   * This is ordinarily called once per tick (e.g., every frame). It
   * updates all Systems, then destroys any Entities that were marked
   * for removal.
   */
  update(delta_seconds: number): void {
    // Update all systems. (Later, we'll add a way to specify the
    // update order.)
    for (let [system, entities] of this.#systems.entries()) {
      system.update(entities, delta_seconds)
    }

    // Remove any entities that were marked for deletion during the
    // update.
    while (this.#entitiesToDestroy.length > 0) {
      this.#destroyEntity(this.#entitiesToDestroy.pop())
    }
  }

  // #methods for doing internal state checks and mutations.

  #destroyEntity(entity: Entity): void {
    this.#entities.delete(entity)
    for (let entities of this.#systems.values()) {
      entities.delete(entity)  // no-op if doesn't have it
    }
  }

  #checkE(entity: Entity): void {
    for (let system of this.#systems.keys()) {
      this.#checkES(entity, system)
    }
  }

  #checkES(entity: Entity, system: System): void {
    let have = this.#entities.get(entity)
    let need = system.componentsRequired
    if (have.hasAll(need)) {
      // should be in system
      this.#systems.get(system).add(entity) // no-op if in
    } else {
      // should not be in system
      this.#systems.get(system).delete(entity) // no-op if out
    }
  }
}