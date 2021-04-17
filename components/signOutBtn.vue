<template>
    <TextBtn :text="text" @click.native="signOut()" />
</template>

<script>
export default {
    props: {
        text: { type: String, default: "Cerrar sesión" },
    },

    mounted() {
        this.$AWS.Hub.listen("auth", ({ payload: { event, data } }) => {
            switch (event) {
                case "signOut":
                    this.$router.push("/start");
                    break;
            }
        });
    },

    methods: {
        signOut() {
            this.$store
                .dispatch("global/signOut")
                .then(() => {})
                .catch((e) => {
                    this.showNotification(e.title, e.msg, e.type);
                });
        },
    },
};
</script>
