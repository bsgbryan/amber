import { Navigator } from "@/Mabeuth/types"

declare const navigator: Navigator

class LookAxis {
  get X() { return navigator.getGamepads()[0]?.axes[3] }
  get Y() { return navigator.getGamepads()[0]?.axes[2] }
}

class MoveAxis {
  get X() { return navigator.getGamepads()[0]?.axes[0] }
  get Y() { return navigator.getGamepads()[0]?.axes[1] }
}

export default class Controller {
  #look_axes: LookAxis
  #move_axes: MoveAxis
  
  constructor() {
    this.#look_axes = new LookAxis()
    this.#move_axes = new MoveAxis()
  }
  
  get Look() {
    return {
      x: this.#look_axes.X,
      y: this.#look_axes.Y,
    }
  }

  get Move() {
    return {
      x: this.#move_axes.X,
      y: 0,
      z: this.#move_axes.Y,
    }
  }
}