<template>

    <div class="navbar">

        <div class="toggle">
            <theme-toggle size="small" />
        </div>


        <div class="menu">
            <umt-navigation-bar
                position="top"
                :tabs="navbarOptions"
                :active-tab="navbarValue"
                @click="(e) => redirect(e)"
            />
        </div>


        <div class="picture">

            <umt-avatar
                v-if="_userState.primaryTeam"
                class="team-picture"
                icon="team-profile"
                size="small"
                color="violet"
                :src="_userState.primaryTeam.picture"
            />

            <nuxt-link to="profile">
                <umt-avatar size="large" :src="_userState.picture" />
            </nuxt-link>

        </div>

    </div>

</template>


<script>

const navbarOptions = require('@/static/data/navbarOptions.json')


export default {

    data () {
        return {

            navbarOptions,
            navbarValue: 'home'

        }
    },


    mounted () {
        this.navbarValue = this.$router.currentRoute.name
    },


    methods: {
        redirect (e) {
            this.navbarValue = e
            this.$router.push(e)
        }
    }

}
</script>
