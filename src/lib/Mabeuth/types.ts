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

export interface MouseClickEventDetails extends EventDetails {
  x:         number
  y:         number
  buttons:   Array<string>
  modifiers: Array<string>
}

export type EventHandler<T extends EventDetails> = (details: T) => void