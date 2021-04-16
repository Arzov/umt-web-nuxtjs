const actions = {
    setPrimaryTeam(ctx, data) {
        const params = {
            primaryTeam: data,
        };

        ctx.commit("user/setState", { params }, { root: true });
    },
};

export default {
    namespaced: true,
    actions,
};
