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
                        <PrincipalInput
                            v-model="ruleForm.firstName"
                            :placeholder="this.$RULES.firstName.placeholder"
                            name="fname"
                            autocomplete="given-name"
                        />
                    </a-form-model-item>

                    <a-form-model-item :prop="this.$RULES.email.name">
                        <PrincipalInput
                            v-model="ruleForm.email"
                            :placeholder="this.$RULES.email.placeholder"
                            name="email"
                            :type="this.$RULES.email.type"
                            autocomplete="email"
                        />
                    </a-form-model-item>

                    <a-form-model-item :prop="this.$RULES.password.name">
                        <PrincipalInput
                            v-model="ruleForm.password"
                            :placeholder="this.$RULES.password.placeholder"
                            :type="this.$RULES.password.type"
                            :autocomplete="this.$RULES.password.autocomplete"
                        />
                    </a-form-model-item>

                    <a-form-model-item :prop="this.$RULES.birthdate.name">
                        <DateSelector
                            v-model="ruleForm.birthdate"
                            label="FECHA DE NACIMIENTO*"
                        />
                    </a-form-model-item>

                    <a-form-model-item>
                        <OptionSelector
                            v-model="ruleForm.gender"
                            label="SEXO*"
                            :options="
                                require('../../static/data/genderOptions.json')
                            "
                        />
                    </a-form-model-item>

                    <center>
                        *Tu edad y sexo permitirán a otros rivales encontrarte y
                        desafiarte en un match.
                    </center>

                    <br>

                    <a-form-model-item>
                        <PrincipalBtn
                            text="REGISTRAR"
                            :loading="btnLoading"
                            @click.native="submitForm('ruleForm')"
                        />
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

export default {

    layout: 'theme-header',


    data () {
        return {

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
