<template>
    <div v-if="type == 'in'" class="listBtn">
        <a-avatar size="large" :src="getImage(picture1)" />
        <a-row class="contentContainer">
            <a-col class="content" :span="14">
                <a-row class="title">
                    <h2>
                        {{ title }}
                    </h2>
                </a-row>
                <a-row class="desc">
                    {{ desc }}
                </a-row>
            </a-col>
            <a-col class="icon" :span="10">
                <a-row class="iconRow">
                    <img
                        src="@/assets/icons/check-circle.svg"
                        alt=""
                        @click="accept"
                    />
                    <img
                        src="@/assets/icons/x-circle.svg"
                        alt=""
                        @click="reject"
                    />
                </a-row>
            </a-col>
        </a-row>
    </div>
    <div v-else class="listBtn">
        <a-avatar size="large" :src="getImage(picture1)" />
        <a-row class="contentContainer">
            <a-col class="content" :span="14">
                <a-row class="title">
                    <h2>
                        {{ title }}
                    </h2>
                </a-row>
                <a-row class="desc">
                    {{ desc }}
                </a-row>
            </a-col>
            <a-col class="icon" :span="10">
                <a-row class="iconRow">
                    <img
                        src="@/assets/icons/x-circle.svg"
                        alt=""
                        @click="reject"
                    />
                </a-row>
            </a-col>
        </a-row>
    </div>
</template>

<script>
export default {
    props: {
        picture1: { type: String, default: "" },
        picture2: { type: String, default: "" },
        title: { type: String, default: "" },
        desc: { type: String, default: "" },
        type: { type: String, default: "in" },
    },
    methods: {
        getImage(image) {
            if (image === "") {
                const mode =
                    this._globalState.themePreference === "light" ? "lm" : "dm";
                return require(`@/assets/icons/${mode}-team-profile.svg`);
            } else {
                return image;
            }
        },
        accept() {
            console.log("Click de botón para aceptar");
        },
        reject() {
            console.log("Click de botón para rechazar");
        },
    },
};
</script>
