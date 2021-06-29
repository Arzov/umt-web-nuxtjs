<template>

    <div class="start">

        <!-- LEFT CONTENT -->

        <div class="left-content">
            <start-images-layout />
        </div>


        <!-- RIGHT CONTENT -->

        <div class="right-content">

            <h1>Inicio de sesión</h1>

            <p>
                ¿Olvidaste tu contraseña?
                <nuxt-link to="/recover_password">
                    Recupérala.
                </nuxt-link>
            </p>

            <br>

            <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules">

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

                <a-form-model-item>
                    <umt-button @click="submitForm('ruleForm')">
                        INICIAR SESIÓN
                    </umt-button>
                </a-form-model-item>

            </a-form-model>

            <center>

                <p>- O ingresa con tus redes sociales -</p>

                <div class="social-login">
                    <google class="google" />
                    <facebook class="facebook" />
                </div>

                <p>¿No tienes cuenta? <nuxt-link to="/register">Regístrate.</nuxt-link></p>

            </center>

        </div>

    </div>

</template>


<script>
export default {

    layout: 'theme-header',


    data () {
        return {

            ruleForm: {
                email       : '',
                password    : ''
            },

            rules: {
                email       : this.$RULES.email.rules,
                password    : this.$RULES.password.rules
            }

        }
    },


    mounted () {
        this.$AWS.Hub.listen('auth', ({ payload: { event, data } }) => {

            switch (event) {

            case 'signIn': {

                const email = data.signInUserSession.idToken.payload.email

                this.$store.dispatch('user/fetch', { email })
                    .then(() => {
                        this.btnLoading = false
                        this.$router.push('/home')
                    })
                    .catch((e) => {
                        this.btnLoading = false
                        this.showNotification(e.title, e.msg, e.type)
                    })

                break

            }

            }

        })
    },


    methods: {
        submitForm (formName) {

            this.$refs[formName].validate((valid) => {

                if (valid) {

                    this.btnLoading = true

                    this.$store.dispatch('start/signIn', {
                        email       : this.ruleForm.email.toLowerCase(),
                        password    : this.ruleForm.password
                    })
                        .then(() => {})
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
