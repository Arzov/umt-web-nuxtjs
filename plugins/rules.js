import email from './rules/email.js'
import password from './rules/password.js'
import firstName from './rules/firstname.js'
import birthdate from './rules/birthdate.js'
import code from './rules/code.js'

export default (ctx, inject) => {
  const RULES = {
    email,
    password,
    firstName,
    birthdate,
    code
  }

  inject('RULES', RULES)
}
