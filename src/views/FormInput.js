/* eslint-env browser */

import Backbone from 'backbone'
import _ from 'underscore'
import { deepClone } from '../util'
import sample1 from '../../assets/sample1.json'
import $ from 'jquery'

const FormInput = Backbone.View.extend({
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
  template: _.template(
    `
    <form class="w-full max-w-lg mb-4">
        <div class="flex flex-wrap -mx-3 mb-2">
          <div class="w-1/3 sm:w-full px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Height
              <input value="<%= this.formInput.height %>" class="appearance-none block bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="input-height" type="text">
            </label>
          </div>
          <div class="w-1/3 sm:w-full px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Alpha
              <input value="<%= this.formInput.alpha %>" class="appearance-none block bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="input-alpha" type="text">
            </label>
          </div>
          <div class="w-1/3 sm:w-full px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Beta
              <input value="<%= this.formInput.beta %>" class="appearance-none block bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="input-beta" type="text">
            </label>
          </div>
        </div>
  
        <div class="mb-4">
          <% this.formInput.ground.forEach((ground, i) => { %>
            <div class="mb-2">
              <input value="<%= ground.x %>" data-index="<%= i %>" data-role="ground-point" data-type="x" class="w-1/3 appearance-none inline bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text">
              <input value="<%= ground.y %>" data-index="<%= i %>" data-role="ground-point" data-type="y" class="w-1/3 appearance-none inline bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="text">
              <button data-role="ground-point-remove" data-index="<%= i %>" type="button" class="inline xs:w-1/3 py-2 px-4 text-sm font-medium text-white bg-red-300 hover:bg-red-400 rounded-lg border border-gray-200 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700">
                <i class="las la-times"></i>
              </button>
            </div>
          <% }) %>
        </div>
  
        <button id="add-point-btn" type="button" class="py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700">
          <i class="las la-plus"></i>
        </button>
      </form>
      `
  ),
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
      x: 0,
      y: 0
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

module.exports = { FormInput }
