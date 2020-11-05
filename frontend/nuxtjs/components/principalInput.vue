<template>
  <a-input
    v-if="_themePreference === 'light'"
    class="lmPrincipalInput"
    :placeholder="placeholder"
    :type="type"
    :autocomplete="autocomplete"
    :value="values.text"
    @change="setText"
  />
  <a-input
    v-else
    class="dmPrincipalInput"
    :placeholder="placeholder"
    :type="type"
    :autocomplete="autocomplete"
    :value="values.text"
    @change="setText"
  />
</template>

<script>
export default {
  props: {
    placeholder: { type: String, default: 'Ingresa' },
    type: { type: String, default: 'text' },
    autocomplete: { type: String, default: 'on' },
    values: {
      type: Object,
      default: () => {
        return {
          text: ''
        }
      }
    }
  },
  methods: {
    setText (e) {
      this.values.text = e.target.value
      this.triggerChange()
    },
    // triggerInput (e) {
    //   this.$emit('update:text', e.target.value)
    // },
    triggerChange () {
      this.$emit('change', this.values)
    }
  }
}
</script>
