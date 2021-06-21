<template>

    <a class="facebook" @click="toFacebookLogin">
        <img
            :src="require(`@/assets/icons/${_themePrefix}-facebook.svg`)"
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
