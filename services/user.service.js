const bcrypt = require("bcrypt");

const User = require("../models/user.model");
const AppError = require("../utils/AppError");

const encrypt = async (payload) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPayload = await bcrypt.hash(payload, salt);

    return hashedPayload;
};

const compare = async (payload, hashedPayload) => {
    const payloadsMatch = await bcrypt.compare(payload, hashedPayload);

    return payloadsMatch;
};

module.exports.register = async (userBody) => {
    const { email, password } = userBody;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new AppError("User already exists", 400, "form_validation_error", {
            errors: [{ email: "User alredy exists" }],
        });
    }

    const encryptedPassword = await encrypt(password);

    return User.create({
        email,
        password: encryptedPassword,
    });
};

module.exports.login = async (userBody) => {
    try {
        const { email, password } = userBody;
        if (!email || !password) {
            throw new AppError("Email and password fields cannot be empty", 401, "invalid_data_error");
        }

        const existingUser = await User.findOne({ email }, "password");
        if (!existingUser) {
            throw new AppError("Invalid email or password", 401, "invalid_data_error");
        }

        const passwordsMatch = await compare(password, existingUser.password);
        if (!passwordsMatch) {
            throw new AppError("Invalid email or password", 401, "invalid_data_error");
        }

        return existingUser._id;
    } catch (error) {
        throw error;
    }
};
