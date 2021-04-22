export default ({ app, route, store, redirect }) => {
    const currentPath = route.name.split("-")[0]; // split by '-' for dynamic pages
    const _userState = store.getters["user/get"];

    app.$AWS.Auth.currentSession()
        .then(() => {
            // Check auth routes (out of app)
            if (
                [
                    "start",
                    "register",
                    "email_verification",
                    "recover_password",
                    "reset_password",
                ].includes(currentPath)
            ) {
                /**
                 * If email is null it means that Amplify Hub should be expected
                 * finish resolving the 'signIn' event to save the states
                 * of the user in the store, therefore it is not redirected to
                 * the view Home. This only happens in the Start view and only
                 * when started with social media.
                 */
                if (_userState.email) {
                    redirect("/home");
                }
            }

            // Check mandatory/optionals fields
            else if (!_userState.birthdate) {
                /**
                 * It is redirected only if you are not on the corresponding page.
                 * This validation goes at this point and not in the parent 'else if' since
                 * if the condition is false it would follow the next 'else if' and we need
                 * that when it is false the condition, stays in the view.
                 */
                if (currentPath !== "required_attributes") {
                    redirect("/required_attributes");
                }
            } else if (!_userState.foot) {
                if (currentPath !== "optional_attributes") {
                    redirect("/optional_attributes");
                }
            } else if (!_userState.ageMinFilter) {
                if (currentPath !== "optional_filters") {
                    redirect("/optional_filters");
                }
            }
        })
        .catch(function () {
            // Redirect to Start only if is inside the app
            if (
                ![
                    "start",
                    "register",
                    "email_verification",
                    "recover_password",
                    "reset_password",
                    "mobile",
                ].includes(currentPath)
            ) {
                redirect("/start");
            }
        });
};
