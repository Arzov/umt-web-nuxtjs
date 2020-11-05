<template>
  <a class="facebook" block @click="toFacebookLogin">
    <img v-if="_themePreference === 'light'" :src="require('../assets/icons/lm-facebook.svg')">
    <img v-else :src="require('../assets/icons/dm-facebook.svg')">
  </a>
</template>

<script>
export default {
  methods: {
    toFacebookLogin () {
      this.$AWS.Auth.federatedSignIn({ provider: 'Facebook' })
    }
  }
}
</script>
