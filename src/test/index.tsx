import {
  type Component,
  createEffect,
} from "solid-js"

import Xenon from "../lib/Xenon"

import Geometry   from "../lib/Xenon/components/Geometry"
import MainCamera from "../lib/Xenon/components/MainCamera"
import Position   from "../lib/Xenon/components/Position"

import Refresh_Geometry                             from "../lib/Xenon/systems/Refresh_Geometry"
import Update_MainCamera_Position_and_LookDirection from "../lib/Xenon/systems/Update_MainCamera_Position_and_LookDirection"

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

    const register_geometry   = new Refresh_Geometry()
    const main_camera_manager = new Update_MainCamera_Position_and_LookDirection()

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