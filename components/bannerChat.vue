<template>
    <div>
        <a-row class="bannerChat">
            <a-col class="imgContainer" :span="4">
                <img src="../assets/images/corner-top-right.svg" alt="" />
                <a-avatar size="large" class="teamPicture" :src="teamPicture" />
            </a-col>
            <a-col v-if="type === 'teams'" class="content" :span="20">
                <center>
                    <h2>{{ teamName }}</h2>
                </center>
                <br />
                <center>Haz click aquí para más info</center>
            </a-col>
            <a-col v-else class="content" :span="20">
                <center>
                    <h2>{{ teamName }}</h2>
                </center>
                <br />
                <a-row type="flex" justify="space-between">
                    <a-col :span="4">
                        <a-row type="flex" align="top">
                            <img
                                :src="getImage('patch-active.svg')"
                                style="width: 30%; margin-right: 10px"
                                alt=""
                            />
                            <h3>1/3</h3>
                        </a-row>
                    </a-col>
                    <a-col :span="4">
                        <a-row type="flex">
                            <img
                                :src="getImage('calendar.svg')"
                                style="width: 30%; margin-right: 10px"
                                alt=""
                            />
                            <a-col>
                                <h3>20/09</h3>
                                <h2>18:30</h2>
                            </a-col>
                        </a-row>
                    </a-col>
                    <a-col :span="4">
                        <a-row type="flex" align="top">
                            <img
                                :src="getImage('expire.svg')"
                                style="width: 30%; margin-right: 10px"
                                alt=""
                            />
                            <a-col>
                                <h3>27/09</h3>
                                <h2>20:30</h2>
                            </a-col>
                        </a-row>
                    </a-col>
                    <a-col :span="4">
                        <a-row type="flex" align="top">
                            <img
                                :src="getImage('court.svg')"
                                style="width: 30%; margin-right: 10px"
                                alt=""
                            />
                            <a-col :span="4"> <h3>CLUB DEPORTIVO</h3> </a-col>
                        </a-row>
                    </a-col>
                    <a-col :span="4">
                        <a-row type="flex" align="top">
                            <img
                                :src="getImage('football-active.svg')"
                                style="width: 30%; margin-right: 10px"
                                alt=""
                            />
                            <h3>7v7</h3>
                        </a-row>
                    </a-col>
                </a-row>
            </a-col>
        </a-row>
    </div>
</template>

<script>
export default {
    props: {
        teamName: { type: String, default: "NOMBRE EQUIPO" },
        active: { type: Boolean, default: false },
        type: { type: String, default: "teams" },
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
        getImage(image) {
            const mode =
                this._globalState.themePreference === "light" ? "lm" : "dm";
            return require(`@/assets/icons/${mode}-${image}`);
        },
    },
};
</script>
