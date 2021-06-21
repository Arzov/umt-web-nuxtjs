<template>

    <a class="google" @click="toGoogleLogin">
        <img
            :src="require(`@/assets/icons/${_themePrefix}-google.svg`)"
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
