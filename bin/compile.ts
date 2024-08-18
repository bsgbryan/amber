import {
  readdir,
  rm,
  stat,
} from 'node:fs/promises'

import { join } from 'node:path'

import asc from "assemblyscript/asc"

const root = `${process.cwd()}/assembly`

const compile = async file => {
  const module = file.substring(root.length + 1, file.length - 3)

  const { error, stderr, stats } = await asc.main([
    file,
    "-o", `${process.cwd()}/compiled/${module}.wasm`,
    "-O3",
    "--converge",
    "-b", "esm",
    "--stats",
    "--enable", "simd",
  ])

  if (error) {
    console.log(`Compilation failed: ${error.message}`)
    console.log(stderr.toString())
  }
  else {
    console.log(`Compiled ${module.replaceAll('/', '::')}`)
  }
}

const list = async path => (await readdir(path)).map(n => join(path, n))

const recurse = async path => {
  for (const e of await list(path)) {
    const s = await stat(e)

    if      (s.isDirectory())   recurse(e)
    else if (e.endsWith('.ts')) compile(e)
  }
}

await rm(`${process.cwd()}/compiled`, {
  force:     true,
  recursive: true,
})

recurse(root)