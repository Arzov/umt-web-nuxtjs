import { validateBirthdate } from '@/utils/inputUtils'

const checkDate = (rule, value, callback) => {
  const response = validateBirthdate(value)

  if (!response.status) { callback(response.msg) } else { callback() }
}

export default {
  title: 'Fecha de nacimiento',
  required: true,
  placeholder: '',
  extra: '',
  decorator: [
    'birthdate',
    {
      initialValue: { day: undefined, month: undefined, year: undefined },
      rules: [
        { validator: checkDate }
      ]
    }
  ]
}
