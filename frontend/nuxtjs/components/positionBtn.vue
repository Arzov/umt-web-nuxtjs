<template>
  <a-button :class="`positionBtn${color}`">
    <b>{{ text }}</b>
  </a-button>
</template>

<script>
export default {
  props: {
    text: { type: String, default: '' },
    color: { type: String, default: '' }
  }
}
</script>
