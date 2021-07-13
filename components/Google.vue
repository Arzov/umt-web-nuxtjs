<template>

    <umt-button type="icon" color="green" icon="google" @click="toGoogleLogin" />

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
