export type RenderPass = {
  instances: number,
  vertices:  number,
  pipeline:  GPURenderPipeline,
  buffers:   Map<number, number>,
}

export type ShadersSources = {
  compute?:  string,
  fragment?: string,
  vertex?:   string,
}

export type ShaderBuffers = {
  vertex?: {
    slot_map: Map<number, number>
    layouts:  Array<GPUVertexBufferLayout>
  }
}

export type ViewPort = {
  height: number
  width:  number
}