<template>

    <umt-theme-provider :theme="_globalState.themePreference">

        <umt-navigation-bar
            position="top"
            :tabs="navbarOptions"
            :active-tab="navigationValue"
            @click="(e) => navigationValue = e"
        />

        <Nuxt class="page" />

    </umt-theme-provider>

</template>


<script>

const navbarOptions = require('@/static/data/navbarOptions.json')


export default {

    props: {
        theme: {
            type: String,
            default: 'dark'
        }
    },


    data () {
        return {

            navbarOptions,
            navigationValue: 'home'

        }
    }

}

</script>
