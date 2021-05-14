<template>
    <div class="requestCard">
        <!-- AVATAR -->
        <div v-if="pictures.length == 1">
            <a-avatar size="large" :src="getImage(pictures[0])" />
        </div>
        <div v-else>
            <a-avatar :src="getImage(pictures[0])" />

            <b> - </b>

            <a-avatar :src="getImage(pictures[1])" />
        </div>

        <!-- CONTENT CONTAINER -->
        <a-row class="contentContainer">
            <!-- CONTENT -->
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

            <!-- BUTTONS -->
            <a-col class="icon" :span="10">
                <a-row class="iconRow">
                    <img
                        v-if="action == 'in'"
                        src="@/assets/icons/check-circle.svg"
                        alt=""
                        @click="accept"
                    >

                    <img
                        src="@/assets/icons/x-circle.svg"
                        alt=""
                        @click="reject"
                    >
                </a-row>
            </a-col>
        </a-row>
    </div>
</template>

<script>
export default {
    props: {
        pictures: { type: Array, default: () => [''] },
        title: { type: String, default: '' },
        desc: { type: String, default: '' },
        type: { type: String, default: 'user' },
        action: { type: String, default: 'in' }
    },
    methods: {
        getImage (image) {
            let icon = 'team-profile.svg'

            switch (this.type) {
            case 'user':
                icon = 'avatar.svg'
                break
            }

            if (image === '') {
                return this.getIcon(icon)
            }
            else {
                return image
            }
        },
        accept () {
            this.$emit('accept')
        },
        reject () {
            this.$emit('reject')
        }
    }
}
</script>
