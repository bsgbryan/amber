export default class Yggdrasil {
  static #frame_time_budget = 16.666666666666668
  static #fps_target        = 60

  static #sample_size = 15
  
  static #times: TimeDictionary = {
    ecs:    new Float32Array(15),
    render: new Float32Array(15),
  }
  
  static #index = {
    ecs:    0,
    render: 0,
  }

  static set fps(target: number) {
    this.#fps_target        = target
    this.#frame_time_budget = 1000 / target
    
    this.#sample_size = Math.floor(this.#fps_target * .25)

    this.#times.ecs    = new Float32Array(this.#sample_size)
    this.#times.render = new Float32Array(this.#sample_size)
  }

  static record_phase(name: Phase, time: number): void {
    this.#times[name][this.#index[name]++ % this.#sample_size] = time
  }

  static get fidelity(): number {
    let sum   = 0
    let count = 0

    for (const p of Object.keys(this.#times))
      // @ts-ignore
      for (const t of this.#times[p]) {
        sum += t
        count++
      }

    return this.#frame_time_budget / (sum / count)
  }

  static phase_fidelity(phase: Phase): number {
    let sum = 0

    for (const t of this.#times[phase]) sum += t

    return this.#frame_time_budget / (sum / this.#times[phase].length)
  }
}