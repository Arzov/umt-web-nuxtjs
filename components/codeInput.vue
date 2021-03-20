<template>
  <div class="codeInput">
    <input
      v-for="n in length"
      :key="n"
      :ref="'cn-' + n"
      type="number"
      maxlength="1"
      :min="0"
      :max="9"
      placeholder="0"
      @keyup="onKeyUp($event, n)"
      @change="triggerChange"
    >
  </div>
</template>

<script>
export default {
    data () {
        return {
            code: [],
            length: 6,
            previousValue: undefined
        }
    },
    methods: {
        onKeyUp (event, key) {
            const aux = this.code[key - 1] ? this.code[key - 1] + event.key : undefined

            // Número mayor a 10
            if (this.code[key - 1] && aux && Number(aux) > 10) {
                event.preventDefault()
                this.code[key - 1] = Number(event.key)
                // Digito distinto entre 0 y 9
            } else if (Number(event.keyCode) < 48 || Number(event.keyCode) > 57) {
                event.preventDefault()
            } else {
                this.code[key - 1] = Number(event.key)
            }

            this.$refs['cn-' + key][0].value = this.code[key - 1]

            if ((Number(event.keyCode) >= 48 && Number(event.keyCode) <= 57)) {
                // Si hay siguiente
                if (this.$refs['cn-' + (key + 1)]) {
                    this.$refs['cn-' + (key + 1)][0].focus()
                    // En el ultimo se sale
                } else {
                    this.$refs['cn-' + key][0].blur()
                }
            } else if (event.key === 'Backspace' && this.$refs['cn-' + (key - 1)]) {
                this.$refs['cn-' + (key - 1)][0].focus()
            }
        },

        triggerChange () {
            let code = ''
            this.code.forEach((n) => {
                if (n || n === 0) { code += n.toString() } else { code += '' }
            })

            this.$emit('input', code)
            this.$emit('change', code)
        }
    }
}
</script>
