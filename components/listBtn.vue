<template>
    <div v-if="type === 'individual'" class="listBtn">
        <a-avatar size="large" :src="getImage(picture1)" />
        <a-row class="contentContainer">
            <a-col class="content" :span="18">
                <a-row class="title">
                    <h2>
                        {{ title }}
                    </h2>
                </a-row>
                <a-row class="desc">
                    {{ desc }}
                </a-row>
            </a-col>
            <a-col class="time" :span="6">
                {{ time }}
            </a-col>
        </a-row>
    </div>
    <div v-else class="listBtn">
        <a-row class="contentContainer">
            <a-col :span="8">
                <div :class="`pictures patch ${loading ? 'loading' : ''}`">
                    <figure>
                        <LoadingAvatar v-if="loading" />
                        <a-avatar
                            v-if="!loading"
                            :src="getImage(match.picture1)"
                        />

                        <figcaption v-if="!loading">
                            <a-tooltip placement="bottom">
                                <template slot="title">
                                    <span>{{ match.name1 }}</span>
                                </template>

                                <h5>
                                    {{ match.name1 }}
                                </h5>
                            </a-tooltip>
                        </figcaption>
                    </figure>

                    <b> - </b>

                    <figure>
                        <LoadingAvatar v-if="loading" />
                        <a-avatar
                            v-if="!loading"
                            :src="getImage(match.picture2)"
                        />

                        <figcaption v-if="!loading">
                            <a-tooltip placement="bottom">
                                <template slot="title">
                                    <span>{{ match.name2 }}</span>
                                </template>

                                <h5>
                                    {{ match.name2 }}
                                </h5>
                            </a-tooltip>
                        </figcaption>
                    </figure>
                </div>
            </a-col>
            <a-col class="content" :span="10">
                <a-row class="title">
                    <h2>
                        {{ title }}
                    </h2>
                </a-row>
                <a-row class="desc">
                    {{ desc }}
                </a-row>
            </a-col>
            <a-col class="time" :span="6">
                {{ time }}
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
        time: { type: Date, default: "" },
        type: { type: String, default: "individual" },
        loading: { type: Boolean, default: false },
    },
    data() {
        return {
            match: [
                {
                    name1: "Team 1",
                    name2: "Team 2",
                },
                {
                    name1: "Team 1",
                    name2: "Team 2",
                },
            ],
        };
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
    },
};
</script>
