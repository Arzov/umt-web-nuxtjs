<template>
  <a class="google" block @click="toGoogleLogin">
    <img v-if="_themePreference === 'light'" :src="require('../assets/icons/lm-google.svg')">
    <img v-else :src="require('../assets/icons/dm-google.svg')">
  </a>
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
