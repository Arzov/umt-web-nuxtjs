<template>

    <div class="multi-selector">

        <label>
            <h4>{{ label }}</h4>
        </label>

        <div class="container">
            <div
                v-for="(option, i) in opts"
                :key="`o${i}`"
                :class="`option ${option.stat}`"
                @click="toggle(option.value, i)"
            >
                <b>{{ option.key }}</b>
            </div>
        </div>

    </div>

</template>


<script>
export default {

    props: {
        label   : { type: String, default: 'Selecciona' },
        options : { type: Array, default: () => [] },
        value   : { type: Array, required: true }
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

        toggle (value, i) {

            let output = JSON.parse(JSON.stringify(this.value))

            if (this.opts[i].stat === 'on') {

                if (output.length > 1) {
                    output = output.filter((v) => {
                        return value !== v
                    })
                }

            }

            else {
                output.push(value)
            }

            this.$emit('input', output)
            this.$emit('change', output)

        },


        initOptions () {
            return this.options.map((option) => {

                if (this.value.includes(option.key)) {
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
