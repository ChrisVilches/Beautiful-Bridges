/* eslint-env browser */

import { createScene, drawBridge } from '../graphics'
import Backbone from 'backbone'
import _ from 'underscore'
import { getInputErrors, deepClone, randomBridge } from '../util'
import { solve } from '../worker-client'
import $ from 'jquery'
import sample1 from 'Samples/sample1.json'
import sample2 from 'Samples/sample2.json'
import sample3 from 'Samples/sample3.json'
import sample4 from 'Samples/sample4.json'
import { RawInput } from './RawInput'
import { FormInput } from './FormInput'
import indexViewTemplate from './index-view-template.html'

function resizeRendererToDisplaySize (renderer) {
  const canvas = renderer.domElement
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  const needResize = (canvas.width !== width || canvas.height !== height) && width > 0 && height > 0
  if (needResize) {
    renderer.setSize(width, height, false)
  }
  return needResize
}

export const IndexView = Backbone.View.extend({
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

      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement
        camera.aspect = canvas.clientWidth / canvas.clientHeight
        camera.updateProjectionMatrix()
      }
    }

    const { renderer, scene, camera, resetCameraPosition } = createScene(this.$el.find('#render-canvas-container'))
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
  template: _.template(indexViewTemplate),
  events: {
    'click #solve-btn': 'solveUsingCurrentInput',
    'click [data-role="sample-btn"]': 'onClickSampleBtn',
    'click #reset-camera-btn': 'resetCameraPositionHandle'
  },
  error: null,
  currentSolutionCost: null,
  onClickSampleBtn: function (e) {
    const btn = $(e.target)
    const id = btn.attr('data-sample-id')
    let sample
    switch (id) {
      case '1': sample = sample1; break
      case '2': sample = sample2; break
      case '3': sample = sample3; break
      case '4': sample = sample4; break
      case 'random': sample = randomBridge(); break
    }

    this.formInput.setInputData(deepClone(sample))
    this.rawInput.setInputData(deepClone(sample))

    this.render()
    this.solveUsingCurrentInput()

    $('html, body').animate({
      scrollTop: this.$el.find('#render-canvas-container').offset().top
    }, 0)
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
    this.$el.find('#render-canvas-container').html(this.renderer.domElement)
    window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub])

    return this
  }
})
