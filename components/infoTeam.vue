<template>
    <div class="tabs">
        <a-tabs default-active-key="1" class="tabPane" size="large">
            <a-tabPane key="1" :tab="title1">
                <a-form-model-item>
                    <PrincipalBtn
                        text="+ AGREGAR JUGADOR (3/30)"
                        :loading="btnLoading"
                        @click.native="toggleModal()"
                    />
                </a-form-model-item>
                <Modal v-model="visible" />
                <h3>JUGADORES</h3>
                <br />
                <a-row :gutter="[0, 0]" type="flex">
                    <a-col
                        v-for="k in require('./../static/data/players.json')"
                        :key="`r${k.name}`"
                        :span="24"
                    >
                        <ListBtn
                            :key="`l${k.name}`"
                            :desc="k.name"
                            :picture1="k.img"
                            :value="k.name"
                            @click.native="click()"
                        />
                    </a-col>
                </a-row>
            </a-tabPane>
            <a-tabPane key="2" :tab="title2">
                <img
                    src="https://image-api.onlineeducation.center/v2/image/max-width/800/blog/4_3_3.jpg"
                    alt=""
                    style="width: 100%"
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
    data() {
        return {
            loading: false,
            visible: false,
        };
    },
    methods: {
        click() {
            console.log("Probando click de listDisplay para el chat");
        },
        toggleModal() {
            console.log("Probando click para agregar jugadores");
            this.visible = !this.visible;
        },
    },
};
</script>
