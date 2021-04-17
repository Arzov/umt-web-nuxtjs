import errorNotification from "@/static/data/errorNotification.json";

const actions = {
    setPrimaryTeam(ctx, data) {
        const params = {
            primaryTeam: data,
        };

        ctx.commit("user/setState", { params }, { root: true });
    },
    update(ctx, data) {
        return new Promise((resolve, reject) => {
            let response = {};

            ctx.dispatch(
                "user/update",
                {
                    ...data,
                    email: ctx.rootState.user.email,
                    firstName: ctx.rootState.user.firstName,
                    lastName: ctx.rootState.user.lastName,
                    picture: ctx.rootState.user.picture,
                    api: "arv",
                },
                { root: true }
            )
                .then(() => {
                    ctx.dispatch(
                        "user/update",
                        {
                            ...data,
                            latitude: ctx.rootState.user.coords.LAT.N,
                            longitude: ctx.rootState.user.coords.LON.N,
                            email: ctx.rootState.user.email,
                            skills: ctx.rootState.user.skills,
                            ageMinFilter: data.ageFilter[0],
                            ageMaxFilter: data.ageFilter[1],
                            api: "umt",
                        },
                        { root: true }
                    )
                        .then(() => {
                            resolve();
                        })
                        .catch((err) => {
                            response = { ...errorNotification, err };
                            reject(response);
                        });
                })
                .catch((err) => {
                    response = { ...errorNotification, err };
                    reject(response);
                });
        });
    },
};

export default {
    namespaced: true,
    actions,
};
