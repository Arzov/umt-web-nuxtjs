
// actions

const actions = {

    save (ctx, data) {

        const positions = data.positions.length ? data.positions : null
        const params = {
            height  : data.height,
            weight  : data.weight,
            foot    : data.foot,
            positions
        }

        ctx.commit('user/setState', { params }, { root: true })

    }
}


// export modules

export default {
    namespaced: true,
    actions
}
