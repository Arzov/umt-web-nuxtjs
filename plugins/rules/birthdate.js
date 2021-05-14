import { validateBirthdate } from '../utils'


const checkDate = (rule, value, callback) => {

    const response = validateBirthdate(value)

    // invalid input

    if (!response.status) {
        callback(response.msg)
    }

    // no error

    else {
        callback()
    }
}


export default {
    name    : 'birthdate',
    rules   : [{ validator: checkDate }]
}
