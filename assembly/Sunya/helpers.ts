export function degrees_to_radians(input: f32): f32 { return input * (Math.PI / 180) as f32 }

export function UP(): Float32Array {
  const UP = new Float32Array(3)

  UP[0] = 0.0
  UP[1] = 1.0
  UP[2] = 0.0

  return UP
}