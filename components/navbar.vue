<template>
    <div class="navbar">
        <div class="navbarToggle">
            <ThemeToggle />
        </div>

        <div class="navbarMenu">
            <div v-for="menu in options" :key="menu.key">
                <a-tooltip placement="bottom">
                    <template slot="title">
                        <span>{{ menu.label }}</span>
                    </template>
                    <nuxt-link :to="menu.url">
                        <img
                            v-if="menu.key != current"
                            :src="getIcon(menu.icon.normal)"
                            alt=""
                        />
                        <img
                            v-if="menu.key == current"
                            :src="getIcon(menu.icon.active)"
                            alt=""
                        />
                    </nuxt-link>
                </a-tooltip>
            </div>
        </div>

        <div class="navbarPicture">
            <a-avatar size="small" class="teamPicture" :src="teamPicture" />

            <nuxt-link to="profile">
                <a-avatar size="large" :src="userPicture" />
            </nuxt-link>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            options: require("@/static/data/navbarOptions.json"),
        };
    },
    computed: {
        current() {
            return this.$route.name;
        },
        teamPicture() {
            if (
                this._userState.primaryTeam &&
                this._userState.primaryTeam.picture
            )
                return this._userState.primaryTeam.picture;
            else return this.getIcon("team-profile.svg");
        },
        userPicture() {
            if (this._userState.picture) return this._userState.picture;
            else return this.getIcon("avatar.svg");
        },
    },
};
</script>
