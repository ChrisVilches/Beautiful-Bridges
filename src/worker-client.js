/* eslint-env browser */

let worker = null

// TODO: A bit weird that only one callback can be set. I'd like to obtain results from many places, in controlled ways.
function initializeWorker (cb) {
  if (worker !== null) return
  worker = new Worker('worker.js')

  worker.onmessage = function (e) {
    switch (e.data.type) {
      case 'solve-response':
        console.log('Response from worker:', e.data.body)
        cb(e.data.body.H, e.data.body.ground, e.data.body.solution)
        break
      default:
        console.error(`Incorrect response type: ${e.data.type}`)
    }
  }
}

function dispatchSolve (N, H, alpha, beta, ground) {
  worker.postMessage({
    cmd: 'solve',
    args: {
      N, H, alpha, beta, ground
    }
  })
}

module.exports = {
  initializeWorker,
  dispatchSolve
}
