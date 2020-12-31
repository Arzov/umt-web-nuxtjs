import Vue from 'vue'

const global = {
  data () {
    return {
      btnLoading: false
    }
  },
  computed: {
    _userState () {
      return this.$store.getters['user/get']
    },
    _globalState () {
      return this.$store.getters['global/get']
    },
    _themePreference () {
      return this._globalState.themePreference
    },
    _allowGeoloc () {
      return this._globalState.allowGeoloc
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

Vue.mixin(global)

export const signOut = {
  mounted () {
    this.$AWS.Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signOut':
          this.$router.push('/start')
          break
      }
    })
  }
}
