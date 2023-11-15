import { Navigator } from "@/Mabeuth/types"

declare const navigator: Navigator

class LookAxis {
  get X() { return navigator.getGamepads()[0]?.axes[3] }
  get Y() { return navigator.getGamepads()[0]?.axes[2] }
}

class MoveAxis {
  get X() { return  navigator.getGamepads()[0]?.axes[0] }
  get Y() { return -navigator.getGamepads()[0]?.axes[1] }
}

export default class Controller {
  #look_axes: LookAxis
  #move_axes: MoveAxis
  
  constructor() {
    this.#look_axes = new LookAxis()
    this.#move_axes = new MoveAxis()
  }
  
  get Look(): Float32Array {
    return new Float32Array([
      this.#look_axes.X,
      this.#look_axes.Y,
    ])
  }

  get Move(): Float32Array {
    return new Float32Array([
      this.#move_axes.X,
      0,
      this.#move_axes.Y,
    ])
  }
}