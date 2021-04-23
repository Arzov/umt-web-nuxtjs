<template>
    <div class="teams">
        <a-row>
            <a-col class="leftContent" :span="8">
                <a-row class="shield">
                    <img src="@/assets/images/shield.svg" alt="" />
                </a-row>

                <a-tabs
                    class="tabDisplay tabPane"
                    :default-active-key="1"
                    size="large"
                >
                    <a-tabPane :key="1" tab="ACTIVOS">
                        <ScrollContainer>
                            <ListBtn
                                title="FC BARCELONA"
                                desc="Matias: Hola chicos, todos listos?"
                                time="2021-04-12T21:36:23.570Z"
                                @click.native="click()"
                            />
                            <PrincipalBtn
                                text="+ CREAR EQUIPO (1/3)"
                                :loading="btnLoading"
                                @click.native="createTeam()"
                            />
                        </ScrollContainer>
                    </a-tabPane>
                    <a-tabPane :key="2" tab="SOLICITUDES">
                        <ScrollContainer>
                            <CollapseDisplay
                                icon="team-profile.svg"
                                label="TEAM (2)"
                            >
                                <RequestCard
                                    title="Matias"
                                    desc="Solicitud enviada"
                                    :pictures="['']"
                                    type="user"
                                    action="out"
                                />

                                <RequestCard
                                    title="Matias"
                                    desc="Aceptar solicitud"
                                    :pictures="['', '']"
                                    type="match"
                                />
                            </CollapseDisplay>
                        </ScrollContainer>
                    </a-tabPane>
                </a-tabs>
            </a-col>

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
                            />

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
                                />
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
                                />
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
                            />
                        </a-col>
                        <a-col v-else class="iconContainer" :span="4">
                            <img
                                src="@/assets/icons/dm-x-active.svg"
                                alt=""
                                @click="showInfoTeam = !showInfoTeam"
                            />
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
                            />
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
                                            @click.native="toggleModal()"
                                        />
                                    </a-form-model-item>
                                    <Modal v-model="visible" />
                                    <h3>JUGADORES</h3>
                                    <br />
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
    layout: "navbar",

    data() {
        return {
            showInfoTeam: false,
            teamName: "NOMBRE EQUIPO",
            visible: false,
        };
    },

    computed: {
        teamPicture() {
            if (
                this._userState.primaryTeam &&
                this._userState.primaryTeam.picture
            ) {
                return this._userState.primaryTeam.picture;
            } else {
                return this.getIcon("team-profile.svg");
            }
        },
    },

    methods: {
        click() {
            console.log("Probando el click del banner");
        },
        toggleModal() {
            console.log("Probando click para agregar jugadores");
            this.visible = !this.visible;
        },
    },
};
</script>
