import Vue from "vue";
import errorNotification from "@/static/data/errorNotification.json";

const global = {
    data() {
        return {
            btnLoading: false,
        };
    },
    computed: {
        _userState() {
            return this.$store.getters["user/get"];
        },
        _globalState() {
            return this.$store.getters["global/get"];
        },
        _themePreference() {
            return this._globalState.themePreference;
        },
        _allowGeoloc() {
            return this._globalState.allowGeoloc;
        },
    },
    methods: {
        showNotification(title, msg, type) {
            let icon = <a-icon type="close-circle" />;

            switch (type) {
                case "success":
                    icon = <a-icon type="check-circle" />;
                    break;

                case "warning":
                    icon = <a-icon type="warning" />;
                    break;

                case "info":
                    icon = <a-icon type="info-circle" />;
                    break;
            }

            this.$notification.destroy();

            this.$notification.open({
                message: title,
                description: msg,
                class: "notification",
                getContainer: () => this.$el,
                icon,
            });
        },
    },
};

Vue.mixin(global);

export const signOut = {
    mounted() {
        this.$AWS.Hub.listen("auth", ({ payload: { event, data } }) => {
            switch (event) {
                case "signOut":
                    this.$router.push("/start");
                    break;
            }
        });
    },
};

export const validGeoloc = {
    mounted() {
        if ("geolocation" in navigator) {
            if (this._allowGeoloc) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const moveDistance = this.$UTILS.getDistance(
                            position.coords.latitude,
                            position.coords.longitude,
                            this._userState.coords.LAT.N,
                            this._userState.coords.LON.N
                        );

                        // update location if is current is greater than 5km
                        if (moveDistance >= 5) {
                            const params = {
                                api: "umt",
                                email: this._userState.email,
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                matchFilter: this._userState.matchFilter,
                                ageMinFilter: this._userState.ageMinFilter,
                                ageMaxFilter: this._userState.ageMaxFilter,
                                positions: this._userState.positions,
                                skills: this._userState.skills,
                                foot: this._userState.foot,
                                weight: this._userState.weight,
                                height: this._userState.height,
                            };

                            this.$store
                                .dispatch("user/update", params)
                                .then(() => {
                                    const params = {
                                        allowGeoloc: true,
                                    };
                                    this.$store.dispatch(
                                        "global/setGeoloc",
                                        params
                                    );
                                })
                                .catch((e) => {
                                    this.showNotification(
                                        e.title,
                                        e.msg,
                                        e.type
                                    );
                                });
                        }
                    },
                    (err) => {
                        const params = {
                            allowGeoloc: false,
                        };
                        this.$store.dispatch("global/setGeoloc", params);

                        switch (err.code) {
                            case err.PERMISSION_DENIED:
                                break;

                            default:
                                this.showNotification(
                                    errorNotification.title,
                                    errorNotification.msg,
                                    errorNotification.type
                                );
                                break;
                        }
                    }
                );
            }
        } else {
            this.showNotification(
                "¡Geolocalización no disponible!",
                "No puedes usar la app en este dispositivo.",
                errorNotification.type
            );
        }
    },
};
