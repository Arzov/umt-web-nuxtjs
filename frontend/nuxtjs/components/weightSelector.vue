<template>
  <div class="weightSelector">
    <label>
      <h4>{{ label }}</h4>
    </label>
    <a-input-number
      :min="0"
      :max="150"
      :default-value="0"
    />
    kg
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String, default: 'Peso' },
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
