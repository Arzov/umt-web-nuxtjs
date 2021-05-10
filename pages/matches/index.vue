<template>
    <div class="teams">
        <a-row>
            <a-col class="leftContent" :span="8">
                <a-row class="cup">
                    <img src="@/assets/images/cup.svg" alt="" />
                </a-row>
                <a-row class="options">
                    <MatchesTabs title1="ACTIVOS" title2="SOLICITUDES" />
                </a-row>
            </a-col>
            <a-col v-show="isVisible" class="rightContent" :span="16">
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
                        />
                    </a-col>
                    <a-col class="title" :span="20">
                        <a-row type="flex" justify="center" align="middle">
                            <a-col :span="6" align="center">
                                <img
                                    :src="teamPicture"
                                    alt=""
                                    style="width: 50px"
                                />
                                <br />
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
                                />
                                <br />
                                <h4>{{ teamName }}</h4>
                            </a-col>
                        </a-row>
                    </a-col>
                    <a-col class="imgContainer" :span="4">
                        <img
                            src="./../../assets/images/corner-top-right.svg"
                            alt=""
                        />
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
                        @click.native="click()"
                    />
                    <CardBtn
                        icon-assets="expire.svg"
                        title="Fecha de expiración"
                        desc="27/09/2020 20:30"
                        icon-customizable="true"
                        @click.native="click()"
                    />
                    <CardBtn
                        icon-assets="patch-active.svg"
                        title="Parches"
                        desc="1/3"
                        icon-customizable="true"
                        @click.native="click()"
                    />
                    <CardBtn
                        icon-assets="football-active.svg"
                        title="Tipo de partido"
                        desc="7v7"
                        icon-customizable="true"
                        @click.native="click()"
                    />
                    <CardBtn
                        icon-assets="court.svg"
                        title="Lugar del partido"
                        desc="CLUB DEPORTIVO INDEPENDIENTE"
                        icon-customizable="true"
                        @click.native="click()"
                    />
                    <br />
                    <center><h4>Jugadores</h4></center>
                    <br />
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
                        />
                    </a-row>
                    <br />
                    <a-form-model-item>
                        <PrincipalBtn
                            text="GUARDAR"
                            :loading="btnLoading"
                            @click.native="createTeam()"
                        />
                    </a-form-model-item>
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
            isVisible: true,
            teamName: "NOMBRE EQUIPO",
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
                return this.getImage("team-profile.svg");
            }
        },
    },
    methods: {
        click() {
            console.log("Card btn clicked");
        },
        addPlayer() {
            console.log("Add player btn clicked");
        },
        createTeam() {
            console.log("Save btn clicked");
        },
        getImage(image) {
            const mode =
                this._globalState.themePreference === "light" ? "lm" : "dm";
            return require(`@/assets/icons/${mode}-${image}`);
        },
    },
};
</script>
