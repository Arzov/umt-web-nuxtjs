import email from './rules/email.js'
import password from './rules/password.js'

export default (ctx, inject) => {
  const RULES = {
    email,
    password
  }

  inject('RULES', RULES)
}
