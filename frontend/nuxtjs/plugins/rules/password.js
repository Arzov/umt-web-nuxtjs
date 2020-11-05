export const passwordRules = [
  {
    required: true,
    message: 'Ingresa una contraseña.',
    transform (v) {
      return v.text
    }
  },
  {
    min: 6,
    message: 'La contraseña debe tener al menos 6 caracteres.',
    trigger: 'change'
  }
]

export default {
  name: 'password',
  placeholder: 'Ingresa tu contraseña',
  type: 'password',
  autocomplete: 'off',
  rules: passwordRules
}
