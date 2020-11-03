<template>
  <div class="genderSelector">
    <a-row>
      <label>
        <b>{{ values.label | uppercase }}</b>
      </label>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-radio-group
          v-model="values.gender"
          :default-value="values.gender"
          @change="setGender"
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
  filters: {
    uppercase (value) {
      return value.toUpperCase()
    }
  },
  props: {
    values: {
      type: Object,
      default: () => {
        return {
          label: 'sexo',
          gender: 'M'
        }
      }
    }
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
    setGender (event) {
      this.values.gender = event.target.value
      this.triggerChange()
    },
    triggerChange () {
      this.$emit('change', this.values)
    }
  }
}
</script>
