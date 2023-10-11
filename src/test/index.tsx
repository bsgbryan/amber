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

import Benzaiten from "../lib/Benzaiten"

import { cube } from "./data"

const TestScene: Component = () => {
  createEffect(async () => {
    await Eunomia.init()

    const unit_cube_space  = new Float32Array([1, 1, 1])
    const unit_cube_points = Benzaiten.partition(unit_cube_space)
    new ColoredPoint(Color.from_html_rgb(255,  87, 51)).apply_to(unit_cube_points)

    const rectangle_space  = new Float32Array([2, 2, 4])
    const rectangle_points = Benzaiten.partition(rectangle_space)
    new ColoredPoint(Color.from_html_rgb(255, 128, 98), 25).apply_to(rectangle_points)

    new SimpleVertexColor().apply_to(cube)
    
    const camera = Legion.add_entity()

    Legion.add_system(new Update_MainCamera_Position_and_LookDirection())

    Legion.add_component(camera, new Position(0, 2, -10))
    Legion.add_component(camera, new MainCamera())
  })

  return <canvas id="main-render-target" />
}

export default TestScene