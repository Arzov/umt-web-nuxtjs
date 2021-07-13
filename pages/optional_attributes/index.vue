<template>

    <div class="optional-attributes">

        <!-- LEFT CONTENT -->

        <div class="left-content">

            <div class="image">
                <img src="@/assets/images/court-positions.svg">
            </div>

            <center>
                <p>
                    Tus habilidades nos permitirán conocerte mejor y también te
                    darás a conocer frente a otros jugadores.
                </p>
            </center>

        </div>


        <!-- RIGHT CONTENT -->

        <div class="right-content">

            <h1>Habilidades y características</h1>

            <br>

            <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules">

                <a-form-model-item>
                    <label class="umt-label">
                        POSICIONES DE JUEGO
                    </label>
                    <umt-badge-group v-model="ruleForm.positions" :options="positionOptions" />
                </a-form-model-item>

                <a-form-model-item>
                    <label class="umt-label">
                        PIE HÁBIL
                    </label>
                    <umt-radio-selector v-model="ruleForm.foot" :options="footOptions" />
                </a-form-model-item>

                <a-row :gutter="12" type="flex">

                    <a-col :span="12" :flex="1">
                        <a-form-model-item :prop="$RULES.height.name">
                            <label class="umt-label">
                                ESTATURA
                            </label>
                            <umt-input
                                v-model="ruleForm.height"
                                placeholder="0"
                                type="number"
                                suffix="cm"
                            />
                        </a-form-model-item>
                    </a-col>

                    <a-col :span="12" :flex="1">
                        <a-form-model-item :prop="$RULES.weight.name">
                            <label class="umt-label">
                                PESO
                            </label>
                            <umt-input
                                v-model="ruleForm.weight"
                                placeholder="0"
                                type="number"
                                suffix="kg"
                            />
                        </a-form-model-item>
                    </a-col>

                </a-row>

                <a-form-model-item>
                    <umt-button @click="submitForm('ruleForm')">
                        CONTINUAR
                    </umt-button>
                </a-form-model-item>

            </a-form-model>

            <center>
                <nuxt-link to="" @click.native="submitForm('ruleForm')">
                    Omitir
                </nuxt-link>
            </center>

        </div>

        <umt-top-progress ref="topProgress" />

    </div>

</template>


<script>

const footOptions = require('@/static/data/footOptions.json')
const positionOptions = require('@/static/data/positionOptions.json')


export default {

    layout: 'corners',


    data () {
        return {

            footOptions,

            positionOptions,

            ruleForm: {
                foot        : 'R',
                positions   : [],
                weight      : 0,
                height      : 0
            },

            rules: {
                height: this.$RULES.height.rules,
                weight: this.$RULES.weight.rules
            }

        }
    },


    methods: {
        submitForm (formName) {
            this.$refs[formName].validate(async (valid) => {

                if (valid) {

                    this.handleTopProgress('start')

                    this.$store.dispatch('optionalAttributes/save', {
                        foot        : this.ruleForm.foot,
                        positions   : this.ruleForm.positions,
                        weight      : this.ruleForm.weight,
                        height      : this.ruleForm.height
                    })

                    await new Promise(resolve => setTimeout(resolve, 2000))

                    this.handleTopProgress('done')

                    this.$router.push('/optional_filters')

                }

                else {
                    return false
                }

            })
        }
    }

}
</script>
