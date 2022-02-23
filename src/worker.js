/* eslint-env browser */

import { beautifulBridgesSolver } from './beautifulbridges'
import { deepClone } from './util'
import _ from 'underscore'

console.log('Web worker loaded')

const solve = ({ N, H, alpha, beta, ground }) => beautifulBridgesSolver(N, H, alpha, beta, ground)

self.onmessage = function (e) {
  let solveArgs

  switch (e.data.cmd) {
    case 'solve':
      solveArgs = _.pick(deepClone(e.data.args), 'N', 'H', 'alpha', 'beta', 'ground')

      console.log('Begin solving', solveArgs)

      setTimeout(() => {
        self.postMessage({ type: 'solve-response', body: { ...solve(solveArgs), requestId: e.data.args.requestId } })
      }, 500)
      break
    default:
      console.error('Incorrect command')
  }
}
