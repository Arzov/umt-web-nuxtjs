<template>
  <a-button class="principalBtn">
    <i>{{ text | uppercase }}</i>
  </a-button>
</template>

<script>
export default {
  filters: {
    uppercase (value) {
      return value.toUpperCase()
    }
  },
  props: {
    text: { type: String, default: '' }
  }
}
</script>
