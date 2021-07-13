<template>

    <div class="matches">

        <!-- MODALS -->

        <modal-add-patch v-if="showAddPlayer" :match="activeMatch" @close="showAddPlayer = !showAddPlayer" />


        <!-- LEFT CONTENT -->

        <div class="left-content">

            <img class="cup" src="@/assets/images/cup.svg">

            <umt-tabs>

                <!-- ACTIVES -->

                <umt-tab-panel tab="1" label="activos">

                    <!-- TEAMS -->

                    <umt-collapsible v-for="team in _actives.teams" :key="`active-team-${team.id}`">

                        <umt-collapsible-request-header
                            slot="header"
                            :name="team.name"
                            :picture="team.picture"
                            :request-count="team.matches.matches.length"
                        />

                        <div slot="body">

                            <umt-chat-list
                                v-for="match in team.matches.matches"
                                :key="`match-chat-${match.teamId1}${match.teamId2}`"
                                :team="{
                                    name: team.id === match.teamId1 ? match.name2 : match.name1,
                                    picture: team.id === match.teamId1 ? match.picture2 : match.picture1,
                                    chat: match.chat
                                }"
                                :active="isActive(match)"
                                type="team"
                                @click="setChat(match)"
                            />

                        </div>

                    </umt-collapsible>


                    <!-- USER -->

                    <umt-collapsible>

                        <umt-collapsible-request-header
                            slot="header"
                            type="user"
                            :name="_userState.firstName"
                            :picture="_userState.picture"
                            :request-count="_actives.user.matches.length"
                        />

                        <div slot="body">

                            <umt-chat-list
                                v-for="match in _actives.user.matches"
                                :key="`match-chat-${match.teamId1}${match.teamId2}`"
                                :match="match"
                                :active="isActive(match)"
                                type="match"
                                @click="setChat(match)"
                            />

                        </div>

                    </umt-collapsible>

                </umt-tab-panel>


                <!-- REQUEST -->

                <umt-tab-panel tab="2" label="solicitudes">

                    <!-- TEAMS -->

                    <umt-collapsible v-for="team in _requests.teams" :key="`request-team-${team.id}`">

                        <umt-collapsible-request-header
                            slot="header"
                            :name="team.name"
                            :picture="team.picture"
                            :request-count="team.requests.requests.length"
                        />

                        <div slot="body">
                            <umt-request-list
                                v-for="match in team.requests.requests"
                                :key="`match-request-${match.teamId1}${match.teamId2}`"
                                :team="{
                                    name: team.id === match.teamId1 ? match.name2 : match.name1,
                                    picture: team.id === match.teamId1 ? match.picture2 : match.picture1
                                }"
                                :inbound="team.id != match.teamId1"
                                type="team"
                                @accept="acceptRequest(match, null)"
                                @reject="rejectRequest(match, null)"
                            />
                        </div>

                    </umt-collapsible>


                    <!-- USER -->

                    <umt-collapsible>

                        <umt-collapsible-request-header
                            slot="header"
                            type="user"
                            :name="_userState.firstName"
                            :picture="_userState.picture"
                            :request-count="_requests.user.requests.length"
                        />

                        <div slot="body">
                            <umt-request-list
                                v-for="match in _requests.user.requests"
                                :key="`user-request-${match.teamId1}${match.teamId2}`"
                                :match="match"
                                :inbound="true"
                                type="match"
                                @accept="acceptRequest(null, match)"
                                @reject="rejectRequest(null, match)"
                            />
                        </div>

                    </umt-collapsible>

                </umt-tab-panel>

            </umt-tabs>

        </div>


        <!-- RIGHT CONTENT -->

        <div class="right-content">


            <!-- CHAT -->

            <div v-if="activeMatch.teamId1 && !showInfoMatch" class="chat-container">


                <!-- CHAT HEADER -->

                <div class="chat-header" @click="showInfoMatch = !showInfoMatch">

                    <div class="title">

                        <center class="team-1">
                            <umt-avatar
                                class="team-picture"
                                icon="team-profile"
                                color="violet"
                                :src="activeMatch.picture1"
                            />
                        </center>

                        <center>
                            <h2>{{ activeMatch.name1 }} VS {{ activeMatch.name2 }}</h2>
                            <p>haz click aquí para más info</p>
                        </center>

                        <center class="team-2">
                            <umt-avatar
                                class="team-picture"
                                icon="team-profile"
                                color="violet"
                                :src="activeMatch.picture2"
                            />
                        </center>

                    </div>

                    <center class="info">

                        <div class="patch">
                            <img :src="require(`@/assets/icons/${_themePrefix}-patch.svg`)">
                            <h3>{{ activeMatch.patches.CP.N }}/{{ activeMatch.patches.NP.N }}</h3>
                        </div>

                        <div class="expire">
                            <img :src="require(`@/assets/icons/${_themePrefix}-expire.svg`)">
                            <div>
                                <span><h3>{{ getDate(activeMatch.expireOn) }}</h3></span>
                                <span><h3>{{ getTime(activeMatch.expireOn) }}</h3></span>
                            </div>
                        </div>

                    </center>


                </div>


                <!-- CHAT BODY -->

                <div class="chat-body">

                    <div class="messages">
                        <div
                            v-for="message in [...activeMatch.chat.messages].reverse()"
                            :key="`message${message.email}${message.sentOn}`"
                            :class="message.email == _userState.email ? 'right-message' : 'left-message'"
                        >
                            <p><b>{{ message.author }}</b> {{ getDate(message.sentOn) }} {{ getTime(message.sentOn) }}</p>
                            <p>{{ message.msg }}</p>
                            <img
                                v-if="message.email == _userState.email"
                                class="msg-corner-image"
                                src="@/assets/images/chat-corner-right.svg"
                            >
                            <img
                                v-else
                                class="msg-corner-image"
                                src="@/assets/images/chat-corner-left.svg"
                            >
                        </div>
                    </div>

                </div>


                <!-- CHAT FOOTER -->

                <div class="chat-footer">

                    <div class="emoticon">
                        <img src="@/assets/icons/emoticon.svg">
                    </div>

                    <div class="input-text">
                        <umt-input
                            v-model="inputMessage"
                            placeholder="Escribe un mensaje"
                        />
                    </div>

                    <div class="send" @click="sendMessage">
                        <img src="@/assets/icons/send.svg">
                    </div>

                </div>

            </div>


            <!-- MATCH INFORMATION -->

            <div v-if="showInfoMatch" class="match-info">

                <div class="header">

                    <img class="corner-top-right" src="@/assets/images/corner-top-right.svg">

                    <umt-button
                        type="icon"
                        color="green"
                        icon="x"
                        @click="showInfoMatch = !showInfoMatch"
                    />

                    <div class="title">

                        <center>
                            <umt-avatar
                                icon="team-profile"
                                color="violet"
                                size="large"
                                :src="activeMatch.picture1"
                            />
                        </center>

                        <center>
                            <h2>
                                {{ activeMatch.name1 }} VS {{ activeMatch.name2 }}
                            </h2>
                        </center>

                        <center>
                            <umt-avatar
                                icon="team-profile"
                                color="violet"
                                size="large"
                                :src="activeMatch.picture2"
                            />
                        </center>

                    </div>

                </div>


                <div class="title">

                    <h2>JUGADORES</h2>

                    <umt-button
                        type="icon"
                        color="violet"
                        size="small"
                        icon="plus"
                        @click="showAddPlayer = !showAddPlayer"
                    />

                </div>

                <div class="members">
                    <umt-list
                        v-for="player in activeMatch.members.members"
                        :key="`teammember-${player.teamId}${player.email}`"
                        :user="{
                            firstName: player.name,
                            picture: player.picture
                        }"
                        type="user"
                    />
                </div>

            </div>


            <!-- DEFAULT NON MATCH SELECTED -->

            <div v-if="!activeMatch.teamId1">
                <center>

                    <img src="@/assets/images/football-circle.svg" style="width: 250px">

                    <h2>PARTIDO NO SELECCIONADO</h2>

                    <br>

                    <p>
                        Selecciona un partido para acceder al chat e interactuar
                        con tus amigos y rivales.
                    </p>

                </center>
            </div>

        </div>

        <umt-top-progress ref="topProgress" />

    </div>

</template>

<script>
export default {

    layout: 'navbar',


    data () {
        return {
            activeMatch     : { teamId1: null, teamId2: null },
            showAddPlayer   : false,
            showInfoMatch   : false,
            inputMessage    : ''
        }
    },


    computed: {

        _actives () {
            return this.$store.getters['matches/get'].actives
        },

        _requests () {
            return this.$store.getters['matches/get'].requests
        }

    },


    async mounted () {

        this.handleTopProgress('start')

        try {

            await this.$store.dispatch('matches/listActives')
            await this.$store.dispatch('matches/listRequests')

            this.handleTopProgress('done')

        }

        catch (e) {
            this.handleTopProgress('fail')
            this.showNotification(e.title, e.msg, e.type)
        }

    },


    methods: {

        acceptRequest (match, matchPatch) {

            this.handleTopProgress('start')

            if (match) {

                this.$store.dispatch('matches/updateMatch', {
                    ...match,
                    action  : 'accept',
                    reqStat : { AR: { S: 'A' }, RR : { S : 'A' } }
                })
                    .then((e) => {
                        this.handleTopProgress('done')
                        this.showNotification(e.title, e.msg, e.type)
                    })
                    .catch((e) => {
                        this.handleTopProgress('fail')
                        this.showNotification(e.title, e.msg, e.type)
                    })

            }

            else {

                this.$store.dispatch('matches/updateMatchPatch', {
                    ...matchPatch,
                    action  : 'accept',
                    reqStat : { MR: { S: 'A' }, PR : { S : 'A' } }
                })
                    .then((e) => {
                        this.handleTopProgress('done')
                        this.showNotification(e.title, e.msg, e.type)
                    })
                    .catch((e) => {
                        this.handleTopProgress('fail')
                        this.showNotification(e.title, e.msg, e.type)
                    })

            }

        },


        rejectRequest (match, matchPatch) {

            this.handleTopProgress('start')

            if (match) {

                this.$store.dispatch('matches/updateMatch', {
                    ...match,
                    action  : 'reject',
                    reqStat : { AR: { S: 'C' }, RR : { S : 'C' } }
                })
                    .then((e) => {
                        this.handleTopProgress('done')
                        this.showNotification(e.title, e.msg, e.type)
                    })
                    .catch((e) => {
                        this.handleTopProgress('fail')
                        this.showNotification(e.title, e.msg, e.type)
                    })

            }

            else {

                this.$store.dispatch('matches/updateMatchPatch', {
                    ...matchPatch,
                    action  : 'reject',
                    reqStat : { MR: { S: 'C' }, PR : { S : 'C' } }
                })
                    .then((e) => {
                        this.handleTopProgress('done')
                        this.showNotification(e.title, e.msg, e.type)
                    })
                    .catch((e) => {
                        this.handleTopProgress('fail')
                        this.showNotification(e.title, e.msg, e.type)
                    })
            }

        },


        async setChat (match) {

            this.handleTopProgress('start')

            try {

                this.activeMatch = match

                await this.$store.dispatch('matches/listTeamMembers', match)

                this.handleTopProgress('done')

            }

            catch (e) {
                this.handleTopProgress('fail')
                this.showNotification(e.title, e.msg, e.type)
            }

        },


        sendMessage () {

            if (this.inputMessage !== '') {

                this.$store.dispatch('matches/sendMessage', {
                    teamId1     : this.activeMatch.teamId1,
                    teamId2     : this.activeMatch.teamId2,
                    msg         : this.inputMessage,
                    expireOn    : this.activeMatch.expireOn
                })
                    .catch((e) => {
                        this.showNotification(e.title, e.msg, e.type)
                    })

                this.inputMessage = ''

            }

        },


        isActive (match) {
            return `${this.activeMatch.teamId1}${this.activeMatch.teamId2}` === `${match.teamId1}${match.teamId2}`
        },


        getDate (datetime) {
            return `${this.$UTILS.getDayDD(datetime)}/${this.$UTILS.getMonthMM(datetime)}`
        },


        getTime (datetime) {
            return `${this.$UTILS.getHourHH(datetime)}:${this.$UTILS.getMinutesMM(datetime)}`
        }

    }

}
</script>
