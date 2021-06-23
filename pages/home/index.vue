<template>

    <div class="home">

        <img class="home-top-left" src="@/assets/images/home-top-left.svg">

        <img class="home-bottom-right" src="@/assets/images/home-bottom-right.svg">


        <a-row>


            <!-- LEFT CONTENT -->

            <a-col class="left-content" :span="12">

                <h1>¡Hola {{ _userState.firstName }}!</h1>

                <h1 style="font-weight: 400; margin-bottom: 48px">
                    Busca nuevos desafíos.
                </h1>

                <div v-for="menu in options" :key="menu.key">
                    <card-btn
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


            <!-- RIGHT CONTENT -->

            <a-col class="right-content" :span="12">

                <scroll-container @bottomScroll="callStore(_activeOption, true)">


                    <!-- CHALLENGE -->

                    <div v-if="_activeOption === 'challenge'">

                        <h3>DESAFIAR</h3>

                        <div v-if="_userState.primaryTeam">

                            <div v-if="loading">
                                <umt-skeleton v-for="index in 3" :key="index" />
                            </div>

                            <div v-if="!loading">

                                <div v-if="_nearTeams.length">

                                    <umt-request-cell
                                        v-for="(team, index) in _nearTeams"
                                        :key="index"
                                        :team="team"
                                        button-label="desafiar"
                                        @click="sendMatchRequest(team)"
                                    />

                                </div>

                                <div v-else>
                                    <!-- TODO: Put image -->
                                    <p>
                                        <b>¡Lo sentimos!.</b> No encontramos equipos
                                        rivales cercanos. Intenta más tarde.
                                    </p>
                                </div>

                            </div>

                        </div>

                        <div v-else>
                            <!-- TODO: Put image -->
                            <p>
                                <b>¡Lo sentimos!.</b> Debes tener un equipo para
                                poder buscar equipos rivales.
                            </p>
                        </div>

                    </div>


                    <!-- PATCH -->

                    <div v-else-if="_activeOption === 'patch'">

                        <h3>PARCHAR</h3>

                        <div v-if="loading">
                            <umt-skeleton v-for="index in 3" :key="index" />
                        </div>

                        <div v-if="!loading">

                            <div v-if="_nearMatches.length">

                                <!-- FIXME: Object structure for match is not correct -->
                                <umt-patch-cell
                                    v-for="(match, index) in _nearMatches"
                                    :key="index"
                                    :match="match"
                                    @click="sendMatchPatchRequest(match)"
                                />

                            </div>

                            <div v-else>
                                <!-- TODO: Put image -->
                                <p>
                                    <b>¡Lo sentimos!.</b> No encontramos partidos
                                    cercanos. Intenta más tarde.
                                </p>
                            </div>

                        </div>

                    </div>


                    <!-- JOIN TEAM -->

                    <div v-else>

                        <h3>EQUIPOS</h3>

                        <div v-if="loading">
                            <umt-skeleton v-for="index in 3" :key="index" />
                        </div>

                        <div v-if="!loading">

                            <div v-if="_nearTeamsForJoin.length">

                                <umt-request-cell
                                    v-for="(team, index) in _nearTeamsForJoin"
                                    :key="index"
                                    :team="team"
                                    button-label="solicitar"
                                    @click="sendTeamMemberRequest(team)"
                                />

                            </div>

                            <div v-else>
                                <!-- TODO: Put image -->
                                <p>
                                    <b>¡Lo sentimos!.</b> No encontramos equipos
                                    cercanos. Intenta más tarde.
                                </p>
                            </div>

                        </div>

                    </div>

                </scroll-container>

            </a-col>

        </a-row>

        <geoloc />

    </div>

</template>


<script>

import { validGeoloc } from '@/plugins/mixins'


export default {

    mixins: [validGeoloc],


    layout: 'navbar',


    data () {
        return {
            loading: true,
            options: require('@/static/data/homeOptions.json')
        }
    },


    computed: {
        _activeOption () {
            return this.options.filter(m => m.active === true)[0].key
        },
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
            .then(() => {
                this.callStore(this._activeOption)
            })
            .catch((e) => {
                this.showNotification(e.title, e.msg, e.type)
            })
    },


    methods: {

        callStore (action, isInfiniteScroll) {

            this.loading = true

            switch (action) {

            case 'challenge': {
                if (this._userState.primaryTeam) {
                    this.$store.dispatch('home/nearTeams', {
                        forJoin: false,
                        isInfiniteScroll
                    })
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
                this.$store.dispatch('home/nearMatches', {
                    forJoin: false,
                    isInfiniteScroll
                })
                    .then(() => {
                        this.loading = false
                    })
                    .catch((e) => {
                        this.showNotification(e.title, e.msg, e.type)
                    })
                break
            }


            case 'search': {
                this.$store.dispatch('home/nearTeams', {
                    forJoin: true,
                    isInfiniteScroll
                })
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


        selectOption (e) {
            // Avoid reload when action is already selected
            if (e !== this._activeOption) {
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

                this.callStore(e)
            }
        },


        sendMatchRequest (team) {
            this.$store.dispatch('home/sendMatchRequest', team)
                .then((e) => {
                    this.showNotification(e.title, e.msg, e.type)
                })
                .catch((e) => {
                    this.showNotification(e.title, e.msg, e.type)
                })
        },


        sendMatchPatchRequest (match) {
            this.$store.dispatch('home/sendMatchPatchRequest', match)
                .then((e) => {
                    this.showNotification(e.title, e.msg, e.type)
                })
                .catch((e) => {
                    this.showNotification(e.title, e.msg, e.type)
                })
        },


        sendTeamMemberRequest (team) {
            this.$store.dispatch('home/sendTeamMemberRequest', team)
                .then((e) => {
                    this.showNotification(e.title, e.msg, e.type)
                })
                .catch((e) => {
                    this.showNotification(e.title, e.msg, e.type)
                })
        }

    }

}
</script>
