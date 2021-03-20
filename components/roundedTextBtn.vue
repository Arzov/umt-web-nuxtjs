<template>
  <div class="roundedTextBtn">
    <h4> {{ text }} </h4>
  </div>
</template>

<script>
export default {
    props: {
        text: { type: String, default: '' }
    }
}
</script>
