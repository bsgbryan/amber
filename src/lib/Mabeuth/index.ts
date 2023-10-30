import Xenon from "@/Xenon"

import {
  KEY,
  MOUSE,
  MOUSE_BUTTON_NAMES,
} from "@/Mabeuth/CONSTANTS"

import {
  Document,
  EventHandler,
  HTMLCanvasElement,
  KeyDownEventDetails,
  KeyUpEventDetails,
  KeyboardEvent,
  MouseClickEventDetails,
  MouseEvent,
  MouseMoveEventDetails,
  MouseWheelEventDetails,
  RenderDimensions,
  WheelEvent,
  Window,
} from "@/Mabeuth/types"

import Controller from "@/Mabeuth/Controller"

declare const document: Document
declare const window:   Window

declare function requestAnimationFrame(callback: () => void): void

declare class ResizeObserver {
  constructor(callback: () => void)
  observe(element: HTMLCanvasElement)
}

export default class Mabueth {
  static #target: HTMLCanvasElement

  static #controller: Controller

  static get controller() {
    return this.#controller
  }

  static get dimensions(): RenderDimensions {
    return {
      height: this.#target.height,
      width:  this.#target.width,
    }
  }

  static get context() { return this.#target?.getContext('webgpu') }

  static init(target = 'main-render-target') {
    this.#target = document.getElementById(target) as HTMLCanvasElement

    this.#target.addEventListener(MOUSE.CLICK, async () => {
      if (!document.pointerLockElement) {
        // @ts-ignore
        await this.#target.requestPointerLock({
          unadjustedMovement: true,
        })
      }
    })

    new ResizeObserver(() => {
      this.#target.height = window.innerHeight
      this.#target.width  = window.innerWidth

      Xenon.refresh_render_target_size_and_scale()
    }).
      observe(document.getElementById(target))

    this.#controller = new Controller()
  }

  static #extract_key_down_details(event: Event): KeyDownEventDetails {
    return {
      key:       (event as KeyboardEvent).key,
      modifiers: []
    }
  }

  static #extract_key_up_details(event: Event): KeyUpEventDetails {
    return { key: (event as KeyboardEvent).key }
  }

  static #extract_mouse_click_details(event: Event): MouseClickEventDetails {
    const e = event as MouseEvent,
          b = [0, 1, 2, 4, 8, 16]

    return {
      x:         e.x,
      y:         e.y,
      buttons:   b.map(p => MOUSE_BUTTON_NAMES[e.buttons | p]),
      modifiers: []
    }
  }

  static #extract_mouse_move_details(event: Event) {
    const e = event as MouseEvent

    return {
      x: e.movementX,
      y: e.movementY,
    }
  }

  static #extract_mouse_wheel_details(event: Event): MouseWheelEventDetails {
    const e = event as WheelEvent

    return {
      x: e.deltaX,
      y: e.deltaY,
      z: e.deltaZ,
    }
  }

  static set on_key_down(handler: EventHandler<KeyDownEventDetails>) {
    document.addEventListener(KEY.DOWN, e => handler(this.#extract_key_down_details(e)))
  }

  static set on_key_up(handler: EventHandler<KeyUpEventDetails>) {
    document.addEventListener(KEY.UP, e => handler(this.#extract_key_up_details(e)))
  }

  static set on_mouse_wheel(handler: EventHandler<MouseWheelEventDetails>) {
    document.addEventListener(MOUSE.WHEEL, e => handler(this.#extract_mouse_wheel_details(e)))
  }

  static set on_mouse_click(handler: EventHandler<MouseClickEventDetails>) {
    document.addEventListener(MOUSE.WHEEL, e => handler(this.#extract_mouse_click_details(e)))
  }

  static set on_mouse_move(handler: EventHandler<MouseMoveEventDetails>) {
    document.addEventListener(MOUSE.MOVE, e => {
      if (document.pointerLockElement) handler(this.#extract_mouse_move_details(e))
    })
  }

  static set on_tick(callback: () => void) {
    const loop = () => {
      callback()
      requestAnimationFrame(loop)
    }

    requestAnimationFrame(loop)
  }
}