<template>

    <div class="home">

        <img class="home-top-left" src="@/assets/images/home-top-left.svg">
        <img class="home-bottom-right" src="@/assets/images/home-bottom-right.svg">


        <!-- CENTER CONTENT -->

        <div class="center-content">

            <h1>¡Hola {{ _userState.firstName }}!</h1>

            <h1 style="font-weight: 400;">
                Busca nuevos desafíos.
            </h1>

            <br>

            <umt-tabs>

                <!-- CHALLENGES -->

                <umt-tab-panel tab="1" label="desafiar">

                    <p>
                        Puedes desafiar a otros equipos sólo si tienes o perteneces a un equipo.
                    </p>

                    <div v-if="_userState.primaryTeam">

                        <div v-if="_nearTeams.length">

                            <umt-request-cell
                                v-for="(team, index) in _nearTeams"
                                :key="index"
                                :team="team"
                                @click="sendMatchRequest(team)"
                            />

                        </div>

                        <div v-else>
                            <center v-if="!loading">
                                <img src="@/assets/images/football-circle.svg" style="width: 250px">
                                <p>
                                    <b>¡Lo sentimos!.</b> No encontramos equipos
                                    rivales cercanos. Intenta más tarde.
                                </p>
                            </center>
                        </div>

                        <div v-if="loading">
                            <umt-skeleton v-for="index in 3" :key="index" />
                        </div>

                        <umt-button @click="callStore('challenge')">
                            SEGUIR BUSCANDO
                        </umt-button>

                    </div>

                    <div v-else>
                        <center>
                            <img src="@/assets/images/football-circle.svg" style="width: 250px">
                            <p>
                                <b>¡Lo sentimos!.</b> Debes tener un equipo para
                                poder buscar equipos rivales.
                            </p>
                        </center>
                    </div>

                </umt-tab-panel>


                <!-- PATCH -->

                <umt-tab-panel tab="2" label="parchar">

                    <p>
                        Únete a partidos cercanos a ti.
                        Puedes parchar de manera individual a equipos que requieran de jugadores.
                    </p>

                    <div v-if="_nearMatches.length">
                        <umt-patch-cell
                            v-for="(match, index) in _nearMatches"
                            :key="index"
                            :match="match"
                            @click="sendMatchPatchRequest(match)"
                        />
                    </div>

                    <div v-else>
                        <center v-if="!loading">
                            <img src="@/assets/images/football-circle.svg" style="width: 250px">
                            <p>
                                <b>¡Lo sentimos!.</b> No encontramos partidos
                                cercanos. Intenta más tarde.
                            </p>
                        </center>
                    </div>

                    <div v-if="loading">
                        <umt-skeleton v-for="index in 3" :key="index" />
                    </div>

                    <umt-button @click="callStore('patch')">
                        SEGUIR BUSCANDO
                    </umt-button>

                </umt-tab-panel>


                <!-- TEAMS -->

                <umt-tab-panel tab="3" label="equipos">

                    <p>
                        ¿No tienes equipo?
                        Busca uno cercano a ti o encuentra alguno por su nombre.
                    </p>

                    <div v-if="_nearTeamsForJoin.length">

                        <umt-request-cell
                            v-for="(team, index) in _nearTeamsForJoin"
                            :key="index"
                            :team="team"
                            @click="sendTeamMemberRequest(team)"
                        />

                    </div>

                    <div v-else>
                        <center v-if="!loading">
                            <img src="@/assets/images/football-circle.svg" style="width: 250px">
                            <p>
                                <b>¡Lo sentimos!.</b> No encontramos equipos
                                cercanos. Intenta más tarde.
                            </p>
                        </center>
                    </div>

                    <div v-if="loading">
                        <umt-skeleton v-for="index in 3" :key="index" />
                    </div>

                    <umt-button @click="callStore('search')">
                        SEGUIR BUSCANDO
                    </umt-button>

                </umt-tab-panel>

            </umt-tabs>

        </div>

        <geoloc />

        <umt-top-progress ref="topProgress" />

    </div>

</template>


<script>

import { validGeoloc } from '@/plugins/mixins'


export default {

    mixins: [validGeoloc],


    layout: 'navbar',


    data () {
        return {
            loading: true
        }
    },


    computed: {

        _nearTeams () {
            return this.$store.getters['home/get'].nearTeams
        },

        _nearTeamsForJoin () {
            return this.$store.getters['home/get'].nearTeamsForJoin
        },

        _nearMatches () {
            return this.$store.getters['home/get'].nearMatches
        }

    },


    mounted () {

        this.$store.dispatch('user/listTeams')
            .then(async () => {

                try {
                    await this.callStore('challenge')
                    await this.callStore('patch')
                    await this.callStore('search')
                }

                catch (e) {
                    this.showNotification(e.title, e.msg, e.type)
                }

            })
            .catch((e) => {
                this.showNotification(e.title, e.msg, e.type)
            })

    },


    methods: {

        callStore (action) {

            this.loading = true

            switch (action) {

            case 'challenge': {
                if (this._userState.primaryTeam) {
                    this.$store.dispatch('home/nearTeams', { forJoin: false })
                        .then(() => {
                            this.loading = false
                        })
                        .catch((e) => {
                            this.showNotification(e.title, e.msg, e.type)
                        })
                }
                break
            }


            case 'patch': {
                this.$store.dispatch('home/nearMatches')
                    .then(() => {
                        this.loading = false
                    })
                    .catch((e) => {
                        this.showNotification(e.title, e.msg, e.type)
                    })
                break
            }


            case 'search': {
                this.$store.dispatch('home/nearTeams', { forJoin: true })
                    .then(() => {
                        this.loading = false
                    })
                    .catch((e) => {
                        this.showNotification(e.title, e.msg, e.type)
                    })
                break
            }

            }

        },


        sendMatchRequest (team) {

            this.handleTopProgress('start')

            this.$store.dispatch('home/sendMatchRequest', team)
                .then((e) => {
                    this.handleTopProgress('done')
                    this.showNotification(e.title, e.msg, e.type)
                })
                .catch((e) => {
                    this.handleTopProgress('fail')
                    this.showNotification(e.title, e.msg, e.type)
                })

        },


        sendMatchPatchRequest (match) {

            this.handleTopProgress('start')

            this.$store.dispatch('home/sendMatchPatchRequest', match)
                .then((e) => {
                    this.handleTopProgress('done')
                    this.showNotification(e.title, e.msg, e.type)
                })
                .catch((e) => {
                    this.handleTopProgress('fail')
                    this.showNotification(e.title, e.msg, e.type)
                })

        },


        sendTeamMemberRequest (team) {

            this.handleTopProgress('start')

            this.$store.dispatch('home/sendTeamMemberRequest', team)
                .then((e) => {
                    this.handleTopProgress('done')
                    this.showNotification(e.title, e.msg, e.type)
                })
                .catch((e) => {
                    this.handleTopProgress('fail')
                    this.showNotification(e.title, e.msg, e.type)
                })

        }

    }

}

</script>
