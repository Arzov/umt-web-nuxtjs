<template>

    <div :class="`card-btn ${active ? 'active' : ''}`" @click="toggle">

        <img
            v-if="!iconCustomizable"
            :src="active ? getIcon(icon.active) : getIcon(icon.normal)"
        >

        <img v-else :src="getImage(iconAssets)">

        <div class="content">
            <h2 class="title">
                {{ title }}
            </h2>
            {{ desc }}
        </div>

    </div>

</template>


<script>
export default {

    props: {
        title               : { type: String, default: '' },
        desc                : { type: String, default: '' },
        active              : { type: Boolean, default: false },
        value               : { type: String, default: null },
        iconAssets          : { type: String, default: '' },
        iconCustomizable    : { type: Boolean, default: false },
        icon                : {
            type: Object,
            default: () => {
                return { normal: '', active: '' }
            }
        }
    },


    methods: {

        toggle () {
            this.$emit('change', this.value)
        },

        getImage (image) {
            const mode = this._themePrefix
            return require(`@/assets/icons/${mode}-${image}`)
        }

    }

}
</script>
