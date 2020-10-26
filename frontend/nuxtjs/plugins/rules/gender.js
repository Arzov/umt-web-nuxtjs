function checkRequire (rule, value, callback) {
  const error = 'Seleccione un género.'

  if (value) { callback() } else { callback(error) }
}

const createAgeDecorator = (name = 'gender') => {
  return {
    title: 'Género',
    required: true,
    placeholder: '',
    extra: '',
    decorator: [
      name,
      {
        initialValue: 'M',
        rules: [
          { validator: checkRequire }
        ]
      }
    ]
  }
}

export default createAgeDecorator
