/* eslint-env browser */

let worker = null
let requestId = 0
let responseId
const callbacks = {}

// TODO: A bit weird that only one callback can be set. I'd like to obtain results from many places, in controlled ways.
//       (Update: I think it's solved now)
function initializeWorker () {
  if (worker !== null) return
  worker = new Worker('worker.js')

  worker.onmessage = function (e) {
    switch (e.data.type) {
      case 'solve-response':
        console.log('Response from worker:', e.data.body)

        responseId = e.data.body.requestId
        if (responseId in callbacks) {
          callbacks[responseId](e.data.body.cost, e.data.body.solution)
          delete callbacks[responseId]
        } else {
          console.warn(`Response ID ${responseId} was not handled`)
        }

        break
      default:
        console.error(`Incorrect response type: ${e.data.type}`)
    }
  }
}

function solve (N, H, alpha, beta, ground, callback) {
  const rId = requestId
  requestId++

  callbacks[rId] = callback

  worker.postMessage({
    cmd: 'solve',
    args: {
      requestId: rId, N, H, alpha, beta, ground
    }
  })
}

module.exports = {
  initializeWorker,
  solve
}
