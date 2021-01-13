<template>
  <div class="ageSlider">
    <label>
      <h4>{{ label }}
        <p v-if="value[1] == 60" class="range">{{ textRange.min }} - {{ textRange.max }}+</p>
        <p v-else class="range">{{ textRange.min }} - {{ textRange.max }}</p>
      </h4>
    </label>
    <a-slider
      range
      :value="value"
      :min="fullRange.min"
      :max="fullRange.max"
      @change="triggerChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String, default: 'Rango' },
    value: { type: Array, default: () => { return [18, 22] } },
    fullRange: {
      type: Object,
      default: () => {
        return {
          min: 18,
          max: 60
        }
      }
    }
  },
  data () {
    return {
      textRange: {
        min: this.value[0],
        max: this.value[1]
      }
    }
  },
  methods: {
    triggerChange (e) {
      this.textRange.min = e[0]
      this.textRange.max = e[1]
      this.$emit('input', e)
      this.$emit('change', e)
    }
  }
}
</script>

<style scoped>

</style>
