export class VPM {
  static FieldOfView =   80
  static NearPlane   =     .1
  static FarPlane    = 2000
}

export const Input = {
  DeadZone: {
    X: .1,
    Y: .1,
  },
  AxisDeadZone: .1,
  Look: {
    X: {
      Multiplier: 85
    },
    Y: {
      Multiplier: 85
    },
    Z: {
      Multiplier: 85
    },
  },
  Move: {
    X: {
      Multiplier: 5
    },
    Y: {
      Multiplier: 5
    },
    Z: {
      Multiplier: 5
    },
  },
}

export class Camera {
  static VerticalLookLimit = 85
}