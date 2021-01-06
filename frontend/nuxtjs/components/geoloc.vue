<template>
  <a-modal
    v-model="visible"
    class="geoloc"
    centered
    :wrap-class-name="_themePreference === 'light' ? 'lmBody' : 'dmBody'"
    :mask-closable="false"
    :closable="false"
    :footer="false"
  >
    <div v-if="isDenied">
      <div class="image">
        <img
          class="pin"
          :src="_themePreference === 'light' ? require('../assets/icons/lm-pin.svg') :
            require('../assets/icons/dm-pin.svg')"
        >
      </div>
      <br>
      <a-row type="flex" justify="center" align="top">
        <p><b>Nop</b></p>
        <p>
          Umatch utiliza tu ubicación para encontrar rivales cercanos.
          Presiona el botón "Aceptar" y luego debes permitir el acceso a la ubicación,
          de lo contrario no podrás usar la aplicación.
        </p>
        <PrincipalBtn
          text="ACEPTAR"
          :loading="btnLoading"
          @click.native="getPosition"
        />
        <SignOutBtn />
      </a-row>
    </div>
    <div v-else>
      <div class="image">
        <img
          class="pin"
          :src="_themePreference === 'light' ? require('../assets/icons/lm-pin.svg') :
            require('../assets/icons/dm-pin.svg')"
        >
      </div>
      <br>
      <a-row type="flex" justify="center" align="top">
        <p><b>Comparte tu ubicación</b></p>
        <p>
          Umatch utiliza tu ubicación para encontrar rivales cercanos.
          Presiona el botón "Aceptar" y luego debes permitir el acceso a la ubicación,
          de lo contrario no podrás usar la aplicación.
        </p>
        <PrincipalBtn
          text="ACEPTAR"
          :loading="btnLoading"
          @click.native="getPosition"
        />
        <SignOutBtn />
      </a-row>
    </div>
  </a-modal>
</template>

<script>
export default {
  data () {
    return {
      visible: !this._allowGeoloc,
      isDenied: false
    }
  },
  methods: {
    getPosition () {
      this.btnLoading = true
      navigator.geolocation.getCurrentPosition((position) => {
        const params = {
          api: 'umt',
          email: this._userState.email,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          genderFilter: this._userState.genderFilter,
          matchFilter: this._userState.matchFilter,
          ageMinFilter: this._userState.ageMinFilter,
          ageMaxFilter: this._userState.ageMaxFilter,
          positions: this._userState.positions,
          skills: this._userState.skills,
          foot: this._userState.foot,
          weight: this._userState.weight,
          height: this._userState.height
        }

        this.$store.dispatch('user/update', params)
          .then(() => {
            this.btnLoading = false
          })
          .catch((e) => {
            this.showNotification()
            this.btnLoading = false
          })
      }, (err) => {
        switch (err.code) {
          // Permiso denegado
          case err.PERMISSION_DENIED:
            this.isDenied = true
            break

          default:
            this.showNotification()
            break
        }
      })
    }
  }
}
</script>
