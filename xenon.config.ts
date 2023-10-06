export default {
  Input: {
    GamePad: {
      DeadZone: {
        X: .1,
        Y: .1,
      },
      Look: {
        X: {
          DeadZone:     .1,
          Multiplier: 85
        },
        Y: {
          DeadZone:     .1,
          Multiplier: 85
        },
        Z: {
          Multiplier: 85
        },
      },
      Move: {
        X: {
          DeadZone:    .1,
          Multiplier: 5
        },
        Y: {
          Multiplier: 5
        },
        Z: {
          DeadZone:    .1,
          Multiplier: 5
        },
      },
    }
  }
}