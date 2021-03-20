const actions = {
    save (ctx, data) {
        const positions = data.positions.length ? data.positions : null
        const params = {
            height: data.height,
            weight: data.weight,
            foot: data.foot,
            positions
        }
        // TODO: Review async commits
        ctx.commit('user/setState', { params }, { root: true })
        this.$router.push('/optional_filters')
    }
}

export default {
    namespaced: true,
    actions
}
