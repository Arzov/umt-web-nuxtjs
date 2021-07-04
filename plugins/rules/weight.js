const checkWeight = (rule, value, callback) => {

    let error = 'Ingresa un peso menor a 300 kg.'


    // max. weight 300 allowed

    if (value >= 300) {
        callback(error)
    }


    // positive values allowed

    if (value < 0) {
        error = 'Ingresa un peso mayor o igual a 0 kg.'
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
