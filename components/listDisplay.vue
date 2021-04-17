<template>
    <!-- patch -->
    <div v-if="type == 'patch'" class="listDisplay">
        <!-- team pictures -->
        <div :class="`pictures patch ${loading ? 'loading' : ''}`">
            <figure>
                <LoadingAvatar v-if="loading" />
                <a-avatar v-if="!loading" :src="getImage(match.picture1)" />

                <figcaption v-if="!loading">
                    <a-tooltip placement="bottom">
                        <template slot="title">
                            <span>{{ match.name1 }}</span>
                        </template>

                        <h4>
                            {{ match.name1 }}
                        </h4>
                    </a-tooltip>
                </figcaption>
            </figure>

            <b> - </b>

            <figure>
                <LoadingAvatar v-if="loading" />
                <a-avatar v-if="!loading" :src="getImage(match.picture2)" />

                <figcaption v-if="!loading">
                    <a-tooltip placement="bottom">
                        <template slot="title">
                            <span>{{ match.name2 }}</span>
                        </template>

                        <h4>
                            {{ match.name2 }}
                        </h4>
                    </a-tooltip>
                </figcaption>
            </figure>
        </div>

        <!-- content -->
        <div class="content patch">
            <figure v-if="loading" class="loading">
                <i><LoadingText type="title" /></i>

                <figcaption>
                    <LoadingText />
                </figcaption>
            </figure>

            <figure v-if="!loading" class="count">
                <i>
                    {{
                        `${match.patches.CP.N} /
                        ${match.patches.NP.N}`
                    }}
                </i>
                <figcaption>Parches</figcaption>
            </figure>

            <figure v-if="!loading" class="date">
                <i>
                    {{
                        `${this.$UTILS.getDayDD(match.schedule)} /
                        ${this.$UTILS.getMonthMM(match.schedule)}`
                    }}
                </i>
                <figcaption>Fecha</figcaption>
            </figure>
        </div>

        <!-- button -->
        <div v-if="!loading" class="btn" @click="triggerClick">
            <RoundedTextBtn text="unirse" />
        </div>
    </div>

    <!-- team -->
    <div v-else class="listDisplay">
        <!-- team picture -->
        <LoadingAvatar v-if="loading" size="large" />
        <a-avatar v-if="!loading" size="large" :src="getImage(team.picture)" />

        <!-- content -->
        <div class="content">
            <h2>
                <LoadingText v-if="loading" type="title" />
                {{ !loading ? team.name : "" }}
            </h2>
            <LoadingText v-if="loading" />
            <div v-if="!loading">
                A {{ team.distance }} kilómetros de distancia
            </div>
        </div>

        <!-- button -->
        <div v-if="!loading" class="btn" @click="triggerClick">
            <RoundedTextBtn text="solicitar" />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        match: { type: Object, default: () => {} },
        team: { type: Object, default: () => {} },
        loading: { type: Boolean, default: false },
        type: { type: String, default: "challenge" },
    },

    methods: {
        getImage(image) {
            if (image === "") return this.getIcon("team-profile.svg");
            else return image;
        },
        triggerClick() {
            this.$emit("click");
        },
    },
};
</script>
