<template>
  <a-button block @click="toGoogleLogin">
    <span>
      Iniciar con Google
    </span>
  </a-button>
</template>

<script>
export default {
  name: 'GoogleLogin',
  methods: {
    toGoogleLogin () {
      this.$AWS.Auth.federatedSignIn({ provider: 'Google' })
    }
  }
}
</script>

<style scoped>

</style>
