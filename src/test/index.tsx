import {
  type Component,
  createEffect,
} from "solid-js"

import Eunomia from "../lib/Eunomia"
import Legion  from "../lib/Legion"

import Color from "../lib/Athenaeum/Color"

import ColoredPoint      from "../lib/Athenaeum/materials/ColoredPoint"
import SimpleVertexColor from "../lib/Athenaeum/materials/SimpleVertexColor"

import MainCamera from "../lib/Athenaeum/components/MainCamera"
import Position   from "../lib/Athenaeum/components/Position"

import Update_MainCamera_Position_and_LookDirection from "../lib/Athenaeum/systems/Update_MainCamera_Position_and_LookDirection"

import {
  cube,
  points,
 } from "./data"

const TestScene: Component = () => {
  createEffect(async () => {
    await Eunomia.init()

    new SimpleVertexColor().apply_to(cube)
    new ColoredPoint(Color.from_html_rgb(255, 87, 51)).apply_to(points)
    
    const camera = Legion.add_entity()

    Legion.add_system(new Update_MainCamera_Position_and_LookDirection())

    Legion.add_component(camera, new Position(0, 2, -10))
    Legion.add_component(camera, new MainCamera())
  })

  return <canvas id="main-render-target" />
}

export default TestScene