<template>

    <div class="requiredAttributes">

        <a-row>


            <!-- LEFT CONTENT -->

            <a-col class="left-content" :span="12">

                <div class="image">
                    <img src="@/assets/images/cup-triangle.svg">
                </div>

                <center>
                    <p>
                        Necesitamos estos datos para que otros rivales te puedan
                        desafiar. De lo contrario, no podrás utilizar la app.
                    </p>
                </center>

            </a-col>


            <!-- RIGHT CONTENT -->

            <a-col class="rightContent" :span="12">

                <h1>Datos necesarios</h1>

                <br>

                <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules">

                    <a-form-model-item :prop="$RULES.birthdate.name">
                        <date-selector
                            v-model="ruleForm.birthdate"
                            label="FECHA DE NACIMIENTO*"
                        />
                    </a-form-model-item>

                    <a-form-model-item>
                        <umt-radio-group
                            v-model="ruleForm.gender"
                            name="gender"
                            label="SEXO*"
                        >
                            <a-row type="flex" :gutter="12" class="radio-group-row">
                                <a-col
                                    v-for="gender in genderOptions"
                                    :key="gender.key"
                                    :span="24/genderOptions.length"
                                    :flex="1"
                                >
                                    <umt-radio :value="gender.value">
                                        {{ gender.key }}
                                    </umt-radio>
                                </a-col>
                            </a-row>
                        </umt-radio-group>
                    </a-form-model-item>

                    <center>
                        <p>
                            *Tu edad y sexo permitirán a otros rivales encontrarte y
                            desafiarte en un match.
                        </p>
                    </center>

                    <br>

                    <a-form-model-item>
                        <umt-button @click="submitForm('ruleForm')">
                            CONTINUAR
                        </umt-button>
                    </a-form-model-item>

                </a-form-model>

                <center>
                    <signout-btn />
                </center>

            </a-col>

        </a-row>

    </div>

</template>


<script>

const genderOptions = require('@/static/data/genderOptions.json')


export default {

    layout: 'corners',


    data () {
        return {

            genderOptions,

            ruleForm: {

                birthdate: {
                    day     : undefined,
                    month   : undefined,
                    year    : undefined
                },

                gender: 'M'

            },

            rules: {
                birthdate: this.$RULES.birthdate.rules
            }

        }
    },


    methods: {
        submitForm (formName) {
            this.$refs[formName].validate((valid) => {

                if (valid) {
                    this.btnLoading = true
                    this.$store.dispatch('requiredAttributes/save', {
                        email       : this._userState.email,
                        firstName   : this._userState.firstName,
                        lastName    : this._userState.lastName,
                        picture     : this._userState.picture,
                        birthdate   : this.ruleForm.birthdate,
                        gender      : this.ruleForm.gender
                    })
                        .then(() => {
                            this.btnLoading = false
                        })
                        .catch((e) => {
                            this.btnLoading = false
                            this.showNotification(e.title, e.msg, e.type)
                        })
                }

                else {
                    return false
                }

            })
        }
    }

}
</script>
