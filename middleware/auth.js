export default ({ app, route, store, redirect }) => {

    const currentPath = route.name.split('-')[0] // split by '-' for dynamic pages
    const userState = store.getters['user/get']


    // handle user access

    app.$AWS.Auth.currentSession()

    // exist a session

        .then(() => {

            // force to `Home` if is outside of the app

            if (
                [
                    'start',
                    'register',
                    'email_verification',
                    'recover_password',
                    'reset_password'
                ].includes(currentPath)
            ) {


                /**
                 * If email is `null` it means that Amplify Hub should be expected
                 * finish resolving the `signIn` event to save the states of the
                 * user in the store, therefore it is not redirected to the view
                 * `Home`. This only happens in the `Start` view and only when
                 * started with social media.
                 */

                if (userState.email) { redirect('/home') }
            }


            // check mandatory/optionals fields

            else if (!userState.birthdate) {


                /**
                 * It is redirected only if you are not on the corresponding page.
                 * This validation goes at this point and not in the parent
                 * `else if` since if the condition is `false` it would follow the
                 * next `else if` and we need that when it's `false` the condition,
                 * stays in the view.
                 */

                if (currentPath !== 'required_attributes') {
                    redirect('/required_attributes')
                }
            }

            else if (!userState.foot) {
                if (currentPath !== 'optional_attributes') {
                    redirect('/optional_attributes')
                }
            }

            else if (!userState.ageMinFilter) {
                if (currentPath !== 'optional_filters') {
                    redirect('/optional_filters')
                }
            }

        })


    // not logged

        .catch(function () {

            // redirect to `Start` only if is inside of the app

            if (
                ![
                    'start',
                    'register',
                    'email_verification',
                    'recover_password',
                    'reset_password',
                    'mobile'
                ].includes(currentPath)
            ) {
                redirect('/start')
            }

        })

}
