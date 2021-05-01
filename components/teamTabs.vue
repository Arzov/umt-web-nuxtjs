<template>
    <div class="tabs">
        <a-tabs default-active-key="1" class="tabPane" size="large">
            <a-tabPane key="1" :tab="title1">
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
                <br />
                <center>
                    * Sólo puedes pertenecer o crear un máximo de 3 equipos.
                </center>
                <br />
                <a-form-model-item>
                    <PrincipalBtn
                        text="+ CREAR EQUIPO (1/3)"
                        :loading="btnLoading"
                        @click.native="createTeam()"
                    />
                </a-form-model-item>
            </a-tabPane>
            <a-tabPane key="2" :tab="title2">
                <CollapseBtn
                    total-team-request="2"
                    total-individual-request="2"
                />
            </a-tabPane>
        </a-tabs>
    </div>
</template>

<script>
export default {
    props: {
        title1: {
            type: String,
            default: "Tab1",
        },
        title2: {
            type: String,
            default: "Tab2",
        },
    },
    methods: {
        click() {
            console.log("Probando click de listDisplay para el chat");
        },
        createTeam() {
            console.log("Probando click para crear equipos");
        },
    },
};
</script>
