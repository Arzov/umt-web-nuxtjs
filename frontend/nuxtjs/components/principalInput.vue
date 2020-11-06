<template>
  <a-input
    :class="_themePreference === 'light' ? 'lmPrincipalInput' : 'dmPrincipalInput'"
    :placeholder="placeholder"
    :type="type"
    :autocomplete="autocomplete"
    :value="value"
    @input="triggerInput"
  />
</template>

<script>
export default {
  props: {
    placeholder: { type: String, default: 'Ingresa' },
    type: { type: String, default: 'text' },
    autocomplete: { type: String, default: 'on' },
    value: { type: String, default: 'on' }
  },
  methods: {
    triggerInput (e) {
      this.$emit('input', e.target.value)
      this.$emit('change', e.target.value)
    }
  }
}
</script>
