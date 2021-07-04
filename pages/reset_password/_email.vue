<template>

    <div class="reset-password">

        <!-- LEFT CONTENT -->

        <div class="left-content">

            <div class="image">
                <img src="@/assets/images/lock.svg">
            </div>

            <center>
                <p>
                    Ingresa tu código de seguridad enviado a tu email registrado
                    en <b>Arzov</b>, luego ingresa tu nueva contraseña.
                </p>

                <p>
                    Si recordaste tu antigua contraseña y no la quieres cambiar,
                    sólo debes volver e ingresar a la app.
                </p>
            </center>

        </div>


        <!-- RIGHT CONTENT -->

        <div class="right-content">

            <back-btn />

            <h1>Cambia tu contraseña</h1>

            <br>

            <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules">

                <center>
                    <p>
                        Ingresa tu código enviado a <nuxt-link to="">
                            <i>{{ email }}</i>
                        </nuxt-link>
                    </p>
                </center>

                <a-form-model-item :prop="$RULES.code.name">
                    <umt-code-input @change="setCode" />
                </a-form-model-item>

                <br>

                <a-form-model-item :prop="$RULES.password.name">
                    <umt-input
                        v-model="ruleForm.password"
                        placeholder="Ingresa tu nueva contraseña"
                        type="password"
                    />
                </a-form-model-item>

                <a-form-model-item>
                    <umt-button @click="submitForm('ruleForm')">
                        CAMBIAR CONTRASEÑA
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


    validate ({ params, query, store }) {

        if (params.email) {
            return true
        }

        else {
            return false
        }

    },


    data () {
        return {

            ruleForm: {
                code        : '',
                password    : ''
            },

            rules: {
                code        : this.$RULES.code.rules,
                password    : this.$RULES.password.rules
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

                    this.$store.dispatch('resetPassword/reset', {
                        email       : this.email.toLowerCase(),
                        code        : this.ruleForm.code,
                        password    : this.ruleForm.password
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
                .dispatch('resetPassword/resendCode', {
                    email: this.email.toLowerCase()
                })
                .then((r) => {
                    this.handleTopProgress('done')
                    this.showNotification(r.title, r.msg, r.type)
                })
                .catch((e) => {
                    this.handleTopProgress('faill')
                    this.showNotification(e.title, e.msg, e.type)
                })

        }

    }

}
</script>
