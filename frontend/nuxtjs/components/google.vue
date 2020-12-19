<template>
  <a class="google" block @click="toGoogleLogin">
    <img
      :src="_themePreference === 'light' ? require('../assets/icons/lm-google.svg') :
        require('../assets/icons/dm-google.svg')"
    >
  </a>
</template>

<script>
import Auth from '@aws-amplify/auth'

export default {
  methods: {
    toGoogleLogin () {
      Auth.federatedSignIn({ provider: 'Google' })
    }
  }
}
</script>
