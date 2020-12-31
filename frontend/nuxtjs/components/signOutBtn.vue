<template>
  <TextBtn :text="text" @click.native="signOut()" />
</template>

<script>
export default {
  props: {
    text: { type: String, default: 'Cerrar sesión' }
  },
  methods: {
    signOut () {
      this.$store.dispatch('global/signOut')
        .then(() => {
        })
        .catch((e) => {
          this.showNotification()
        })
    }
  }
}
</script>
