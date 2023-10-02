import { createEffect, type Component } from 'solid-js'

import {
  createAndWriteBuffer,
} from '../lib/buffers'

import preamble from './shaders/preamble.wgsl?raw'
import compute  from './shaders/compute.wgsl?raw'
import vertex   from './shaders/vertex.wgsl?raw'
import fragment from './shaders/fragment.wgsl?raw'

import styles from './style.module.css'

// const createAndWriteBuffer = (
//   device:   GPUDevice,
//   vertices: Float32Array,
// ): GPUBuffer => {
//   const buffer = device.createBuffer({
//     label: "Cell vertices",
//     size: vertices.byteLength,
//     usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
//   })

//   device.queue.writeBuffer(buffer, /*bufferOffset=*/0, vertices)

//   return buffer
// }

const create2DVertexBufferLayout = (
  position: number,
): GPUVertexBufferLayout => {
  return {
    arrayStride: 8,
    attributes: [{
      format: "float32x2",
      offset: 0,
      shaderLocation: position, // Position, see vertex shader
    }],
  } as GPUVertexBufferLayout
}

const createBindGroupLayout = (
  device: GPUDevice
): GPUBindGroupLayout => {
  return device.createBindGroupLayout({
    label: "Cell Bind Group Layout",
    entries: [{
      binding: 0,
      visibility: GPUShaderStage.COMPUTE | GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
      buffer: {} // Grid uniform buffer
    }, {
      binding: 1,
      visibility: GPUShaderStage.COMPUTE | GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
      buffer: { type: "read-only-storage"} // Cell state input buffer
    }, {
      binding: 2,
      visibility: GPUShaderStage.COMPUTE,
      buffer: { type: "storage"} // Cell state output buffer
    }]
  })
}

const createPipelineLayout = (
  device: GPUDevice
): GPUPipelineLayout => {
  return device.createPipelineLayout({
    label: "Cell Pipeline Layout",
    bindGroupLayouts: [ createBindGroupLayout(device) ],
  })
}

const createRenderPipeline = (
  device: GPUDevice,
  format: GPUTextureFormat,
  buffers: Iterable<GPUVertexBufferLayout | null>,
  layout: GPUPipelineLayout,
): GPURenderPipeline => {
  return device.createRenderPipeline({
    label: "Cell pipeline",
    layout,
    vertex: {
      module: device.createShaderModule({
        label: "Cell vertex shader",
        code: `${preamble}\n\n${vertex}`
      }),
      entryPoint: 'main',
      buffers,
    },
    fragment: {
      module: device.createShaderModule({
        label: "Cell fragment shader",
        code: `${preamble}\n\n${fragment}`
      }),
      entryPoint: 'main',
      targets: [{
        format: format
      }]
    }
  })
}

const createComputePipeline = (
  device: GPUDevice,
  workgroup_size: number,
  layout: GPUPipelineLayout,
): GPUComputePipeline => {
  return device.createComputePipeline({
    label: "Simulation pipeline",
    layout,
    compute: {
      module: device.createShaderModule({
        label: "Cell compute shader",
        code:   compute.replaceAll('${WORKGROUP_SIZE}', String(workgroup_size))
      }),
      entryPoint: 'main',
    }
  })
}

const createBindGroups = (
  device: GPUDevice,
  grid_size: number,
): Array<GPUBindGroup> => {
  const uniformArray = new Float32Array([grid_size, grid_size])
  const uniformBuffer = device.createBuffer({
    label: "Grid Uniforms",
    size: uniformArray.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  })

  device.queue.writeBuffer(uniformBuffer, 0, uniformArray)

  const cellStateArray = new Uint32Array(grid_size * grid_size);

  const cellStateStorage = [
    device.createBuffer({
      label: "Cell State A",
      size: cellStateArray.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    }),
    device.createBuffer({
      label: "Cell State B",
      size: cellStateArray.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    })
  ]

  for (let i = 0; i < cellStateArray.length; ++i)
    cellStateArray[i] = Math.random() > 0.6 ? 1 : 0

  device.queue.writeBuffer(cellStateStorage[0], 0, cellStateArray)

  for (let i = 0; i < cellStateArray.length; i++)
    cellStateArray[i] = Math.random() <= 0.6 ? 1 : 0

  device.queue.writeBuffer(cellStateStorage[1], 0, cellStateArray)

  const layout = createBindGroupLayout(device)

  return [
    device.createBindGroup({
      label: "Cell renderer bind group A",
      layout,
      entries: [{
        binding: 0,
        resource: { buffer: uniformBuffer }
      }, {
        binding: 1,
        resource: { buffer: cellStateStorage[0] }
      }, {
        binding: 2, // New Entry
        resource: { buffer: cellStateStorage[1] }
      }],
    }),
    device.createBindGroup({
      label: "Cell renderer bind group B",
      layout,
      entries: [{
        binding: 0,
        resource: { buffer: uniformBuffer }
      }, {
        binding: 1,
        resource: { buffer: cellStateStorage[1] }
      }, {
        binding: 2, // New Entry
        resource: { buffer: cellStateStorage[0] }
      }],
    })
  ]
}

const Life: Component = () => {
  createEffect(async () => {
    const target = document.getElementById('main-render-target') as HTMLCanvasElement

    const adapter = await navigator.gpu.requestAdapter()
    if (!adapter) throw new Error("No appropriate GPUAdapter found.")

    const device  = await adapter.requestDevice()
    const context = target.getContext('webgpu')

    if (context) {
      const canvasFormat = navigator.gpu.getPreferredCanvasFormat()
      context.configure({
        device: device,
        format: canvasFormat,
      })

      const GRID_SIZE      = 64
      const WORKGROUP_SIZE = 8
      let   step           = 0

      const vertices = new Float32Array([
      //   X,    Y,
        -0.8, -0.8, // Triangle 1 (Blue)
         0.8, -0.8,
         0.8,  0.8,
        -0.8, -0.8, // Triangle 2 (Red)
         0.8,  0.8,
        -0.8,  0.8,
      ])

      const buffer = createAndWriteBuffer(device, vertices)

      const vertexBufferLayout = create2DVertexBufferLayout(0)
      const layout             = createPipelineLayout(device)
      const renderPipeline     = createRenderPipeline(device, canvasFormat, [vertexBufferLayout], layout)
      const simulationPipeline = createComputePipeline(device, WORKGROUP_SIZE, layout)
      const bindGroups         = createBindGroups(device, GRID_SIZE)

      function tick() {
        const encoder     = device.createCommandEncoder()
        const computePass = encoder.beginComputePass()

        computePass.setPipeline(simulationPipeline)
        computePass.setBindGroup(0, bindGroups[step % 2])

        const workgroupCount = Math.ceil(GRID_SIZE / WORKGROUP_SIZE)
        computePass.dispatchWorkgroups(workgroupCount, workgroupCount)

        computePass.end()

        step++;

        const pass = encoder.beginRenderPass({
          // @ts-ignore
          colorAttachments: [{
            clearValue: { r: 0, g: 0, b: 0, a: 1 },
            loadOp: "clear",
            storeOp: "store",
            view: context?.getCurrentTexture().createView(),
          }]
        })
        pass.setPipeline(renderPipeline)
        pass.setVertexBuffer(0, buffer)
        pass.setBindGroup(0, bindGroups[step % 2])
        pass.draw(vertices.length / 2, GRID_SIZE * GRID_SIZE) // 6 vertices
        pass.end()

        device.queue.submit([encoder.finish()])

        requestAnimationFrame(tick)
      }

      requestAnimationFrame(tick)
    }
  })

  return <>
    <header class={styles.header}>
      <p>I can haz WebGPU? {navigator.gpu ? '🤘🏻' : '😞'}</p>
    </header>
    <canvas id="main-render-target" width={512} height={512} />
  </>
}

export default Life
