/* eslint-env browser */

let worker = null
let requestId = 0
let responseId
const callbacks = {}

export function initializeWorker () {
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

export function solve (N, H, alpha, beta, ground, callback) {
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
