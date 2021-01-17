<template>
  <!-- TODO: Refactorizar componente reutilizable (gender y foot Selector) -->
  <div class="genderSelector">
    <label>
      <h4>{{ label }}</h4>
    </label>
    <a-radio-group
      :value="value"
      @change="triggerChange"
    >
      <a-radio
        v-for="f in footOptions"
        :key="`f${f.key}`"
        :value="f.value"
      >
        {{ f.key }}
      </a-radio>
    </a-radio-group>
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String, default: 'Pie hábil' },
    value: { type: String, default: 'R' }
  },
  data () {
    return {
      footOptions: [
        { key: 'Izquierdo', value: 'L' },
        { key: 'Derecho', value: 'R' }
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
