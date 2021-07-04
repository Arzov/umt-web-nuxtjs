const checkHeight = (rule, value, callback) => {

    let error = 'Ingresa una estatura menor a 300 cm.'


    // max. height 300 allowed

    if (value >= 300) {
        callback(error)
    }


    // positive values allowed

    if (value < 0) {
        error = 'Ingresa una estatura mayor o igual a 0 cm.'
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
