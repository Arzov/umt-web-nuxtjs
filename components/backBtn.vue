<template>

    <nuxt-link class="back-btn" :to="path">
        <img
            :src="require(`@/assets/icons/${_themePrefix}-arrow-left.svg`)"
        >
    </nuxt-link>

</template>


<script>

export default {
    props: {
        path: { type: String, default: '/' }
    }
}

</script>
