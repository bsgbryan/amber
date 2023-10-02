import { mat4, vec3 } from "gl-matrix"

const view_projection = (
  aspectRatio          = 1.0,
  // y: is negative because it's inverted because the gl-matrix
  // library is designed for OpenGL
  cameraPosition:     vec3 = [2, -2, -4],
  lookTargetPosition: vec3 = [0,  0,  0],
) => {
  const lookAtMatrix      = mat4.create()
  const perspectiveMatrix = mat4.create()
  const uniformMatrix     = mat4.create()
  const up                = vec3.fromValues(0, 1, 0)

  mat4.lookAt(lookAtMatrix,cameraPosition,lookTargetPosition,up)
  // TODO Support proper FoV setting (2nd arg here needs to not be hard-coded)
  mat4.perspective(perspectiveMatrix,100,aspectRatio,1,100)
  mat4.multiply(uniformMatrix,lookAtMatrix,uniformMatrix)
  mat4.multiply(uniformMatrix,perspectiveMatrix,uniformMatrix)

  return uniformMatrix
}

export const initialize = (
  device: GPUDevice,
  pipeline: GPURenderPipeline,
  size: { width: number, height: number },
  cameraPosition: vec3,
  lookTargetPosition: vec3,
): GPUBindGroup => {
  const vpMatrix  = view_projection(
    size.width / size.height,
    cameraPosition,
    lookTargetPosition,
  )

  const uniformBuffer = device.createBuffer({
    size: 64,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  })

  const uniformBindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [{
      binding: 0,
      resource: {
        buffer: uniformBuffer,
        offset: 0,
        size: 64
      }
    }]
  })

  device.queue.writeBuffer(uniformBuffer, 0, vpMatrix as ArrayBuffer)

  return uniformBindGroup
}