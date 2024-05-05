const Product = require("../models/product.model");
const Cart = require("../models/cart.model");
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
    if (!req.session?.user) {
        data = await cartService.getCart({ sessionId: req.session.id });
    } else {
        data = await cartService.getCart({ userId: req.session.user });
    }

    res.status(200).render("cart", {
        title: "Cart",
        data,
    });
});

module.exports.getCheckoutPage = catchAsync(async (req, res, next) => {
    if (!req.session?.user) {
        return res.status(200).redirect("/login?redirect=cart");
    }

    const cart = await Cart.deleteOne({ userId: req.session.user });

    if (cart.deletedCount < 1) {
        return res.redirect("/");
    }

    res.status(200).render("checkout", {
        title: "Cart",
        message: "Thank you for shopping with us",
    });
});

module.exports.getProductPage = catchAsync(async (req, res, next) => {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    res.status(200).render("product", {
        title: product.name,
        product,
    });
});
