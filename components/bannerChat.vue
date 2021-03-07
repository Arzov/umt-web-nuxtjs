<template>
  <div>
    <a-row class="bannerChat" @click="toggle">
      <a-col class="imgContainer" :span="4">
        <img src="../assets/images/corner-top-right.svg" alt="">
        <a-avatar
          size="large"
          class="teamPicture"
          :src="teamPicture"
        />
      </a-col>
      <a-col class="content" :span="20">
        <center>
          <h2>{{ teamName }}</h2>
        </center>
        <br>
        <center>
          haz click aquí para más info
        </center>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  props: {
    teamName: { type: String, default: 'NOMBRE EQUIPO' },
    active: { type: Boolean, default: false },
    value: { type: String, default: null }
  },
  computed: {
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
    },
    toggle () {
      this.$emit('click', this.value)
    }
  }
}
</script>
