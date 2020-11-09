import Vue from 'vue'

const mixin = {
  data () {
    return {
      btnLoading: false
    }
  },
  computed: {
    _themePreference () {
      return this.$store.getters['global/getGlobal'].themePreference
    }
  },
  methods: {
    showNotification (message, description, type) {
      let icon = <a-icon type="close-circle" />

      switch (type) {
        case 'success':
          icon = <a-icon type="check-circle" />
          break

        case 'warning':
          icon = <a-icon type="warning" />
          break

        case 'info':
          icon = <a-icon type="info-circle" />
          break
      }

      this.$notification.destroy()

      this.$notification.open({
        message,
        description,
        class: 'notification',
        getContainer: () => this.$el,
        icon
      })
    }
  }
}

Vue.mixin(mixin)
