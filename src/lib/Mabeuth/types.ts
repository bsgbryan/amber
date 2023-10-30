export type EventName =
  'keydown'   |
  'keyup'     |
  'click'     |
  'mousemove' |
  'wheel'

export type EventNameDictionary = {
  KeyDown:    'keydown'
  KeyUp:      'keyup'
  MouseClick: 'click'
  MouseMove:  'mousemove'
  MouseWheel: 'wheel'
}

export type KeyEventDictionary = {
  DOWN: EventNameDictionary['KeyDown']
  UP:   EventNameDictionary['KeyUp'  ]
}

export type MouseEventDictionary = {
  CLICK: EventNameDictionary['MouseClick']
  MOVE:  EventNameDictionary['MouseMove' ]
  WHEEL: EventNameDictionary['MouseWheel']
}

export type MouseButtonNameDictionary = {
  [NAME: number]: string
}

export interface EventDetails {}

export interface KeyDownEventDetails extends EventDetails {
  key:       string
  modifiers: Array<string>
}

export interface KeyUpEventDetails extends EventDetails {
  key: string
}

export interface MouseWheelEventDetails extends EventDetails {
  x: number
  y: number
  z: number
}

export interface MouseMoveEventDetails extends EventDetails {
  x: number
  y: number
}

export interface MouseClickEventDetails extends EventDetails {
  x:         number
  y:         number
  buttons:   Array<string>
  modifiers: Array<string>
}

export type EventHandler<T extends EventDetails> = (details: T) => void

export type RenderDimensions = {
  height: number
  width:  number
}

/**
 * START: html types
 */

type EventHandlerReturn   = Promise<undefined | void> | void
type EventHandlerCallback = (event?: Event) => EventHandlerReturn

export type HTMLCanvasElement = {
  addEventListener:   (event: EventName, callback: EventHandlerCallback) => void
  getContext:         (name: 'webgpu') => GPUCanvasContext
  requestPointerLock: (options: {unadjustedMovement: boolean}) => EventHandlerReturn
  height: number
  width:  number
}

export type Document = {
  addEventListener: (event: EventName, callback: EventHandlerCallback) => void
  getElementById: (id: string) => HTMLCanvasElement
  pointerLockElement?: HTMLCanvasElement
}

export type Window = {
  innerHeight: number
  innerWidth:  number
}

type Gamepad = {
  axes: Array<number>
}

export type Navigator = {
  getGamepads: () => Array<Gamepad>
}

export interface KeyboardEvent extends Event {
  key: string
}

export interface MouseEvent extends Event {
  x:         number
  y:         number
  buttons:   number
  movementX: number
  movementY: number
}

export interface WheelEvent extends Event {
  deltaX: number
  deltaY: number
  deltaZ: number
}

/**
 * END: html types
 */