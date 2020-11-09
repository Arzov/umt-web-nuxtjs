<template>
  <div />
</template>

<script>
export default {
  props: {
    message: { type: String, default: '' },
    description: { type: String, default: '' },
    type: { type: String, default: 'error' },
    toggle: { type: Boolean, default: false }
  },
  watch: {
    toggle (val) {
      this.showNotificaion()
    }
  },
  methods: {
    showNotificaion () {
      let icon = <a-icon type="close-circle" />

      switch (this.type) {
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

      this.$notification.open({
        message: this.message,
        description: this.description,
        class: 'notification',
        getContainer: () => document.querySelector('.page'),
        icon
      })
    }
  }
}
</script>
