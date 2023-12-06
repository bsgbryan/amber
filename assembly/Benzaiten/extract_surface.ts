import {
  x_crossings,
  y_crossings,
  z_crossings,
} from "./crossings"

const x: u8 = 0,
      y: u8 = 1,
      z: u8 = 2

const half  = f32x4(.5, .5, .5, 0)

export function execute(
  shape:      u32,
  params:     Float32Array,
  vertices:   Float32Array,
  divisions:  u8,
  segments:   Uint8Array,
  space:      Float32Array,
  origin:     Float32Array,
  recursions: u8,
): Float32Array {
  const _sp         = f32x4(space   [x], space   [y], space   [z], 1),
        _se         = f32x4(segments[x], segments[y], segments[z], 1),
        _origin     = f32x4(origin[x], origin[y], origin[z], 0),
        _space      = f32x4(space [x], space [y], space [z], 0),
        _half_space = f32x4.mul(_space, half),
        start       = f32x4.sub(_origin, _half_space),
        extent      = f32x4.div(_sp, _se),
        level       = segments[x] * segments[z],
        iterations  = level       * segments[y]

  for (let i: u16 = 0; i < iterations; i++) {
    const current_x       =  i                 % segments[x],
          current_y       = (i / level)        % segments[y],
          current_z       = (i / segments[x])  % segments[z],
          _current        = f32x4(current_x, current_y, current_z, 0),
          _current_extent = f32x4.mul(_current, extent),
          _next           = f32x4.add(_current, f32x4.splat(1)),
          _next_extent    = f32x4.mul(_next, extent),
          _begin          = f32x4.add(start, _current_extent),
          _end            = f32x4.add(start, _next_extent),
          sides           = new Float32Array(6)

    sides[0] = /* left:   */ f32x4.extract_lane(_begin, x)
    sides[1] = /* bottom: */ f32x4.extract_lane(_begin, y)
    sides[2] = /* back:   */ f32x4.extract_lane(_begin, z)
    sides[3] = /* right:  */ f32x4.extract_lane(_end,   x)
    sides[4] = /* top:    */ f32x4.extract_lane(_end,   y)
    sides[5] = /* front:  */ f32x4.extract_lane(_end,   z)

    const x_crosses = x_crossings(shape, params, sides),
          y_crosses = y_crossings(shape, params, sides),
          z_crosses = z_crossings(shape, params, sides)

    if (x_crosses[4] || y_crosses[4] || z_crosses[4]) {
      if (recursions + 1 <= divisions) {
        const _sides          = f32x4(sides[x], sides[y], sides[z], 0),
              _half_extent    = f32x4.mul(extent, half),
              half_origin     = f32x4.add(_sides, _half_extent),
              recursed_space  = new Float32Array(3),
              recursed_origin = new Float32Array(3)

        recursed_space[x] = f32x4.extract_lane(extent, x)
        recursed_space[y] = f32x4.extract_lane(extent, y)
        recursed_space[z] = f32x4.extract_lane(extent, z)

        recursed_origin[x] = f32x4.extract_lane(half_origin, x)
        recursed_origin[y] = f32x4.extract_lane(half_origin, y)
        recursed_origin[z] = f32x4.extract_lane(half_origin, z)

        execute(
          shape,
          params,
          vertices,
          divisions,
          segments,
          recursed_space,
          recursed_origin,
          recursions + 1,
        )
      }
      else {
        const cube = [
          /* Vertex 0 */ x_crosses[0] === -1 || y_crosses[0] === -1 || z_crosses[0] === -1,
          /* Vertex 1 */ x_crosses[0] ===  1 || y_crosses[1] === -1 || z_crosses[1] === -1,
          /* Vertex 2 */ x_crosses[3] ===  1 || y_crosses[2] === -1 || z_crosses[1] ===  1,
          /* Vertex 3 */ x_crosses[3] === -1 || y_crosses[3] === -1 || z_crosses[0] ===  1,
          /* Vertex 4 */ x_crosses[1] === -1 || y_crosses[0] ===  1 || z_crosses[3] === -1,
          /* Vertex 5 */ x_crosses[1] ===  1 || y_crosses[1] ===  1 || z_crosses[2] === -1,
          /* Vertex 6 */ x_crosses[2] ===  1 || y_crosses[2] ===  1 || z_crosses[2] ===  1,
          /* Vertex 7 */ x_crosses[2] === -1 || y_crosses[3] ===  1 || z_crosses[3] ===  1,
        ],
        last = vertices.length - 1
        
        // BOTTOM
        if (sides[1] < 0) {
          // BOTTOM BACK RIGHT CORNER FACE
          if (cube[0] && cube[2] && cube[3]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]
          } // BOTTOM FRONT RIGHT CORNER FACE
          else if (cube[0] && cube[1] && cube[3]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]
          } // BOTTOM FRONT LEFT CORNER FACE
          else if (cube[0] && cube[1] && cube[2]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]
          } // BOTTOM BACK LEFT CORNER FACE
          else if (cube[1] && cube[2] && cube[3]) {
            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]
            
            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]
          }

          // BOTTOM FACE
          if (cube[0] && cube[1] && cube[2] && cube[3]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]
          } // BOTTOM-BACK FACE
          else if (cube[2] && cube[3] && cube[4] && cube[5]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]
          } // BOTTOM-RIGHT-BACK FACE
          else if (cube[3] && cube[4] && cube[6]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]
          } // BOTTOM-RIGHT-BACK FACE
          else if (cube[0] && cube[5] && cube[2]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]
          } // BOTTOM-RIGHT FACE
          else if (cube[0] && cube[3] && cube[5] && cube[6]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]
          } // BOTTOM-RIGHT-FRONT FACE
          else if (cube[1] && cube[6] && cube[3]) {
            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]
          } // BOTTOM-RIGHT-FRONT FACE
          else if (cube[0] && cube[5] && cube[7]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]
          } // BOTTOM-FRONT FACE
          else if (cube[0] && cube[1] && cube[6] && cube[7]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]
          } // BOTTOM-LEFT-FRONT FACE
          else if (cube[1] && cube[6] && cube[4]) {
            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]
          } // BOTTOM-LEFT-FRONT FACE
          else if (cube[0] && cube[2] && cube[7]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]
          }  // BOTTOM-LEFT FACE
          else if (cube[1] && cube[2] && cube[4] && cube[7]) {
            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]
          } // BOTTOM-LEFT-BACK FACE
          else if (cube[2] && cube[7] && cube[5]) {
            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]
          } // BOTTOM-LEFT-BACK FACE
          else if (cube[1] && cube[3] && cube[4]) {
            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]
          }
        }
        // TOP
        else if (sides[1] > 0) {
          // TOP BACK RIGHT CORNER FACE
          if (cube[4] && cube[7] && cube[6]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]
          } // TOP FRONT RIGHT CORNER FACE
          else if (cube[4] && cube[7] && cube[5]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]
          } // TOP FRONT LEFT CORNER FACE
          else if (cube[4] && cube[6] && cube[5]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]
          } // TOP BACK LEFT CORNER FACE
          else if (cube[5] && cube[7] && cube[6]) {
            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]
          }

          // TOP FACE
          if (cube[4] && cube[5] && cube[6] && cube[7]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]
          } // TOP-BACK FACE
          else if (cube[0] && cube[1] && cube[6] && cube[7]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]
          } // TOP-RIGHT-BACK FACE
          else if (cube[0] && cube[2] && cube[7]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]
          } // TOP-RIGHT-BACK FACE
          else if (cube[1] && cube[4] && cube[6]) {
            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]
          } // TOP-RIGHT FACE
          else if (cube[1] && cube[2] && cube[4] && cube[7]) {
            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]
          } // TOP-RIGHT-FRONT FACE
          else if (cube[2] && cube[5] && cube[7]) {
            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]
          } // TOP-RIGHT-FRONT FACE
          else if (cube[1] && cube[3] && cube[4]) {
            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]
          } // TOP-FRONT FACE
          else if (cube[2] && cube[3] && cube[4] && cube[5]) {
            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]
          } // TOP-LEFT-FRONT FACE
          else if (cube[0] && cube[2] && cube[5]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]
          } // TOP-LEFT-FRONT FACE
          else if (cube[3] && cube[4] && cube[6]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]
          } // TOP-LEFT FACE
          else if (cube[0] && cube[3] && cube[5] && cube[6]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]
          } // TOP-LEFT-BACK FACE
          else if (cube[0] && cube[7] && cube[5]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]
          } // TOP-LEFT-BACK FACE
          else if (cube[1] && cube[3] && cube[6]) {
            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]
          }
        }

        // BACK
        if (sides[2] < 0) {
          // BACK BOTTOM RIGHT CORNER FACE
          if (cube[0] && cube[4] && cube[5]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]
          } // BACK TOP RIGHT CORNER FACE
          else if (cube[0] && cube[4] && cube[1]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]
          } // BACK TOP LEFT CORNER FACE
          else if (cube[0] && cube[5] && cube[1]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]
          } // BACK BOTTOM LEFT CORNER FACE
          else if (cube[1] && cube[4] && cube[5]) {
            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]
          }

          // BACK FACE
          if (cube[0] && cube[1] && cube[4] && cube[5]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]
          }

          // BACK-RIGHT FACE
          if (sides[0] > 0) {
            if (cube[0] && cube[2] && cube[4] && cube[6] && sides[2] < 0) {
              vertices[vertices[last]++ as u32] = sides[0]
              vertices[vertices[last]++ as u32] = sides[1]
              vertices[vertices[last]++ as u32] = sides[2]

              vertices[vertices[last]++ as u32] = sides[0]
              vertices[vertices[last]++ as u32] = sides[4]
              vertices[vertices[last]++ as u32] = sides[2]

              vertices[vertices[last]++ as u32] = sides[3]
              vertices[vertices[last]++ as u32] = sides[1]
              vertices[vertices[last]++ as u32] = sides[5]

              vertices[vertices[last]++ as u32] = sides[3]
              vertices[vertices[last]++ as u32] = sides[1]
              vertices[vertices[last]++ as u32] = sides[5]

              vertices[vertices[last]++ as u32] = sides[0]
              vertices[vertices[last]++ as u32] = sides[4]
              vertices[vertices[last]++ as u32] = sides[2]

              vertices[vertices[last]++ as u32] = sides[3]
              vertices[vertices[last]++ as u32] = sides[4]
              vertices[vertices[last]++ as u32] = sides[5]
            }
          }
          // BACK-LEFT FACE
          else if (sides[2] < 0) {
            if (cube[1] && cube[3] && cube[5] && cube[7] && sides[2] < 0) {
              vertices[vertices[last]++ as u32] = sides[3]
              vertices[vertices[last]++ as u32] = sides[1]
              vertices[vertices[last]++ as u32] = sides[2]
  
              vertices[vertices[last]++ as u32] = sides[0]
              vertices[vertices[last]++ as u32] = sides[1]
              vertices[vertices[last]++ as u32] = sides[5]
  
              vertices[vertices[last]++ as u32] = sides[0]
              vertices[vertices[last]++ as u32] = sides[4]
              vertices[vertices[last]++ as u32] = sides[5]
  
              vertices[vertices[last]++ as u32] = sides[3]
              vertices[vertices[last]++ as u32] = sides[1]
              vertices[vertices[last]++ as u32] = sides[2]
  
              vertices[vertices[last]++ as u32] = sides[0]
              vertices[vertices[last]++ as u32] = sides[4]
              vertices[vertices[last]++ as u32] = sides[5]
  
              vertices[vertices[last]++ as u32] = sides[3]
              vertices[vertices[last]++ as u32] = sides[4]
              vertices[vertices[last]++ as u32] = sides[2]
            }
          }
        }
        // FRONT
        else if (sides[2] > 0) {
          // FRONT BOTTOM RIGHT CORNER FACE
          if (cube[3] && cube[6] && cube[7]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]
          } // FRONT TOP RIGHT CORNER FACE
          else if (cube[2] && cube[7] && cube[3]) {
            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]
          } // FRONT TOP LEFT CORNER FACE
          else if (cube[2] && cube[6] && cube[3]) {
            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]
          } // FRONT BOTTOM LEFT CORNER FACE
          else if (cube[2] && cube[6] && cube[7]) {
            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]
          }

          // FRONT FACE
          if (cube[2] && cube[3] && cube[6] && cube[7]) {
            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]
          }

          // RIGHT-FRONT
          if (sides[0] > 0) {
            if (cube[1] && cube[3] && cube[5] && cube[7] && sides[2] >= 0) {
              vertices[vertices[last]++ as u32] = sides[3]
              vertices[vertices[last]++ as u32] = sides[1]
              vertices[vertices[last]++ as u32] = sides[2]
  
              vertices[vertices[last]++ as u32] = sides[0]
              vertices[vertices[last]++ as u32] = sides[4]
              vertices[vertices[last]++ as u32] = sides[5]
  
              vertices[vertices[last]++ as u32] = sides[0]
              vertices[vertices[last]++ as u32] = sides[1]
              vertices[vertices[last]++ as u32] = sides[5]
  
              vertices[vertices[last]++ as u32] = sides[3]
              vertices[vertices[last]++ as u32] = sides[1]
              vertices[vertices[last]++ as u32] = sides[2]
  
              vertices[vertices[last]++ as u32] = sides[3]
              vertices[vertices[last]++ as u32] = sides[4]
              vertices[vertices[last]++ as u32] = sides[2]
  
              vertices[vertices[last]++ as u32] = sides[0]
              vertices[vertices[last]++ as u32] = sides[4]
              vertices[vertices[last]++ as u32] = sides[5]
            }
          }
          // FRONT-LEFT
          else if (sides[0] < 0) {
            if (cube[0] && cube[2] && cube[4] && cube[6] && sides[2] >= 0) {
              vertices[vertices[last]++ as u32] = sides[0]
              vertices[vertices[last]++ as u32] = sides[1]
              vertices[vertices[last]++ as u32] = sides[2]
  
              vertices[vertices[last]++ as u32] = sides[3]
              vertices[vertices[last]++ as u32] = sides[1]
              vertices[vertices[last]++ as u32] = sides[5]
  
              vertices[vertices[last]++ as u32] = sides[3]
              vertices[vertices[last]++ as u32] = sides[4]
              vertices[vertices[last]++ as u32] = sides[5]
  
              vertices[vertices[last]++ as u32] = sides[0]
              vertices[vertices[last]++ as u32] = sides[1]
              vertices[vertices[last]++ as u32] = sides[2]
  
              vertices[vertices[last]++ as u32] = sides[3]
              vertices[vertices[last]++ as u32] = sides[4]
              vertices[vertices[last]++ as u32] = sides[5]
  
              vertices[vertices[last]++ as u32] = sides[0]
              vertices[vertices[last]++ as u32] = sides[4]
              vertices[vertices[last]++ as u32] = sides[2]
            }
          }
        }

        // LEFT
        if (sides[0] < 0) {
          // LEFT BOTTOM RIGHT CORNER FACE
          if (cube[0] && cube[7] && cube[4]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]
          } // LEFT TOP RIGHT CORNER FACE
          else if (cube[0] && cube[3] && cube[4]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]
          } // LEFT TOP LEFT CORNER FACE
          else if (cube[0] && cube[3] && cube[7]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]
          } // LEFT BOTTOM LEFT CORNER FACE
          else if (cube[3] && cube[7] && cube[4]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]
          }

          // LEFT FACE
          if (cube[0] && cube[3] && cube[4] && cube[7]) {
            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[0]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]
          }
        }
        // RIGHT
        else if (sides[0] > 0) {
          // RIGHT BOTTOM RIGHT CORNER FACE
          if (cube[2] && cube[5] && cube[6]) {
            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]
          } // RIGHT TOP RIGHT CORNER FACE
          else if (cube[1] && cube[6] && cube[2]) {
            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]
          } // RIGHT TOP LEFT CORNER FACE
          else if (cube[1] && cube[5] && cube[2]) {
            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]
          } // RIGHT BOTTOM LEFT CORNER FACE
          else if (cube[1] && cube[5] && cube[6]) {
            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]
          }

          // RIGHT FACE
          if (cube[1] && cube[2] && cube[5] && cube[6]) {
            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[2]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[4]
            vertices[vertices[last]++ as u32] = sides[5]

            vertices[vertices[last]++ as u32] = sides[3]
            vertices[vertices[last]++ as u32] = sides[1]
            vertices[vertices[last]++ as u32] = sides[5]
          }
        }
      }
    } 
  }

  return recursions === 1 ?
    vertices.subarray(0, vertices[vertices.length - 1] as u32)
    :
    new Float32Array(0)
}