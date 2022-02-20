/* eslint-env browser */

import { createScene, drawBridge } from '../graphics'
import Backbone from 'backbone'
import _ from 'underscore'
import { parseInput, getInputErrors } from '../util'
import { solve } from '../worker-client'
import $ from 'jquery'
import sample1 from '../../assets/sample1.txt'
import sample2 from '../../assets/sample2.txt'

// TODO: Maybe a bit too long (verbose)

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

    const { renderer, scene, camera, resetCameraPosition } = createScene(this.$el.find('#render-container'))
    this.renderer = renderer
    this.scene = scene
    this.resetCameraPosition = resetCameraPosition
    render()
  },
  resetCameraPosition: () => { throw new Error('Cannot reset camera yet') },
  resetCameraPositionHandle: function () {
    this.resetCameraPosition()
  },
  solveLoading: false,
  scene: null,
  template: _.template($('#index-template').html()),
  events: {
    'click #solve-btn': 'solveFromTextarea',
    'click #sample-1': 'setSample1',
    'click #sample-2': 'setSample2',
    'click #reset-camera-btn': 'resetCameraPositionHandle'
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
      this.solveLoading = true
      this.render()
      solve(N, H, alpha, beta, ground, (cost, solution) => {
        this.currentSolutionCost = cost
        drawBridge(this.scene, H, ground, solution)
        this.solveLoading = false
        this.render()
      })
    } else {
      this.solveLoading = false
      this.render()
    }
  },
  render: function () {
    this.$el.html(this.template())
    this.$el.find('#render-container').html(this.renderer.domElement)
    window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub])
  }
})

module.exports = { IndexView }
