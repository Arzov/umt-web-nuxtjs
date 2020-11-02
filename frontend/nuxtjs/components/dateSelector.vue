<template>
  <div class="dateSelector">
    <a-row>
      <label>
        <b>{{ values.label | uppercase }}</b>
      </label>
    </a-row>
    <a-row>
      <a-col :span="7">
        <a-select
          v-model="values.day"
          placeholder="Día"
          :default-value="values.day"
          @change="setDay"
        >
          <a-select-option v-for="d in dayOptions" :key="`d${d}`" :value="d">
            {{ d }}
          </a-select-option>
        </a-select>
      </a-col>
      <a-col :span="1" />
      <a-col :span="8">
        <a-select
          v-model="values.month"
          placeholder="Mes"
          :default-value="values.month"
          @change="setMonth"
        >
          <a-select-option v-for="m in monthOptions" :key="`m${m.value}`" :value="m.value">
            {{ m.key }}
          </a-select-option>
        </a-select>
      </a-col>
      <a-col :span="1" />
      <a-col :span="7">
        <a-select
          v-model="values.year"
          placeholder="Año"
          :default-value="values.year"
          @change="setYear"
        >
          <a-select-option v-for="y in yearOptions" :key="`y${y}`" :value="y">
            {{ y }}
          </a-select-option>
        </a-select>
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
          label: 'fecha',
          day: undefined,
          month: undefined,
          year: undefined
        }
      }
    }
  },
  data () {
    return {
      monthOptions: [
        { key: 'Enero', value: '01' },
        { key: 'Febrero', value: '02' },
        { key: 'Marzo', value: '03' },
        { key: 'Abril', value: '04' },
        { key: 'Mayo', value: '05' },
        { key: 'Junio', value: '06' },
        { key: 'Julio', value: '07' },
        { key: 'Agosto', value: '08' },
        { key: 'Septiembre', value: '09' },
        { key: 'Octubre', value: '10' },
        { key: 'Noviembre', value: '11' },
        { key: 'Diciembre', value: '12' }
      ]
    }
  },
  computed: {
    dayOptions () {
      return Array.from({ length: 31 }, (value, index) => {
        const d = 1 + index

        if (d < 10) { return '0' + String(d) } else { return String(d) }
      })
    },
    yearOptions () {
      const year = new Date().getFullYear()
      return Array.from({ length: year - 1899 }, (value, index) => 1900 + index).reverse()
    }
  },
  methods: {
    setDay (day) {
      this.values.day = day
      this.triggerChange()
    },
    setMonth (month) {
      this.values.month = month
      this.triggerChange()
    },
    setYear (year) {
      this.values.year = year
      this.triggerChange()
    },
    triggerChange () {
      this.$emit('change', this.values)
    }
  }
}
</script>
