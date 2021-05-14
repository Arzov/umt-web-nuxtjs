<template>
    <!-- patch -->
    <div class="listDisplay">
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

                        <h5>
                            {{ match.name1 }}
                        </h5>
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

                        <h5>
                            {{ match.name2 }}
                        </h5>
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
                <figcaption>PARCHAR</figcaption>
                <p>Aceptar solicitud</p>
            </figure>
        </div>

        <!-- buttons -->
        <div v-if="!loading">
            <a-row class="iconRow">
                <img
                    src="@/assets/icons/check-circle.svg"
                    alt=""
                    @click="accept"
                />
                <img src="@/assets/icons/x-circle.svg" alt="" @click="reject" />
            </a-row>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        match: { type: Object, default: () => {} },
        loading: { type: Boolean, default: false },
    },

    methods: {
        getImage(image) {
            if (image === "") return this.getIcon("team-profile.svg");
            else return image;
        },
        triggerClick() {
            this.$emit("click");
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
