function checkRequire(rule, value, callback) {
    const error = "Seleccione un tipo de match.";

    if (value) {
        callback();
    } else {
        callback(error);
    }
}

export default {
    title: "Tipo de juego",
    required: true,
    placeholder: "",
    extra: "",
    decorator: [
        "match",
        {
            initialValue: "7v7",
            rules: [{ validator: checkRequire }],
        },
    ],
};
