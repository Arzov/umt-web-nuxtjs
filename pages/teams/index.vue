<template>

    <div class="teams">

        <!-- MODALS -->

        <!-- <ModalAddTeam v-model="showAddTeam" />
        <ModalAddPlayer v-model="showAddPlayer" :team-id="_activeTeam ? _activeTeam.id : ''" /> -->


        <!-- LEFT SIDE MENU -->

        <div class="left-content">

            <img class="shield" src="@/assets/images/shield.svg">

            <umt-tabs>

                <!-- ACTIVE -->

                <umt-tab-panel tab="1" label="activos">

                    <div v-if="_userState.teams.length">

                        <umt-chat-cell
                            v-for="(team, i) in _userState.teams"
                            :key="`t${team.id}`"
                            :team="{
                                name: team.name,
                                picture: team.picture,
                                chat: _actives.teams[i].chat
                            }"
                            :active="activeTeamChat == i"
                            @click="setChat(i)"
                        />

                    </div>

                    <center v-else>
                        <img src="@/assets/images/football-circle.svg" style="width: 250px">
                        <p>No perteneces a ningún equipo aún.</p>
                    </center>

                    <umt-button @click="showModalAddTeam()">
                        + CREAR EQUIPO (1/3)
                    </umt-button>

                </umt-tab-panel>


                <!-- REQUESTS -->

                <umt-tab-panel tab="2" label="solicitudes">

                    <umt-collapsible v-for="(team, i) in _userState.teams" :key="`r${team.id}`">

                        <umt-collapsible-request-header
                            slot="header"
                            :name="team.name"
                            :picture="team.picture"
                            :request-count="_requests.teams[i] ? _requests.teams[i].requests.length : 0"
                        />

                        <div v-if="_requests.teams[i]" slot="body">
                            <umt-request-list
                                v-for="teamMember in _requests.teams[i].requests"
                                :key="`tr${teamMember.teamId}${teamMember.email}`"
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
                                :key="`ur${teamMember.teamId}${teamMember.email}`"
                                :user="teamMember"
                                :inbound="teamMember.reqStat.TR.S == 'A'"
                                type="user"
                                @accept="acceptRequest({
                                    ...teamMember,
                                    name: _userState.firstName
                                })"
                                @reject="rejectRequest({
                                    ...teamMember,
                                    name: _userState.firstName
                                })"
                            />
                        </div>

                    </umt-collapsible>

                </umt-tab-panel>

            </umt-tabs>

        </div>


        <!-- RIGHT CONTENT -->

        <div class="right-content">

            <!-- CHAT CONTENT -->

            <div v-if="!showInfoTeam && _userState.teams.length" class="chat-container">

                <!-- CHAT HEADER -->

                <div class="chat-header" @click="showInfoTeam = !showInfoTeam">

                    <div class="title">

                        <center>
                            <h2>{{ _activeTeam.name }}</h2>
                            <p>haz click aquí para más info</p>
                        </center>

                        <center class="team">
                            <umt-avatar
                                class="team-picture"
                                icon="team-profile"
                                color="violet"
                                :src="_activeTeam.picture"
                            />
                        </center>

                    </div>

                </div>


                <!-- CHAT BODY -->

                <div class="chat-body">

                    <div class="messages">
                        <div
                            v-for="message in [..._activeTeam.chat.messages].reverse()"
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

            <div v-else-if="_userState.teams.length" class="team-info">

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
                            <h2 class="team-name">
                                {{ _activeTeam.name }}
                            </h2>
                        </center>

                        <center class="team">
                            <umt-avatar
                                class="team-picture"
                                icon="team-profile"
                                color="violet"
                                :src="_activeTeam.picture"
                            />
                        </center>

                    </div>

                </div>

                <div class="content">

                    <div class="title">

                        <h2>JUGADORES (3/30)</h2>

                        <umt-button
                            type="icon"
                            color="violet"
                            size="small"
                            icon="plus"
                            @click="showModalAddPlayer"
                        />

                    </div>

                    <umt-list
                        v-for="player in _teamMembers"
                        :key="`r${player.email}`"
                        :user="{
                            firstName: player.name,
                            picture: player.picture
                        }"
                        type="user"
                    />

                </div>

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
            activeTeamChat  : 0,
            inputMessage    : ''
        }
    },


    computed: {

        _actives () {
            return this.$store.getters['teams/get'].actives
        },

        _requests () {
            return this.$store.getters['teams/get'].requests
        },

        _activeTeam () {

            if (this._userState.teams.length) {

                const team = this._actives.teams[this.activeTeamChat]
                return team

            }

            else { return null }

        },

        _teamMembers () {
            return this.$store.getters['teams/get'].teamMembers
        }

    },


    async mounted () {

        try {
            await this.$store.dispatch('teams/listTeamChats')
            await this.$store.dispatch('teams/listRequests')
            await this.setChat(0)
        }

        catch (e) {
            this.showNotification(e.title, e.msg, e.type)
        }

    },


    methods: {

        showModalAddTeam () {
            this.showAddTeam = !this.showAddTeam
        },


        showModalAddPlayer () {
            this.showAddPlayer = !this.showAddPlayer
        },


        acceptRequest (teamMember) {

            this.$store.dispatch('teams/updateRequest', {
                ...teamMember,
                action  : 'accept',
                reqStat : { PR: { S: 'A' }, TR : { S : 'A' } }
            })
                .then((e) => {
                    this.showNotification(e.title, e.msg, e.type)
                })
                .catch((e) => {
                    this.showNotification(e.title, e.msg, e.type)
                })

        },


        rejectRequest (teamMember) {

            this.$store.dispatch('teams/updateRequest', {
                ...teamMember,
                action  : 'reject',
                reqStat : { PR: { S: 'C' }, TR : { S : 'C' } }
            })
                .then((e) => {
                    this.showNotification(e.title, e.msg, e.type)
                })
                .catch((e) => {
                    this.showNotification(e.title, e.msg, e.type)
                })

        },


        async setChat (i) {

            try {

                this.activeTeamChat = i

                if (this._activeTeam) {

                    await this.$store.dispatch('teams/listTeamMembers', {
                        teamId: this._activeTeam.teamId
                    })

                }

            }

            catch (e) {
                this.showNotification(e.title, e.msg, e.type)
            }

        },


        sendMessage () {

            if (this.inputMessage !== '') {

                this.$store.dispatch('teams/sendMessage', {
                    teamId  : this._activeTeam.id,
                    msg     : this.inputMessage
                })
                    .catch((e) => {
                        this.showNotification(e.title, e.msg, e.type)
                    })

            }

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
