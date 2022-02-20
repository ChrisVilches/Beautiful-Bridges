import { IndexView } from './views/index'
import $ from 'jquery'
import 'flowbite'

// TODO: A bit weird. It should be an object, and the "solve" should be its method
//       (removed here, but still applies for other uses of this worker-client file)
import { initializeWorker } from './worker-client'

$(() => {
  initializeWorker()
  new IndexView() // eslint-disable-line no-new
})
