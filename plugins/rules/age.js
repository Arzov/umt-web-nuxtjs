function checkRequire (rule, value, callback) {
    const error = 'Ingrese un rango válido.'

    if (value && value.length === 2) { callback() } else { callback(error) }
}

export default {
    title: 'Rango de edad',
    required: true,
    placeholder: '',
    extra: '',
    decorator: [
        'age',
        {
            initialValue: [18, 22],
            rules: [
                { validator: checkRequire }
            ]
        }
    ]
}
