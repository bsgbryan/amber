import { InputSettings } from "@/Finesse/types"

const dead_zone  = .1
const multiplier = {
  augment:   0.1,
  movement:  0.5,
  rotation: 85.0,
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
    DeadZone:   dead_zone,
    Multiplier: multiplier.movement,
  },
  Y: {
    DeadZone:   dead_zone,
    Multiplier: multiplier.movement,
  },
  Z: {
    DeadZone:   dead_zone,
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
    },
    Augment: {
      Y: {
        Multiplier: multiplier.augment,
      }
    }
  },
  Keyboard: {
    ...defaults,
    Movement: {
      ...defaults.Movement,
      Bindings: {
        Backward: 's',
        Down:     'z',
        Forward:  'w',
        Left:     'a',
        Right:    'd',
        Up:       'q',
      }
    },
    Augment: {
      Y: {
        Multiplier: multiplier.augment,
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
    },
    Augment: {
      Y: {
        Multiplier: multiplier.augment,
      }
    }
  }
}

export default Settings