import { VertexBufferLayout } from "../../lib/Xenon/helpers"

import { Component } from "../../lib/Legion"

import Xenon from "../../lib/Xenon"

import vertex   from '../shaders/vertex.wgsl?raw'
import fragment from '../shaders/fragment.wgsl?raw'

export default class SimpleVertexColor extends Component {
  constructor() {
    super()

    const buffer_layouts = [
      VertexBufferLayout(0, 0), // Position
    ]

    Xenon.register_render_pipeline(
      'Example',
      { vertex, fragment },
      { vertex: buffer_layouts }
    )
  }
}