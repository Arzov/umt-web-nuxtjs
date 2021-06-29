<template>

    <umt-button type="icon" color="green" icon="facebook" @click="toFacebookLogin" />

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
