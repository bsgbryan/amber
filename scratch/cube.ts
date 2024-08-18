import Eunomia from "@/Eunomia"
import Legion  from "@/Legion"

import ColoredPoint from "@/Athenaeum/materials/ColoredPoint"
import Color        from "@/Athenaeum/Color"

import MainCamera from "@/Athenaeum/components/MainCamera"

import Update_Camera_and_Target_Positions from "@/Athenaeum/systems/Update_Camera_and_Target_Positions"

import SimpleVertexColor from "@/Athenaeum/materials/SimpleVertexColor"

await Eunomia.init()

new ColoredPoint(Color.from_html_rgb(255, 192, 64), .5).apply_to({
  vertices: new Float32Array([-1, 0, 0]),
})

new ColoredPoint(Color.from_html_rgb(255, 64, 192), .5).apply_to({
  vertices: new Float32Array([0, -1, 0]),
})

new ColoredPoint(Color.from_html_rgb(64, 192, 255), .5).apply_to({
  vertices: new Float32Array([0, 0, -1])
})

// new ColoredPoint(Color.from_html_rgb(255, 255, 255), .5).apply_to({
// 	vertices: new Float32Array([
// 		-1.5,  1, 0,
// 		 1,  1, 0,
// 		-1, -1, 0,
// 	])
// })

new SimpleVertexColor().apply_to({
	vertices: new Float32Array([
		// FRONT
		-.5, -.5, .5,
		 .5,  .5, .5,
		-.5,  .5, .5,

		-.5, -.5, .5,
		 .5, -.5, .5,
		 .5,  .5, .5,

		// BACK
		-.5,  .5, -.5,
		 .5,  .5, -.5,
		-.5, -.5, -.5,

		 .5,  .5, -.5,
		 .5, -.5, -.5,
		-.5, -.5, -.5,

		// LEFT
		-.5, -.5, -.5,
		-.5, -.5,  .5,
		-.5,  .5, -.5,

		-.5,  .5,  .5,
		-.5,  .5, -.5,
		-.5, -.5,  .5,

		// RIGHT
		 .5,  .5, -.5,
		 .5,  .5,  .5,
		 .5, -.5,  .5,

		 .5, -.5,  .5,
		 .5, -.5, -.5,
		 .5,  .5, -.5,

		// TOP
		-.5,  .5, -.5,
		 .5,  .5,  .5,
		 .5,  .5, -.5,

		-.5,  .5, -.5,
		-.5,  .5,  .5,
		 .5,  .5,  .5,

		// BOTTOM
		-.5, -.5, -.5,
		 .5, -.5, -.5,
		 .5, -.5,  .5,

		-.5, -.5, -.5,
		 .5, -.5,  .5,
		-.5, -.5,  .5,
	])
})

const camera = Legion.add_entity()

Legion.add_system(new Update_Camera_and_Target_Positions())
Legion.add_component(camera, new MainCamera(0, .15, -1.5))
