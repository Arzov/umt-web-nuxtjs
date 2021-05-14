<template>
    <div class="positionSelector">
        <h4>{{ label }}</h4>

        <a-row :gutter="[48, 48]" type="flex">
            <a-col
                v-for="position in opts"
                :key="`c${position.value}`"
                :span="4.8"
            >
                <PositionBtn
                    :key="`p${position.value}`"
                    :text="position.text"
                    :label="position.desc"
                    :color="position.color"
                    :value="position.value"
                    :status="position.stat"
                    @change="setPosition($event)"
                />
            </a-col>
        </a-row>
    </div>
</template>

<script>
export default {
    props: {
        label: { type: String, default: 'POSICIONES DE JUEGO' },
        options: {
            type: Array,
            default: () => require('@/static/data/positionOptions.json')
        },
        value: { type: Array, required: true }
    },

    data () {
        return {
            opts: []
        }
    },

    watch: {
        value () {
            this.opts = this.initOptions()
        }
    },

    mounted () {
        this.opts = this.initOptions()
    },

    methods: {
        setPosition (e) {
            let output = JSON.parse(JSON.stringify(this.value))

            if (e.value !== null) {
                output.push(e.value)
                output = output.filter((value) => {
                    return value !== ''
                })
            }
            else {
                output = output.filter((value) => {
                    return value !== e.key && value !== ''
                })

                // fill empty array just for dynamoDB
                if (output.length <= 1 || output[0] === '') {
                    output = ['']
                }
            }

            this.$emit('input', output)
            this.$emit('change', output)
        },

        initOptions () {
            return this.options.map((option) => {
                if (this.value.includes(option.value)) {
                    return { ...option, stat: 'on' }
                }
                else {
                    return { ...option, stat: 'off' }
                }
            })
        }
    }
}
</script>
