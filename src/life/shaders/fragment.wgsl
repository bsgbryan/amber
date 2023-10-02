@fragment
fn main(input: VertexOutput) -> @location(0) vec4f {
  let c = input.cell / grid;
  return vec4f(c, 1 - c.x, 1); // (red, green, blue, alpha)
}