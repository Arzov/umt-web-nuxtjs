<template>

    <div>

        <nuxt-link to="" @click.native="signOut">
            {{ text }}
        </nuxt-link>

        <umt-top-progress ref="topProgress" />

    </div>

</template>


<script>
export default {

    props: {
        text: { type: String, default: 'Cerrar sesión' }
    },


    mounted () {
        this.$AWS.Hub.listen('auth', ({ payload: { event, data } }) => {

            switch (event) {

            case 'signOut': {

                this.handleTopProgress('done')
                this.$router.push('/start')
                break

            }

            }

        })
    },


    methods: {
        signOut () {

            this.handleTopProgress('start')

            this.$store.dispatch('global/signOut')
                .then(() => this.handleTopProgress('done'))
                .catch((e) => {
                    this.handleTopProgress('fail')
                    this.showNotification(e.title, e.msg, e.type)
                })

        }
    }

}
</script>
