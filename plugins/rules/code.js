const checkCode = (rule, value, callback) => {

    const error = 'Ingresa un código válido.'

    // code must have 6 digits

    if (value.length < 6) {
        callback(error)
    }

    // no error

    else {
        callback()
    }
}


export default {
    name    : 'code',
    rules   : [{ validator: checkCode }]
}
