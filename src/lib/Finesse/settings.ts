import { InputSettings } from "./types"

const dead_zone  = .1
const multiplier = {
  movement: 5,
  rotation: 85,
}
const limit = multiplier.rotation

const rotation = {
  ActiveThreshhold: dead_zone,
  X: {
    DeadZone:   dead_zone,
    Multiplier: multiplier.rotation,
  },
  Y: {
    DeadZone:   dead_zone,
    Limit:      limit,
    Multiplier: multiplier.rotation,
  },
  Z: {
    DeadZone:   dead_zone,
    Multiplier: multiplier.rotation,
  },
}

const movement = {
  ActiveThreshhold: dead_zone,
  X: {
    DeadZone:  dead_zone,
    Multiplier: multiplier.movement,
  },
  Y: {
    Multiplier: multiplier.movement,
  },
  Z: {
    DeadZone:  dead_zone,
    Multiplier: multiplier.movement,
  },
}

const defaults = {
  Rotation: rotation,
  Movement: movement,
}

const Settings: InputSettings = {
  GamePad:  {
    ...defaults,
    Movement: {
      ...defaults.Movement,
    }
  },
  Keyboard: {
    ...defaults,
    Movement: {
      ...defaults.Movement,
      Bindings: {
        Backward: 's',
        Forward:  'w',
        Left:     'a',
        Right:    'd',
      }
    }
  },
  Mouse: {
    Rotation: {
      X: {
        Multiplier: 5,
      },
      Y: {
        Multiplier: 5,
        Limit:      limit,
      }
    }
  }
}

export default Settings