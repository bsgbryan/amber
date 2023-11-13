import {
  describe,
  expect,
  test,
} from "bun:test"

import {
  from_axis_angle,
  multiply,
  rotate,
} from "#/Sunya/Quaternion"

describe('Quaternion', () => {
  test('from_axis_angle', () => {
    const wasm = from_axis_angle(new Float32Array([0, 1, 0]), 45)

    expect(wasm[0]).toEqual(-0)
    expect(wasm[1]).toEqual(-0.48717451095581055)
    expect(wasm[2]).toEqual(-0)
    expect(wasm[3]).toEqual(-0.8733046650886536)
  })

  test('multiply', () => {
    const base = new Float32Array([2, 4, 6, 8]),
          wasm = multiply(base, base)

    expect(wasm[0]).toEqual(32)
    expect(wasm[1]).toEqual(64)
    expect(wasm[2]).toEqual(96)
    expect(wasm[3]).toEqual(8)
  })

  test('rotate', () => {
    const point = new Float32Array([1, .5, 2]),
          angle = new Float32Array([10, 45, 2, 3]),
          wasm  = rotate(point, angle)

    expect(wasm[0]).toEqual( 2692)
    expect(wasm[1]).toEqual( 979)
    expect(wasm[2]).toEqual(-3974)
  })
})