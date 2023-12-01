import {
  describe,
  test,
} from "bun:test"

import {
  execute,
  execute_simd,
} from '#/scratch/SIMD'

const harness = (mode: string, fn: () => number): void => {
  let max = Number.MIN_VALUE,
      min = Number.MAX_VALUE,
      sum = 0

  const limit = 10

  for (let i = 0; i < limit; i++) {
    const time = fn()

    if (time > max) max = time
    if (time < min) min = time
    
    sum += time
  }

  const avg = sum / limit

  console.log(`${mode} -> Average: ${avg}`)
  console.log(`${mode} -> Max:     ${max}`)
  console.log(`${mode} -> Min:     ${min}`)
}

// This isn't a unit test, per se. It's more of an experiment.
describe.skip('scratch', () => {
  test('SIMD perfomance difference for Quaternion.from_axis_angle', () => {
    harness('non-SIMD', execute)

    harness('SIMD', execute_simd)
  })
})