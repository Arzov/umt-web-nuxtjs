<template>
  <div class="optionSelector">
    <label>
      <h4>{{ label }}</h4>
    </label>
    <a-radio-group
      :value="value"
      @change="triggerChange"
    >
      <a-radio
        v-for="o in options"
        :key="`o${o.key}`"
        :value="o.value"
      >
        {{ o.key }}
      </a-radio>
    </a-radio-group>
  </div>
</template>

<script>
export default {
    props: {
        label: { type: String, default: 'Selecciona' },
        value: { type: String, default: '' },
        options: { type: Array, default: () => {} }
    },
    methods: {
        triggerChange (e) {
            this.$emit('input', e.target.value)
            this.$emit('change', e.target.value)
        }
    }
}
</script>
