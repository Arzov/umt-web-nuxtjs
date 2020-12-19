<template>
  <a class="facebook" block @click="toFacebookLogin">
    <img
      :src="_themePreference === 'light' ? require('../assets/icons/lm-facebook.svg') :
        require('../assets/icons/dm-facebook.svg')"
    >
  </a>
</template>

<script>
import Auth from '@aws-amplify/auth'

export default {
  methods: {
    toFacebookLogin () {
      Auth.federatedSignIn({ provider: 'Facebook' })
    }
  }
}
</script>
