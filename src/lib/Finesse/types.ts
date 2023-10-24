export type MovementAxes = {
  x: number
  y: number
  z: number
}

export type RotationAxes = {
  x: number
  y: number
}

type HasMultiplier = {
  Multiplier: number
}

type HasMultiplierAndDeadZone = HasMultiplier & {
  DeadZone: number
}

type HasMultiplierAndHeadZoneAndLimit = HasMultiplierAndDeadZone & {
  Limit: number
}

type CoreSettings = {
  ActiveThreshhold: number
  X:                HasMultiplierAndDeadZone
  Z:                HasMultiplierAndDeadZone
}

type RotationSettings = CoreSettings & {
  Y: HasMultiplierAndHeadZoneAndLimit
}

type MovementSettings = CoreSettings & {
  Y: HasMultiplier
}

type GamePadSetting = {
  Rotation: RotationSettings
  Movement: MovementSettings
  Augment: {
    Y: HasMultiplier
  }
}

type KeyboardSettings = {
  Rotation: RotationSettings
  Movement: MovementSettings & {
    Bindings: {
      Backward: string
      Down:     string
      Forward:  string
      Left:     string
      Right:    string
      Up:       string
    }
  }
  Augment: {
    Y: HasMultiplier
  }
}

type MouseSettings = {
  Rotation: {
    X: HasMultiplier
    Y: HasMultiplier & {
      Limit: number
    }
  }
}

export type InputSettings = {
  GamePad:  GamePadSetting
  Keyboard: KeyboardSettings
  Mouse:    MouseSettings
}

export type MovementMode = 'GamePad' | 'Keyboard'
export type RotationMode = MovementMode | 'Mouse'