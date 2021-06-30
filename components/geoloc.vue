<template>

    <umt-modal v-if="!_globalState.allowGeoloc" class="geoloc" :closable="false">

        <div v-if="isDenied">

            <center>
                <img :src="require(`@/assets/icons/${_themePrefix}-pin.svg`)">
                <h2>¡Ubicación denegada!</h2>
            </center>

            <br>

            <p>
                Necesitas habilitar la ubicación para utilizar la
                aplicación. Debes configurar tu navegador.
            </p>

            <!--TODO: Falta implementar accion-->

            <umt-button @click="back">
                CONFIGURAR
            </umt-button>

            <center><nuxt-link to="" @click.native="back">Atrás</nuxt-link></center>

        </div>


        <div v-else>

            <center>
                <img :src="require(`@/assets/icons/${_themePrefix}-pin.svg`)">
                <h2>Comparte tu ubicación</h2>
            </center>

            <br>

            <p>
                <b>Umatch</b> utiliza tu ubicación para encontrar rivales cercanos.
                Presiona el botón <b>"Aceptar"</b> y luego debes permitir el acceso
                a la ubicación, de lo contrario no podrás usar la aplicación.
            </p>

            <umt-button @click="getPosition">
                ACEPTAR
            </umt-button>

            <center><signout-btn /></center>

        </div>

    </umt-modal>

</template>


<script>

import errorNotification from '@/static/data/errorNotification.json'


export default {

    data () {
        return {
            isDenied: false
        }
    },


    methods: {

        back () {
            this.isDenied = false
        },


        getPosition () {

            this.btnLoading = true

            navigator.geolocation.getCurrentPosition((position) => {

                const params = {
                    api             : 'umt',
                    email           : this._userState.email,
                    latitude        : position.coords.latitude,
                    longitude       : position.coords.longitude,
                    matchFilter     : this._userState.matchFilter,
                    ageMinFilter    : this._userState.ageMinFilter,
                    ageMaxFilter    : this._userState.ageMaxFilter,
                    positions       : this._userState.positions,
                    skills          : this._userState.skills,
                    foot            : this._userState.foot,
                    weight          : this._userState.weight,
                    height          : this._userState.height
                }

                this.$store.dispatch('user/update', params)
                    .then(() => {

                        const params = {
                            allowGeoloc: true
                        }

                        this.btnLoading = false
                        this.$store.dispatch('global/setState', params)

                    })
                    .catch((e) => {
                        // FIXME: Fix notification style
                        this.btnLoading = false
                        this.showNotification(e.title, e.msg, e.type)
                    })

            },

            (err) => {

                this.btnLoading = false

                switch (err.code) {
                case err.PERMISSION_DENIED:
                    this.isDenied = true
                    break

                default:
                    // FIXME: Fix notification style
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
