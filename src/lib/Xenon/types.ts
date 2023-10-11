export type RenderEncoding = {
  vertices:  number
  pipeline:  GPURenderPipeline
  buffers:   Map<number, number>
}

export type InstancedRenderEncoding = RenderEncoding & {
  instances: number
}

export type ShadersSources = {
  compute?:  string,
  fragment?: string,
  vertex?:   string,
}

export type ShaderBuffers = {
  vertex?: {
    layouts: Array<GPUVertexBufferLayout>
  }
}

export type ViewPort = {
  height: number
  width:  number
}