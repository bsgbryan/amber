export const createAndWriteBuffer = (
  device: GPUDevice,
  items:  Float32Array,
  offset = 0,
  usage = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
): GPUBuffer => {
  const buffer = device.createBuffer({
    size: items.byteLength,
    usage,
  })

  device.queue.writeBuffer(buffer, offset, items)

  return buffer
}