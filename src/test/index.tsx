import {
  type Component,
  createEffect,
} from "solid-js"

import Eunomia from "../lib/Eunomia"
import Legion  from "../lib/Legion"

import MainCamera from "../lib/Athenaeum/components/MainCamera"
import Position   from "../lib/Athenaeum/components/Position"

import Update_MainCamera_Position_and_LookDirection from "../lib/Athenaeum/systems/Update_MainCamera_Position_and_LookDirection"

import Benzaiten from "../lib/Benzaiten"

import Sphere       from "../lib/Benzaiten/shapes/Sphere"
import ColoredPoint from "../lib/Athenaeum/materials/ColoredPoint"
import Color        from "../lib/Athenaeum/Color"

const TestScene: Component = () => {
  createEffect(async () => {
    await Eunomia.init()

    const results = Benzaiten.partition(Sphere(), 4)

    new ColoredPoint(Color.from_html_rgb(255, 128, 191), .125).apply_to(results)

    const camera = Legion.add_entity()

    Legion.add_system(new Update_MainCamera_Position_and_LookDirection())

    Legion.add_component(camera, new Position(0, .15, -1.5))
    Legion.add_component(camera, new MainCamera())
  })

  return <canvas id="main-render-target" />
}

export default TestScene