export const emailRules = [
  { required: true, message: 'Ingrese un correo electrónico.', trigger: 'blur' },
  { type: 'email', message: 'Ingrese un correo válido.', trigger: 'change' }
]

export default {
  name: 'email',
  placeholder: 'Ingresa tu correo electrónico',
  initialValue: '',
  rules: emailRules
}
