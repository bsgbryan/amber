import {
  describe,
  expect,
  test,
} from "bun:test"

import { mat4 } from '@/Sunya'

import { degrees_to_radians } from '#/Sunya/helpers'

import {
  aim,
  look_at,
  multiply,
  perspective,
} from '#/Sunya/Matrix4x4'

const base = [
  2, 2, 2, 2,
  3, 3, 3, 3,
  4, 4, 4, 4,
  5, 5, 5, 5,
]

describe('Sunya::Matrix4x4', () => {
  test('aim', () => {
    const eye    = new Float32Array([0, 0, 0]),
          target = new Float32Array([0, 0, 1]),
          up     = new Float32Array([0, 1, 0]),
          wasm   = aim(eye, target, up)

    expect(wasm[0]).toEqual(-1)
    expect(wasm[1]).toEqual(-0)
    expect(wasm[2]).toEqual(-0)
    expect(wasm[3]).toEqual( 0)
    
    expect(wasm[4]).toEqual(0)
    expect(wasm[5]).toEqual(1)
    expect(wasm[6]).toEqual(0)
    expect(wasm[7]).toEqual(0)
    
    expect(wasm[ 8]).toEqual(0)
    expect(wasm[ 9]).toEqual(0)
    expect(wasm[10]).toEqual(1)
    expect(wasm[11]).toEqual(0)

    expect(wasm[12]).toEqual(0)
    expect(wasm[13]).toEqual(0)
    expect(wasm[14]).toEqual(0)
    expect(wasm[15]).toEqual(1)
  })

  test('look_at', () => {
    const eye    = new Float32Array([0, 0, 0]),
          target = new Float32Array([0, 0, 1]),
          up     = new Float32Array([0, 1, 0]),
          wasm   = look_at(eye, target, up)

    expect(wasm[0]).toEqual( 1)
    expect(wasm[1]).toEqual(-0)
    expect(wasm[2]).toEqual(-0)
    expect(wasm[3]).toEqual( 0)
    
    expect(wasm[4]).toEqual(0)
    expect(wasm[5]).toEqual(1)
    expect(wasm[6]).toEqual(0)
    expect(wasm[7]).toEqual(0)
    
    expect(wasm[ 8]).toEqual( 0)
    expect(wasm[ 9]).toEqual( 0)
    expect(wasm[10]).toEqual(-1)
    expect(wasm[11]).toEqual( 0)

    expect(wasm[12]).toEqual(-0)
    expect(wasm[13]).toEqual(-0)
    expect(wasm[14]).toEqual(-0)
    expect(wasm[15]).toEqual( 1)
  })

  test('multiply', () => {
    const one  = new Float32Array(base),
          two  = new Float32Array(base),
          wasm = multiply(one, two)

    expect(wasm[0]).toEqual(28)
    expect(wasm[1]).toEqual(28)
    expect(wasm[2]).toEqual(28)
    expect(wasm[3]).toEqual(28)
    
    expect(wasm[4]).toEqual(42)
    expect(wasm[5]).toEqual(42)
    expect(wasm[6]).toEqual(42)
    expect(wasm[7]).toEqual(42)
    
    expect(wasm[ 8]).toEqual(56)
    expect(wasm[ 9]).toEqual(56)
    expect(wasm[10]).toEqual(56)
    expect(wasm[11]).toEqual(56)

    expect(wasm[12]).toEqual(70)
    expect(wasm[13]).toEqual(70)
    expect(wasm[14]).toEqual(70)
    expect(wasm[15]).toEqual(70)
  })

  test('perspective', () => {
    const wasm = perspective(
      degrees_to_radians(80),
      16 / 9,
          .1,
      1000.0,
    )

    expect(wasm[ 0]).toEqual( 0.6703613996505737)
    expect(wasm[ 5]).toEqual( 1.191753625869751)
    expect(wasm[10]).toEqual(-1.0000998973846436)
    expect(wasm[14]).toEqual(-0.1000099927186966)

    expect(wasm[11]).toEqual(-1)

    expect(wasm[1]).toEqual(0)
    expect(wasm[2]).toEqual(0)
    expect(wasm[3]).toEqual(0)

    expect(wasm[4]).toEqual(0)
    expect(wasm[6]).toEqual(0)
    expect(wasm[7]).toEqual(0)

    expect(wasm[8]).toEqual(0)
    expect(wasm[9]).toEqual(0)

    expect(wasm[12]).toEqual(0)
    expect(wasm[13]).toEqual(0)
    expect(wasm[15]).toEqual(0)
  })
})