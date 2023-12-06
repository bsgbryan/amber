import Color                              from "@/Athenaeum/Color"
import MainCamera                         from "@/Athenaeum/components/MainCamera"
import ColoredPoint                       from "@/Athenaeum/materials/ColoredPoint"
import SimpleVertexColor                  from "@/Athenaeum/materials/SimpleVertexColor"
import Update_Camera_and_Target_Positions from "@/Athenaeum/systems/Update_Camera_and_Target_Positions"

import { Sphere  } from "#/Benzaiten/shapes"
import { execute } from "#/Benzaiten/extract_surface"

import Eunomia from "@/Eunomia"
import Legion  from "@/Legion"

await Eunomia.init()

const divisions  = 3,
      segments   = new Uint8Array  ([2, 2, 2]),
      space      = new Float32Array([1, 1, 1]),
      origin     = new Float32Array([0, 0, 0]),
      recursions = 1,
      dimensions = segments[0] * segments[1] * segments[2],
      voxels     = dimensions  * divisions,
      vertices   = new Float32Array(voxels * dimensions * dimensions * divisions),
      params     = new Float32Array([/* radius */ .475]),
      shape      = Sphere(),
      start   = performance.now(),
      surface = execute(shape, params, vertices, divisions, segments, space, origin, recursions),
      bench   = (performance.now() - start).toFixed(1)

console.log(`Mesh took ${bench} milliseconds to generate`)

new ColoredPoint(Color.from_html_rgb(255, 192, 64), .5).apply_to({
  vertices: new Float32Array([-1, 0, 0]),
})

new ColoredPoint(Color.from_html_rgb(255, 64, 192), .5).apply_to({
  vertices: new Float32Array([0, -1, 0]),
})

new ColoredPoint(Color.from_html_rgb(64, 192, 255), .5).apply_to({
  vertices: new Float32Array([0, 0, -1])
})

new ColoredPoint(Color.from_html_rgb(192, 64, 255), .25).apply_to({
  vertices: surface,
})

// TODO: Figure out why this line fails if the above ColoredPoints are not rendered first
new SimpleVertexColor().apply_to({ vertices: surface })

const camera = Legion.add_entity()

Legion.add_system(new Update_Camera_and_Target_Positions())
Legion.add_component(camera, new MainCamera(0, .15, -1.5))

const extra   = vertices.length - surface.length,
      ratio   = extra / vertices.length,
      percent = (ratio * 100).toFixed(1)

console.log(`${percent}% (${extra}) extra vertices; ${Intl.NumberFormat('en-US').format(surface.length)} used`)
