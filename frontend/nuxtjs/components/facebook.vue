<template>
  <a class="facebook" block @click="toFacebookLogin">
    <img
      :src="_themePreference === 'light' ? require('../assets/icons/lm-facebook.svg') :
        require('../assets/icons/dm-facebook.svg')"
    >
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
