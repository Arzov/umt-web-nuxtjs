<template>

    <div class="register">

        <!-- LEFT CONTENT -->

        <div class="left-content">
            <start-images-layout />
        </div>


        <!-- RIGHT CONTENT -->

        <div class="right-content">

            <back-btn />

            <h1>Registro</h1>

            <br>

            <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules">

                <a-form-model-item :prop="$RULES.firstName.name">
                    <umt-input
                        v-model="ruleForm.firstName"
                        name="fname"
                        autocomplete="given-name"
                        :placeholder="$RULES.firstName.placeholder"
                    />
                </a-form-model-item>

                <a-form-model-item :prop="$RULES.email.name">
                    <umt-input
                        v-model="ruleForm.email"
                        name="email"
                        autocomplete="email"
                        type="email"
                        :placeholder="$RULES.email.placeholder"
                    />
                </a-form-model-item>

                <a-form-model-item :prop="$RULES.password.name">
                    <umt-input
                        v-model="ruleForm.password"
                        type="password"
                        :placeholder="$RULES.password.placeholder"
                    />
                </a-form-model-item>

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

                <a-form-model-item>
                    <umt-button @click="submitForm('ruleForm')">
                        REGISTRAR
                    </umt-button>
                </a-form-model-item>

            </a-form-model>

            <center>
                <nuxt-link to="/">Términos y condiciones</nuxt-link>
            </center>

        </div>

    </div>

</template>


<script>

const genderOptions = require('@/static/data/genderOptions.json')


export default {

    layout: 'theme-header',


    data () {
        return {

            genderOptions,

            ruleForm: {
                firstName   : '',
                email       : '',
                password    : '',
                gender      : 'M',
                birthdate   : {
                    day     : undefined,
                    month   : undefined,
                    year    : undefined
                }
            },

            rules: {
                firstName   : this.$RULES.firstName.rules,
                email       : this.$RULES.email.rules,
                password    : this.$RULES.password.rules,
                birthdate   : this.$RULES.birthdate.rules
            }

        }
    },


    methods: {
        submitForm (formName) {
            this.$refs[formName].validate((valid) => {

                if (valid) {

                    this.btnLoading = true

                    this.$store.dispatch('register/signUp', {
                        firstName   : this.ruleForm.firstName,
                        email       : this.ruleForm.email.toLowerCase(),
                        password    : this.ruleForm.password,
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
