<template>

    <div class="teams">

        <!-- MODALS -->

        <modal-add-team v-if="showAddTeam" @close="showAddTeam = !showAddTeam" />
        <modal-add-player v-if="showAddPlayer" :team-id="activeTeam.id" @close="showAddPlayer = !showAddPlayer" />


        <!-- LEFT SIDE MENU -->

        <div class="left-content">

            <img class="shield" src="@/assets/images/shield.svg">

            <umt-tabs>

                <!-- ACTIVE -->

                <umt-tab-panel tab="1" label="activos">

                    <div v-if="_actives.teams.length">

                        <umt-chat-cell
                            v-for="team in _actives.teams"
                            :key="`active-team-${team.id}`"
                            :team="team"
                            :active="activeTeam.id === team.id"
                            @click="setChat(team)"
                        />

                    </div>

                    <center v-else>
                        <p>Puedes crear un equipo e invitar a tus amigos(as).</p>
                    </center>

                    <umt-button @click="showAddTeam = !showAddTeam">
                        + CREAR EQUIPO ({{ _actives.teams.length }}/5)
                    </umt-button>

                </umt-tab-panel>


                <!-- REQUESTS -->

                <umt-tab-panel tab="2" label="solicitudes">

                    <umt-collapsible v-for="team in _requests.teams" :key="`request-team-${team.id}`">

                        <umt-collapsible-request-header
                            slot="header"
                            :name="team.name"
                            :picture="team.picture"
                            :request-count="team.requests.requests.length"
                        />

                        <div slot="body">
                            <umt-request-list
                                v-for="teamMember in team.requests.requests"
                                :key="`teammember-request-${teamMember.teamId}${teamMember.email}`"
                                :user="{
                                    firstName: teamMember.name,
                                    picture: teamMember.picture
                                }"
                                :inbound="teamMember.reqStat.TR.S != 'A'"
                                type="user"
                                @accept="acceptRequest(teamMember)"
                                @reject="rejectRequest(teamMember)"
                            />
                        </div>

                    </umt-collapsible>

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
                                v-for="teamMember in _requests.user.requests"
                                :key="`user-request-${teamMember.teamId}${teamMember.email}`"
                                :team="teamMember"
                                :inbound="teamMember.reqStat.TR.S == 'A'"
                                type="team"
                                @accept="acceptRequest(teamMember)"
                                @reject="rejectRequest(teamMember)"
                            />
                        </div>

                    </umt-collapsible>

                </umt-tab-panel>

            </umt-tabs>

        </div>


        <!-- RIGHT CONTENT -->

        <div class="right-content">

            <!-- CHAT CONTENT -->

            <div v-if="!showInfoTeam && _userState.teams.length && activeTeam.id" class="chat-container">

                <!-- CHAT HEADER -->

                <div class="chat-header" @click="showInfoTeam = !showInfoTeam">

                    <center style="width: 32px;" />

                    <center>
                        <h2>{{ activeTeam.name }}</h2>
                        <p>haz click aquí para más info</p>
                    </center>

                    <center>
                        <umt-avatar
                            class="team-picture"
                            icon="team-profile"
                            color="violet"
                            :src="activeTeam.picture"
                        />
                    </center>

                </div>


                <!-- CHAT BODY -->

                <div class="chat-body">

                    <div class="messages">

                        <div
                            v-for="message in [...activeTeam.chat.messages].reverse()"
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


            <!-- TEAM INFORMATION -->

            <div v-else-if="_userState.teams.length && activeTeam.id" class="team-info">

                <div class="header">

                    <img class="corner-top-right" src="@/assets/images/corner-top-right.svg">

                    <umt-button
                        type="icon"
                        color="green"
                        icon="x"
                        @click="showInfoTeam = !showInfoTeam"
                    />

                    <div class="title">

                        <center>
                            <umt-avatar
                                class="team-picture"
                                icon="team-profile"
                                color="violet"
                                size="large"
                                :src="activeTeam.picture"
                            />
                        </center>

                        <br>

                        <center>
                            <h2>{{ activeTeam.name }}</h2>
                        </center>

                    </div>

                </div>

                <div class="title">

                    <h2>JUGADORES ({{ activeTeam.members.members.length }}/30)</h2>

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
                        v-for="player in activeTeam.members.members"
                        :key="`teammember-${player.email}`"
                        :user="{
                            firstName: player.name,
                            picture: player.picture
                        }"
                        type="user"
                    />
                </div>

            </div>


            <!-- NO TEAM SELECTED -->

            <div v-else-if="!activeTeam.id">
                <center>

                    <img src="@/assets/images/football-circle.svg" style="width: 250px">

                    <h2>SELECCIONA UN EQUIPO</h2>

                    <br>

                    <p>
                        Selecciona un equipo para desplegar el chat y conversar con sus integrantes.
                    </p>

                </center>
            </div>


            <!-- DEFAULT -->

            <div v-else>
                <center>

                    <img src="@/assets/images/football-circle.svg" style="width: 250px">

                    <h2>NO TIENES EQUIPO</h2>

                    <br>

                    <p>
                        No pertences a un equipo aún.
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
            showInfoTeam    : false,
            showAddTeam     : false,
            showAddPlayer   : false,
            activeTeam      : { id: null },
            inputMessage    : ''
        }
    },


    computed: {

        _actives () {
            return this.$store.getters['teams/get'].actives
        },

        _requests () {
            return this.$store.getters['teams/get'].requests
        }

    },


    async mounted () {

        this.handleTopProgress('start')

        try {

            await this.$store.dispatch('teams/listActives')
            await this.$store.dispatch('teams/listRequests')

            this.handleTopProgress('done')

        }

        catch (e) {
            this.handleTopProgress('fail')
            this.showNotification(e.title, e.msg, e.type)
        }

    },


    methods: {

        acceptRequest (teamMember) {

            this.handleTopProgress('start')

            this.$store.dispatch('teams/updateRequest', {
                ...teamMember,
                action  : 'accept',
                reqStat : { PR: { S: 'A' }, TR : { S : 'A' } }
            })
                .then((e) => {
                    this.handleTopProgress('done')
                    this.showNotification(e.title, e.msg, e.type)
                })
                .catch((e) => {
                    this.handleTopProgress('fail')
                    this.showNotification(e.title, e.msg, e.type)
                })

        },


        rejectRequest (teamMember) {

            this.handleTopProgress('start')

            this.$store.dispatch('teams/updateRequest', {
                ...teamMember,
                action  : 'reject',
                reqStat : { PR: { S: 'C' }, TR : { S : 'C' } }
            })
                .then((e) => {
                    this.handleTopProgress('done')
                    this.showNotification(e.title, e.msg, e.type)
                })
                .catch((e) => {
                    this.handleTopProgress('fail')
                    this.showNotification(e.title, e.msg, e.type)
                })

        },


        async setChat (team) {

            this.handleTopProgress('start')

            try {

                this.activeTeam = team

                await this.$store.dispatch('teams/listTeamMembers', team)

                this.handleTopProgress('done')

            }

            catch (e) {
                this.handleTopProgress('fail')
                this.showNotification(e.title, e.msg, e.type)
            }

        },


        sendMessage () {

            if (this.inputMessage !== '') {

                this.$store.dispatch('teams/sendMessage', {
                    teamId  : this.activeTeam.id,
                    msg     : this.inputMessage
                })
                    .catch((e) => {
                        this.showNotification(e.title, e.msg, e.type)
                    })

            }

            this.inputMessage = ''

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
