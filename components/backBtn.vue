<template>
    <nuxt-link class="backBtn" :to="path">
        <img
            :src="
                _themePreference === 'light'
                    ? require('../assets/icons/lm-arrow-left.svg')
                    : require('../assets/icons/dm-arrow-left.svg')
            "
        />
    </nuxt-link>
</template>

<script>
export default {
    props: {
        path: { type: String, default: "/" },
    },
};
</script>
