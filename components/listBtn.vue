<template>

    <div :class="isActive ? 'listBtn on' : 'listBtn'">


        <!-- AVATAR -->

        <div v-if="pictures.length == 1">

            <a-avatar size="large" :src="getImage(pictures[0])" />

        </div>

        <div v-else>

            <a-avatar :src="getImage(pictures[0])" />

            <b> - </b>

            <a-avatar :src="getImage(pictures[1])" />

        </div>


        <!-- CONTENT -->

        <a-row class="contentContainer">

            <a-col class="content" :span="18">


                <!-- TITLE -->

                <a-row class="title">

                    <h2> {{ title }} </h2>

                </a-row>


                <!-- DESCRIPTION -->

                <a-row class="desc">
                    {{ desc }}
                </a-row>

            </a-col>


            <!-- DATE TIME -->

            <a-col class="time" :span="6">
                {{ time }}
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
        time: { type: String, default: '' },
        type: { type: String, default: 'user' },
        isActive: { type: Boolean, default: false }

    },


    methods: {

        getImage (image) {

            let icon = 'team-profile.svg'

            switch (this.type) {

            case 'user':
                icon = 'avatar.svg'
                break

            }


            if (image === '') { return this.getIcon(icon) }
            else { return image }

        }

    }

}
</script>
