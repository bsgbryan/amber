@vertex
fn main(
  @location(0) pos: vec2f,
  @builtin(instance_index) instance: u32
) -> VertexOutput {
  let i          = f32(instance);
  let cell       = vec2f(i % grid.x, floor(i / grid.x));
  let state      = f32(cellState[instance]);
  let cellOffset = cell / grid * 2;
  let gridPos    = ((pos * state + 1) / grid) - 1 + cellOffset;

  var output: VertexOutput;
  output.pos = vec4f(gridPos, 0, 1);
  output.cell = cell;

  return output;
}