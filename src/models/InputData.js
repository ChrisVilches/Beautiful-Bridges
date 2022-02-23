import Backbone from 'backbone'
import { deepClone } from '../util'

export const InputData = Backbone.Model.extend({
  defaults: {
    height: null,
    alpha: null,
    beta: null,
    ground: []
  },
  addGround: function () {
    this.set({
      ground: this.get('ground').concat([{
        x: '',
        y: ''
      }])
    })

    this.trigger('change:ground:length')
  },
  removeGround: function (i) {
    const ground = deepClone(this.get('ground'))

    ground.splice(i, 1)
    this.set({ ground })
    this.trigger('change:ground:length')
  },
  updateGround: function (i, type, value) {
    const ground = deepClone(this.get('ground'))

    ground[i][type] = value
    this.set({ ground })
  },
  toObject: function () {
    return {
      N: this.get('ground').length,
      H: Number(this.get('height')),
      alpha: Number(this.get('alpha')),
      beta: Number(this.get('beta')),
      ground: this.get('ground').map(o => ({ x: Number(o.x), y: Number(o.y) }))
    }
  },
  toObjectSimple: function () {
    return {
      height: Number(this.get('height')),
      alpha: Number(this.get('alpha')),
      beta: Number(this.get('beta')),
      ground: this.get('ground')
    }
  }
})
