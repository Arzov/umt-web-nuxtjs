import Vue from 'vue'
import errorNotification from '@/static/data/errorNotification.json'


// global mixin for all components

const global = {

    data () {
        return {

            // button loading indicator

            btnLoading: false
        }
    },

    computed: {

        // user state from store

        _userState () {
            return this.$store.getters['user/get']
        },


        // global state from store

        _globalState () {
            return this.$store.getters['global/get']
        },


        _themePrefix () {
            return this._globalState.themePreference === 'dark' ? 'dm' : 'lm'
        }

    },

    methods: {

        // show notification component from ant-design

        showNotification (title, msg, type) {

            let icon = <a-icon type="close-circle" />

            switch (type) {

            // success
            case 'success':
                icon = <a-icon type="check-circle" />
                break

            // warning
            case 'warning':
                icon = <a-icon type="warning" />
                break

            // info
            case 'info':
                icon = <a-icon type="info-circle" />
                break
            }

            this.$notification.destroy()

            this.$notification.open({
                message         : title,
                description     : msg,
                class           : 'notification',
                getContainer    : () => this.$el,
                icon
            })
        },


        // get icon from assets

        getIcon (icon) {
            return require(`@/assets/icons/${this._themePrefix}-${icon}`)
        }

    }

}

Vue.mixin(global)


// validate if geolocation is activated by the user

export const validGeoloc = {

    mounted () {

        if ('geolocation' in navigator) {

            if (this._globalState.allowGeoloc) {

                navigator.geolocation.getCurrentPosition(


                    // position obtained from browser

                    (position) => {

                        // distance between current user's position and stored user's position

                        const moveDistance = this.$UTILS.getDistance(
                            position.coords.latitude,
                            position.coords.longitude,
                            this._userState.coords.LAT.N,
                            this._userState.coords.LON.N
                        )

                        // update location if distance is greater than 5km

                        if (moveDistance >= 5) {

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

                            this.$store
                                .dispatch('user/update', params)

                                // update location
                                .then(() => {

                                    const params = { allowGeoloc: true }

                                    this.$store.dispatch(
                                        'global/setState',
                                        params
                                    )
                                })

                                // error
                                .catch((e) => {
                                    this.showNotification(
                                        e.title,
                                        e.msg,
                                        e.type
                                    )
                                })
                        }
                    },


                    // user have denied permission to geolocation

                    (err) => {

                        const params = { allowGeoloc: false }

                        this.$store.dispatch('global/setState', params)

                        switch (err.code) {

                        // permission denied
                        case err.PERMISSION_DENIED:
                            break


                        // unknown error
                        default:
                            this.showNotification({ ...errorNotification })
                            break
                        }

                    }
                )
            }
        }


        // the user device doesn't support geolocation

        else {
            this.showNotification(
                '¡Geolocalización no disponible!',
                'No puedes usar la app en este dispositivo.',
                errorNotification.type
            )
        }
    }

}
