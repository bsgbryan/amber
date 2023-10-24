struct Uniforms {
  mvpMatrix:  mat4x4f,
  resolution: vec2f,
};

@binding(0) @group(0) var<uniform> uniforms : Uniforms;

struct Input {
  @location(0) position: vec4f,
  @location(1) size:     f32,
  @location(2) color:    vec4f,
}

struct Output {
  @builtin(position) Position: vec4f,
  @location(0)       color:    vec4f,
};

@vertex
fn main(
                         input:       Input,
  @builtin(vertex_index) vertexIndex: u32,
) -> Output {
  let quadPos = array(
    vec2f(0, 0),
    vec2f(1, 0),
    vec2f(0, 1),
    vec2f(0, 1),
    vec2f(1, 0),
    vec2f(1, 1),
  );

  var out: Output;

  let pos = (quadPos[vertexIndex] - 0.5) * input.size * 2.0 / uniforms.resolution;

  out.Position = uniforms.mvpMatrix * input.position + vec4f(pos, 0, 0);
  out.color    = input.color * vec4f(input.position.xyz + 0.5 * 0.5, 1);

  return out;
}