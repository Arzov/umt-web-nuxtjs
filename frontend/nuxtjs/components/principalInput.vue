<template>
  <a-input
    class="principalInput"
    :placeholder="placeholder"
    :type="type"
    :autocomplete="autocomplete"
    :name="name"
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
    name: { type: String, default: '' },
    value: { type: String, default: '' }
  },
  methods: {
    triggerInput (e) {
      this.$emit('input', e.target.value)
      this.$emit('change', e.target.value)
    }
  }
}
</script>
