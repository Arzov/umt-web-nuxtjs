<template>
  <a-button class="principalBtn">
    <i>{{ text | uppercase }}</i>
  </a-button>
</template>

<script>
export default {
  props: {
    text: { type: String, default: '' }
  }
}
</script>
