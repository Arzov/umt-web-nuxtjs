<template>

    <div class="required-attributes">

        <!-- LEFT CONTENT -->

        <div class="left-content">

            <div class="image">
                <img src="@/assets/images/cup-triangle.svg">
            </div>

            <center>
                <p>
                    Necesitamos estos datos para que otros rivales te puedan
                    desafiar. De lo contrario, no podrás utilizar la app.
                </p>
            </center>

        </div>


        <!-- RIGHT CONTENT -->

        <div class="right-content">

            <h1>Datos necesarios</h1>

            <br>

            <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules">

                <a-form-model-item :prop="$RULES.birthdate.name">
                    <label>
                        <h3>FECHA DE NACIMIENTO*</h3>
                    </label>
                    <umt-date-picker v-model="ruleForm.birthdate" />
                </a-form-model-item>

                <a-form-model-item>
                    <label>
                        <h3>SEXO*</h3>
                    </label>
                    <umt-radio-selector v-model="ruleForm.gender" :options="genderOptions" />
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

        </div>

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
