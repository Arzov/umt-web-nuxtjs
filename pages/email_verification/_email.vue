<template>

    <div class="email-verification">

        <!-- LEFT CONTENT -->

        <div class="left-content">

            <div class="image">
                <img src="@/assets/images/mailbox.svg">
            </div>

            <center>
                <p>
                    Ingresa tu código secreto enviado a tu email registrado en
                    <b>Arzov</b> para validar y poder iniciar sesión en la app.
                </p>
            </center>

        </div>


        <!-- RIGHT CONTENT -->

        <div class="right-content">

            <back-btn />

            <h1>Verifica tu email</h1>

            <br>

            <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules">

                <center>
                    <p>
                        Ingresa tu código de verificación enviado a <nuxt-link to="">
                            <i>{{ email }}</i>
                        </nuxt-link>
                    </p>
                </center>

                <a-form-model-item :prop="$RULES.code.name">
                    <umt-code-input @change="setCode" />
                </a-form-model-item>

                <br>

                <a-form-model-item>
                    <umt-button @click="submitForm('ruleForm')">
                        ENVIAR
                    </umt-button>
                </a-form-model-item>

            </a-form-model>

            <center>
                <nuxt-link to="" @click.native="resendCode">
                    Reenviar código
                </nuxt-link>
            </center>

        </div>

        <umt-top-progress ref="topProgress" />

    </div>

</template>


<script>
export default {

    layout: 'corners',


    asyncData ({ params }) {
        return {
            email: params.email
        }
    },


    validate ({ params, query, store, redirect }) {

        if (params.email) { return true }

        else { redirect('/start') }

    },


    data () {
        return {

            ruleForm: {
                code: ''
            },

            rules: {
                code: this.$RULES.code.rules
            }

        }
    },


    methods: {

        setCode (code) {
            this.ruleForm.code = code
        },


        submitForm (formName) {
            this.$refs[formName].validate((valid) => {

                if (valid) {

                    this.handleTopProgress('start')

                    this.$store.dispatch('emailVerification/verify', {
                        email   : this.email.toLowerCase(),
                        code    : this.ruleForm.code
                    })
                        .then(() => {
                            this.handleTopProgress('done')
                            this.$router.push('/start')
                        })
                        .catch((e) => {
                            this.handleTopProgress('fail')
                            this.showNotification(e.title, e.msg, e.type)
                        })

                }

                else {
                    return false
                }

            })
        },


        resendCode () {

            this.handleTopProgress('start')

            this.$store
                .dispatch('emailVerification/resendCode', {
                    email: this.email.toLowerCase()
                })
                .then((r) => {
                    this.handleTopProgress('done')
                    this.showNotification(r.title, r.msg, r.type)
                })
                .catch((e) => {
                    this.handleTopProgress('fail')
                    this.showNotification(e.title, e.msg, e.type)
                })

        }

    }

}
</script>
