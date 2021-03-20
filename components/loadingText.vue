<template>
  <div :class="`loadingText ${type}`" />
</template>

<script>
export default {
  props: {
    type: { type: String, default: 'paragraph' }
  }
}
</script>
