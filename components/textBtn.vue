<template>

    <p class="text-btn">
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
