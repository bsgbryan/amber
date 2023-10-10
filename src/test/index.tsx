import {
  type Component,
  createEffect,
} from "solid-js"

import Eunomia from "../lib/Eunomia"
import Legion  from "../lib/Legion"
import Xenon   from "../lib/Xenon"

import Geometry   from "../lib/Athenaeum/components/Geometry"
import MainCamera from "../lib/Athenaeum/components/MainCamera"
import Position   from "../lib/Athenaeum/components/Position"

import Update_MainCamera_Position_and_LookDirection from "../lib/Athenaeum/systems/Update_MainCamera_Position_and_LookDirection"

import { positions } from "./data"
import ColoredPoint from "../lib/Athenaeum/materials/ColoredPoint"
import Color from "../lib/Athenaeum/Color"

const TestScene: Component = () => {
  createEffect(async () => {
    await Xenon.init()

    const cube   = Legion.add_entity()
    const camera = Legion.add_entity()

    const geometry    = new Geometry(positions)
    const position    = new Position(0, 2, -10)
    const main_camera = new MainCamera()
    const material    = new ColoredPoint(Color.from_html_rgb(255, 87, 51))

    material.apply_to(positions)

    const main_camera_manager = new Update_MainCamera_Position_and_LookDirection()

    Legion.add_system(main_camera_manager)

    Legion.add_component(cube,   geometry)
    Legion.add_component(cube,   material)
    Legion.add_component(camera, position)
    Legion.add_component(camera, main_camera)

    Eunomia.update()
  })

  return <canvas id="main-render-target" />
}

export default TestScene