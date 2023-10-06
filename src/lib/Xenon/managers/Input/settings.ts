import { InputSettings } from "./types"

const dead_zone  = .1
const multiplier = {
  movement: 85,
  rotation:  5,
}
const limit = multiplier.movement

const movement = {
  X: {
    DeadZone:   dead_zone,
    Multiplier: multiplier.movement,
  },
  Y: {
    DeadZone:   dead_zone,
    Limit:      limit,
    Multiplier: multiplier.movement,
  },
  Z: {
    DeadZone:   dead_zone,
    Multiplier: multiplier.movement,
  },
}

const rotation = {
  X: {
    DeadZone:  dead_zone,
    Multiplier: multiplier.rotation,
  },
  Y: {
    Multiplier: multiplier.rotation,
  },
  Z: {
    DeadZone:  dead_zone,
    Multiplier: multiplier.rotation,
  },
}

const defaults = {
  Rotation: movement,
  Movement: rotation,
}

const Settings: InputSettings = {
  GamePad:  defaults,
  Keyboard: defaults,
}

export default Settings