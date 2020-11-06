<template>
  <a class="google" block @click="toGoogleLogin">
    <img
      :src="_themePreference === 'light' ? require('../assets/icons/lm-google.svg') :
        require('../assets/icons/dm-google.svg')"
    >
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
