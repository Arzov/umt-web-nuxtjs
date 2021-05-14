const emailRules = [

    // required validation

    {
        required    : true,
        message     : 'Ingresa un correo electrónico.'
    },


    // email format validation

    {
        type    : 'email',
        message : 'Ingresa un correo válido.',
        trigger : 'change'
    }
]

export default {
    name        : 'email',
    placeholder : 'Ingresa tu correo electrónico',
    type        : 'email',
    rules       : emailRules
}
