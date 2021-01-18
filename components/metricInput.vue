<template>
  <div class="metricInput">
    <label>
      <h4>{{ label }}</h4>
    </label>
    <a-input
      :value="value"
      :suffix="suffix"
      @input="triggerInput"
      @keypress="isNumber($event)"
    />
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String, default: 'PESO' },
    suffix: { type: String, default: 'kg' },
    value: { type: Number, default: 0 }
  },
  methods: {
    triggerInput (e) {
      this.$emit('input', Number(e.target.value))
      this.$emit('change', Number(e.target.value))
    },
    isNumber (evt) {
      evt = (evt) || window.event
      const charCode = (evt.which) ? evt.which : evt.keyCode
      if (((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) || evt.key === '.') {
        evt.preventDefault()
      } else {
        return true
      }
    }
  }
}
</script>
