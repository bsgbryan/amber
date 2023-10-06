import {
  type Component,
  createEffect,
} from "solid-js"

import Xenon from "../../lib/Xenon"
import {
  Vector,
  degrees_to_radians,
  quat,
  vec3,
} from "../../lib/Xenon/math"

import Geometry   from "../../lib/Xenon/components/Geometry"
import MainCamera from "../../lib/Xenon/components/MainCamera"
import Position   from "../../lib/Xenon/components/Position"

import RefreshGeometry   from "../../lib/Xenon/systems/RefreshGeometry"
import MainCameraManager from "../../lib/Xenon/systems/MainCameraManager"

import SimpleVertexColor from "./materials/SimpleVertexColor"

import { positions } from "./data"

const StaticCube: Component = () => {
  createEffect(async () => {
    await Xenon.init('main-render-target')

    const cube   = Xenon.new_entity()
    const camera = Xenon.new_entity()

    const geometry = new Geometry(positions)
    const position = new Position(0, 2, -10)
    const material = new SimpleVertexColor()

    const register_geometry   = new RefreshGeometry()
    const main_camera_manager = new MainCameraManager()

    Xenon.add_system(register_geometry)
    Xenon.add_system(main_camera_manager)

    Xenon.add_component(cube,   geometry)
    Xenon.add_component(cube,   material)
    Xenon.add_component(camera, position)
    Xenon.add_component(camera, new MainCamera())

    Xenon.run()
  })

  return <canvas id="main-render-target" />
}

export default StaticCube