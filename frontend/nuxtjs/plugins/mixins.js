import Vue from 'vue'

const mixin = {
  data () {
    return {
      notification: {
        type: 'error',
        toggle: false,
        message: '',
        description: ''
      }
    }
  },
  computed: {
    _themePreference () {
      return this.$store.getters['global/getGlobal'].themePreference
    }
  },
  methods: {
    showNotification (message, description, type) {
      this.notification.message = message
      this.notification.description = description
      this.notification.type = type
      this.notification.toggle = !this.notification.toggle
    }
  }
}

Vue.mixin(mixin)
