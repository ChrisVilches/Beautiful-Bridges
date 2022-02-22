import Backbone from 'backbone'

export const IndexViewState = Backbone.Model.extend({
  defaults: {
    error: null,
    currentSolutionCost: null,
    solveLoading: false
  },
  isRaw: function () {
    return this.get('currentTab') === 'raw'
  },
  isForm: function () {
    return this.get('currentTab') === 'form'
  },
  isLoading: function () {
    return Boolean(this.get('solveLoading'))
  }
})
