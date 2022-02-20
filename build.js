const esbuild = require('esbuild')
const fs = require('fs')
const path = require('path')

const SRC = 'src'
const DIST = 'dist'

if (!fs.existsSync(DIST)) {
  fs.mkdirSync(DIST)
}

// TODO: Should be target: ES5

esbuild.build({
  entryPoints: [path.join(SRC, 'app.js')],
  bundle: true,
  minify: !true,
  target: ['es6'],
  outfile: path.join(DIST, 'bundle.js')
})

esbuild.build({
  entryPoints: [path.join(SRC, 'worker.js')],
  bundle: true,
  minify: !true,
  target: ['es6'],
  outfile: path.join(DIST, 'worker.js')
})

// TODO: Does not overwrite the file?
fs.copyFile(path.join(SRC, 'index.html'), path.join(DIST, 'index.html'), err => {
  if (err) throw err
})
