<template>
    <div class="matches">

        <a-row>

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
                                :key="`r${team.id}`"
                                :label="`${team.name} (${_actives.teams[i] ? _actives.teams[i].matches.length : 0})`"
                                icon="team-profile.svg"
                            >

                                <div v-if="_actives.teams[i]">

                                    <ListBtn
                                        v-for="(opponent, j) in _actives.teams[i].matches"
                                        :key="`t${opponent.id}`"
                                        :title="opponent.id"
                                        :desc="opponent.chat.messages.length
                                            ? `${opponent.chat.messages[0].author}: ${opponent.chat.messages[0].msg}`
                                            : 'No hay mensajes'
                                        "
                                        :time="opponent.chat.messages.length
                                            ? opponent.chat.messages[0].sentOn
                                            : ''
                                        "
                                        :pictures="[opponent.picture]"
                                        :is-active="activeMatchChat == j ? true : false"
                                        type="team"
                                        @click.native="setChat(j)"
                                    />

                                </div>

                            </CollapseDisplay>

                            <CollapseDisplay
                                icon="avatar.svg"
                                :label="`${_userState.firstName} (${_actives.user.matches.length})`"
                            >

                                <ListBtn
                                    v-for="(opponent, j) in _actives.user.matches"
                                    :key="`t${opponent.id}`"
                                    :title="opponent.id"
                                    :desc="opponent.chat.messages.length
                                        ? `${opponent.chat.messages[0].author}: ${opponent.chat.messages[0].msg}`
                                        : 'No hay mensajes'
                                    "
                                    :time="opponent.chat.messages.length
                                        ? opponent.chat.messages[0].sentOn
                                        : ''
                                    "
                                    :pictures="[opponent.picture]"
                                    :is-active="activeMatchChat == j ? true : false"
                                    type="team"
                                    @click.native="setChat(j)"
                                />

                            </CollapseDisplay>

                        </ScrollContainer>

                    </a-tabPane>


                    <!-- PENDING REQUESTS -->

                    <a-tabPane :key="2" tab="SOLICITUDES">

                        <ScrollContainer>

                            <CollapseDisplay
                                v-for="(team, i) in _userState.teams"
                                :key="`r${team.id}`"
                                :label="`${team.name} (${_requests.teams[i] ? _requests.teams[i].matches.length : 0})`"
                                icon="team-profile.svg"
                            >

                                <div v-if="_requests.teams[i]">

                                    <RequestCard
                                        v-for="(match, j) in _requests.teams[i].matches"
                                        :key="`tm${j}`"
                                        :title="match.teamId1"
                                        :desc="match.reqStat.RR.S == 'A' ? 'Solicitud enviada' : 'Aceptar solicitud'"
                                        :pictures="[match.picture]"
                                        :action="match.reqStat.RR.S == 'A' ? 'out' : 'in'"
                                        type="user"
                                        @accept="acceptRequest(match)"
                                        @reject="rejectRequest(match)"
                                    />

                                </div>

                            </CollapseDisplay>

                            <!-- <CollapseDisplay
                                icon="avatar.svg"
                                :label="`${_userState.firstName} (${_actives.user.matches.length})`"
                            >

                                <ListBtn
                                    v-for="(opponent, j) in _actives.user.matches"
                                    :key="`t${opponent.id}`"
                                    :title="opponent.id"
                                    :desc="opponent.chat.messages.length
                                        ? `${opponent.chat.messages[0].author}: ${opponent.chat.messages[0].msg}`
                                        : 'No hay mensajes'
                                    "
                                    :time="opponent.chat.messages.length
                                        ? opponent.chat.messages[0].sentOn
                                        : ''
                                    "
                                    :pictures="[opponent.picture]"
                                    :is-active="activeMatchChat == j ? true : false"
                                    type="team"
                                    @click.native="setChat(j)"
                                />

                            </CollapseDisplay> -->

                        </ScrollContainer>

                    </a-tabPane>

                </a-tabs>

            </a-col>


            <!-- <a-col v-show="isVisible" class="rightContent" :span="16">

                <a-row class="chatContainer">


                    <a-row class="chat-header">

                        <div @click="isVisible = !isVisible">
                            <BannerChat type="matches" />
                        </div>

                    </a-row>


                    <div class="chat-body">

                        <div class="left-message">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Ex facere iure accusamus dolor culpa, nobis
                            repellendus vitae maiores in, explicabo recusandae
                            eaque obcaecati alias dolore sit velit voluptatibus
                            odio consequuntur.
                        </div>
                        <div class="right-message">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Ratione maiores temporibus corporis
                            necessitatibus debitis laborum ipsum ullam iste unde
                            dolores quam, maxime cupiditate optio mollitia
                            perspiciatis fugit vel quis ducimus?
                        </div>
                        <div class="left-message">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Ex facere iure accusamus dolor culpa, nobis
                            repellendus vitae maiores in, explicabo recusandae
                            eaque obcaecati alias dolore sit velit voluptatibus
                            odio consequuntur.
                        </div>
                        <div class="right-message">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Ratione maiores temporibus corporis
                            necessitatibus debitis laborum ipsum ullam iste unde
                            dolores quam, maxime cupiditate optio mollitia
                            perspiciatis fugit vel quis ducimus?
                        </div>
                        <div class="left-message">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Ex facere iure accusamus dolor culpa, nobis
                            repellendus vitae maiores in, explicabo recusandae
                            eaque obcaecati alias dolore sit velit voluptatibus
                            odio consequuntur.
                        </div>
                        <div class="right-message">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Ratione maiores temporibus corporis
                            necessitatibus debitis laborum ipsum ullam iste unde
                            dolores quam, maxime cupiditate optio mollitia
                            perspiciatis fugit vel quis ducimus?
                        </div>

                    </div>


                    <a-row class="chat-footer">
                        <InputChat />
                    </a-row>

                </a-row>

            </a-col>


            <a-col v-show="!isVisible" class="rightContent" :span="16">

                <a-row class="bannerInfoTeam">

                    <a-col class="iconContainer" :span="4">

                        <img
                            :src="getImage('x-active.svg')"
                            alt=""
                            @click="isVisible = !isVisible"
                        >

                    </a-col>


                    <a-col class="title" :span="20">

                        <a-row type="flex" justify="center" align="middle">

                            <a-col :span="6" align="center">

                                <img
                                    :src="teamPicture"
                                    alt=""
                                    style="width: 50px"
                                >

                                <br>

                                <h4>{{ teamName }}</h4>

                            </a-col>

                            <a-col>
                                <p>VS</p>
                            </a-col>

                            <a-col :span="6" align="center">

                                <img
                                    :src="teamPicture"
                                    alt=""
                                    style="width: 50px"
                                >

                                <br>

                                <h4>{{ teamName }}</h4>

                            </a-col>

                        </a-row>

                    </a-col>


                    <a-col class="imgContainer" :span="4">

                        <img
                            src="./../../assets/images/corner-top-right.svg"
                            alt=""
                        >

                        <a-avatar
                            size="large"
                            class="teamPicture"
                            :src="teamPicture"
                        />

                    </a-col>

                </a-row>


                <a-row class="infoTeam">

                    <CardBtn
                        icon-assets="calendar.svg"
                        title="Fecha del partido"
                        desc="27/09/2020 20:30"
                        icon-customizable="true"
                        @click.native="setMatchDate()"
                    />


                    <ModalDef
                        v-model="modalVisible1"
                        title="Fecha del partido"
                        desc="Entre los equipos pueden decidir en qué fecha y hora
                        se jugará el partido. La fecha debe ser dentro del rango
                        permitido, esto es, antes de la fecha de expiración."
                    >

                        <a-row type="flex" justify="space-around">

                            <a-date-picker
                                :value="valueDate"
                                @change="onChangeDate"
                            />

                            <a-time-picker
                                format="HH:mm"
                                :minute-step="30"
                                :value="valueTime"
                                @change="onChangeTime"
                            />

                        </a-row>

                    </ModalDef>


                    <CardBtn
                        icon-assets="expire.svg"
                        title="Fecha de expiración"
                        desc="27/09/2020 20:30"
                        icon-customizable="true"
                        @click.native="setExpirationDate()"
                    />


                    <ModalDef
                        v-model="modalVisible2"
                        title="Fecha de expiración"
                        desc="Fecha en que el partido caducará (14 días desde la creación del partido).
                        Los equipos deberán fijar una fecha del encuentro del plazo.
                        Una vez pasada la fecha de expiración, el partido se eliminará automáticamente."
                    />


                    <CardBtn
                        icon-assets="patch-active.svg"
                        title="Parches"
                        desc="1/3"
                        icon-customizable="true"
                        @click.native="setPatches()"
                    />


                    <ModalDef
                        v-model="modalVisible3"
                        title="Parches"
                        desc="Entre los equipos pueden decidir cuantos parches pueden necesitar para
                        el partido. Se puede asignar un máximo de 8 parches en total.
                        Si el valor de este campo es mayor que 0, el partido se publicará para que
                        jugadores individuales puedan unirse."
                    >

                        <a-row
                            type="flex"
                            justify="center"
                            align="middle"
                            style="
                                border: 1px solid white;
                                height: 50px;
                                margin-right: 150px;
                                margin-left: 150px;
                                justify-content: space-around;
                            "
                        >

                            <a-button @click="decreasePatches">
                                <a-icon type="minus" />
                            </a-button>

                            <div>{{ valuePatches }}</div>

                            <a-button @click="increasePatches">
                                <a-icon type="plus" />
                            </a-button>

                        </a-row>

                    </ModalDef>


                    <CardBtn
                        icon-assets="football-active.svg"
                        title="Tipo de partido"
                        desc="7v7"
                        icon-customizable="true"
                    />


                    <CardBtn
                        icon-assets="court.svg"
                        title="Lugar del partido"
                        desc="CLUB DEPORTIVO INDEPENDIENTE"
                        icon-customizable="true"
                    />

                    <br>

                    <center><h4>Jugadores</h4></center>

                    <br>

                    <a-row type="flex" justify="center" align="middle">

                        <a-col align="center" :span="4">

                            <div class="navbarPicture">

                                <a-avatar
                                    size="small"
                                    class="teamPicture"
                                    :src="teamPicture"
                                />

                                <nuxt-link to="profile">
                                    <a-avatar size="large" :src="userPicture" />
                                </nuxt-link>

                            </div>

                            <h4>Nombre</h4>

                        </a-col>


                        <a-col align="center" :span="4">

                            <div class="navbarPicture">

                                <a-avatar
                                    size="small"
                                    class="teamPicture"
                                    :src="teamPicture"
                                />

                                <nuxt-link to="profile">
                                    <a-avatar size="large" :src="userPicture" />
                                </nuxt-link>

                            </div>

                            <h4>Nombre</h4>

                        </a-col>


                        <a-col align="center" :span="4">

                            <div class="navbarPicture">

                                <a-avatar
                                    size="small"
                                    class="teamPicture"
                                    :src="teamPicture"
                                />

                                <nuxt-link to="profile">
                                    <a-avatar size="large" :src="userPicture" />
                                </nuxt-link>

                            </div>

                            <h4>Nombre</h4>

                        </a-col>


                        <img
                            src="@/assets/icons/plus-circle.svg"
                            alt=""
                            style="width: 25px; margin-left: 15px"
                            @click="addPlayer()"
                        >


                        <ModalDef
                            v-model="modalVisibleAddPlayer"
                            title="Agrega un jugador"
                            desc="Invita a jugadores individuales que conozcas. Los jugadores
                            que invites contarán como un parche en el partido."
                        >

                            <br>

                            <a-row style="display: flex">

                                <PrincipalInput
                                    placeholder="Ingresa el email del jugador"
                                    style="width: 100%"
                                />

                                <img
                                    src="@/assets/icons/dm-search.svg"
                                    alt=""
                                    style="
                                        position: absolute;
                                        right: 10px;
                                        top: 5px;
                                        width: 20px;
                                    "
                                >

                            </a-row>

                            <br>

                            <a-row>

                                <a-avatar
                                    size="large"
                                    :src="getImage('avatar.svg')"
                                />

                                <h4 style="color: white">
                                    Svenko
                                </h4>

                                <div>
                                    <RoundedTextBtn text="solicitar" />
                                </div>

                            </a-row>

                        </ModalDef>

                    </a-row>

                    <br>

                    <a-form-model-item>

                        <PrincipalBtn
                            text="GUARDAR"
                            :loading="btnLoading"
                            @click.native="createTeam()"
                        />

                    </a-form-model-item>

                </a-row>

            </a-col> -->

        </a-row>

    </div>

</template>

<script>
export default {

    layout: 'navbar',


    data () {
        return {
            // isVisible: true,
            // teamName: 'NOMBRE EQUIPO',
            // modalVisible1: false,
            // modalVisible2: false,
            // modalVisible3: false,
            // modalVisibleAddPlayer: false,
            // valueDate: null,
            // valueTime: null,
            // valuePatches: 0,
            activeMatchChat  : 0
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

        _actives () {
            return this.$store.getters['matches/get'].actives
        },

        _requests () {
            return this.$store.getters['matches/get'].requests
        }

    },


    async mounted () {

        await this.$store.dispatch('matches/listMatches')
            .catch((e) => {
                console.log(e)
                this.showNotification(e.title, e.msg, e.type)
            })

        await this.$store.dispatch('matches/listRequests')
            .catch((e) => {
                console.log(e)
                this.showNotification(e.title, e.msg, e.type)
            })

    },


    methods: {
        // setMatchDate () {
        //     console.log('Card to set match date clicked')
        //     this.modalVisible1 = !this.modalVisible1
        // },
        // setExpirationDate () {
        //     console.log('Card to set expiration date clicked')
        //     this.modalVisible2 = !this.modalVisible2
        // },
        // setPatches () {
        //     console.log('Card to set patches clicked')
        //     this.modalVisible3 = !this.modalVisible3
        // },
        // addPlayer () {
        //     console.log('Add player btn clicked')
        //     this.modalVisibleAddPlayer = !this.modalVisibleAddPlayer
        // },
        // createTeam () {
        //     console.log('Save btn clicked')
        // },
        // getImage (image) {
        //     const mode =
        //         this._globalState.themePreference === 'light' ? 'lm' : 'dm'
        //     return require(`@/assets/icons/${mode}-${image}`)
        // },
        // onChangeDate (date, dateString) {
        //     console.log(date, dateString)
        //     this.valueDate = date
        // },
        // onChangeTime (time) {
        //     console.log(time.toString())
        //     this.valueTime = time
        // },
        // decreasePatches () {
        //     if (this.valuePatches > 0) {
        //         this.valuePatches--
        //     }
        // },
        // increasePatches () {
        //     if (this.valuePatches < 8) {
        //         this.valuePatches++
        //     }
        // }

        setChat (i) {

            this.activeMatchChat = i

            // if (this._activeTeam) {

            //     await this.$store.dispatch('teams/listTeamMembers', {
            //         teamId: this._activeTeam.id
            //     })
            //         .catch((e) => {
            //             this.showNotification(e.title, e.msg, e.type)
            //         })

            // }

        },

        acceptRequest (match) {

            console.log(match)

        },

        rejectRequest (match) {

            console.log(match)

        }

    }

}
</script>
