/* eslint-env browser */

import { createScene, drawBridge } from './graphics'
import { IndexView } from './views/index'
import { parseInput } from './util'
import $ from 'jquery'

// TODO: A bit weird. It should be an object, and the "dispatchSolve" should be its method
import { initializeWorker, dispatchSolve } from './worker-client'

function solveFromTextarea () {
  console.log('Solving from textarea')
  const val = document.getElementById('data-input').value
  const { N, H, alpha, beta, ground } = parseInput(val)
  dispatchSolve(N, H, alpha, beta, ground)
}

const { renderer, scene, camera } = createScene()

function render () {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}

$(() => {
  initializeWorker((h, ground, solution) => {
    drawBridge(scene, h, ground, solution)
  })

  render()

  const initialInput = `5 60 18 2
  0 0
  20 20
  30 10
  50 30
  70 20`

  $('#data-input').val(initialInput)

  solveFromTextarea()
  const view = new IndexView()
})
