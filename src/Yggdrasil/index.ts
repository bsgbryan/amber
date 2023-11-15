export default class Yggdrasil {
  static #frame_time_budget = 16.666666666666668
  static #fps_target        = 60

  static #sample_size = 15

  static #overall_fidelity              = 0
  static #phase_fidelity: PhaseFidelity = {
    ecs:    0,
    render: 0,
  }
  
  static #times: TimeDictionary = {
    ecs:    new Float32Array(15),
    render: new Float32Array(15),
  }
  
  static #index: IndexDictionary = {
    ecs:    0,
    render: 0,
  }
  
  static #starts: PhaseDictionary = {
    ecs:    new Float32Array(15),
    render: new Float32Array(15),
  }

  static set fps(target: number) {
    this.#fps_target        = target
    this.#frame_time_budget = 1000 / target
    
    this.#sample_size = Math.floor(this.#fps_target * .25)

    this.#times.ecs     = new Float32Array(this.#sample_size)
    this.#times.render  = new Float32Array(this.#sample_size)
    this.#starts.ecs    = new Float32Array(this.#sample_size)
    this.#starts.render = new Float32Array(this.#sample_size)
  }

  static start_phase(name: Phase): void {
    this.#starts[name][this.#index[name]] = performance.now()
  }

  static #calculate_fidelity(): void {
    const phases      = Object.keys(this.#times)
    let   overall_sum = 0

    for (const p of phases) {
      let sum = 0

      for (const t of this.#times[p]) sum += t

      this.#phase_fidelity[p] = this.#frame_time_budget / (sum / this.#times[p].length)

      overall_sum += sum
    }

    this.#overall_fidelity = this.#frame_time_budget / (overall_sum / phases.length)
  }

  static complete_phase(name: Phase): void {
    const i = this.#index[name] % this.#sample_size

    this.#times[name][i] = performance.now() - this.#starts[name][i]

    if (++this.#index[name] === this.#sample_size) {
      this.#index[name] = 0

      this.#calculate_fidelity()
    }
  }

  static get fidelity(): Fidelity {
    return {
      overall: this.#overall_fidelity,
      ...this.#phase_fidelity,
    }
  }
}