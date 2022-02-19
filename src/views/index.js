import Backbone from 'backbone'
import _ from 'underscore'
import { parseInput, getInputErrors } from '../util'
import { dispatchSolve } from '../worker-client'
import $ from 'jquery'

const IndexView = Backbone.View.extend({
  el: '#container',
  initialize: function () {
    this.render()
  },
  template: _.template($('#index-template').html()),
  events: {
    'click #solve-btn': 'solveFromTextarea'
  },
  error: null,
  solveFromTextarea: function () {
    console.log('Solving from textarea')
    const val = document.getElementById('data-input').value
    const input = parseInput(val)

    const err = getInputErrors(input)
    if (err) {
      console.error(err)
      this.error = err
      this.render()
      return
    }

    const { N, H, alpha, beta, ground } = input
    dispatchSolve(N, H, alpha, beta, ground)
  },
  render: function () {
    this.$el.html(this.template({ who: 'felo!' }))

    window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub])
  }
})

module.exports = { IndexView }
