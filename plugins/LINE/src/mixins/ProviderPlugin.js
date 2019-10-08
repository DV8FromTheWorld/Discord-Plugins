export default {
  install(Vue, options) {
    Vue.mixin({
      beforeCreate() {
        for (const key in options) {
          this[key] = options[key]
        }
      }
    })
  }
}