<template>

    <div class="optional-filters">

        <a-row>


            <!-- LEFT CONTENT -->

            <a-col class="left-content" :span="12">
                <div class="image">
                    <img src="@/assets/images/whistle.svg">
                </div>

                <center>
                    <P>
                        Ingresa tus <b>filtros</b> para encontrar partidos cercanos
                        a ti a los cuales quieras <b>parchar</b> o simplemente para
                        buscar equipos a los cuales quieras <b>unirte</b>. Puedes
                        omitir estas opciones y configurarlas más adelante desde tu
                        perfil.
                    </P>
                </center>
            </a-col>


            <!-- RIGHT CONTENT -->

            <a-col class="right-content" :span="12">

                <h1>¿A qué rivales o equipos buscas?</h1>

                <br>

                <a-form-model ref="ruleForm" :model="ruleForm">

                    <a-form-model-item>
                        <multi-selector
                            v-model="ruleForm.matchFilter"
                            label="TIPO DE JUEGO (SELECCIONA 1 O MÁS)"
                            :options="matchFilterOptions"
                        />
                    </a-form-model-item>

                    <a-form-model-item>
                        <umt-range v-model="ruleForm.ageFilter" label="RANGO DE EDAD" :min="18" :max="60" />
                    </a-form-model-item>

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
        submitForm (formName, isSkip) {
            this.$refs[formName].validate((valid) => {

                if (valid) {

                    if (!isSkip) {
                        this.btnLoading = true
                    }

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
