<template>

    <div class="register">

        <a-row>

            <!-- LEFT CONTENT -->

            <a-col class="left-content" :span="12">
                <start-images-layout />
            </a-col>


            <!-- RIGHT CONTENT -->

            <a-col class="right-content" :span="12">

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
                            :mode="_themePrefix"
                        />
                    </a-form-model-item>

                    <a-form-model-item :prop="$RULES.email.name">
                        <umt-input
                            v-model="ruleForm.email"
                            name="email"
                            autocomplete="email"
                            :type="$RULES.email.type"
                            :placeholder="$RULES.email.placeholder"
                            :mode="_themePrefix"
                        />
                    </a-form-model-item>

                    <a-form-model-item :prop="$RULES.password.name">
                        <umt-input
                            v-model="ruleForm.password"
                            :type="$RULES.password.type"
                            :placeholder="$RULES.password.placeholder"
                            :mode="_themePrefix"
                        />
                    </a-form-model-item>

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
                        *Tu edad y sexo permitirán a otros rivales encontrarte y
                        desafiarte en un match.
                    </center>

                    <br>

                    <a-form-model-item>
                        <umt-button @click="submitForm('ruleForm')">
                            REGISTRAR
                        </umt-button>
                    </a-form-model-item>

                </a-form-model>

                <center>
                    <nuxt-link to="/">
                        Términos y condiciones
                    </nuxt-link>
                </center>

            </a-col>

        </a-row>

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
