struct Uniforms {
  mvpMatrix : mat4x4f,
};

@binding(0) @group(0) var<uniform> uniforms : Uniforms;

struct Output {
  @builtin(position) Position:  vec4f,
  @location(0)       fragColor: vec4f,
};

@vertex
fn main(
  @location(0) pos: vec4f
) -> Output {
  var out: Output;
  out.Position = uniforms.mvpMatrix * pos;
  out.fragColor = 0.5 * (pos + vec4(1.0));
  return out;
}