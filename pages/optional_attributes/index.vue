<template>

    <div class="optional-attributes">

        <a-row>


            <!-- LEFT CONTENT -->

            <a-col class="left-content" :span="12">

                <div class="image">
                    <img src="@/assets/images/football-circle.svg">
                </div>

                <center>
                    <p>
                        Tus habilidades nos permitirán conocerte mejor y también te
                        darás a conocer frente a otros jugadores.
                    </p>
                </center>

                <!-- TODO: Complete with image -->

            </a-col>


            <!-- RIGHT CONTENT -->

            <a-col class="right-content" :span="12">

                <h1>Habilidades y características</h1>

                <br>

                <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules">

                    <a-form-model-item>
                        <umt-position-group v-model="ruleForm.positions" :show-more-info="false" />
                    </a-form-model-item>

                    <a-form-model-item>
                        <a-form-model-item>
                            <umt-radio-group
                                v-model="ruleForm.foot"
                                name="foot"
                                label="PIE HÁBIL"
                            >
                                <a-row type="flex" :gutter="12" class="radio-group-row">
                                    <a-col
                                        v-for="foot in footOptions"
                                        :key="foot.key"
                                        :span="24/footOptions.length"
                                        :flex="1"
                                    >
                                        <umt-radio :value="foot.value">
                                            {{ foot.key }}
                                        </umt-radio>
                                    </a-col>
                                </a-row>
                            </umt-radio-group>
                        </a-form-model-item>
                    </a-form-model-item>

                    <a-row :gutter="16" type="flex">

                        <a-col :span="12" :flex="1">
                            <a-form-model-item :prop="$RULES.height.name">

                                <label>
                                    <h4>ESTATURA</h4>
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
                                    <h4>PESO</h4>
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
                    <text-btn
                        text="Omitir"
                        @click.native="submitForm('ruleForm', true)"
                    />
                </center>

            </a-col>
        </a-row>
    </div>
</template>


<script>

const footOptions = require('@/static/data/footOptions.json')


export default {

    layout: 'corners',


    data () {
        return {

            footOptions,

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
