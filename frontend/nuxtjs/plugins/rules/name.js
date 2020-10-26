module.exports = {
  title: 'Nombre',
  required: true,
  placeholder: 'Ingresa tu nombre',
  extra: '',
  decorator: [
    'name',
    {
      initialValue: undefined,
      rules: [
        { required: true, message: 'Ingrese su nombre.' }
      ]
    }
  ]
}
