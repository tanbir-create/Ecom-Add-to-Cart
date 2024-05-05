const userService = require("../services/user.service");
const cartService = require("../services/cart.service");
const User = require("../models/user.model");

const catchAsync = require("../utils/catchAsync");

module.exports.signup = catchAsync(async (req, res, next) => {
    const user = await userService.register(req.body);
    await cartService.mergeCarts({ sessionId: req.session.id, userId: user });

    req.session.user = user._id;

    res.status(201).json({
        status: "success",
        statusCode: 201,
        message: "Signup successful",
        data: user,
    });
});

module.exports.login = catchAsync(async (req, res, next) => {
    const user = await userService.login(req.body);
    // const cart = await cartService.getCart({ sessionId: req.session.id });
    await cartService.mergeCarts({ sessionId: req.session.id, userId: user });

    req.session.user = user;

    res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Login successful",
    });
});

module.exports.logout = catchAsync(async (req, res, next) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                res.status(400).send("Unable to log out");
            } else {
                res.clearCookie("connect.sid", { path: "/" });
                res.status(204).end();
            }
        });
    } else {
        res.end();
    }
});

module.exports.isLoggedIn = async (req, res, next) => {
    try {
        if (!req.session?.user) {
            return next();
        }
        const user = await User.findById(req.session.user);
        res.locals.user = user;
        next();
    } catch (error) {
        next(error);
    }
};
