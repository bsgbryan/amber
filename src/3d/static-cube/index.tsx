import {
  type Component,
  createEffect,
} from 'solid-js'

import Xenon, { VertexBufferLayout } from '../../lib/Xenon'

import vertex   from './shaders/vertex.wgsl?raw'
import fragment from './shaders/fragment.wgsl?raw'

import { positions } from './data'
import { degrees_to_radians, vec3 } from '../../lib/math'

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
  let y_diff      = 0

  if (gp) {
    x_translate  = Math.abs(gp?.axes[0]) > .1 ? gp?.axes[0] * delta * 5 : 0
    z_translate  = Math.abs(gp?.axes[1]) > .1 ? gp?.axes[1] * delta * 5 : 0
    y_diff       = Math.abs(gp?.axes[2]) > .1 ? gp?.axes[2] * delta * 80 : 0
    x_rotate    += Math.abs(gp?.axes[3]) > .1 ? gp?.axes[3] * delta * 80 : 0
    y_rotate    += y_diff
  }

  const sphere = vec3.spherical(x_rotate, -y_rotate)
  const next   = new Float32Array(position)
  const target = vec3.zero()

  // TODO: Change this to use a quaternion
  const rotated = vec3.rotateY(
    new Float32Array([1, 0, 1]),
    degrees_to_radians(y_rotate)
  )

  const x_move = -z_translate * (1 - rotated[0])
  const z_move = -z_translate * rotated[2]

  // console.log(`X:${rotated[0]} ${x_move}\nZ:${rotated[2]} ${z_move}`)

  // Move Forward
  vec3.add(new Float32Array([x_move, 0, z_move]), next, next)
  vec3.add(sphere, next, target)

  Xenon.render(next, target, positions.length / 3)

  requestAnimationFrame(() => {
    render(next, (performance.now() - started) * .001)
  })
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