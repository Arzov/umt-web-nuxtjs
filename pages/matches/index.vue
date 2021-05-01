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
                            <BannerChat />
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
                    <a-col
                        v-if="this._globalState.themePreference === 'light'"
                        class="iconContainer"
                        :span="4"
                    >
                        <img
                            src="./../../assets/icons/lm-x-active.svg"
                            alt=""
                            @click="isVisible = !isVisible"
                        />
                    </a-col>
                    <a-col v-else class="iconContainer" :span="4">
                        <img
                            src="./../../assets/icons/dm-x-active.svg"
                            alt=""
                            @click="isVisible = !isVisible"
                        />
                    </a-col>
                    <a-col class="title" :span="20">
                        <center>
                            <h2>{{ teamName }}</h2>
                        </center>
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
                    <InfoTeam title1="INFORMACIÓN" title2="FORMACIÓN" />
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
            console.log("Probando el click del banner");
        },
        getImage(image) {
            const mode =
                this._globalState.themePreference === "light" ? "lm" : "dm";
            return require(`@/assets/icons/${mode}-${image}`);
        },
    },
};
</script>
