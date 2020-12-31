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
  </a-modal>
</template>

<script>
export default {
  data () {
    return {
      visible: !this._allowGeoloc
    }
  },
  methods: {
    getPosition () {
      navigator.geolocation.getCurrentPosition(function (position) {
        const params = {
          email: this._userState.email,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          genderFilter: this._userState.genderFilter,
          matchFilter: this._userState.matchFilter,
          ageMinFilter: this._userState.ageMinFilter,
          ageMaxFilter: this._userState.ageMaxFilter
        }

        this.$store.dispatch('user/updatePosition', params)

        // Error en la peticion de la ubicacion
      }, function (err) {
        console.log(err)
        // const params = {
        //   toggle: true,
        //   allow: false
        // }

        // switch (error.code) {
        //   // Permiso denegado
        //   case error.PERMISSION_DENIED:
        //     // Mostrar popup para que el usuario configure la ubicacion
        //     vue.$store.dispatch('geoloc/update', params)
        //     break

        //   default:
        //     console.log('Error desconocido.')
        //     break
        // }
      })
    },
    resetStates () {
    //   this.$store.dispatch('geoloc/resetStates')
    }
  }
}
</script>
