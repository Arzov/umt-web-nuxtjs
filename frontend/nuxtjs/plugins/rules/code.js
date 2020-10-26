function checkCode (rule, value, callback) {
  const error = 'Ingrese un código válido.'

  if (value.length < 6) {
    callback(error)
  } else { callback() }
}

module.exports = {
  title: 'Código',
  required: true,
  placeholder: 'Ingresa el código enviado',
  extra: '',
  decorator: [
    'code',
    {
      initialValue: undefined,
      rules: [
        { validator: checkCode }
      ]
    }
  ]
}
