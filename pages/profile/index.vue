<template>
    <div class="profile">
        <a-row>
            <a-col class="leftContent" :span="8">
                <BackBtn />

                <ProfileDisplay :user="_userState" />

                <br />

                <PrimaryTeamSelector
                    :teams="_userState.teams"
                    :primary-team="_userState.primaryTeam"
                    @click="setPrimaryTeam"
                />

                <br />

                <center>
                    * Tu equipo principal es con el cual desafiarás a otros
                    equipos rivales.
                </center>

                <br />

                <PrincipalBtn
                    text="GUARDAR"
                    :loading="btnLoading"
                    @click.native="submitForm('ruleForm')"
                />

                <br />

                <center>
                    <SignOutBtn />
                </center>
            </a-col>
            <a-col class="rightContent" :span="16">
                <div class="content">
                    <a-form-model
                        ref="ruleForm"
                        :model="ruleForm"
                        :rules="rules"
                    >
                        <center><h3>Atributos</h3></center>
                        <br />
                        <a-row :gutter="16" type="flex">
                            <a-col :span="12">
                                <a-form-model-item
                                    :prop="this.$RULES.height.name"
                                >
                                    <MetricInput
                                        v-model="ruleForm.height"
                                        label="ESTATURA"
                                        suffix="cm"
                                    />
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-model-item
                                    :prop="this.$RULES.weight.name"
                                >
                                    <MetricInput
                                        v-model="ruleForm.weight"
                                        label="PESO"
                                        suffix="kg"
                                    />
                                </a-form-model-item>
                            </a-col>
                        </a-row>
                        <br />
                        <a-divider class="divider" />
                        <br />
                        <center><h3>Filtros</h3></center>
                        <br />
                        <a-form-model-item>
                            <OptionSelector
                                v-model="ruleForm.matchFilter"
                                label="TIPO DE JUEGO"
                                :options="
                                    require('../../static/data/matchFilterOptions.json')
                                "
                            />
                        </a-form-model-item>
                        <a-form-model-item>
                            <OptionSelector
                                v-model="ruleForm.genderFilter"
                                label="BUSCO RIVALES"
                                :options="
                                    require('../../static/data/genderFilterOptions.json')
                                "
                            />
                        </a-form-model-item>
                        <a-form-model-item>
                            <AgeSlider
                                v-model="ruleForm.ageFilter"
                                label="RANGO DE EDAD"
                            />
                        </a-form-model-item>
                        <br />
                        <a-divider class="divider" />
                        <br />
                        <center><h3>Habilidades</h3></center>
                        <br />
                        <h4>POSICIONES DE JUEGO</h4>
                        <br />
                        <a-row :gutter="[48, 48]" type="flex">
                            <a-col
                                v-for="k in require('../../static/data/positionOptions.json')"
                                :key="`c${k.value}`"
                                :span="4.8"
                            >
                                <PositionBtn
                                    :key="`p${k.value}`"
                                    :text="k.text"
                                    :color="k.color"
                                    :value="k.value"
                                    @change="setPosition($event)"
                                />
                            </a-col>
                        </a-row>
                        <br />
                        <a-form-model-item>
                            <OptionSelector
                                v-model="ruleForm.foot"
                                label="PIE HÁBIL"
                                :options="
                                    require('../../static/data/footOptions.json')
                                "
                            />
                        </a-form-model-item>
                    </a-form-model>
                </div>
                <div class="footer">
                    <img
                        class="cornerBottomLeft"
                        src="../../assets/images/corner-bottom-left.svg"
                    />
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import profileDisplay from "../../components/profileDisplay.vue";
export default {
    components: { profileDisplay },
    data() {
        return {
            ruleForm: {
                height: 0,
                weight: 0,
                matchFilter: "5v5",
                genderFilter: "M",
                ageFilter: [18, 22],
                positions: [],
                foot: "R",
            },
            /* TODO: Eliminar teams, ya que los equipos vendrán desde el backend */
            teams: [
                {
                    id: "realmadrid",
                    name: "Real Madrid",
                    picture: "",
                },
                {
                    id: "barcelona",
                    name: "FC Barcelona",
                    picture: "",
                },
            ],
            rules: {
                height: this.$RULES.height.rules,
                weight: this.$RULES.weight.rules,
            },
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.btnLoading = true;
                    this.$store.dispatch("profile/save", {
                        height: this.ruleForm.height,
                        weight: this.ruleForm.weight,
                        matchFilter: this.ruleForm.matchFilter,
                        genderFilter: this.ruleForm.genderFilter,
                        ageFilter: this.ruleForm.ageFilter,
                        positions: this.ruleForm.positions,
                        foot: this.ruleForm.foot,
                    });
                    this.btnLoading = false;
                } else {
                    return false;
                }
            });
        },
        setPosition(e) {
            if (e.value !== null) {
                this.ruleForm.positions.push(e.value);
            } else {
                this.ruleForm.positions = this.ruleForm.positions.filter(
                    (value) => {
                        return value !== e.key;
                    }
                );
            }
        },
        setPrimaryTeam(team) {
            this.$store.dispatch("profile/setPrimaryTeam", team);
        },
    },
};
</script>
