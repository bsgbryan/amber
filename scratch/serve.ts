Bun.serve({
  development: true,
  
  async fetch(req) {
    console.log(req.url)
    if (req.url === 'http://localhost:1138/')
      return new Response(Bun.file(`${process.cwd()}/scratch/index.html`))

    if (req.url.endsWith('index.ts')) {
      const trans   = new Bun.Transpiler(),
            content = await Bun.file(`${process.cwd()}/scratch/index.ts`).text(),
            output  = await trans.transform(content.replaceAll('@/', '/'), 'ts'),
            res     = new Response(output)

      res.headers.set('Content-Type', 'text/javascript')
      res.headers.set('Cache-Control', 'max-age')

      return res
    }
    else if (req.url.endsWith('favicon.ico'))
      return new Response(Bun.file(`${process.cwd()}/public/amber.png`))
    else if (req.url.includes('/build/')) {
      return new Response(Bun.file(`${process.cwd()}${new URL(req.url).pathname}`))
    }
    else if (req.url.includes('/compiled/')) {
      const path = new URL(req.url).pathname,
            ext  = path.endsWith('.wasm') ? '' : '.js'
 
      return new Response(Bun.file(`${process.cwd()}${path}${ext}`))
    }
    else {
      const trans   = new Bun.Transpiler(),
            path    = new URL(req.url).pathname,
            middle  = req.url.includes('/lib/') ? '/src' : '/src/lib',
            p       = `${process.cwd()}${middle}${path}.ts`, 
            file    = Bun.file(p),
            content = Bun.file(`${process.cwd()}${middle}${await file.exists() ? `${path}.ts` : `${path}/index.ts`}`)
      
      const text = await content.text()
      const imports = {}

      let processed = ''

      for (const t of text.split('\n')) {
        if (t.includes('import') && t.includes('.wgsl')) {
          const tokens = t.split('@/').map(t => t.replaceAll("'", ''))
          const name   = t.split(/\s+/)[1]
          const shader = await Bun.file(`${process.cwd()}/src/lib/${tokens[1]}`).text()

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
            output = await trans.transform(stripped, 'ts'),
            res    = new Response(output)

      res.headers.set('Content-Type', 'text/javascript')
      res.headers.set('Expires', new Date(Date.now() + (60 * 60 * 24 * 31 * 1000)).toUTCString())

      return res
    }
  },
  port: 1138,
})

console.info(`Amber is listening at http://localhost:1138`)