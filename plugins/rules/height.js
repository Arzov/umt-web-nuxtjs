const checkHeight = (rule, value, callback) => {

    const error = 'Ingresa una estatura menor a 300 cm.'


    // max. height 300 allowed

    if (value >= 300) {
        callback(error)
    }


    // no error

    else {
        callback()
    }
}


export default {
    name    : 'height',
    rules   : [{ validator: checkHeight }]
}
