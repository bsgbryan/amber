import {
  type Component,
  createEffect,
} from "solid-js"

import Eunomia from "../lib/Eunomia"
import Legion  from "../lib/Legion"
import Xenon   from "../lib/Xenon"

import Geometry   from "../lib/Xenon/components/Geometry"
import MainCamera from "../lib/Xenon/components/MainCamera"
import Position   from "../lib/Xenon/components/Position"

import Refresh_Geometry                             from "../lib/Xenon/systems/Refresh_Geometry"
import Update_MainCamera_Position_and_LookDirection from "../lib/Xenon/systems/Update_MainCamera_Position_and_LookDirection"

import SimpleVertexColor from "./materials/SimpleVertexColor"

import { positions } from "./data"

const TestScene: Component = () => {
  createEffect(async () => {
    await Xenon.init()

    const cube   = Legion.add_entity()
    const camera = Legion.add_entity()

    const geometry = new Geometry(positions)
    const position = new Position(0, 2, -10)
    const material = new SimpleVertexColor()

    const register_geometry   = new Refresh_Geometry()
    const main_camera_manager = new Update_MainCamera_Position_and_LookDirection()

    Legion.add_system(register_geometry)
    Legion.add_system(main_camera_manager)

    Legion.add_component(cube,   geometry)
    Legion.add_component(cube,   material)
    Legion.add_component(camera, position)
    Legion.add_component(camera, new MainCamera())

    Eunomia.update()
  })

  return <canvas id="main-render-target" />
}

export default TestScene