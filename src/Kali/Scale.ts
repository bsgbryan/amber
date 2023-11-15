export default class TimeScale {
  static #current   = 1
  static #initiated = 0
  static #span      = 0
  static #target    = 1

  static init(value = 1) {
    this.#current = value
    this.#target  = value
  }

  static get value(): number {
    if (this.#target !== this.#current) {
      const remaining_milliseconds = Math.max(0, (this.#initiated + this.#span) - performance.now())
      const tranisition_remaining  = Math.abs(remaining_milliseconds * .001) / (this.#span * .001)
  
      this.#current += (1 - tranisition_remaining) * (this.#target - this.#current)
    }

    return this.#current
  }

  static transition_to(
    value:             number,
    over_milliseconds: number,
  ): void {
    this.#initiated = performance.now()
    this.#span      = over_milliseconds
    this.#target    = value
  }
}