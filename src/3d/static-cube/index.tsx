import {
  type Component,
  createEffect,
} from 'solid-js'

import Xenon, { VertexBufferLayout } from '../../lib/Xenon'

import vertex   from './shaders/vertex.wgsl?raw'
import fragment from './shaders/fragment.wgsl?raw'

import {
  Vector,
  degrees_to_radians,
  quat,
  vec3,
} from '../../lib/Xenon/math'

import { positions } from './data'

let x_rotate = 0
let y_rotate = 0

const render = (
  position: Float32Array,
  delta:    number,
) => {
  const started = performance.now()
  const gp      = navigator.getGamepads()[0]
  
  let x_translate = 0
  let z_translate = 0

  if (gp) {
    x_translate  = Math.abs(gp?.axes[0]) > .1 ? gp?.axes[0] * delta : 0
    z_translate  = Math.abs(gp?.axes[1]) > .1 ? gp?.axes[1] * delta : 0
    y_rotate    -= Math.abs(gp?.axes[2]) > .1 ? gp?.axes[2] * delta * 80 : 0
    x_rotate    += Math.abs(gp?.axes[3]) > .1 ? gp?.axes[3] * delta * 80 : 0
  }

  x_rotate = Math.min(x_rotate,  85)
  x_rotate = Math.max(x_rotate, -85)

  const q       = quat.from_axis_angle(Vector.Up, degrees_to_radians(y_rotate))
  const rotated = quat.rotate(new Float32Array([x_translate, 0, z_translate]), q)

  vec3.add(rotated, position, position)

  Xenon.render(position, vec3.spherical(x_rotate, y_rotate), positions.length / 3)

  requestAnimationFrame(() => render(position, (performance.now() - started) * .001))
}

const StaticCube: Component = () => {
  createEffect(async () => {
    await Xenon.init('main-render-target')

    Xenon.register_buffer(positions)

    const buffer_layouts = [
      VertexBufferLayout(0, 0), // Position
    ]

    Xenon.register_render_pipeline(
      'Example',
      { vertex, fragment },
      { vertex: buffer_layouts }
    )

    const timestamp =  performance.now()

    requestAnimationFrame(() => {
      render(new Float32Array([0, 2, -10]), (performance.now() - timestamp) * .001)
    })
  })

  return <canvas id="main-render-target" />
}

export default StaticCube