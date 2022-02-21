const esbuild = require('esbuild')
const fs = require('fs')
const path = require('path')

const SRC = 'src'
const ASSETS = 'assets'
const DIST = 'dist'
const WATCH = Boolean(process.argv.find(a => a === '--watch'))

if (!fs.existsSync(DIST)) {
  fs.mkdirSync(DIST)
}

// TODO: Should be target: ES5
// TODO: Asset copying could be better.

const jsCommonOpts = {
  bundle: true,
  minify: true,
  sourcemap: true,
  watch: WATCH,
  target: ['es6'],
  loader: { '.html': 'text' }
}

esbuild.build({
  entryPoints: [path.join(SRC, 'app.js')],
  outfile: path.join(DIST, 'bundle.js'),
  ...jsCommonOpts
})

esbuild.build({
  entryPoints: [path.join(SRC, 'worker.js')],
  outfile: path.join(DIST, 'worker.js'),
  ...jsCommonOpts
})

function copyFile (src, dest, watch = false) {
  const copy = () => {
    fs.copyFile(src, dest, err => {
      if (err) throw err
    })
  }

  copy()

  if (watch) {
    fs.watchFile(src, copy)
  }
}

copyFile(path.join(SRC, 'index.html'), path.join(DIST, 'index.html'), WATCH)
copyFile(path.join(ASSETS, 'ground-texture.jpg'), path.join(DIST, 'ground-texture.jpg'), WATCH)
copyFile(path.join(ASSETS, 'steel-texture.jpg'), path.join(ASSETS, 'steel-texture.jpg'), WATCH)
