const validateBirthdate = (birthdate) => {
    const validBirthdate = new Date(
        birthdate.year,
        +birthdate.month - 1,
        birthdate.day
    );
    const result = {
        status: false,
        msg: "",
    };

    if (validBirthdate.getMonth() !== +birthdate.month - 1) {
        result.msg = "Ingresa una fecha válida.";

        return result;
    } else {
        const today = new Date();
        const m = today.getMonth() - validBirthdate.getMonth();
        let age = today.getFullYear() - validBirthdate.getFullYear();

        if (m < 0 || (m === 0 && today.getDate() < validBirthdate.getDate())) {
            age--;
        }

        if (age < 18) {
            result.msg = "Debes ser mayor de 18 años.";

            return result;
        } else {
            result.status = true;
            result.msg = "Edad correcta.";

            return result;
        }
    }
};

const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // earth radius in km
    const p = Math.PI / 180;
    const dLat = (lat2 - lat1) * p;
    const dLon = (lon2 - lon1) * p;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * p) *
            Math.cos(lat2 * p) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // distance in km
    return Math.round(d);
};

const getLocalFromUTC = (dateUTC) => {
    const currDate = new Date(Date.parse(`${dateUTC}`));
    return currDate;
};

const getMonthMM = (currDate) => {
    let currentMonth = currDate.getMonth() + 1;
    if (currentMonth < 10) {
        currentMonth = "0" + currentMonth;
    }
    return currentMonth;
};

const getDayDD = (currDate) => {
    let currentDay = currDate.getDate();
    if (currentDay < 10) {
        currentDay = "0" + currentDay;
    }
    return currentDay;
};

const getAgeFromDate = (birthday) => {
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export default (ctx, inject) => {
    const UTILS = {
        validateBirthdate,
        getDistance,
        getLocalFromUTC,
        getMonthMM,
        getDayDD,
        getAgeFromDate,
    };

    inject("UTILS", UTILS);
};

export { validateBirthdate };
