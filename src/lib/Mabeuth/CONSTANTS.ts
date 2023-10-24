import {
  KeyEventDictionary,
  MouseButtonNameDictionary,
  MouseEventDictionary,
} from "@/Mabeuth/types"

export const KEY: KeyEventDictionary = {
  DOWN: 'keydown',
  UP:   'keyup',
}

export const MOUSE: MouseEventDictionary = {
  CLICK: 'click',
  MOVE:  'mousemove',
  WHEEL: 'wheel',
}

export const MOUSE_BUTTON_NAMES: MouseButtonNameDictionary = {
  0x00001: 'primary',
  0x00010: 'seconday',
  0x00100: 'tertiary',
  0x01000: 'fourth',
  0x10000: 'fifth',
}