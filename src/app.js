import { IndexView } from './views/IndexView'
import $ from 'jquery'
import 'flowbite'
import Backbone from 'backbone'
import BackboneSubview from 'backbone-subviews'
import { initializeWorker } from './worker-client'
import './styles.css'

Backbone.View.extend(BackboneSubview)

$(() => {
  initializeWorker()

  const indexView = new IndexView()

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
      indexView.currentTab = 'raw'
      indexView.render()
      renderBridgeOnce()
    },
    form: function () {
      indexView.currentTab = 'form'
      indexView.render()
      renderBridgeOnce()
    }
  })

  new Workspace() // eslint-disable-line no-new
  Backbone.history.start()
})
