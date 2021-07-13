<template>

    <nuxt-link :to="path">
        <umt-button type="icon" color="green" icon="arrow-left" />
    </nuxt-link>

</template>


<script>

export default {
    props: {
        path: { type: String, default: '/' }
    }
}

</script>
