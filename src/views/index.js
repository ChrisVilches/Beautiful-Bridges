/* eslint-env browser */

import { createScene, drawBridge } from '../graphics'
import Backbone from 'backbone'
import _ from 'underscore'
import { parseInput, getInputErrors, jsonInputToRaw, deepClone } from '../util'
import { solve } from '../worker-client'
import $ from 'jquery'
import sample1 from '../../assets/sample1.json'
import sample2 from '../../assets/sample2.json'

// TODO: Maybe a bit too long (verbose)
//       For example, the form input and events can be moved to a different view, maybe.

const IndexView = Backbone.View.extend({
  el: '#container',
  initialize: function () {
    this.initializeGraphics()
    this.render()
    this.solveFromTextarea()
  },
  formInput: deepClone(sample1),
  inputValue: jsonInputToRaw(sample1),
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
    'click #solve-btn': 'onClickSolve',
    'click #sample-1': 'setSample1',
    'click #sample-2': 'setSample2',
    'click #reset-camera-btn': 'resetCameraPositionHandle',
    'change #input-height': 'onChangeInputHeight',
    'change #input-alpha': 'onChangeInputAlpha',
    'change #input-beta': 'onChangeInputBeta',
    'click #add-point-btn': 'onClickAddInputGround',
    'change [data-role="ground-point"]': 'onChangeInputGround',
    'click [data-role="ground-point-remove"]': 'onClickRemoveInputGround',
    'click [data-role="tab"]': 'onClickTabButton'
  },
  onClickTabButton: function (e) {
    this.currentTab = $(e.target).attr('data-tab-name')
    this.render()
  },
  onChangeInputHeight: function (e) { this.formInput.height = e.target.value },
  onChangeInputAlpha: function (e) { this.formInput.alpha = e.target.value },
  onChangeInputBeta: function (e) { this.formInput.beta = e.target.value },
  onChangeInputGround: function (e) {
    const input = $(e.target)
    const idx = Number(input.attr('data-index'))
    const type = input.attr('data-type')
    const value = input.val()
    this.formInput.ground[idx][type] = value
  },
  onClickRemoveInputGround: function (e) {
    const input = $(e.target)
    const idx = Number(input.attr('data-index'))
    this.formInput.ground.splice(idx, 1)
    this.render()
  },
  onClickAddInputGround: function () {
    this.formInput.ground.push({
      x: 0,
      y: 0
    })
    this.render()
  },
  error: null,
  currentSolutionCost: null,
  setSample1: function () {
    this.inputValue = jsonInputToRaw(sample1)
    this.formInput = deepClone(sample1)
    this.render()
    this.onClickSolve()
  },
  setSample2: function () {
    this.inputValue = jsonInputToRaw(sample2)
    this.formInput = deepClone(sample2)
    this.render()
    this.onClickSolve()
  },
  onClickSolve: function () {
    if (this.currentTab === 'raw') {
      this.solveFromTextarea()
    } else {
      this.solveFromForm()
    }
  },
  solveFromTextarea: function () {
    const val = document.getElementById('data-input').value
    this.inputValue = val
    const input = parseInput(val)
    this.executeSolve(input)
  },
  solveFromForm: function () {
    const input = {
      N: this.formInput.ground.length,
      H: Number(this.formInput.height),
      alpha: Number(this.formInput.alpha),
      beta: Number(this.formInput.beta),
      ground: this.formInput.ground.map(o => ({ x: Number(o.x), y: Number(o.y) }))
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
  }
})

module.exports = { IndexView }
