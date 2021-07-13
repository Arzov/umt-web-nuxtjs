<template>

    <umt-modal v-if="!_globalState.allowGeoloc" class="geoloc" :closable="false">

        <div v-if="isDenied">

            <center>
                <img :src="require(`@/assets/icons/${_themePrefix}-pin.svg`)">
                <h2>¡Ubicación denegada!</h2>
            </center>

            <br>

            <p>
                Necesitas habilitar la ubicación para utilizar la aplicación.
                Debes configurar tu navegador.
            </p>

            <p>
                <b>Chrome:</b> En la parte superior izquierda, haz clic en el
                ícono de información al lado de la URL del sitio web. Aquí,
                podrás permitir o bloquear tu ubicación.
            </p>

            <p>
                <b>Safari:</b> Haz clic en Safari en la parte superior de la
                pantalla > Preferencias > selecciona la pestaña Privacidad > Uso
                del sitio web de los servicios de ubicación > asegúrate de que
                esté seleccionado "Preguntar por cada sitio web una vez al día".
            </p>

            <p>
                <b>Firefox:</b> Toca el ícono de información junto al URL del
                sitio web > Permisos > Ubicación.
            </p>

            <umt-button @click="back">
                Atrás
            </umt-button>

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

        <umt-top-progress ref="topProgress" />

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

            this.handleTopProgress('start')

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

                        this.handleTopProgress('done')
                        this.$store.dispatch('global/setState', params)

                    })
                    .catch((e) => {
                        this.handleTopProgress('fail')
                        this.showNotification(e.title, e.msg, e.type)
                    })

            },

            (err) => {

                this.handleTopProgress('fail')

                switch (err.code) {
                case err.PERMISSION_DENIED:
                    this.isDenied = true
                    break

                default:
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
