<template>
    <div class="profileDisplay">
        <div type="container">
            <div class="userPicture">
                <a-avatar size="large" :src="_userPicture" />
            </div>
            <div class="content">
                <h3>{{ user.firstName }}</h3>

                <nuxt-link v-if="user.teams" to="" style="cursor: default">
                    <i>{{ _teamsNames.join(" | ") | uppercase }}</i>
                </nuxt-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        user: { type: Object, default: () => {} }
    },
    computed: {
        _userPicture () {
            if (this.user.picture) {
                return this.user.picture
            }
            else {
                return this.getIcon('avatar.svg')
            }
        },
        _teamsNames () {
            if (this.user.teams) {
                return this.user.teams.map((team) => {
                    return team.name
                })
            }
            else {
                return null
            }
        }
    }
}
</script>
