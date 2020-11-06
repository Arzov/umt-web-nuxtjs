export const emailRules = [
  {
    required: true,
    message: 'Ingresa un correo electrónico.'
  },
  {
    type: 'email',
    message: 'Ingresa un correo válido.',
    trigger: 'change'
  }
]

export default {
  name: 'email',
  placeholder: 'Ingresa tu correo electrónico',
  rules: emailRules
}
