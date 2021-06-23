<template>
    <div class="home">
        <img class="homeTopLeft" src="@/assets/images/home-top-left.svg">
        <img
            class="homeBottomRight"
            src="@/assets/images/home-bottom-right.svg"
        >
        <a-row>
            <a-col class="leftContent" :span="12">
                <h1>¡Hola {{ _userState.firstName }}!</h1>

                <h1 style="font-weight: 400; margin-bottom: 48px">
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
                <ScrollContainer @bottomScroll="callStore(_activeOption, true)">
                    <!-- Challenge -->

                    <div v-if="_activeOption === 'challenge'">
                        <h3>DESAFIAR</h3>
                        <div v-if="_userState.primaryTeam">
                            <ListDisplay v-if="loading" :loading="loading" />
                            <div v-if="!loading">
                                <div v-if="_nearTeams.length">
                                    <div
                                        v-for="team in _nearTeams"
                                        :key="`t${team.id}`"
                                    >
                                        <ListDisplay
                                            :team="team"
                                            @click="sendMatchRequest(team)"
                                        />
                                    </div>
                                </div>
                                <div v-else>
                                    <!-- TODO: Put image -->
                                    <b>¡Lo sentimos!.</b> No encontramos equipos
                                    rivales cercanos. Intenta más tarde.
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <!-- TODO: Put image -->
                            <b>¡Lo sentimos!.</b> Debes tener un equipo para
                            poder buscar equipos rivales.
                        </div>
                    </div>

                    <!-- Patch -->

                    <div v-else-if="_activeOption === 'patch'">
                        <h3>PARCHAR</h3>
                        <ListDisplay
                            v-if="loading"
                            :loading="loading"
                            type="patch"
                        />
                        <div v-if="!loading">
                            <div v-if="_nearMatches.length">
                                <div
                                    v-for="match in _nearMatches"
                                    :key="`m${match.teamId1}${match.teamId2}`"
                                >
                                    <ListDisplay
                                        :match="match"
                                        type="patch"
                                        @click="sendMatchPatchRequest(match)"
                                    />
                                </div>
                            </div>
                            <div v-else>
                                <!-- TODO: Put image -->
                                <b>¡Lo sentimos!.</b> No encontramos partidos
                                cercanos. Intenta más tarde.
                            </div>
                        </div>
                    </div>

                    <!-- Join team -->

                    <div v-else>
                        <h3>EQUIPOS</h3>
                        <ListDisplay v-if="loading" :loading="loading" />
                        <div v-if="!loading">
                            <div v-if="_nearTeamsForJoin.length">
                                <div
                                    v-for="team in _nearTeamsForJoin"
                                    :key="`t${team.id}`"
                                >
                                    <ListDisplay
                                        :team="team"
                                        @click="sendTeamMemberRequest(team)"
                                    />
                                </div>
                            </div>
                            <div v-else>
                                <!-- TODO: Put image -->
                                <b>¡Lo sentimos!.</b> No encontramos equipos
                                cercanos. Intenta más tarde.
                            </div>
                        </div>
                    </div>
                </ScrollContainer>
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
        this.$store
            .dispatch('user/listTeams')
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
                    this.$store
                        .dispatch('home/nearTeams', {
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
                this.$store
                    .dispatch('home/nearMatches', {
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
                this.$store
                    .dispatch('home/nearTeams', {
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
            this.$store
                .dispatch('home/sendMatchRequest', team)
                .then((e) => {
                    this.showNotification(e.title, e.msg, e.type)
                })
                .catch((e) => {
                    this.showNotification(e.title, e.msg, e.type)
                })
        },

        sendMatchPatchRequest (match) {
            this.$store
                .dispatch('home/sendMatchPatchRequest', match)
                .then((e) => {
                    this.showNotification(e.title, e.msg, e.type)
                })
                .catch((e) => {
                    this.showNotification(e.title, e.msg, e.type)
                })
        },

        sendTeamMemberRequest (team) {
            this.$store
                .dispatch('home/sendTeamMemberRequest', team)
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
