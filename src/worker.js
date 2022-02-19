/* eslint-env browser */

import { beautifulBridgesSolver } from './beautifulbridges'

console.log('Web worker loaded')

const solve = args => {
  const N = args.N
  const H = args.H
  const alpha = args.alpha
  const beta = args.beta
  const ground = args.ground
  return beautifulBridgesSolver(N, H, alpha, beta, ground)
}

self.onmessage = function (e) {
  switch (e.data.cmd) {
    case 'solve':
      self.postMessage({ type: 'solve-response', body: solve(e.data.args) })
      break
    default:
      console.error('Incorrect command')
  }
}
