import email from './rules/email.js'
import password from './rules/password.js'
import firstName from './rules/firstname.js'
import birthdate from './rules/birthdate.js'
import code from './rules/code.js'
import height from './rules/height.js'
import weight from './rules/weight.js'


export default (ctx, inject) => {

    const RULES = {
        email,
        password,
        firstName,
        birthdate,
        code,
        height,
        weight
    }

    inject('RULES', RULES)
}
