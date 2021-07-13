<template>

    <div class="optional-filters">

        <!-- LEFT CONTENT -->

        <div class="left-content">
            <div class="image">
                <img src="@/assets/images/whistle.svg">
            </div>

            <center>
                <p>
                    Ingresa tus <b>filtros</b> para encontrar partidos cercanos
                    a ti a los cuales quieras <b>parchar</b> o simplemente para
                    buscar equipos a los cuales quieras <b>unirte</b>. Puedes
                    omitir estas opciones y configurarlas más adelante desde tu
                    perfil.
                </p>
            </center>
        </div>


        <!-- RIGHT CONTENT -->

        <div class="right-content">

            <h1>¿A qué rivales o equipos buscas?</h1>

            <br>

            <a-form-model ref="ruleForm" :model="ruleForm">

                <a-form-model-item>
                    <label class="umt-label">
                        TIPO DE JUEGO
                    </label>
                    <umt-multi-selector
                        v-model="ruleForm.matchFilter"
                        :options="matchFilterOptions"
                    />
                </a-form-model-item>

                <a-form-model-item>
                    <umt-range v-model="ruleForm.ageFilter" label="RANGO DE EDAD" :min="18" :max="60" />
                </a-form-model-item>

                <a-form-model-item>
                    <umt-button @click="submitForm('ruleForm')">
                        CONTINUAR
                    </umt-button>
                </a-form-model-item>

            </a-form-model>

            <center>
                <nuxt-link to="" @click.native="submitForm('ruleForm')">Omitir</nuxt-link>
            </center>

        </div>

        <umt-top-progress ref="topProgress" />

    </div>

</template>


<script>

const matchFilterOptions = require('@/static/data/matchFilterOptions.json')


export default {

    layout: 'corners',


    data () {
        return {

            matchFilterOptions,

            ruleForm: {
                matchFilter : ['5v5'],
                ageFilter   : [18, 22]
            }

        }
    },


    methods: {
        submitForm (formName) {
            this.$refs[formName].validate((valid) => {

                if (valid) {

                    this.handleTopProgress('start')

                    this.$store.dispatch('optionalFilters/save', {
                        email       : this._userState.email,
                        matchFilter : this.ruleForm.matchFilter,
                        ageFilter   : this.ruleForm.ageFilter,
                        positions   : this._userState.positions,
                        skills      : this._userState.skills,
                        foot        : this._userState.foot,
                        weight      : this._userState.weight,
                        height      : this._userState.height
                    })
                        .then(() => {
                            this.handleTopProgress('done')
                            this.$router.push('/home')
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
        }
    }

}
</script>
