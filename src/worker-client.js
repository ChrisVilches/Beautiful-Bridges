/* eslint-env browser */

let worker = null
let requestId = 0
let responseId
const callbacks = {}

// TODO: A bit weird that only one callback can be set. I'd like to obtain results from many places, in controlled ways.
function initializeWorker () {
  if (worker !== null) return
  worker = new Worker('worker.js')

  worker.onmessage = function (e) {
    switch (e.data.type) {
      case 'solve-response':
        console.log('Response from worker:', e.data.body)

        responseId = e.data.body.requestId
        callbacks[responseId](e.data.body.cost, e.data.body.solution)
        delete callbacks[responseId]

        break
      default:
        console.error(`Incorrect response type: ${e.data.type}`)
    }
  }
}

function solve (N, H, alpha, beta, ground, callback) {
  callbacks[requestId] = callback

  worker.postMessage({
    cmd: 'solve',
    args: {
      requestId, N, H, alpha, beta, ground
    }
  })

  requestId++
}

module.exports = {
  initializeWorker,
  solve
}
