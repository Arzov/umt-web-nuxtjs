function checkCode(rule, value, callback) {
    const error = "Ingresa un código válido.";

    if (value.length < 6) {
        callback(error);
    } else {
        callback();
    }
}

export const codeRules = [{ validator: checkCode }];

export default {
    name: "code",
    rules: codeRules,
};
