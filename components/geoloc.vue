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
        <p><b>¡Ubicación denegada!</b></p>
        <p>
          Necesitas habilitar la ubicación para utilizar la aplicación.
          Debes configurar tu navegador.
        </p>
        <!--TODO: Falta implementar accion-->
        <PrincipalBtn
          text="CONFIGURAR"
          @click.native="back"
        />
        <TextBtn text="Atrás" @click.native="back" />
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
import errorNotification from '@/static/data/errorNotification.json'

export default {
  data () {
    return {
      isDenied: false
    }
  },
  computed: {
    visible () { return !this._allowGeoloc }
  },
  methods: {
    back () {
      this.isDenied = false
    },
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
            const params = {
              allowGeoloc: true
            }
            this.btnLoading = false
            this.$store.dispatch('global/setGeoloc', params)
          })
          .catch((e) => {
            // TODO: Arreglar estilo de notificacion
            this.showNotification(e.title, e.msg, e.type)
            this.btnLoading = false
          })
      }, (err) => {
        this.btnLoading = false
        switch (err.code) {
          case err.PERMISSION_DENIED:
            this.isDenied = true
            break

          default:
            // TODO: Arreglar estilo de notificacion
            this.showNotification(
              errorNotification.title,
              errorNotification.msg,
              errorNotification.type
            )
            break
        }
      })
    }
  }
}
</script>
