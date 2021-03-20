<template>
  <a-avatar :size="size" class="loadingAvatar" />
</template>

<script>
export default {
    props: {
        size: { type: String, default: 'default' }
    }
}
</script>
