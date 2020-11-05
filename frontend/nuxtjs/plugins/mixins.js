import Vue from 'vue'

const mixin = {
  computed: {
    _themePreference () {
      return this.$store.getters['global/getGlobals'].themePreference
    }
  }
}

Vue.mixin(mixin)
