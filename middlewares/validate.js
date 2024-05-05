const AppError = require("../utils/AppError");

const validateOptions = {
    errors: {
        wrap: {
            label: false,
        },
    },
    abortEarly: false,
};

function validate(schema) {
    return function (req, res, next) {
        const { error, value } = schema.validate(req.body, validateOptions);

        if (error) {
            let message = "Please enter valid data";
            const customErrorMessages = error.details.map((err) => {
                message = err.message;
                return { [err.path[0]]: err.message };
            });
            return next(
                new AppError(message, 400, "form_validation_error", {
                    errors: customErrorMessages,
                })
            );
        }
        req.body = value;
        next();
    };
}

module.exports = validate;
