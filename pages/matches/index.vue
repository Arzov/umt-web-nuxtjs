<template>
    <div class="matches">

        <!-- MODALS -->

        <ModalAddPatch
            v-model="showAddPlayer"
        />


        <!-- CONTENT -->

        <a-row>


            <!-- LEFT CONTENT -->

            <a-col class="leftContent" :span="8">

                <a-row class="cup">

                    <img src="@/assets/images/cup.svg" alt="">

                </a-row>

                <a-tabs
                    class="tabDisplay tabPane"
                    size="large"
                    :default-active-key="1"
                >

                    <!-- ACTIVE MATCHES -->

                    <a-tabPane :key="1" tab="ACTIVOS">

                        <ScrollContainer>

                            <CollapseDisplay
                                v-for="(team, i) in _userState.teams"
                                :key="`a${i}`"
                                :label="`${team.name} (${_actives.teams[i] ? _actives.teams[i].matches.length : 0})`"
                                icon="team-profile.svg"
                            >

                                <div v-if="_actives.teams[i]">

                                    <ListBtn
                                        v-for="match in _actives.teams[i].matches"
                                        :key="`tm${match.teamId1}${match.teamId2}`"
                                        :title="team.id === match.teamId1 ? match.name2 : match.name1"
                                        :pictures="team.id === match.teamId1 ? [match.picture2] : [match.picture1]"
                                        :is-active="`${_selectedMatch.teamId1}${_selectedMatch.teamId2}` === `${match.teamId1}${match.teamId2}` ? true : false"
                                        :desc="match.chat.messages.length ? `${match.chat.messages[0].author}: ${match.chat.messages[0].msg}` : 'No hay mensajes'"
                                        :time="match.chat.messages.length ? match.chat.messages[0].sentOn : ''"
                                        type="team"
                                        @click.native="setChat(match)"
                                    />

                                </div>

                            </CollapseDisplay>

                            <CollapseDisplay
                                icon="avatar.svg"
                                :image="_userState.picture"
                                :label="`${_userState.firstName} (${_actives.user.matches.length})`"
                            >

                                <ListBtn
                                    v-for="match in _actives.user.matches"
                                    :key="`tm${match.teamId1}${match.teamId2}`"
                                    :title="`${match.name1} - ${match.name2}`"
                                    :pictures="[match.picture1, match.picture2]"
                                    :is-active="`${_selectedMatch.teamId1}${_selectedMatch.teamId2}` === `${match.teamId1}${match.teamId2}` ? true : false"
                                    :desc="match.chat.messages.length ? `${match.chat.messages[0].author}: ${match.chat.messages[0].msg}` : 'No hay mensajes'"
                                    :time="match.chat.messages.length ? match.chat.messages[0].sentOn : ''"
                                    type="team"
                                    @click.native="setChat(match)"
                                />

                            </CollapseDisplay>

                        </ScrollContainer>

                    </a-tabPane>


                    <!-- PENDING REQUESTS -->

                    <a-tabPane :key="2" tab="SOLICITUDES">

                        <ScrollContainer>

                            <CollapseDisplay
                                v-for="(team, i) in _userState.teams"
                                :key="`r${i}`"
                                :label="`${team.name} (${_requests.teams[i] ? _requests.teams[i].matches.length : 0})`"
                                icon="team-profile.svg"
                            >

                                <div v-if="_requests.teams[i]">

                                    <RequestCard
                                        v-for="(match, j) in _requests.teams[i].matches"
                                        :key="`tm${j}`"
                                        :title="team.id === match.teamId1 ? match.name2 : match.name1"
                                        :pictures="team.id === match.teamId1 ? [match.picture2] : [match.picture1]"
                                        :desc="team.id === match.teamId1 ? 'Solicitud enviada' : 'Aceptar solicitud'"
                                        :action="team.id === match.teamId1 ? 'out' : 'in'"
                                        type="team"
                                        @accept="acceptRequest(match, null)"
                                        @reject="rejectRequest(match, null)"
                                    />

                                </div>

                            </CollapseDisplay>

                            <CollapseDisplay
                                icon="avatar.svg"
                                :image="_userState.picture"
                                :label="`${_userState.firstName} (${_requests.user.matches.length})`"
                            >

                                <RequestCard
                                    v-for="(match, j) in _requests.user.matches"
                                    :key="`tm${j}`"
                                    :title="`${match.name1} - ${match.name2}`"
                                    :pictures="[match.picture1, match.picture2]"
                                    desc="Aceptar solicitud"
                                    action="in"
                                    type="team"
                                    @accept="acceptRequest(null, match)"
                                    @reject="rejectRequest(null, match)"
                                />

                            </CollapseDisplay>

                        </ScrollContainer>

                    </a-tabPane>

                </a-tabs>

            </a-col>


            <!-- RIGHT CONTENT -->

            <a-col class="rightContent" :span="16">


                <!-- CHAT CONTENT -->

                <a-row v-if="_selectedMatch && !showInfoMatch" class="chatContainer">


                    <!-- CHAT HEADER -->

                    <a-row
                        class="chatHeader"
                        @click.native="activateMatchInfo(true)"
                    >

                        <a-col class="imgContainer" :span="4">

                            <img
                                src="@/assets/images/corner-top-right.svg"
                                style="width: 24px"
                            >

                            <a-avatar
                                size="large"
                                class="teamPicture"
                                :src="_selectedMatch.picture1"
                            />

                            <a-avatar
                                size="large"
                                class="teamPicture"
                                :src="_selectedMatch.picture2"
                            />

                        </a-col>

                        <a-col class="content" :span="20">

                            <center>

                                <h2>{{ _selectedMatch.name1 }} VS {{ _selectedMatch.name2 }}</h2>

                            </center>

                            <center>

                                Parches: {{ _selectedMatch.patches.CP.N }} / {{ _selectedMatch.patches.NP.N }}

                                Fecha: {{ _selectedMatch.schedule }}

                                Expira: {{ _selectedMatch.expireOn }}

                                haz click aquí para más info
                            </center>

                        </a-col>

                    </a-row>


                    <!-- CHAT BODY -->

                    <a-row class="chatBody">

                        <ScrollContainer>

                            <div v-if="_selectedMatch.chat.messages.length">

                                <div
                                    v-for="message in [..._selectedMatch.chat.messages].reverse()"
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


                <!-- MATCH INFORMATION -->

                <a-row v-if="showInfoMatch">

                    <a-row>

                        <a-col
                            class="iconContainer"
                            :span="4"
                        >

                            <img
                                :src="getIcon('x-active.svg')"
                                @click="activateMatchInfo"
                            >

                        </a-col>

                        <a-col class="title" :span="20">

                            <center>
                                <h2>{{ _selectedMatch.name1 }} VS {{ _selectedMatch.name2 }}</h2>
                            </center>

                        </a-col>

                        <a-col class="imgContainer" :span="4">

                            <img
                                src="@/assets/images/corner-top-right.svg"
                            >

                            <a-avatar
                                size="large"
                                class="teamPicture"
                                :src="_selectedMatch.picture1"
                            />

                            <a-avatar
                                size="large"
                                class="teamPicture"
                                :src="_selectedMatch.picture2"
                            />

                        </a-col>

                    </a-row>


                    <a-row>

                        <ScrollContainer>

                            <PrincipalBtn
                                text="+ AGREGAR JUGADOR (3/30)"
                                :loading="btnLoading"
                                @click.native="showAddPlayer = !showAddPlayer"
                            />

                            <h3>JUGADORES</h3>

                            <br>

                            <a-row :gutter="[0, 0]" type="flex">

                                <a-col
                                    v-for="player in _selectedMatch.members.players"
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

            </a-col>

        </a-row>

    </div>

</template>

<script>
export default {

    layout: 'navbar',


    data () {
        return {
            activeChat      : 0,
            showInfoMatch   : false,
            selectedMatch   : null,
            inputMessage    : '',
            showAddPlayer   : false
        }
    },


    computed: {

        _actives () {
            return this.$store.getters['matches/get'].actives
        },

        _requests () {
            return this.$store.getters['matches/get'].requests
        },

        _selectedMatch () {

            if (this.selectedMatch) {

                return this.selectedMatch

            }

            // select a default match if exists

            if (this._actives.user.matches.length) {

                return this._actives.user.matches[0]

            }

            else if (this._actives.teams.length) {

                for (const team of this._actives.teams) {

                    if (team.matches.length) {

                        return team.matches[0]

                    }

                }

            }

            return null

        }

    },


    async mounted () {

        await this.$store.dispatch('matches/listMatches')
            .catch((e) => {
                this.showNotification(e.title, e.msg, e.type)
            })

        await this.$store.dispatch('matches/listRequests')
            .catch((e) => {
                this.showNotification(e.title, e.msg, e.type)
            })

    },


    methods: {

        acceptRequest (match, matchPatch) {

            if (match) {

                this.$store
                    .dispatch('matches/updateMatch', {
                        ...match,
                        action  : 'accept',
                        reqStat : { AR: { S: 'A' }, RR : { S : 'A' } }
                    })
                    .then((e) => {
                        this.showNotification(e.title, e.msg, e.type)
                    })
                    .catch((e) => {
                        this.showNotification(e.title, e.msg, e.type)
                    })

            }

            else {

                this.$store
                    .dispatch('matches/updateMatchPatch', {
                        ...matchPatch,
                        action  : 'accept',
                        reqStat : { MR: { S: 'A' }, PR : { S : 'A' } }
                    })
                    .then((e) => {
                        this.showNotification(e.title, e.msg, e.type)
                    })
                    .catch((e) => {
                        this.showNotification(e.title, e.msg, e.type)
                    })

            }

        },


        rejectRequest (match, matchPatch) {


            if (match) {

                this.$store
                    .dispatch('matches/updateMatch', {
                        ...match,
                        action  : 'reject',
                        reqStat : { AR: { S: 'C' }, RR : { S : 'C' } }
                    })
                    .then((e) => {
                        this.showNotification(e.title, e.msg, e.type)
                    })
                    .catch((e) => {
                        this.showNotification(e.title, e.msg, e.type)
                    })

            }

            else {

                this.$store
                    .dispatch('matches/updateMatchPatch', {
                        ...matchPatch,
                        action  : 'reject',
                        reqStat : { MR: { S: 'C' }, PR : { S : 'C' } }
                    })
                    .then((e) => {
                        this.showNotification(e.title, e.msg, e.type)
                    })
                    .catch((e) => {
                        this.showNotification(e.title, e.msg, e.type)
                    })
            }

        },


        setChat (match) {

            this.selectedMatch = match

        },


        sendMessage () {

            if (this.inputMessage !== '') {

                this.$store.dispatch('matches/sendMessage', {
                    teamId1     : this._selectedMatch.teamId1,
                    teamId2     : this._selectedMatch.teamId2,
                    msg         : this.inputMessage,
                    expireOn    : this._selectedMatch.expireOn
                })
                    .catch((e) => {
                        this.showNotification(e.title, e.msg, e.type)
                    })

            }

        },


        async activateMatchInfo (fetchMembers = false) {

            this.showInfoMatch = !this.showInfoMatch

            if (fetchMembers) {

                await this.$store.dispatch('matches/fetchMembers', this._selectedMatch)
                    .catch((e) => {
                        this.showNotification(e.title, e.msg, e.type)
                    })

            }

        }

    }

}
</script>
