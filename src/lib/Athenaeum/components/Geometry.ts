import { Component } from "../../Legion"

let registered_buffer_count = 0

export default class Geometry extends Component {
  #buffer_index = -1

  constructor(public vertices: Float32Array) {
    super()

    this.#buffer_index = registered_buffer_count++
  }

  get buffer_index(): number { return this.#buffer_index }
}