const Product = require("../models/product.model");
const cartService = require("../services/cart.service");
const catchAsync = require("../utils/catchAsync");

module.exports.getOverview = catchAsync(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).render("overview", {
        title: "Home",
        products,
    });
});

module.exports.getLoginForm = catchAsync(async (req, res, next) => {
    res.status(200).render("login", {
        title: "Log into your account",
    });
});

module.exports.getSignUpForm = catchAsync(async (req, res, next) => {
    res.status(200).render("signup", {
        title: "Sign Up with an account",
    });
});

module.exports.getCartPage = catchAsync(async (req, res, next) => {
    let data;
    console.log(req.session.id);
    if (!req.session?.user) {
        data = await cartService.getCart({ sessionId: req.session.id });
    } else {
        data = await cartService.getCart({ userId: req.session.user });
    }

    console.log(data);
    res.status(200).render("cart", {
        title: "Cart",
        data,
    });
});
