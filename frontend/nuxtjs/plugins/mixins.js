import Vue from 'vue'
import Notification from '@/components/notification'

const NotificationClass = Vue.extend(Notification)
const notificationInstance = new NotificationClass()

const mixin = {
  computed: {
    _themePreference () {
      return this.$store.getters['global/getGlobal'].themePreference
    }
  },
  methods: {
    showNotification (message, description, type) {
      notificationInstance.message = message
      notificationInstance.description = description
      notificationInstance.type = type
      notificationInstance.toggle = !notificationInstance.toggle
    }
  }
}

Vue.mixin(mixin)
