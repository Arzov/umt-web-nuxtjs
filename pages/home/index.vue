<template>
  <div class="home">
    <img class="homeTopLeft" src="@/assets/images/home-top-left.svg">
    <a-row>
      <a-col class="leftContent" :span="12">
        <h1>¡Hola {{ _userState.firstName }}!</h1>
        <h1 style="font-weight: 400; margin-bottom: 48px;">
          Busca nuevos desafíos.
        </h1>
        <div v-for="menu in options" :key="menu.key">
          <CardBtn
            :key="menu.key"
            :title="menu.title"
            :icon="menu.icon"
            :desc="menu.desc"
            :active="menu.active"
            :value="menu.key"
            @change="selectOption($event)"
          />
        </div>
      </a-col>
      <a-col class="rightContent" :span="12">
        <div v-for="team in _userState.teams" :key="team.id">
          <ListDisplay
            :title="team.name"
            :picture1="team.picture"
            desc="A 2 Kilometros"
            @change="selectOption($event)"
          />
        </div>
        <ListDisplay
          title="rpc"
          desc="A 2 Kilometros"
        />
        <ListDisplay
          title="rpc"
          desc="A 2 Kilometros"
          type="patch"
        />
        <ThemeToggle />
      </a-col>
    </a-row>
    <img class="homeBottomRight" src="@/assets/images/home-bottom-right.svg">
    <Geoloc />
  </div>
</template>

<script>
import { validGeoloc } from '@/plugins/mixins'

export default {
  mixins: [validGeoloc],
  layout: 'navbar',
  data () {
    return {
      options: require('@/static/data/homeOptions.json')
    }
  },
  computed: {
    activeOption () {
      return this.options.filter(m => m.active === true)[0].key
    }
    // teamsWithDistance () {
    //   return this._userState.teams.map((x) => {
    //     {...x, }
    //   })
    // }
  },
  mounted () {
    this.$store.dispatch('user/listTeams', { email: this._userState.email })
      .then((result) => {
      })
      .catch((e) => {
        this.showNotification(e.title, e.msg, e.type)
      })
  },
  methods: {
    selectOption (e) {
      this.options = this.options.map((m) => {
        let active = false

        if (m.key === e) {
          active = true
        }

        return {
          ...m,
          active
        }
      })
    }
  }
}
</script>
