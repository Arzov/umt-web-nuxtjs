import Vue from 'vue'

const mixin = {
  data () {
    return {
      btnLoading: false
    }
  },
  computed: {
    _globalState () {
      return this.$store.getters['global/getGlobal']
    },
    _themePreference () {
      return this._globalState.themePreference
    }
  },
  methods: {
    showNotification () {
      let icon = <a-icon type="close-circle" />

      switch (this._globalState.notificationMsgType) {
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
        message: this._globalState.notificationTitle,
        description: this._globalState.notificationMsg,
        class: 'notification',
        getContainer: () => this.$el,
        icon
      })
    }
  }
}

Vue.mixin(mixin)
