const checkWeight = (rule, value, callback) => {

    const error = 'Ingresa un peso menor a 300 kg.'


    // max. weight 300 allowed

    if (value >= 300) {
        callback(error)
    }


    // no error

    else {
        callback()
    }
}


export default {
    name    : 'weight',
    rules   : [{ validator: checkWeight }]
}
