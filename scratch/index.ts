import { Sphere } from "#/Benzaiten/shapes"

import Eunomia from "@/Eunomia"
import Legion  from "@/Legion"

import MainCamera from "@/Athenaeum/components/MainCamera"

import Update_Camera_and_Target_Positions from "@/Athenaeum/systems/Update_Camera_and_Target_Positions"

import Benzaiten from "@/Benzaiten"

import SimpleVertexColor from "@/Athenaeum/materials/SimpleVertexColor"

await Eunomia.init()

const mesh = new Benzaiten(Sphere, 3).extract_surface(new Float32Array([/* radius */ .475]))

new SimpleVertexColor().apply_to(mesh)

const camera = Legion.add_entity()

Legion.add_system(new Update_Camera_and_Target_Positions())
Legion.add_component(camera, new MainCamera(0, .15, -1.5))
