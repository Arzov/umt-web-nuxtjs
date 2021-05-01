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
                    :default-active-key="1"
                    size="large"
                >
                    <a-tabPane :key="1" tab="ACTIVOS">
                        <ScrollContainer v-if="_teamsChatMessages.length">
                            <ListBtn
                                v-for="(team, i) in _userState.teams"
                                :key="`t${team.id}`"
                                :title="team.name"
                                :desc="
                                    _teamsChatMessages[i].messages.length
                                        ? `${_teamsChatMessages[i].messages[0].author}: ${_teamsChatMessages[i].messages[0].msg}`
                                        : 'No hay mensajes'
                                "
                                :time="
                                    _teamsChatMessages[i].messages.length
                                        ? _teamsChatMessages[i].messages[0].sentOn
                                        : ''
                                "
                                type="team"
                                :pictures="[team.picture]"
                                @click.native="click()"
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

                    <a-tabPane :key="2" tab="SOLICITUDES">
                        <ScrollContainer>
                            <div v-if="_teamsRequests.length || _teamMemberRequests.length">
                                <CollapseDisplay
                                    v-for="(team, i) in _userState.teams"

                                    :key="`r${team.id}`"
                                    icon="team-profile.svg"
                                    :label="`${team.name} (${_teamsRequests[i].requests.length})`"
                                >
                                    <RequestCard
                                        v-for="teamMember in _teamsRequests[i].requests"
                                        :key="`tm${teamMember.teamId}${teamMember.email}`"
                                        :title="teamMember.name"
                                        :desc="teamMember.reqStat.TR.S == 'A' ?
                                            'Solicitud enviada' : 'Aceptar solicitud'"
                                        :pictures="[teamMember.picture]"
                                        type="user"
                                        :action="teamMember.reqStat.TR.S == 'A' ?
                                            'out' : 'in'"
                                        @accept="acceptRequest(teamMember)"
                                        @reject="rejectRequest(teamMember)"
                                    />
                                </CollapseDisplay>
                            </div>
                            <div v-else />

                            <CollapseDisplay
                                icon="avatar.svg"
                                :label="`${_userState.firstName} (${_teamMemberRequests.requests.length})`"
                            >
                                <RequestCard
                                    v-for="teamMember in _teamMemberRequests.requests"
                                    :key="`tm${teamMember.teamId}${teamMember.email}`"
                                    :title="teamMember.name"
                                    :desc="teamMember.reqStat.TR.S == 'A' ?
                                        'Aceptar solicitud' : 'Solicitud enviada'"
                                    :pictures="[teamMember.picture]"
                                    type="team"
                                    :action="teamMember.reqStat.TR.S == 'A' ?
                                        'in' : 'out'"
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
                <a-row v-if="!showInfoTeam" class="chatContainer">
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
                                :src="teamPicture"
                            />
                        </a-col>

                        <a-col class="content" :span="20">
                            <center>
                                <h2>{{ teamName }}</h2>
                            </center>

                            <center>haz click aquí para más info</center>
                        </a-col>
                    </a-row>
                    <a-row class="chatBody">
                        <ScrollContainer>
                            <div class="leftMessage">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Ex facere iure accusamus dolor
                                culpa, nobis repellendus vitae maiores in,
                                explicabo recusandae eaque obcaecati alias
                                dolore sit velit voluptatibus odio consequuntur.
                            </div>
                            <div class="rightMessage">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Ratione maiores temporibus
                                corporis necessitatibus debitis laborum ipsum
                                ullam iste unde dolores quam, maxime cupiditate
                                optio mollitia perspiciatis fugit vel quis
                                ducimus?
                            </div>
                        </ScrollContainer>
                    </a-row>
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
                                    class="principalInput"
                                    placeholder="Escribe un mensaje"
                                />
                            </div>
                            <div class="iconContainer">
                                <img
                                    src="@/assets/icons/send.svg"
                                    style="width: 24px"
                                >
                            </div>
                        </div>
                    </a-row>
                </a-row>

                <a-row v-else>
                    <a-row>
                        <a-col
                            v-if="_globalState.themePreference === 'light'"
                            class="iconContainer"
                            :span="4"
                        >
                            <img
                                src="@/assets/icons/lm-x-active.svg"
                                alt=""
                                @click="showInfoTeam = !showInfoTeam"
                            >
                        </a-col>
                        <a-col v-else class="iconContainer" :span="4">
                            <img
                                src="@/assets/icons/dm-x-active.svg"
                                alt=""
                                @click="showInfoTeam = !showInfoTeam"
                            >
                        </a-col>
                        <a-col class="title" :span="20">
                            <center>
                                <h2>{{ teamName }}</h2>
                            </center>
                        </a-col>
                        <a-col class="imgContainer" :span="4">
                            <img
                                src="@/assets/images/corner-top-right.svg"
                                alt=""
                            >
                            <a-avatar
                                size="large"
                                class="teamPicture"
                                :src="teamPicture"
                            />
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-tabs
                            class="tabDisplay tabPane"
                            :default-active-key="1"
                            size="large"
                        >
                            <a-tabPane :key="1" tab="ACTIVOS">
                                <ScrollContainer>
                                    <a-form-model-item>
                                        <PrincipalBtn
                                            text="+ AGREGAR JUGADOR (3/30)"
                                            :loading="btnLoading"
                                            @click.native="showModalAddPlayer()"
                                        />
                                    </a-form-model-item>

                                    <h3>JUGADORES</h3>
                                    <br>
                                    <a-row :gutter="[0, 0]" type="flex">
                                        <a-col
                                            v-for="k in require('@/static/data/players.json')"
                                            :key="`r${k.name}`"
                                            :span="24"
                                        >
                                            <ListBtn
                                                :key="`l${k.name}`"
                                                :desc="k.name"
                                                :picture1="k.img"
                                                :value="k.name"
                                                @click.native="click()"
                                            />
                                        </a-col>
                                    </a-row>
                                </ScrollContainer>
                            </a-tabPane>
                        </a-tabs>
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
            showInfoTeam: false,
            teamName: 'NOMBRE EQUIPO',
            showAddTeam: false,
            showAddPlayer: false
        }
    },

    computed: {
        teamPicture () {
            if (
                this._userState.primaryTeam &&
                this._userState.primaryTeam.picture
            ) {
                return this._userState.primaryTeam.picture
            }

            else {
                return this.getIcon('team-profile.svg')
            }
        },

        _teamsChatMessages () {
            return this.$store.getters['teams/get'].teamsChatMessages
        },

        _teamsRequests () {
            return this.$store.getters['teams/get'].teamsRequests
        },

        _teamMemberRequests () {
            return this.$store.getters['teams/get'].teamMemberRequests
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
    },

    methods: {
        showModalAddTeam () {
            console.log('Probando el click del banner')
            this.showAddTeam = !this.showAddTeam
        },

        showModalAddPlayer () {
            console.log('Probando click para agregar jugadores')
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
                    console.log(e)
                    this.showNotification(e.title, e.msg, e.type)
                })
        },

        click () {
            console.log('Probando el click del banner')
        }
    }
}
</script>
