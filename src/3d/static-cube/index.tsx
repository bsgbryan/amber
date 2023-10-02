import {
  type Component,
  createEffect,
} from 'solid-js'

import { initialize           } from '../../lib/camera'
import { createAndWriteBuffer } from '../../lib/buffers'

import vertex   from './shaders/vertex.wgsl?raw'
import fragment from './shaders/fragment.wgsl?raw'

import {
  colors,
  positions,
} from './data'
import { vec3 } from 'gl-matrix'

const StaticCube: Component = () => {
  createEffect(async () => {
    const target = document.getElementById('main-render-target') as HTMLCanvasElement

    const adapter = await navigator.gpu.requestAdapter()
    if (!adapter) throw new Error('No appropriate GPUAdapter found.')

    const device  = await adapter.requestDevice()
    const context = target.getContext('webgpu')

    if (context) {
      const canvasFormat = navigator.gpu.getPreferredCanvasFormat()
      context.configure({
        device: device,
        format: canvasFormat,
      })

      const size = {
        width:  target.clientWidth,
        height: target.clientHeight,
      }

      let timestamp = 0

      const render = () => {
        timestamp = performance.now()

        const pipeline = device.createRenderPipeline({
          label: 'Cube render pipeline',
          layout: 'auto',
          vertex: {
            module: device.createShaderModule({                    
              code: vertex
            }),
            entryPoint: 'main',
            buffers:[{
              arrayStride: 12,
              attributes: [{
                shaderLocation: 0,
                format: 'float32x3',
                offset: 0
              }]
            }, {
              arrayStride: 12,
              attributes: [{
                shaderLocation: 1,
                format: 'float32x3',
                offset: 0
              }]
            }]
          },
          fragment: {
              module: device.createShaderModule({                    
                code: fragment
              }),
              entryPoint: 'main',
              targets: [{ format: canvasFormat }]
          },
          primitive:{
            cullMode: 'back'
          },
          depthStencil: {
            format: 'depth24plus',
            depthWriteEnabled: true,
            depthCompare: 'less'
          }
        })
  
        const camera = initialize(
          device,
          pipeline,
          size,
          vec3.fromValues(0, -2 + -(Math.sin(performance.now() * .001) * 10), -10),
          vec3.fromValues(0, 0, 0)
        )
  
        const vertexBuffer = createAndWriteBuffer(device, positions)
        const colorBuffer  = createAndWriteBuffer(device, colors)
  
        const commandEncoder = device.createCommandEncoder()
        const renderPass = commandEncoder.beginRenderPass({
          colorAttachments: [{
            view: context.getCurrentTexture().createView(),
            clearValue: { r: 0.2, g: 0.247, b: 0.314, a: 1.0 },
            loadOp: 'clear',
            storeOp: 'store'
          }],
          depthStencilAttachment: {
            view: device.createTexture({
              size: [size.width, size.height, 1],
              format: 'depth24plus',
              usage: GPUTextureUsage.RENDER_ATTACHMENT
            }).createView(),
            depthClearValue: 1.0,
            depthLoadOp:  'clear',
            depthStoreOp: 'store',
          }
        })
        renderPass.setPipeline(pipeline)
        renderPass.setVertexBuffer(0, vertexBuffer)
        renderPass.setVertexBuffer(1, colorBuffer)
        renderPass.setBindGroup(0, camera)
        renderPass.draw(positions.length / 3)
        renderPass.end()
  
        device.queue.submit([commandEncoder.finish()])

        requestAnimationFrame(render)
      }

      requestAnimationFrame(render)
    }
  })

  return <div>
    <canvas id="main-render-target" width={512} height={512} />
  </div>
}

export default StaticCube