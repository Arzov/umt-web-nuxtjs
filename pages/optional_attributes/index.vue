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
                    <label>
                        <h3>POSICIONES DE JUEGO</h3>
                    </label>
                    <umt-badge-group v-model="ruleForm.positions" :options="positionOptions" />
                </a-form-model-item>

                <a-form-model-item>
                    <label>
                        <h3>PIE HÁBIL</h3>
                    </label>
                    <umt-radio-selector v-model="ruleForm.foot" :options="footOptions" />
                </a-form-model-item>

                <a-row :gutter="12" type="flex">

                    <a-col :span="12" :flex="1">
                        <a-form-model-item :prop="$RULES.height.name">
                            <label>
                                <h3>ESTATURA</h3>
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
                            <label>
                                <h3>PESO</h3>
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
                    <umt-button @click="submitForm('ruleForm', false)">
                        CONTINUAR
                    </umt-button>
                </a-form-model-item>

            </a-form-model>

            <center>
                <nuxt-link to="" @click.native="submitForm('ruleForm', true)">Omitir</nuxt-link>
            </center>

        </div>

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
        submitForm (formName, isSkip) {
            this.$refs[formName].validate((valid) => {

                if (valid) {

                    if (!isSkip) {
                        this.btnLoading = true
                    }

                    this.$store.dispatch('optionalAttributes/save', {
                        foot        : this.ruleForm.foot,
                        positions   : this.ruleForm.positions,
                        weight      : this.ruleForm.weight,
                        height      : this.ruleForm.height
                    })

                    this.btnLoading = false
                }

                else {
                    return false
                }

            })
        }
    }

}
</script>
