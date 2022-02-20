/* eslint-env browser */

import { createScene, drawBridge } from '../graphics'
import Backbone from 'backbone'
import _ from 'underscore'
import { parseInput, getInputErrors } from '../util'
import { solve } from '../worker-client'
import $ from 'jquery'

const sample1 = `
5 60 18 2
0 0
20 20
30 10
50 30
70 20
`

const sample2 = `
5 60 5 7
0 0
10 30
50 57
55 50
60 20
`

const IndexView = Backbone.View.extend({
  el: '#container',
  initialize: function () {
    this.initializeGraphics()
    this.render()
    this.solveFromTextarea()
  },
  inputValue: sample1,
  initializeGraphics: function () {
    function render () {
      requestAnimationFrame(render)
      renderer.render(scene, camera)
    }

    const { renderer, scene, camera } = createScene(this.$el.find('#render-container'))
    this.renderer = renderer
    this.scene = scene
    render()
  },
  solveLoading: false,
  scene: null,
  template: _.template($('#index-template').html()),
  events: {
    'click #solve-btn': 'solveFromTextarea',
    'click #sample-1': 'setSample1',
    'click #sample-2': 'setSample2'
  },
  error: null,
  currentSolutionCost: null,
  setSample1: function () {
    this.inputValue = sample1
    this.render()
    this.solveFromTextarea()
  },
  setSample2: function () {
    this.inputValue = sample2
    this.render()
    this.solveFromTextarea()
  },
  solveFromTextarea: function () {
    const val = document.getElementById('data-input').value
    this.inputValue = val
    const input = parseInput(val)

    this.error = getInputErrors(input)

    if (!this.error) {
      const { N, H, alpha, beta, ground } = input
      solve(N, H, alpha, beta, ground, (cost, solution) => {
        this.currentSolutionCost = cost
        drawBridge(this.scene, H, ground, solution)
        this.solveLoading = false
        this.render()
      })
    }

    this.solveLoading = true
    this.render()
  },
  render: function () {
    this.$el.html(this.template())
    this.$el.find('#render-container').html(this.renderer.domElement)
    window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub])
  }
})

module.exports = { IndexView }
