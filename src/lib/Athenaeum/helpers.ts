// Taken from https://www.js-craft.io/blog/clamp-numbers-in-javascript/
export const clamp = (
  value: number,
  min: number,
  max: number
) => Math.min(Math.max(value, min), max)