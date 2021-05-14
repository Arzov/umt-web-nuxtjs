<template>

    <div class="teams">


        <!-- MODALS -->

        <ModalAddTeam v-model="showAddTeam" />
        <ModalAddPlayer v-model="showAddPlayer" />


        <!-- CONTENT -->

        <a-row>


            <!-- LEFT SIDE MENU -->

            <a-col class="leftContent" :span="8">

                <a-row class="shield">

                    <img src="@/assets/images/shield.svg" alt="">

                </a-row>


                <a-tabs
                    class="tabDisplay tabPane"
                    size="large"
                    :default-active-key="1"
                >


                    <!-- ACTIVE REQUESTS -->

                    <a-tabPane :key="1" tab="ACTIVOS">

                        <ScrollContainer v-if="_teamsChatMessages.length">

                            <ListBtn
                                v-for="(team, i) in _userState.teams"
                                :key="`t${team.id}`"
                                :title="team.name"
                                :desc="_teamsChatMessages[i].messages.length
                                    ? `${_teamsChatMessages[i].messages[0].author}: ${_teamsChatMessages[i].messages[0].msg}`
                                    : 'No hay mensajes'
                                "
                                :time="_teamsChatMessages[i].messages.length
                                    ? _teamsChatMessages[i].messages[0].sentOn
                                    : ''
                                "
                                :pictures="[team.picture]"
                                :is-active="activeTeamChat == i ? true : false"
                                type="team"
                                @click.native="setChat(i)"
                            />

                        </ScrollContainer>

                        <center v-else>
                            No perteneces a ningún equipo aún.
                        </center>

                        <br>

                        <PrincipalBtn
                            text="+ CREAR EQUIPO (1/3)"
                            :loading="btnLoading"
                            @click.native="showModalAddTeam()"
                        />

                    </a-tabPane>


                    <!-- PENDING REQUESTS -->

                    <a-tabPane :key="2" tab="SOLICITUDES">

                        <ScrollContainer>

                            <CollapseDisplay
                                v-for="(team, i) in _userState.teams"
                                :key="`r${team.id}`"
                                :label="`${team.name} (${_teamsRequests[i] ? _teamsRequests[i].requests.length : 0})`"
                                icon="team-profile.svg"
                            >

                                <div v-if="_teamsRequests[i]">

                                    <RequestCard
                                        v-for="teamMember in _teamsRequests[i].requests"
                                        :key="`tm${teamMember.teamId}${teamMember.email}`"
                                        :title="teamMember.name"
                                        :desc="teamMember.reqStat.TR.S == 'A' ? 'Solicitud enviada' : 'Aceptar solicitud'"
                                        :pictures="[teamMember.picture]"
                                        :action="teamMember.reqStat.TR.S == 'A' ? 'out' : 'in'"
                                        type="user"
                                        @accept="acceptRequest(teamMember)"
                                        @reject="rejectRequest(teamMember)"
                                    />

                                </div>

                            </CollapseDisplay>

                            <CollapseDisplay
                                icon="avatar.svg"
                                :label="`${_userState.firstName} (${_teamMemberRequests.requests.length})`"
                            >

                                <RequestCard
                                    v-for="teamMember in _teamMemberRequests.requests"
                                    :key="`tm${teamMember.teamId}${teamMember.email}`"
                                    :title="teamMember.name"
                                    :desc="teamMember.reqStat.TR.S == 'A' ? 'Aceptar solicitud' : 'Solicitud enviada'"
                                    :pictures="[teamMember.picture]"
                                    :action="teamMember.reqStat.TR.S == 'A' ? 'in' : 'out'"
                                    type="team"
                                    @accept="acceptRequest({
                                        ...teamMember,
                                        name: _userState.firstName
                                    })"
                                    @reject="rejectRequest({
                                        ...teamMember,
                                        name: _userState.firstName
                                    })"
                                />

                            </CollapseDisplay>

                        </ScrollContainer>

                    </a-tabPane>

                </a-tabs>

            </a-col>


            <!-- RIGHT CONTENT -->

            <a-col class="rightContent" :span="16">


                <!-- CHAT CONTENT -->

                <a-row v-if="!showInfoTeam && _userState.teams.length" class="chatContainer">


                    <!-- CHAT HEADER -->

                    <a-row
                        class="chatHeader"
                        @click.native="showInfoTeam = !showInfoTeam"
                    >

                        <a-col class="imgContainer" :span="4">

                            <img
                                src="@/assets/images/corner-top-right.svg"
                                style="width: 24px"
                            >

                            <a-avatar
                                size="large"
                                class="teamPicture"
                                :src="_activeTeam.picture"
                            />

                        </a-col>

                        <a-col class="content" :span="20">

                            <center>

                                <h2>{{ _activeTeam.name }}</h2>

                            </center>

                            <center>haz click aquí para más info</center>

                        </a-col>
                    </a-row>


                    <!-- CHAT BODY -->

                    <a-row class="chatBody">

                        <ScrollContainer>

                            <div v-if="_teamsChatMessages.length">

                                <div
                                    v-for="message in [..._teamsChatMessages[activeTeamChat].messages].reverse()"
                                    :key="`message${message.email}${message.sentOn}`"
                                    :class="message.email == _userState.email ? 'rightMessage' : 'leftMessage'"
                                >
                                    {{ message.author }} - {{ message.sentOn }}:
                                    {{ message.msg }}
                                </div>

                            </div>

                        </ScrollContainer>

                    </a-row>


                    <!-- CHAT FOOTER -->

                    <a-row class="chatFooter">

                        <div class="inputChat">

                            <div class="emoticonContainer">

                                <img
                                    src="@/assets/icons/emoticon.svg"
                                    style="width: 24px"
                                >

                            </div>

                            <div class="inputText">

                                <PrincipalInput
                                    v-model="inputMessage"
                                    class="principalInput"
                                    placeholder="Escribe un mensaje"
                                />

                            </div>

                            <div
                                class="iconContainer"
                                @click="sendMessage"
                            >

                                <img
                                    src="@/assets/icons/send.svg"
                                    style="width: 24px; cursor: pointer;"
                                >

                            </div>

                        </div>

                    </a-row>

                </a-row>


                <!-- TEAM INFORMATION -->

                <a-row v-else-if="_userState.teams.length">

                    <a-row>

                        <a-col
                            class="iconContainer"
                            :span="4"
                        >

                            <img
                                :src="getIcon('x-active.svg')"
                                @click="showInfoTeam = !showInfoTeam"
                            >

                        </a-col>

                        <a-col class="title" :span="20">

                            <center>
                                <h2>{{ _activeTeam.name }}</h2>
                            </center>

                        </a-col>

                        <a-col class="imgContainer" :span="4">

                            <img
                                src="@/assets/images/corner-top-right.svg"
                            >

                            <a-avatar
                                size="large"
                                class="teamPicture"
                                :src="_activeTeam.picture"
                            />

                        </a-col>

                    </a-row>


                    <a-row>

                        <ScrollContainer>

                            <PrincipalBtn
                                text="+ AGREGAR JUGADOR (3/30)"
                                :loading="btnLoading"
                                @click.native="showModalAddPlayer()"
                            />

                            <h3>JUGADORES</h3>

                            <br>

                            <a-row :gutter="[0, 0]" type="flex">

                                <a-col
                                    v-for="player in _teamMembers"
                                    :key="`r${player.email}`"
                                    :span="24"
                                >

                                    <ListBtn
                                        :key="`l${player.email}`"
                                        :desc="player.name"
                                        :pictures="[player.picture]"
                                    />

                                </a-col>

                            </a-row>

                        </ScrollContainer>

                    </a-row>

                </a-row>


                <a-row v-else>
                    No pertences a un equipo aún.
                </a-row>

            </a-col>

        </a-row>

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


        _activeTeam () {

            if (this._userState.teams.length) {

                const team = this._userState.teams[this.activeTeamChat]

                // set default team picture if empty

                team.picture = team.picture || this.getIcon('team-profile.svg')

                return team

            }

            else { return null }
        },


        _teamsChatMessages () {
            return this.$store.getters['teams/get'].teamsChatMessages
        },


        _teamsRequests () {
            return this.$store.getters['teams/get'].teamsRequests
        },


        _teamMemberRequests () {
            return this.$store.getters['teams/get'].teamMemberRequests
        },


        _teamMembers () {
            return this.$store.getters['teams/get'].teamMembers
        }

    },


    async mounted () {

        await this.$store.dispatch('teams/listTeamChats')
            .catch((e) => {
                this.showNotification(e.title, e.msg, e.type)
            })


        await this.$store.dispatch('teams/teamRequests')
            .catch((e) => {
                this.showNotification(e.title, e.msg, e.type)
            })


        await this.$store.dispatch('teams/teamMemberRequests')
            .catch((e) => {
                this.showNotification(e.title, e.msg, e.type)
            })


        await this.setChat(0)

    },


    methods: {

        showModalAddTeam () {
            this.showAddTeam = !this.showAddTeam
        },


        showModalAddPlayer () {
            this.showAddPlayer = !this.showAddPlayer
        },


        acceptRequest (teamMember) {

            this.$store
                .dispatch('teams/updateTeamMember', {
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

            this.$store
                .dispatch('teams/updateTeamMember', {
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

            this.activeTeamChat = i

            if (this._activeTeam) {

                await this.$store.dispatch('teams/listTeamMembers', {
                    teamId: this._activeTeam.id
                })
                    .catch((e) => {
                        this.showNotification(e.title, e.msg, e.type)
                    })

            }

        },


        sendMessage () {

            if (this.inputMessage !== '') {

                this.$store.dispatch('teams/addTeamChat', {
                    teamId  : this._activeTeam.id,
                    msg     : this.inputMessage
                })
                    .catch((e) => {
                        this.showNotification(e.title, e.msg, e.type)
                    })

            }

        }

    }

}

</script>
