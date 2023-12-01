import {
  describe,
  expect,
  test,
} from "bun:test"

import {
  x_crossings,
  y_crossings,
  z_crossings,
} from '#/Benzaiten/helpers'

import { Sphere } from '#/Benzaiten/shapes'

describe('Benzaiten::helpers', () => {
  test('x_crossings', () => {
    const sides  = new Float32Array([-.5, 0, 0, 0, .5, .5]),
          params = new Float32Array([/* radius */ .475]),
          result = x_crossings(Sphere(), params, sides)

    expect(result.length).toEqual(5)
    expect(result[0]).toEqual(-1)
    expect(result[1]).toEqual( 0)
    expect(result[2]).toEqual( 0)
    expect(result[3]).toEqual( 0)
    expect(result[4]).toEqual( 1)
  })

  test('y_crossings', () => {
    const sides  = new Float32Array([0, .5, 0, .5, 0, .5]),
          params = new Float32Array([/* radius */ .475]),
          result = y_crossings(Sphere(), params, sides)

    expect(result.length).toEqual(5)
    expect(result[0]).toEqual(1)
    expect(result[1]).toEqual(0)
    expect(result[2]).toEqual(0)
    expect(result[3]).toEqual(0)
    expect(result[4]).toEqual(1)
  })

  test('z_crossings', () => {
    const sides  = new Float32Array([0, 0, -.5, .5, .5, 0]),
          params = new Float32Array([/* radius */ .475]),
          result = z_crossings(Sphere(), params, sides)

    expect(result.length).toEqual(5)
    expect(result[0]).toEqual(-1)
    expect(result[1]).toEqual( 0)
    expect(result[2]).toEqual( 0)
    expect(result[3]).toEqual( 0)
    expect(result[4]).toEqual( 1)
  })
})