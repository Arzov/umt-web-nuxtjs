function checkWeight (rule, value, callback) {
    const error = 'Ingresa un peso menor a 500 kg.'

    if (value >= 500) {
        callback(error)
    }
    else {
        callback()
    }
}

export const weightRules = [{ validator: checkWeight }]

export default {
    name: 'weight',
    rules: weightRules
}
