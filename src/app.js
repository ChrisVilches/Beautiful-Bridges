import { IndexView } from './views/IndexView'
import $ from 'jquery'
import 'flowbite'
import Backbone from 'backbone'
import BackboneSubview from 'backbone-subviews'
import { initializeWorker } from './worker-client'
import { IndexViewState } from './models/IndexViewState'
import './styles.css'

Backbone.View.extend(BackboneSubview)

function configMathJax () {
  window.MathJax.Hub.Config({
    'HTML-CSS': {
      preferredFont: 'TeX',
      availableFonts: ['STIX', 'TeX'],
      linebreaks: { automatic: true },
      EqnChunk: (window.MathJax.Hub.Browser.isMobile ? 10 : 50)
    },
    tex2jax: { inlineMath: [['$', '$']], processEscapes: true, ignoreClass: 'tex2jax_ignore|dno' },
    TeX: {
      extensions: ['begingroup.js'],
      noUndefined: { attributes: { mathcolor: 'red', mathbackground: '#FFEEEE', mathsize: '90%' } },
      Macros: { href: '{}' }
    },
    messageStyle: 'none'
  })
}

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
