import Eunomia from "@/Eunomia"
import Legion  from "@/Legion"

import MainCamera from "@/Athenaeum/components/MainCamera"
import Position   from "@/Athenaeum/components/Position"

import Update_MainCamera_Position_and_LookDirection from "@/Athenaeum/systems/Update_MainCamera_Position_and_LookDirection"

import Benzaiten from "@/Benzaiten"

import Sphere            from "@/Benzaiten/shapes/Sphere"
import SimpleVertexColor from "@/Athenaeum/materials/SimpleVertexColor"

await Eunomia.init()

const mesh = new Benzaiten(Sphere(), 3).extract_surface()

new SimpleVertexColor().apply_to(mesh)

const camera = Legion.add_entity()

Legion.add_system(new Update_MainCamera_Position_and_LookDirection())

Legion.add_component(camera, new Position(0, .15, -1.5))
Legion.add_component(camera, new MainCamera())
