import Vuex from 'vuex'
import global from './modules/global'
import user from './modules/user'
import start from './modules/start'
import register from './modules/register'
import emailVerification from './modules/email-verification'
import resetPassword from './modules/reset-password'
import recoverPassword from './modules/recover-password'
import requiredAttributes from './modules/required-attributes'
import optionalFilters from './modules/optional-filters'
import optionalAttributes from './modules/optional-attributes'
import home from './modules/home'
import profile from './modules/profile'
import teams from './modules/teams'
import matches from './modules/matches'


const store = () => {
    return new Vuex.Store({
        modules: {
            global,
            user,
            start,
            register,
            emailVerification,
            recoverPassword,
            requiredAttributes,
            resetPassword,
            optionalFilters,
            optionalAttributes,
            home,
            profile,
            teams,
            matches
        }
    })
}

export default store
