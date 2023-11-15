import {
  describe,
  expect,
  test,
} from "bun:test"

import { view_projection_matrix } from '#/Xenon/helpers'

describe('Xenon::helpers', () => {
  test('view_projection_matrix', () => {
    const aspect_ratio = 1.777777777777778,
          position     = new Float32Array([0, 0, 0]),
          target       = new Float32Array([0, 0, 1]),
          fov          =   80,
          near_plane   =     .1,
          far_plane    = 1000,
          height       = 100,
          width        = height * aspect_ratio,
          wasm         = view_projection_matrix(
            aspect_ratio,
            position,
            target,
            fov,
            near_plane,
            far_plane,
            width,
            height,
          )

    expect(wasm[0]).toEqual(0.6703613996505737)
    expect(wasm[1]).toEqual(0)
    expect(wasm[2]).toEqual(0)
    expect(wasm[3]).toEqual(0)
    
    expect(wasm[4]).toEqual(0)
    expect(wasm[5]).toEqual(1.191753625869751)
    expect(wasm[6]).toEqual(0)
    expect(wasm[7]).toEqual(0)
    
    expect(wasm[ 8]).toEqual(0)
    expect(wasm[ 9]).toEqual(0)
    expect(wasm[10]).toEqual(1.0000998973846436)
    expect(wasm[11]).toEqual(1)
    
    expect(wasm[12]).toEqual( 0)
    expect(wasm[13]).toEqual( 0)
    expect(wasm[14]).toEqual(-0.1000099927186966)
    expect(wasm[15]).toEqual( 0)
  })
})