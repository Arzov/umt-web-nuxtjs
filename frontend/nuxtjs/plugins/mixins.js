import Vue from 'vue'

const mixin = {
  data () {
    return {
      btnLoading: false
    }
  },
  computed: {
    _themePreference () {
      return this._globalState.themePreference
    },
    _globalState () {
      return this.$store.getters['global/getGlobal']
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
    },
    signOut () {
      this.$store
        .dispatch('global/signOut')
        .then(() => {
          if (!this._globalState.signOutStatus) {
            this.showNotification(
              this._globalState.signOutTitle,
              this._globalState.signOutMsg,
              this._globalState.signOutMsgType
            )
          }
        })
    }
  }
}

Vue.mixin(mixin)
