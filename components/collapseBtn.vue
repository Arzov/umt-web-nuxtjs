<template>
    <div v-if="type === 'teams'" class="collapseBtn">
        <a-collapse v-model="activeKey" expand-icon-position="right">
            <template #expandIcon="props">
                <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
            </template>
            <img
                src="@/assets/icons/lm-team-profile.svg"
                style="width: 35px"
                alt=""
                class="teamIcon"
            >
            <a-collapse-panel key="1" :header="title1">
                <RequestBtn
                    title="Matias"
                    desc="Solicitud enviada"
                    picture1="https://media.githubusercontent.com/media/Arzov/umt-web-uxi/develop/mockup/images/matias_profile_bw_512x512.jpg"
                    type="out"
                />
                <a-divider class="divider" />
                <RequestBtn
                    title="Jesús"
                    desc="Aceptar solicitud"
                    picture1="https://media.githubusercontent.com/media/Arzov/umt-web-uxi/develop/mockup/images/jesus_profile_bw_512x512.jpg"
                />
                <a-divider class="divider" />
            </a-collapse-panel>
            <img
                :src="_userState.picture"
                style="width: 35px; border-radius: 20px"
                alt=""
                class="teamIcon"
            >
            <a-collapse-panel key="2" :header="title2">
                <RequestBtn
                    title="BAYERN"
                    desc="Solicitud enviada"
                    type="out"
                />
                <a-divider class="divider" />
                <RequestBtn title="FC BARCELONA" desc="Aceptar solicitud" />
                <a-divider class="divider" />
            </a-collapse-panel>
        </a-collapse>
    </div>
    <div v-else-if="type === 'requestMatches'" class="collapseBtn">
        <a-collapse v-model="activeKey" expand-icon-position="right">
            <template #expandIcon="props">
                <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
            </template>
            <img
                src="@/assets/icons/lm-team-profile.svg"
                style="width: 35px"
                alt=""
                class="teamIcon"
            >
            <a-collapse-panel key="1" :header="title1">
                <RequestBtn
                    title="BAYERN"
                    desc="Solicitud enviada"
                    :picture1="getImage()"
                    type="out"
                />
                <a-divider class="divider" />
                <RequestBtn
                    title="FC BARCELONA"
                    desc="Aceptar solicitud"
                    :picture1="getImage()"
                />
                <a-divider class="divider" />
            </a-collapse-panel>
            <img
                :src="_userState.picture"
                style="width: 35px; border-radius: 20px"
                alt=""
                class="teamIcon"
            >
            <a-collapse-panel key="2" :header="title2">
                <div v-if="matches.length">
                    <div
                        v-for="match in matches"
                        :key="`m${match.teamId1}${match.teamId2}`"
                    >
                        <PatchRequest :match="match" />
                        <a-divider class="divider" />
                    </div>
                </div>
                <div v-else>
                    <h3>¡Lo sentimos! No hay solicitudes por el momento</h3>
                    <a-divider class="divider" />
                </div>
            </a-collapse-panel>
        </a-collapse>
    </div>
    <div v-else class="collapseBtn">
        <a-collapse v-model="activeKey" expand-icon-position="right">
            <template #expandIcon="props">
                <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
            </template>
            <img
                src="@/assets/icons/lm-team-profile.svg"
                style="width: 35px"
                alt=""
                class="teamIcon"
            >
            <a-collapse-panel key="1" :header="title1">
                <ListBtn
                    title="FC BARCELONA"
                    desc="Matias: Hola chicos, todos listos?"
                    time="Hoy 18:20"
                    @click.native="click()"
                />
                <a-divider class="divider" />
                <ListBtn
                    title="MAN. UNITED"
                    desc="Franco: Buena Cabros!"
                    time="Miércoles 16:30"
                    @click.native="click()"
                />
                <br>
            </a-collapse-panel>
            <img
                :src="_userState.picture"
                style="width: 35px; border-radius: 20px"
                alt=""
                class="teamIcon"
            >
            <a-collapse-panel key="2" :header="title2">
                <div v-if="matches.length">
                    <ListBtn
                        title="FC BARCELONA"
                        desc="Matias: Hola chicos, todos listos?"
                        time="Hoy 18:20"
                        type="versus"
                        @click.native="click()"
                    />
                    <a-divider class="divider" />
                    <ListBtn
                        title="MAN. UNITED"
                        desc="Franco: Buena Cabros!"
                        time="Miércoles 16:30"
                        type="versus"
                        @click.native="click()"
                    />
                    <br>
                </div>
                <div v-else>
                    <h3>¡Lo sentimos! No hay solicitudes por el momento</h3>
                    <a-divider class="divider" />
                </div>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<script>
export default {
    props: {
        teamName: { type: String, default: 'TEAM' },
        secondaryTabTitle: { type: String, default: 'MIS SOLICITUDES' },
        totalTeamRequest: {
            type: Number,
            default: 0
        } /* TODO: debe cambiarse por la cantidad de solicitudes totales */,
        totalIndividualRequest: { type: Number, default: 0 },
        type: { type: String, default: 'teams' }
    },
    data () {
        return {
            activeKey: ['1'],
            title1: this.teamName + ' (' + this.totalTeamRequest + ')',
            title2:
                this.secondaryTabTitle +
                ' (' +
                this.totalIndividualRequest +
                ')',
            matches: [
                {
                    name1: 'Team 1',
                    name2: 'Team 2'
                },
                {
                    name1: 'Team 1',
                    name2: 'Team 2'
                }
            ]
        }
    },
    computed: {
        _nearMatches () {
            return this.$store.getters['home/get'].nearMatches
        }
    },
    watch: {
        activeKey (key) {
            console.log(key)
        }
    },
    methods: {
        getImage (image) {
            if (image === '') {
                const mode =
                    this._globalState.themePreference === 'light' ? 'lm' : 'dm'
                return require(`@/assets/icons/${mode}-team-profile.svg`)
            } else {
                return image
            }
        },
        click () {
            console.log('Probando click de listDisplay para el chat')
        }
    }
}
</script>
