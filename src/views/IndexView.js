/* eslint-env browser */

import { createScene, drawBridge } from '../graphics'
import Backbone from 'backbone'
import _ from 'underscore'
import { getInputErrors, deepClone } from '../util'
import { solve } from '../worker-client'
import $ from 'jquery'
import sample1 from '../../assets/sample1.json'
import sample2 from '../../assets/sample2.json'
import sample3 from '../../assets/sample3.json'
import { RawInput } from './RawInput'
import { FormInput } from './FormInput'

// TODO: Maybe a bit too long (verbose)
//       For example, the form input and events can be moved to a different view, maybe.

const IndexView = Backbone.View.extend({
  el: '#container',
  initialize: function () {
    Backbone.Subviews.add(this)
    this.initializeGraphics()
  },
  subviewCreators: {
    'raw-input-subview': function () {
      this.rawInput = new RawInput()
      return this.rawInput
    },
    'form-input-subview': function () {
      this.formInput = new FormInput()
      return this.formInput
    }
  },
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
  currentTab: 'raw',
  template: _.template($('#index-template').html()),
  events: {
    'click #solve-btn': 'solveUsingCurrentInput',
    'click [data-role="sample-btn"]': 'onClickSampleBtn',
    'click #reset-camera-btn': 'resetCameraPositionHandle'
  },
  error: null,
  currentSolutionCost: null,
  onClickSampleBtn: function (e) {
    const btn = $(e.target)
    const id = Number(btn.attr('data-sample-id'))
    let sample
    switch (id) {
      case 1: sample = sample1; break
      case 2: sample = sample2; break
      case 3: sample = sample3; break
    }
    this.formInput.setInputData(deepClone(sample))
    this.rawInput.setInputData(deepClone(sample))

    this.render()
    this.solveUsingCurrentInput()
  },
  solveUsingCurrentInput: function () {
    let input
    if (this.currentTab === 'raw') {
      input = this.rawInput.getInputData()
    } else {
      input = this.formInput.getInputData()
    }

    this.executeSolve(input)
  },
  executeSolve: function (input) {
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

    return this
  }
})

module.exports = { IndexView }
