<template>
  <div class="heightSelector">
    <label>
      <h4>{{ label }}</h4>
    </label>
    <a-input-number
      :min="0"
      :max="205"
      :default-value="0"
    />
    cm
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String, default: 'Estatura' },
    value: { type: Number, default: 0 }
  },
  methods: {
    triggerInput (e) {
      this.$emit('input', e.target.value)
      this.$emit('change', e.target.value)
    }
  }
}
</script>
