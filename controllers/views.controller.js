const Product = require("../models/product.model");
const Cart = require("../models/cart.model");
const cartService = require("../services/cart.service");
const orderService = require("../services/order.service");
const catchAsync = require("../utils/catchAsync");
const Order = require("../models/order.model");

module.exports.getOverview = catchAsync(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).render("overview", {
        title: "Home",
        products,
    });
});

module.exports.getLoginForm = catchAsync(async (req, res, next) => {
    if (req.session?.user) {
        return res.redirect("/");
    }

    res.status(200).render("login", {
        title: "Log into your account",
    });
});

module.exports.getSignUpForm = catchAsync(async (req, res, next) => {
    if (req.session?.user) {
        return res.redirect("/");
    }
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

    const data = await orderService.createNewOrder({ userId: req.session.user });
    if (data.status === "success") {
        const cart = await Cart.deleteOne({ userId: req.session.user });
        if (cart.deletedCount < 1) {
            return res.redirect("/");
        }
    } else if (data.status === "fail") {
        return res.status(200).render("checkout", {
            title: "Order",
            message: "Error placing order, please try again!",
        });
    }

    res.status(200).render("checkout", {
        title: "Order",
        message: data.message,
        orderId: data.order.id ? data.order.id : undefined,
        order: data.order,
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

module.exports.getOrdersPage = catchAsync(async (req, res, next) => {
    if (!req.session?.user) {
        return res.status(200).redirect("/login");
    }

    // const data = await orderService.createNewOrder({ userId: req.session.user });
    // if (data.status === "success") {
    //     const cart = await Cart.deleteOne({ userId: req.session.user });
    //     if (cart.deletedCount < 1) {
    //         return res.redirect("/");
    //     }
    // } else if (data.status === "fail") {
    //     return res.status(200).render("checkout", {
    //         title: "Order",
    //         message: "Error placing order, please try again!",
    //     });
    // }

    const orders = await orderService.getAllOrders({ userId: req.session.user });
    let message = "Your orders";
    let status = "success";
    if (!orders || orders.length === 0) {
        message = "You dont have any orders.";
        status = "fail";
    }

    res.status(200).render("orders_overview", {
        title: "Order",
        orders,
        message,
        status,
    });
});

module.exports.getOrderDetailsPage = catchAsync(async (req, res, next) => {
    if (!req.session?.user) {
        return res.status(200).redirect("/login");
    }

    const { orderId } = req.params;

    const order = await orderService.getOrderById({ orderId, userId: req.session.user });

    if (!order) {
        return res.status(200).render("order", {
            title: "Order",
            message: "No order found",
        });
    }

    order.tracking.reverse();
    res.status(200).render("order", {
        title: "Order",
        message: "Order details",
        order,
    });
});
