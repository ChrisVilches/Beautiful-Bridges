/* eslint-env browser */

import { createScene } from '../graphics'
import Backbone from 'backbone'
import _ from 'underscore'
import { getInputErrors, deepClone, randomBridge, isMobile, numberFormat } from '../util'
import { solve } from '../worker-client'
import $ from 'jquery'
import sample1 from 'Samples/sample1.json'
import sample2 from 'Samples/sample2.json'
import sample3 from 'Samples/sample3.json'
import sample4 from 'Samples/sample4.json'
import { RawInput } from './RawInput'
import { FormInput } from './FormInput'
import indexViewTemplate from './index-view-template.html'

export const IndexView = Backbone.View.extend({
  el: '#container',
  initialize: function () {
    Backbone.Subviews.add(this)
    this.listenTo(this.model, 'change', this.render)
    this.initializeGraphics()
  },
  subviewCreators: {
    'raw-input-subview': function () {
      this.rawInput = new RawInput({ solve: this.solveUsingCurrentInput.bind(this) })
      return this.rawInput
    },
    'form-input-subview': function () {
      this.formInput = new FormInput()
      return this.formInput
    }
  },
  initializeGraphics: function () {
    this.graphics = createScene(this.$el, '#render-canvas-container')
  },
  template: _.template(indexViewTemplate),
  events: {
    'click #solve-btn': 'solveUsingCurrentInput',
    'click [data-role="sample-btn"]': 'onClickSampleBtn',
    'click #reset-camera-btn': function () {
      this.graphics.resetCameraPosition()
    }
  },
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
    this.solveUsingCurrentInput()

    $('html, body').animate({
      scrollTop: this.$el.find('#render-canvas-container').offset().top
    }, 0)
  },
  solveUsingCurrentInput: function () {
    if (this.model.isLoading()) return

    const input = (this.model.isRaw() ? this.rawInput : this.formInput).getInputData()

    this.executeSolve(input)
  },
  executeSolve: function (input) {
    this.model.set({ error: getInputErrors(input) })

    if (this.model.get('error')) {
      return this.model.set({ solveLoading: false })
    }

    const { N, H, alpha, beta, ground } = input

    this.model.set({ solveLoading: true })
    solve(N, H, alpha, beta, ground, (cost, solution) => {
      this.graphics.drawBridge(H, ground, solution)
      this.model.set({
        currentSolutionCost: cost,
        solveLoading: false
      })
    })
  },
  render: function () {
    this.$el.html(this.template({
      showCameraControlsHint: !isMobile(),
      cost: numberFormat(this.model.get('currentSolutionCost')),
      error: this.model.get('error'),
      isLoading: this.model.isLoading(),
      isRaw: this.model.isRaw(),
      isForm: this.model.isForm()
    }))

    this.graphics.updateDOM()
    window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub])
  }
})
