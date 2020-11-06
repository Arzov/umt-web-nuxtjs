<template>
  <div class="genderSelector">
    <a-row>
      <label>
        <b>{{ label | uppercase }}</b>
      </label>
    </a-row>
    <a-row>
      <a-col :span="24">
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
      </a-col>
    </a-row>
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
