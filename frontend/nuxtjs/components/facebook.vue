<template>
  <a class="facebook" block @click="toFacebookLogin" />
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
