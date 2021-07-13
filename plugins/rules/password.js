const passwordRules = [

    // required validation

    {
        required: true,
        message: 'Ingresa una contraseña.'
    },


    // password must have 6 characters at least

    {
        min: 6,
        message: 'La contraseña debe tener al menos 6 caracteres.',
        trigger: 'change'
    }
]


export default {
    name            : 'password',
    placeholder     : 'Ingresa tu contraseña',
    rules           : passwordRules
}
