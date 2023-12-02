import MainCamera                         from "@/Athenaeum/components/MainCamera"
import SimpleVertexColor                  from "@/Athenaeum/materials/SimpleVertexColor"
import Update_Camera_and_Target_Positions from "@/Athenaeum/systems/Update_Camera_and_Target_Positions"

import { Sphere      } from "#/Benzaiten/shapes"
import extract_surface from "@/Benzaiten"

import Eunomia from "@/Eunomia"
import Legion  from "@/Legion"

await Eunomia.init()

const divisions  = 3,
      segments   = new Float32Array([2, 2, 2]),
      dimensions = segments[0] * segments[1] * segments[2],
      voxels     = dimensions  * divisions,
      vertices   = new Float32Array(voxels * dimensions * dimensions * divisions),
      params     = new Float32Array([/* radius */ .475]),
      shape      = Sphere(),
      start = performance.now(),
      mesh  = extract_surface(shape, divisions, segments, params, vertices),
      bench = (performance.now() - start).toFixed(1)

console.log(`Mesh took ${bench} milliseconds to generate`)

new SimpleVertexColor().apply_to(mesh)

const camera = Legion.add_entity()

Legion.add_system(new Update_Camera_and_Target_Positions())
Legion.add_component(camera, new MainCamera(0, .15, -1.5))
