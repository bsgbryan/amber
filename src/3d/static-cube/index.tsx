import {
  type Component,
  createEffect,
} from 'solid-js'

import { quat } from 'gl-matrix'

import Xenon, { VertexBufferLayout } from '../../lib/Xenon'

import vertex   from './shaders/vertex.wgsl?raw'
import fragment from './shaders/fragment.wgsl?raw'

import { positions } from './data'
import { degrees_to_radians, vec3 } from '../../lib/math'

let _x     = 0
let _z     = 0
let origin = 0
let _rotate_x = 0
let _rotate_y = 0

const render = (
  camera: {
    position: Float32Array,
    rotation: quat,
  },
  delta: number,
) => {
  const started = performance.now()

  origin += delta

  const gp       = navigator.getGamepads()[0]
  let   X        = vec3.zero()
  let   Y        = vec3.zero()
  let   rotation = [...camera.rotation] as quat
  let   diff = {
    x: 0,
    y: 0,
  }

  if (gp) {
    _z = Math.abs(gp?.axes[1]) > .1 ? gp?.axes[1] * delta : 0
    _x = Math.abs(gp?.axes[0]) > .1 ? gp?.axes[0] * delta : 0

    const x_move = Math.abs(gp?.axes[3]) > .1 ? gp?.axes[3] * delta * 20 : 0
    const y_move = Math.abs(gp?.axes[2]) > .1 ? gp?.axes[2] * delta * 20 : 0

    if (x_move) {
      X[0] = 1

      diff.x = x_move

      _rotate_x = Math.min(_rotate_x + x_move,  90)
      _rotate_x = Math.max(_rotate_x + x_move, -90)
    }
    if (y_move) {
      Y[1] = 1

      diff.y = y_move

      _rotate_y = Math.min(_rotate_y + y_move,  85)
      _rotate_y = Math.max(_rotate_y + y_move, -85)
    }
  }
  else {
    const phase     = origin / (60 * 15)
    const frequency = 500

    _z = Math.cos(phase * frequency) * delta
    _x = Math.sin(phase * frequency) * delta
  }

    // const QY = quat.create()
    // quat.setAxisAngle(QY, Y, DegreesToRadians(_rotate_x))
    // quat.multiply(rotation, rotation, QY)

  // if (diff.y) {
  //   const QY = quat.create()
  //   quat.setAxisAngle(QY, Y, DegreesToRadians(_rotate_y))
  //   quat.multiply(rotation, rotation, QY)
  // }

  // const forward  = [0, 0, 1] as vec3
  // const sideways = [1, 0, 0] as vec3

  // vec3.transformQuat(forward,  forward,  rotation)
  // vec3.transformQuat(sideways, sideways, rotation)

  // vec3.normalize(forward,  forward )
  // vec3.normalize(sideways, sideways)

  // vec3.multiply(forward,  forward,  [ 0, 0, -_z])
  // vec3.multiply(sideways, sideways, [_x, 0,  0])

  const position = new Float32Array(camera.position)

  // vec3.add(position, position, forward )
  // vec3.add(position, position, sideways)

  let target = vec3.zero()

  vec3.add(vec3.spherical(_rotate_x, -_rotate_y, 360), camera.position, target)
  
  // console.log(`${_rotate_x}, ${_rotate_y}: ${target[0]}, ${target[1]}, ${target[2]}`)

  Xenon.render({position, target}, positions.length / 3)

  requestAnimationFrame(() => {
    const camera = {position, rotation}
    render(camera, (performance.now() - started) * .001)
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
      const camera = {
        position: new Float32Array([0, 2, -10]),
        rotation: quat.create()
      }

      render(camera, (performance.now() - timestamp) * .001)
    })
  })

  return <canvas id="main-render-target" />
}

export default StaticCube