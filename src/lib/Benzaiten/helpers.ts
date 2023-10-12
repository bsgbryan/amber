import { Vector3 } from "../Sunya/types"

import { vec3 } from "../Sunya"

import { Shape } from "./shapes/types"

import {
  Sides,
  TestResult,
} from "./types"

const x = ['left', 'right' ],
      y = ['top',  'bottom'],
      z = ['back', 'front' ]

const crosses = (
  a: number,
  b: number,
): boolean => {
  return (a > 0 && b < 0) ||
         (a < 0 && b > 0) ||
          a === 0         ||
          b === 0
}

const zero = vec3.zero(),
      v3   = vec3.create

const surface_point = (
  x: number,
  y: number,
  z: number,
): Vector3 =>
  vec3.multiply(
    v3(.475, .475, .475),
    vec3.add(
      zero,
      vec3.normalize(
        vec3.subtract(
          v3(x, y, z),
          zero,
        )
      )
    )
  )

export const needs_x_recursion = (
  distance: Shape,
  sides:    Sides,
): boolean => {
  for (let i = 0; i < 4; i++) {
    const Y = sides[y[i % 2]],
          Z = sides[z[Math.floor(i / 2)]],
          L = sides[x[0]],
          R = sides[x[1]],
          a = distance(L, Y, Z)

    if (crosses(a, distance(R, Y, Z))) return true
  }
}

export const needs_y_recursion = (
  distance: Shape,
  sides:    Sides,
): boolean => {
  for (let i = 0; i < 4; i++) {
    const X = sides[x[i % 2]],
          Z = sides[z[Math.floor(i / 2)]],
          T = sides[y[0]],
          B = sides[y[1]],
          a = distance(X, T, Z)

    if (crosses(a, distance(X, B, Z))) return true
  }
}

export const needs_z_recursion = (
  distance: Shape,
  sides:    Sides,
): boolean => {
  for (let i = 0; i < 4; i++) {
    const X = sides[x[i % 2]],
          Y = sides[y[Math.floor(i / 2)]],
          B = sides[z[0]],
          F = sides[z[1]],
          a = distance(X, Y, B)

    if (crosses(a, distance(X, Y, F))) return true
  }
}

export const surface_x_point = (
  distance: Shape,
  sides:    Sides,
): TestResult => {
  const Y = sides[y[1]],
        Z = sides[z[1]],
        L = sides[x[0]],
        R = sides[x[1]],
        a = distance(L, Y, Z)

  if (crosses(a, distance(R, Y, Z)))
    return surface_point(L + Math.abs(a), Y, Z)
}

export const surface_y_point = (
  distance: Shape,
  sides:    Sides,
): TestResult => {
  const X = sides[x[1]],
        Z = sides[z[1]],
        T = sides[y[0]],
        B = sides[y[1]],
        a = distance(X, T, Z)

  if (crosses(a, distance(X, B, Z)))
    return surface_point(X, T - Math.abs(a), Z)
}

export const surface_z_point = (
  distance: Shape,
  sides:    Sides,
): TestResult => {
  const X = sides[x[1]],
        Y = sides[y[1]],
        B = sides[z[0]],
        F = sides[z[1]],
        a = distance(X, Y, B)

  if (crosses(a, distance(X, Y, F)))
    return surface_point(X, Y, B + Math.abs(a))
}