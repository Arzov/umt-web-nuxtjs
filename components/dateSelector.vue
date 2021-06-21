<template>

    <div class="date-selector">

        <label>
            <h4>{{ label }}</h4>
        </label>

        <div class="container">

            <a-select
                placeholder="Día"
                :value="value.day"
                @change="triggerChange('day', $event)"
            >
                <a-select-option
                    v-for="d in dayOptions"
                    :key="`d${d}`"
                    :value="d"
                >
                    {{ d }}
                </a-select-option>
            </a-select>

            <a-select
                placeholder="Mes"
                :value="value.month"
                @change="triggerChange('month', $event)"
            >
                <a-select-option
                    v-for="m in monthOptions"
                    :key="`m${m.value}`"
                    :value="m.value"
                >
                    {{ m.key }}
                </a-select-option>
            </a-select>

            <a-select
                placeholder="Año"
                :value="value.year"
                @change="triggerChange('year', $event)"
            >
                <a-select-option
                    v-for="y in yearOptions"
                    :key="`y${y}`"
                    :value="y"
                >
                    {{ y }}
                </a-select-option>
            </a-select>

        </div>

    </div>

</template>


<script>
export default {

    props: {
        label: { type: String, default: 'Fecha' },
        value: {
            type: Object,
            default: () => {
                return {
                    day     : undefined,
                    month   : undefined,
                    year    : undefined
                }
            }
        }
    },


    data () {
        return {
            monthOptions: [
                { key: 'Enero', value       : '01' },
                { key: 'Febrero', value     : '02' },
                { key: 'Marzo', value       : '03' },
                { key: 'Abril', value       : '04' },
                { key: 'Mayo', value        : '05' },
                { key: 'Junio', value       : '06' },
                { key: 'Julio', value       : '07' },
                { key: 'Agosto', value      : '08' },
                { key: 'Septiembre', value  : '09' },
                { key: 'Octubre', value     : '10' },
                { key: 'Noviembre', value   : '11' },
                { key: 'Diciembre', value   : '12' }
            ]
        }
    },


    computed: {

        dayOptions () {
            return Array.from({ length: 31 }, (value, index) => {

                const d = 1 + index

                if (d < 10) {
                    return '0' + String(d)
                }

                else {
                    return String(d)
                }

            })
        },

        yearOptions () {

            const year = new Date().getFullYear()

            return Array.from(
                { length: year - 1899 },
                (value, index) => 1900 + index
            ).reverse()

        }

    },


    methods: {
        triggerChange (key, value) {
            const out = { ...this.value, [key]: value }
            this.$emit('input', out)
            this.$emit('change', out)
        }
    }

}
</script>
