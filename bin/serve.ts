const transpile = async (path: string) => {
	const trans   = new Bun.Transpiler(),
      	content = Bun.file(path),
				text 		= await content.text(),
				imports = {}

	let processed = ''

	for (const t of text.split('\n')) {
	  if (t.includes('import') && t.includes('.wgsl')) {
	    const tokens = t.split('@/').map(t => t.replaceAll("'", ''))
	    const name   = t.split(/\s+/)[1]
	    const shader = await Bun.file(`${process.cwd()}/src/${tokens[1]}`).text()

	    imports[name] = `\`${shader}\``
	  }
	  else if (t.startsWith('export')) {
	    for (const [name, shader] of Object.entries(imports))
	      processed += `const ${name} = ${shader}\n\n`

	    processed += `${t}\n`
	  }
	  else processed += `${t}\n`
	}

	const stripped = processed.replaceAll('@/', '/').replaceAll('#/', '/compiled/'),
	      output 	 = await trans.transform(stripped, 'ts'),
	      res    	 = new Response(output)

	res.headers.set('Content-Type', 'text/javascript')
  res.headers.set('Expires', new Date(Date.now() + (60 * 60 * 24 * 31 * 1000)).toUTCString())

  return res
}

Bun.serve({
  development: true,

  async fetch(req) {
    console.log(req.url)
    if (req.url === 'http://localhost:1138/')
      return new Response(Bun.file(`${process.cwd()}/scratch/index.html`))

    if (req.url.endsWith('.ts')) {
      return await transpile(`${process.cwd()}${new URL(req.url).pathname}`)
    }
    else if (req.url.endsWith('favicon.ico'))
      return new Response(Bun.file(`${process.cwd()}/scratch/amber.png`))
    else if (req.url.includes('/build/')) {
      return new Response(Bun.file(`${process.cwd()}${new URL(req.url).pathname}`))
    }
    else if (req.url.includes('/compiled/')) {
      const path = new URL(req.url).pathname,
            ext  = path.endsWith('.wasm') ? '' : '.js'

      return new Response(Bun.file(`${process.cwd()}${path}${ext}`))
    }
    else {
      const path   	 = new URL(req.url).pathname,
			      middle 	 = '/src',
			      p      	 = `${process.cwd()}${middle}${path}.ts`,
			      file   	 = Bun.file(p),
            location = `${process.cwd()}${middle}${await file.exists() ? `${path}.ts` : `${path}/index.ts`}`

			return await transpile(location)
    }
  },
  port: 1138,
})

console.info(`Amber is listening at http://localhost:1138`)
