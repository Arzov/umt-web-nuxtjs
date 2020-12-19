<template>
  <u-slider title="rango de edad" :range="value">
    <a-slider
      v-model="_value"
      range
      :default-value="value"
      :min="ageRange.min"
      :max="ageRange.max"
      @change="setAge"
    />
  </u-slider>
</template>

<script>
import USlider from './uSlider'

export default {
  name: 'AgeFilterInput',
  components: { USlider },
  props: ['value'],
  data () {
    return {
      ageRange: {
        min: 18,
        max: 60,
        default: [18, 22]
      }
    }
  },
  computed: {
    _value () {
      return this.value ? this.value : [18, 22]
    }
  },
  methods: {
    setAge (event) {
      this.$emit('change', event)
    }
  }
}
</script>

<style scoped>

</style>
