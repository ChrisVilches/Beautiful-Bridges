import Backbone from 'backbone'

export const InputData = Backbone.Model.extend({
  defaults: {
    height: null,
    alpha: null,
    beta: null,
    ground: []
  },
  addGround: function () {
    this.get('ground').push({
      x: '',
      y: ''
    })
    this.trigger('change:ground:length')
  },
  removeGround: function (i) {
    this.get('ground').splice(i, 1)
    this.trigger('change:ground:length')
  },
  updateGround: function (i, type, value) {
    this.get('ground')[i][type] = value
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
      ground: this.get('ground').map(o => ({ x: o.x, y: o.y }))
    }
  }
})
