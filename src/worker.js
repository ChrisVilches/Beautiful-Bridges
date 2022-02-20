/* eslint-env browser */

import { beautifulBridgesSolver } from './beautifulbridges'
import { deepClone } from './util'

console.log('Web worker loaded')

const solve = args => {
  console.log('Solving:', args)

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
      setTimeout(() => {
        const solveArgs = deepClone(e.data.args)
        delete solveArgs.requestId
        self.postMessage({ type: 'solve-response', body: { ...solve(solveArgs), requestId: e.data.args.requestId } })
      }, 500)
      break
    default:
      console.error('Incorrect command')
  }
}
