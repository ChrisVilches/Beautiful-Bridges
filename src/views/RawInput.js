/* eslint-env browser */

import Backbone from 'backbone'
import _ from 'underscore'
import { jsonInputToRaw, parseInput } from '../util'
import sample1 from 'Samples/sample1.json'
import rawInputTemplate from './raw-input-template.html'

export const RawInput = Backbone.View.extend({
  initialize: function (args) {
    console.log('Raw input initialize')
    this.callParentSolve = args.solve
  },
  setInputData: function (data) {
    this.inputValue = jsonInputToRaw(data)
  },
  getInputData: function () {
    return parseInput(this.inputValue)
  },
  inputValue: jsonInputToRaw(sample1),
  template: _.template(rawInputTemplate),
  events: {
    'keyup #data-input': 'onChangeTextarea',
    'keydown #data-input': 'onKeyDown'
  },
  onChangeTextarea: function (e) {
    this.inputValue = e.target.value
  },
  onKeyDown: function (e) {
    if (e.ctrlKey && e.keyCode === 13) {
      this.callParentSolve()
    }
  },
  render: function () {
    this.$el.html(this.template())
    return this
  }
})
