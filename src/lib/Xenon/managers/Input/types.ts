export type MovementAxes = {
  x: number
  z: number
}

export type RotationAxes = {
  x: number
  y: number
}

type HasMultiplier = {
  Multiplier: number
}

type HasMultiplierAndHeadZone = HasMultiplier & {
  DeadZone: number
}

type HasMultiplierAndHeadZoneAndLimit = HasMultiplierAndHeadZone & {
  Limit: number
}

type RotationSettings = {
  X: HasMultiplierAndHeadZone
  Y: HasMultiplierAndHeadZoneAndLimit
  Z: HasMultiplierAndHeadZone
}

type MovementSettings = {
  X: HasMultiplierAndHeadZone
  Y: HasMultiplier
  Z: HasMultiplierAndHeadZone
}

type GamePadSetting = {
  Rotation: RotationSettings
  Movement: MovementSettings
}

type KeyboardSettings = {
  Rotation: RotationSettings
  Movement: MovementSettings
}

export type InputSettings = {
  GamePad:  GamePadSetting
  Keyboard: KeyboardSettings
}