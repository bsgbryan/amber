import {
  type Component,
  createEffect,
} from 'solid-js'

import { vec3 } from 'gl-matrix'

import Xenon, { VertexBufferLayout } from '../../lib/Xenon'

import vertex   from './shaders/vertex.wgsl?raw'
import fragment from './shaders/fragment.wgsl?raw'

import {
  colors,
  positions,
} from './data'

let _x     = 0
let _z     = 0
let origin = 0

const render = (
  camera: {
    x: number,
    y: number,
    z: number
  },
  delta: number,
) => {
  const started = performance.now()

  origin += delta

  const gp   = navigator.getGamepads()[0]
  const anim = Math.sin(origin / (60 * 15)) * 5

  if (gp) {
    _z -= Math.abs(gp?.axes[1]) > .1 ? gp?.axes[1] * delta * .01 : 0
    _x += Math.abs(gp?.axes[0]) > .1 ? gp?.axes[0] * delta * .01 : 0
  }
  else {
    _z = anim
    _x = anim
  }

  Xenon.render({
    position: vec3.fromValues(camera.x + _x, -camera.y, camera.z + _z),
    target:   vec3.fromValues(0, 0, 0),
  }, positions.length / 3)

  requestAnimationFrame(() => {
    render(camera, performance.now() - started)
  })
}

const StaticCube: Component = () => {
  createEffect(async () => {
    await Xenon.init('main-render-target')

    Xenon.register_buffer(positions)
    Xenon.register_buffer(colors)

    const buffer_layouts = [
      VertexBufferLayout(0, 0), // Position
      VertexBufferLayout(1, 0), // Color
    ]

    Xenon.register_render_pipeline(
      'Example',
      { vertex, fragment },
      { vertex: buffer_layouts }
    )

    const timestamp =  performance.now()

    requestAnimationFrame(() => {
      render({x: 0, y: 2, z: -10}, performance.now() - timestamp)
    })
  })

  return <canvas id="main-render-target" />
}

export default StaticCube