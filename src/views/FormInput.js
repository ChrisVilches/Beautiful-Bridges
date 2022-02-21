/* eslint-env browser */

import Backbone from 'backbone'
import _ from 'underscore'
import { deepClone } from '../util'
import sample1 from 'Samples/sample1.json'
import $ from 'jquery'
import formInputTemplate from './form-input-template.html'

export const FormInput = Backbone.View.extend({
  initialize: function () {
    console.log('Form input initialize')
  },
  setInputData: function (data) {
    this.formInput = data
  },
  getInputData: function () {
    return {
      N: this.formInput.ground.length,
      H: Number(this.formInput.height),
      alpha: Number(this.formInput.alpha),
      beta: Number(this.formInput.beta),
      ground: this.formInput.ground.map(o => ({ x: Number(o.x), y: Number(o.y) }))
    }
  },
  template: _.template(formInputTemplate),
  formInput: deepClone(sample1),
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
    const input = $(e.currentTarget)
    const idx = Number(input.attr('data-index'))
    this.formInput.ground.splice(idx, 1)
    this.render()
  },
  onClickAddInputGround: function () {
    this.formInput.ground.push({
      x: '',
      y: ''
    })
    this.render()
  },
  events: {
    'change #input-height': 'onChangeInputHeight',
    'change #input-alpha': 'onChangeInputAlpha',
    'change #input-beta': 'onChangeInputBeta',
    'click #add-point-btn': 'onClickAddInputGround',
    'change [data-role="ground-point"]': 'onChangeInputGround',
    'click [data-role="ground-point-remove"]': 'onClickRemoveInputGround'
  },
  render: function () {
    this.$el.html(this.template())
    return this
  }
})
