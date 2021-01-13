<template>
  <div class="genderSelector">
    <label>
      <h4>{{ label }}</h4>
    </label>
    <a-radio-group
      :value="value"
      @change="triggerChange"
    >
      <a-radio
        v-for="g in genderOptions"
        :key="`g${g.key}`"
        :value="g.value"
      >
        {{ g.key }}
      </a-radio>
    </a-radio-group>
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String, default: 'Sexo' },
    value: { type: String, default: 'M' }
  },
  data () {
    return {
      genderOptions: [
        { key: 'Masculino', value: 'M' },
        { key: 'Femenino', value: 'F' }
      ]
    }
  },
  methods: {
    triggerChange (e) {
      this.$emit('input', e.target.value)
      this.$emit('change', e.target.value)
    }
  }
}
</script>
