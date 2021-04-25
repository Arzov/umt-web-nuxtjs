import { validateBirthdate } from '../utils'

const checkDate = (rule, value, callback) => {
    const response = validateBirthdate(value)

    if (!response.status) {
        callback(response.msg)
    }
    else {
        callback()
    }
}

export const birthdateRules = [{ validator: checkDate }]

export default {
    name: 'birthdate',
    rules: birthdateRules
}
