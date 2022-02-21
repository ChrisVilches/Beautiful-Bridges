/* eslint-env browser */

import Backbone from 'backbone'
import _ from 'underscore'
import { jsonInputToRaw, parseInput } from '../util'
import sample1 from 'Samples/sample1.json'
import rawInputTemplate from './raw-input-template.html'

export const RawInput = Backbone.View.extend({
  initialize: function () {
    console.log('Raw input initialize')
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
    'keyup #data-input': 'onChangeTextarea'
  },
  onChangeTextarea: function (e) {
    this.inputValue = e.target.value
  },
  render: function () {
    this.$el.html(this.template())
    return this
  }
})
