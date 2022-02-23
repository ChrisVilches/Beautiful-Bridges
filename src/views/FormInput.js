/* eslint-env browser */

import Backbone from 'backbone'
import _ from 'underscore'
import sample1 from 'Samples/sample1.json'
import $ from 'jquery'
import formInputTemplate from './form-input-template.html'
import { FORM_MAX_GROUND } from '../constants'
import { deepClone } from '../util'
import { InputData } from '../models/InputData'

export const FormInput = Backbone.View.extend({
  initialize: function () {
    this.formInput = new InputData(sample1)
    this.listenTo(this.formInput, 'change:ground:length', this.render)
  },
  setInputData: function (data) {
    this.formInput.set(deepClone(data))
  },
  getInputData: function () {
    return this.formInput.toObject()
  },
  template: _.template(formInputTemplate),
  onChangeInputHeight: function (e) { this.formInput.set({ height: e.target.value }) },
  onChangeInputAlpha: function (e) { this.formInput.set({ alpha: e.target.value }) },
  onChangeInputBeta: function (e) { this.formInput.set({ beta: e.target.value }) },
  onChangeInputGround: function (e) {
    const input = $(e.target)
    const idx = Number(input.attr('data-index'))
    const type = input.attr('data-type')
    const value = input.val()
    this.formInput.updateGround(idx, type, value)
  },
  onClickRemoveInputGround: function (e) {
    const input = $(e.currentTarget)
    const idx = Number(input.attr('data-index'))
    this.formInput.removeGround(idx)
  },
  onClickAddInputGround: function () {
    this.formInput.addGround()
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
    if (!this.$el.is(':visible')) return
    this.$el.html(this.template({
      ...this.formInput.toObjectSimple(),
      disableAddGroundBtn: this.formInput.get('ground').length >= FORM_MAX_GROUND
    }))
  }
})
