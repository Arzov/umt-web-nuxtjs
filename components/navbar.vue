<template>
  <div class="navbar">
    <div />
    <div class="navbarMenu">
      <div v-for="menu in options" :key="menu.key">
        <a-tooltip placement="bottom">
          <template slot="title">
            <span>{{ menu.label }}</span>
          </template>
          <nuxt-link :to="menu.url">
            <img v-if="menu.key != current" :src="getImage(menu.icon.normal)" alt="">
            <img v-if="menu.key == current" :src="getImage(menu.icon.active)" alt="">
          </nuxt-link>
        </a-tooltip>
      </div>
    </div>
    <div class="navbarPicture">
      <a-avatar
        size="small"
        class="teamPicture"
        :src="teamPicture"
      />
      <a-avatar size="large" :src="_userState.picture" />
    </div>
  </div>
</template>

<script>
export default {
    data () {
        return {
            options: require('@/static/data/navbarOptions.json')
        }
    },
    computed: {
        current () {
            return this.$route.name
        },
        teamPicture () {
            if (this._userState.primaryTeam && this._userState.primaryTeam.picture) {
                return this._userState.primaryTeam.picture
            } else {
                return this.getImage('team-profile.svg')
            }
        }
    },
    methods: {
        getImage (image) {
            const mode = this._themePreference === 'light' ? 'lm' : 'dm'
            return require(`@/assets/icons/${mode}-${image}`)
        }
    }
}
</script>
