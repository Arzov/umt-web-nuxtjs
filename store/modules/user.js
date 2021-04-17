import { graphqlOperation } from "@aws-amplify/api";
import { arv, umt } from "@/graphql/gql";
import errorNotification from "@/static/data/errorNotification.json";
import awsconfig from "~/aws-exports";

const getLocalStorageState = (key) => {
    return JSON.parse(localStorage.getItem(key));
};

const getDefaultState = () => ({
    // DynamoDB
    email: getLocalStorageState("email") || null,
    firstName: getLocalStorageState("firstName") || null,
    lastName: getLocalStorageState("lastName") || null,
    birthdate: getLocalStorageState("birthdate") || null,
    gender: getLocalStorageState("gender") || null,
    picture: getLocalStorageState("picture") || null,
    coords: getLocalStorageState("coords") || null,
    geohash: getLocalStorageState("geohash") || null,
    matchFilter: getLocalStorageState("matchFilter") || null,
    ageMinFilter: getLocalStorageState("ageMinFilter") || null,
    ageMaxFilter: getLocalStorageState("ageMaxFilter") || null,
    positions: getLocalStorageState("positions") || null,
    foot: getLocalStorageState("foot") || null,
    skills: getLocalStorageState("skills") || null,
    weight: getLocalStorageState("weight") || 0,
    height: getLocalStorageState("height") || 0,
    providerId: getLocalStorageState("providerId") || null,
    providers: getLocalStorageState("providers") || null,
    joinedOn: getLocalStorageState("joinedOn") || null,
    verified: getLocalStorageState("verified") || null,
    // Local
    teams: getLocalStorageState("teams") || null,
    primaryTeam: getLocalStorageState("primaryTeam") || null,
});

const state = getDefaultState();

const getters = {
    get(state) {
        return state;
    },
};

const actions = {
    fetch(ctx, data) {
        return new Promise((resolve, reject) => {
            this.$AWS.Amplify.configure(awsconfig.arv);
            this.$AWS.API.graphql(
                graphqlOperation(arv.queries.getUser, {
                    email: data.email,
                })
            )
                .then((result) => {
                    const params = {
                        email: result.data.getUser.email,
                        firstName: result.data.getUser.firstName,
                        lastName: result.data.getUser.lastName,
                        birthdate: result.data.getUser.birthdate,
                        gender: result.data.getUser.gender,
                        picture: result.data.getUser.picture,
                        providerId: JSON.parse(result.data.getUser.providerId),
                        providers: result.data.getUser.providers,
                        joinedOn: result.data.getUser.joinedOn,
                        verified: result.data.getUser.verified,
                    };

                    // TODO: Upload image to S3 logic

                    ctx.commit("setState", { params });

                    this.$AWS.Amplify.configure(awsconfig.umt);
                    this.$AWS.API.graphql(
                        graphqlOperation(umt.queries.getUser, {
                            email: data.email,
                        })
                    )
                        .then((result) => {
                            const params = {
                                geohash: result.data.getUser.geohash || null,
                                coords:
                                    JSON.parse(result.data.getUser.coords) ||
                                    null,
                                ageMinFilter:
                                    result.data.getUser.ageMinFilter || null,
                                ageMaxFilter:
                                    result.data.getUser.ageMaxFilter || null,
                                matchFilter:
                                    result.data.getUser.matchFilter || null,
                                positions:
                                    result.data.getUser.positions || null,
                                foot: result.data.getUser.foot || null,
                                skills:
                                    JSON.parse(result.data.getUser.skills) ||
                                    null,
                                weight: result.data.getUser.weight || 0,
                                height: result.data.getUser.height || 0,
                            };

                            ctx.commit("setState", { params });

                            resolve(ctx.getters.get);
                        })
                        .catch((err) => {
                            const response = { ...errorNotification, err };
                            reject(response);
                        });
                })
                .catch((err) => {
                    const response = { ...errorNotification, err };
                    reject(response);
                });
        });
    },
    update(ctx, data) {
        if (data.api === "arv") {
            return new Promise((resolve, reject) => {
                const birthdate = `${data.birthdate.year}-${data.birthdate.month}-${data.birthdate.day}`;

                this.$AWS.Amplify.configure(awsconfig.arv);
                this.$AWS.API.graphql(
                    graphqlOperation(arv.mutations.updateUser, {
                        email: data.email,
                        birthdate,
                        gender: data.gender,
                        firstName: data.firstName,
                        lastName: data.lastName || "",
                        picture: data.picture || "",
                        providerId: JSON.stringify(ctx.state.providerId),
                        providers: ctx.state.providers,
                        joinedOn: ctx.state.joinedOn,
                        verified: ctx.state.verified,
                    })
                )
                    .then(() => {
                        const params = {
                            birthdate,
                            gender: data.gender,
                            picture: data.picture || "",
                        };
                        ctx.commit("setState", { params });
                        resolve();
                    })
                    .catch((err) => {
                        const response = { ...errorNotification, err };
                        reject(response);
                    });
            });
        } else {
            return new Promise((resolve, reject) => {
                this.$AWS.Amplify.configure(awsconfig.umt);
                this.$AWS.API.graphql(
                    graphqlOperation(umt.mutations.updateUser, {
                        latitude: data.latitude,
                        longitude: data.longitude,
                        email: data.email,
                        ageMinFilter: data.ageMinFilter,
                        ageMaxFilter: data.ageMaxFilter,
                        matchFilter: data.matchFilter,
                        positions: data.positions,
                        skills: JSON.stringify(data.skills),
                        foot: data.foot,
                        weight: data.weight,
                        height: data.height,
                    })
                )
                    .then((result) => {
                        const params = {
                            geohash: result.data.updateUser.geohash,
                            coords: JSON.parse(result.data.updateUser.coords),
                            ageMinFilter: result.data.updateUser.ageMinFilter,
                            ageMaxFilter: result.data.updateUser.ageMaxFilter,
                            matchFilter: result.data.updateUser.matchFilter,
                            positions: result.data.updateUser.positions,
                            foot: result.data.updateUser.foot,
                            skills: JSON.parse(result.data.updateUser.skills),
                            weight: result.data.updateUser.weight,
                            height: result.data.updateUser.height,
                        };
                        ctx.commit("setState", { params });
                        resolve();
                    })
                    .catch((err) => {
                        const response = { ...errorNotification, err };
                        reject(response);
                    });
            });
        }
    },
    listTeams(ctx) {
        if (!ctx.state.teams || !ctx.state.primaryTeam) {
            return new Promise((resolve, reject) => {
                this.$AWS.Amplify.configure(awsconfig.umt);
                this.$AWS.API.graphql(
                    graphqlOperation(umt.queries.listTeams, {
                        email: ctx.state.email,
                    })
                )
                    .then((result) => {
                        const teams = result.data.listTeams.items;

                        if (teams) {
                            const params = {
                                teams,
                                primaryTeam: teams[0],
                            };
                            ctx.commit("setState", { params });
                            resolve();
                        } else {
                            resolve();
                        }
                    })
                    .catch((err) => {
                        const response = { ...errorNotification, err };
                        reject(response);
                    });
            });
        }
    },
    resetStates(ctx) {
        ctx.commit("resetStates");
    },
};

const mutations = {
    setState(state, { params }) {
        for (const key in params) {
            localStorage.setItem(key, JSON.stringify(params[key]));
            state[key] = params[key];
        }
    },
    resetStates(state) {
        for (const key in state) {
            localStorage.removeItem(key);
            state[key] = null;
        }
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
