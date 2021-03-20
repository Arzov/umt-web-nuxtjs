function checkHeight (rule, value, callback) {
    const error = 'Ingresa una estatura menor a 300 cm.'

    if (value >= 300) {
        callback(error)
    } else { callback() }
}

export const heightRules = [
    { validator: checkHeight }
]

export default {
    name: 'height',
    rules: heightRules
}
