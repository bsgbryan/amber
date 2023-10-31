import {
  describe,
  expect,
  test,
} from "bun:test"

import {
  add,
  cross,
  distance,
  divide_by_scalar,
  identity,
  multiply,
  normalize,
  spherical,
  subtract,
  zero,
} from '#/Sunya/Vector3D'

describe('Sunya::Vector3D', () => {
  test("add", () => {
    const one  = new Float32Array([1, 2, 3]),
          two  = new Float32Array([1, 2, 3]),
          wasm = add(one, two)
    
    expect(wasm[0]).toEqual(2)
    expect(wasm[1]).toEqual(4)
    expect(wasm[2]).toEqual(6)
  })

  test("cross", () => {
    const one  = new Float32Array([1, 2, 3]),
          two  = new Float32Array([3, 2, 1]),
          wasm = cross(one, two)
    
    expect(wasm[0]).toEqual(-4)
    expect(wasm[1]).toEqual( 8)
    expect(wasm[2]).toEqual(-4)
  })

  test("distance", () => {
    const one  = new Float32Array([1, 2, 3]),
          two  = new Float32Array([3, 2, 1]),
          wasm = distance(one, two)
    
    expect(wasm).toEqual(2.8284271247461903)
  })

  test("divide_by_scalar", () => {
    const v    = new Float32Array([1, 2, 3]),
          s    = 2,
          wasm = divide_by_scalar(v, s)
    
    expect(wasm[0]).toEqual(0.5)
    expect(wasm[1]).toEqual(1.0)
    expect(wasm[2]).toEqual(1.5)
  })

  test("identity", () => {
    const wasm = identity()
    
    expect(wasm[0]).toEqual(1)
    expect(wasm[1]).toEqual(1)
    expect(wasm[2]).toEqual(1)
  })

  test("multiply", () => {
    const one  = new Float32Array([1, 2, 3]),
          two  = new Float32Array([1, 2, 3]),
          wasm = multiply(one, two)
    
    expect(wasm[0]).toEqual(1)
    expect(wasm[1]).toEqual(4)
    expect(wasm[2]).toEqual(9)
  })

  test("normalize", () => {
    const v    = new Float32Array([1, 2, 3]),
          wasm = normalize(v)
    
    expect(wasm[0]).toBeCloseTo(.5345224738121033, Number.EPSILON)
    expect(wasm[1]).toBeCloseTo(.5345224738121033, Number.EPSILON)
    expect(wasm[2]).toBeCloseTo(.8017836809158325, Number.EPSILON)
  })

  test("spherical", () => {
    const wasm = spherical(0, 45, 1)
    
    expect(wasm[0]).toBeCloseTo(0.7071067690849304, Number.EPSILON)
    expect(wasm[1]).toBeCloseTo(0,                  Number.EPSILON)
    expect(wasm[2]).toBeCloseTo(0.7071067690849304, Number.EPSILON)
  })

  test("substract", () => {
    const one  = new Float32Array([1, 2, 3]),
          two  = new Float32Array([1, 2, 3]),
          wasm = subtract(one, two)
    
    expect(wasm[0]).toEqual(0)
    expect(wasm[1]).toEqual(0)
    expect(wasm[2]).toEqual(0)
  })

  test("zero", () => {
    const wasm = zero()
    
    expect(wasm[0]).toEqual(0)
    expect(wasm[1]).toEqual(0)
    expect(wasm[2]).toEqual(0)
  })
})