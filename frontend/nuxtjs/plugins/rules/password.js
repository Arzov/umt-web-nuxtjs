export const passwordRules = [
  { required: true, message: 'Ingresa una contraseña.', trigger: 'change' },
  { min: 6, message: 'La contraseña debe tener al menos 6 caracteres.', trigger: 'change' }
]

export default {
  name: 'password',
  placeholder: 'Ingresa tu contraseña',
  initialValue: '',
  rules: passwordRules
}
