<template>
    <p class="textBtn">
        {{ text }}
    </p>
</template>

<script>
export default {
    props: {
        text: { type: String, default: '' }
    }
}
</script>
