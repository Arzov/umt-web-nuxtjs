

/**
 * Validate if a date is valid birthdate
 * @param {Object} birthdate Date in format {day: DD, month: MM, year: YYYY}
 */
const validateBirthdate = (birthdate) => {

    // convert input in date type

    const validBirthdate = new Date(
        birthdate.year,
        +birthdate.month - 1,
        birthdate.day
    )

    // default response

    const result = {
        status  : false,
        msg     : ''
    }


    // invalid date

    if (validBirthdate.getMonth() !== +birthdate.month - 1) {

        result.msg = 'Ingresa una fecha válida.'

        return result
    }


    // valid format

    else {

        const today = new Date()
        const m = today.getMonth() - validBirthdate.getMonth()
        let age = today.getFullYear() - validBirthdate.getFullYear()

        if (m < 0 || (m === 0 && today.getDate() < validBirthdate.getDate())) {
            age--
        }

        // user must greather than 18 years old

        if (age < 18) {
            result.msg = 'Debes ser mayor de 18 años.'

            return result
        }

        // correct date

        else {
            result.status = true
            result.msg = 'Edad correcta.'

            return result
        }
    }
}


/**
 * Get distance between two locations
 * @param {Number} lat1 Latitude of first position
 * @param {Number} lon1 Longitude of first position
 * @param {Number} lat2 Latitude of second position
 * @param {Number} lon2 Longitude of second position
 */
const getDistance = (lat1, lon1, lat2, lon2) => {

    const R = 6371 // earth radius in km
    const p = Math.PI / 180
    const dLat = (lat2 - lat1) * p
    const dLon = (lon2 - lon1) * p

    const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
        Math.cos(lat1 * p) *
        Math.cos(lat2 * p) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c // distance in km

    return Math.round(d)
}


/**
 * Get local time from UTC date
 * @param {String} dateUTC Date in UTC format
 */
const getLocalFromUTC = (dateUTC) => {

    const currDate = new Date(Date.parse(`${dateUTC}`))

    return currDate
}


/**
 * Get month from date in `MM` format
 * @param {String} currDate Date to parse
 */
const getMonthMM = (currDate) => {

    let currentMonth = getLocalFromUTC(currDate).getMonth() + 1

    // left padding 0 to month less than 10

    if (currentMonth < 10) {
        currentMonth = '0' + currentMonth
    }

    return currentMonth
}


/**
 * Get day from date in `DD` format
 * @param {String} currDate Date to parse
 */
const getDayDD = (currDate) => {

    let currentDay = getLocalFromUTC(currDate).getDate()

    // left padding 0 to day less than 10

    if (currentDay < 10) {
        currentDay = '0' + currentDay
    }

    return currentDay
}


/**
 * Get hour from date in `HH` format
 * @param {String} currDate Date to parse
 */
const getHourHH = (currDate) => {

    let currentHour = getLocalFromUTC(currDate).getHours()

    // left padding 0 to day less than 10

    if (currentHour < 10) {
        currentHour = '0' + currentHour
    }

    return currentHour

}


/**
 * Get minuntes from date in `MM` format
 * @param {String} currDate Date to parse
 */
const getMinutesMM = (currDate) => {

    let currentMinutes = getLocalFromUTC(currDate).getMinutes()

    // left padding 0 to day less than 10

    if (currentMinutes < 10) {
        currentMinutes = '0' + currentMinutes
    }

    return currentMinutes

}


/**
 * Get age from birthdate
 * @param {String} birthdate Birthdate in `YYYY-MM-DD` format
 */
const getAgeFromDate = (birthdate) => {

    const ageDifMs = Date.now() - new Date(birthdate).getTime()
    const ageDate = new Date(ageDifMs) // miliseconds from epoch

    return Math.abs(ageDate.getUTCFullYear() - 1970)
}


// export functions

export default (ctx, inject) => {

    const UTILS = {
        validateBirthdate,
        getDistance,
        getLocalFromUTC,
        getMonthMM,
        getDayDD,
        getHourHH,
        getMinutesMM,
        getAgeFromDate
    }

    inject('UTILS', UTILS)
}


// export for ant-design rules validation
export { validateBirthdate }
