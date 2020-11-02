import email from './rules/email.js'
import password from './rules/password.js'
import firstname from './rules/firstname.js'
import birthdate from './rules/birthdate.js'

export default (ctx, inject) => {
  const RULES = {
    email,
    password,
    firstname,
    birthdate
  }

  inject('RULES', RULES)
}
