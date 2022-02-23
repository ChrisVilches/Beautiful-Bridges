import { IndexView } from './views/IndexView'
import $ from 'jquery'
import 'flowbite'
import Backbone from 'backbone'
import BackboneSubview from 'backbone-subviews'
import { initializeWorker } from './worker-client'
import { IndexViewState } from './models/IndexViewState'
import { configMathJax } from './mathjax'
import './styles.css'

Backbone.View.extend(BackboneSubview)

$(() => {
  configMathJax()
  initializeWorker()

  const indexView = new IndexView({
    state: new IndexViewState()
  })

  let initialRenderFinished = false

  const renderBridgeOnce = () => {
    if (initialRenderFinished) return
    indexView.solveUsingCurrentInput()
    initialRenderFinished = true
  }

  const Workspace = Backbone.Router.extend({
    routes: {
      '': 'index',
      form: 'form'
    },
    index: function () {
      indexView.state.set({ currentTab: 'raw' })
      renderBridgeOnce()
    },
    form: function () {
      indexView.state.set({ currentTab: 'form' })
      renderBridgeOnce()
    }
  })

  new Workspace() // eslint-disable-line no-new
  Backbone.history.start()
})
