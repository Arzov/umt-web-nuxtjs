<template>
  <a class="google" block @click="toGoogleLogin" />
</template>

<script>
export default {
  methods: {
    toGoogleLogin () {
      this.$AWS.Auth.federatedSignIn({ provider: 'Google' })
    }
  }
}
</script>
