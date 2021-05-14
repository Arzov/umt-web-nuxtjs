<template>
    <a-button class="principalBtn" :loading="loading">
        <i>{{ text | uppercase }}</i>
    </a-button>
</template>

<script>
export default {
    props: {
        text: { type: String, default: '' },
        loading: { type: Boolean, default: false }
    }
}
</script>
