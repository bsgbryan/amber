/**
 * Code originally taken from https://maxwellforbes.com/posts/typescript-ecs-implementation/
 */

import Yggdrasil from "../Yggdrasil"

import {
  ComponentClass,
  Entity,
} from "./types"

export abstract class Component {
  #is_dirty = false

  get dirty(): boolean   { return this.#is_dirty }
  set dirty(is: boolean) { this.#is_dirty = is   }
}

export abstract class System {
  abstract components_required: Set<Function>
  abstract update(entities: Set<Entity>): void

  ecs: Legion
}

export class ComponentContainer {
  #map = new Map<Function, Component>()

  add(component: Component): void {
    this.#map.set(component.constructor, component)
  }

  get<T extends Component>(
    component_class: ComponentClass<T>
  ): T {
    return this.#map.get(component_class) as T
  }

  has(component_class: Function): boolean {
    return this.#map.has(component_class)
  }

  has_all(component_classes: Iterable<Function>): boolean {
    for (let cls of component_classes)
      if (!this.#map.has(cls))
        return false

    return true
  }

  delete(component_class: Function): void {
    this.#map.delete(component_class)
  }
}

export default class Legion {
  static #entities = new Map<Entity, ComponentContainer>()
  static #systems  = new Map<System, Set<Entity>>()

  static #next_entity_ID      = 0
  static #entities_to_destroy = new Array<Entity>()

  static add_entity(): Entity {
    const entity = this.#next_entity_ID

    this.#next_entity_ID++
    this.#entities.set(entity, new ComponentContainer())

    return entity
  }

  static remove_entity_at_end_of_update(entity: Entity): void {
    this.#entities_to_destroy.push(entity)
  }

  static add_component(entity: Entity, component: Component): void {
    this.#entities.get(entity).add(component)
    this.#checkE(entity)
  }

  static get_components(entity: Entity): ComponentContainer {
    return this.#entities.get(entity)
  }

  static remove_component(
    entity: Entity, component_class: Function
  ): void {
    this.#entities.get(entity).delete(component_class)
    this.#checkE(entity)
  }

  static add_system(system: System): void {
    // Checking invariant: systems should not have an empty
    // Components list, or they'll run on every entity. Simply remove
    // or special case this check if you do want a System that runs
    // on everything.
    if (system.components_required.size == 0) {
      console.warn("System not added: empty Components list.")
      console.warn(system)
      return
    }

    // // Give system a reference to the Legion so it can actually do
    // // anything.
    // system.ecs = this

    // Save system and set who it should track immediately.
    this.#systems.set(system, new Set())

    for (let entity of this.#entities.keys())
      this.#checkES(entity, system)
  }

  /**
   * Note: I never actually had a removeSystem() method for the entire
   * time I was programming the game Fallgate (2 years!). I just added
   * one here for a specific testing reason (see the next post).
   * Because it's just for demo purposes, this requires an actual
   * instance of a System to remove (which would be clunky as a real
   * API).
   */
  static remove_system(system: System): void {
    this.#systems.delete(system)
  }

  /**
   * This is ordinarily called once per tick (e.g., every frame). It
   * updates all Systems, then destroys any Entities that were marked
   * for removal.
   */
  static update(): void {
    Yggdrasil.start_phase('ecs')

    // Update all systems. (Later, we'll add a way to specify the
    // update order.)
    for (let [system, entities] of this.#systems.entries())
      system.update(entities)

    // Remove any entities that were marked for deletion during the
    // update.
    while (this.#entities_to_destroy.length > 0)
      this.#destroy_entity(this.#entities_to_destroy.pop())

    Yggdrasil.complete_phase('ecs')
  }

  static #destroy_entity(entity: Entity): void {
    this.#entities.delete(entity)

    for (let entities of this.#systems.values())
      entities.delete(entity)  // no-op if doesn't have it
  }

  static #checkE(entity: Entity): void {
    for (let system of this.#systems.keys())
      this.#checkES(entity, system)
  }

  static #checkES(entity: Entity, system: System): void {
    let have = this.#entities.get(entity)
    let need = system.components_required

    if (have.has_all(need))
      // should be in system
      this.#systems.get(system).add(entity) // no-op if in
    else
      // should not be in system
      this.#systems.get(system).delete(entity) // no-op if out
  }
}