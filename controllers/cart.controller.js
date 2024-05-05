const cartService = require("../services/cart.service");
const productService = require("../services/product.service");
const catchAsync = require("../utils/catchAsync");

module.exports.addToCart = catchAsync(async (req, res, next) => {
    let { productId, quantity } = req.body;

    if (isNaN(Number(quantity)) || Number(quantity) === 0) {
        return res.status(400).json({
            status: "fail",
            statusCode: 400,
            message: "Item quantity can't be 0",
        });
    }

    const productAvailableQuantity = await productService.getProductQunatity(productId);

    if (productAvailableQuantity === 0) {
        return res.status(409).json({
            status: "fail",
            statusCode: 409,
            message: "Sorry, the product is out of stock",
        });
    }

    let cart;
    let message = "Item added to cart";
    if (!req.session?.user) {
        const result = await cartService.addToCart({
            sessionId: req.session.id,
            cartItem: { productId, quantity, stock: productAvailableQuantity },
        });

        cart = result;
        message = result.quantityAdjustedToAvaiablility ? "Quantity adjusted to avaiable product stock" : message;
    } else {
        const result = await cartService.addToCart({
            userId: req.session.user,
            cartItem: { productId, quantity, stock: productAvailableQuantity },
        });

        cart = result;
        message = result.quantityAdjustedToAvaiablility ? "Quantity adjusted to avaiable product stock" : message;
    }

    res.status(200).json({
        status: "success",
        statusCode: 200,
        data: cart,
        message,
    });
});

module.exports.updateCart = catchAsync(async (req, res, next) => {
    let { productId, quantity } = req.body;

    if (isNaN(Number(quantity)) || Number(quantity) === 0) {
        return res.status(400).json({
            status: "fail",
            statusCode: 400,
            message: "Item quantity can't be 0",
        });
    }

    const productAvailableQuantity = await productService.getProductQunatity(productId);

    if (productAvailableQuantity === 0) {
        return res.status(409).json({
            status: "fail",
            statusCode: 409,
            message: "Sorry, the product is out of stock",
        });
    }

    let message = "Updated cart item";
    let quantityAdjustedToAvaiablility = false;
    if (quantity > productAvailableQuantity) {
        quantity = productAvailableQuantity;
        quantityAdjustedToAvaiablility = true;
        message = "Quantity adjusted to avaiable product stock";
    }

    let cart;
    if (!req.session?.user) {
        cart = await cartService.updateCart({
            sessionId: req.session.id,
            cartItem: { productId, quantity },
        });
    } else {
        cart = await cartService.updateCart({
            userId: req.session.user,
            cartItem: { productId, quantity },
        });
    }

    res.status(200).json({
        status: "success",
        statusCode: 200,
        data: {
            cart,
        },
        message,
    });
});

module.exports.deleteProductFromCart = catchAsync(async (req, res, next) => {
    let cart;
    const { productId } = req.params;
    if (!req.session?.user) {
        cart = await cartService.deleteProductFromCart({ productId, sessionId: req.session.id });
    } else {
        cart = await cartService.deleteProductFromCart({ productId, userId: req.session.user });
    }

    res.status(200).json({
        status: "success",
        statusCode: 200,
        data: cart,
        message: "Product deleted from cart",
    });
});

module.exports.getCart = catchAsync(async (req, res, next) => {
    let cart;
    if (!req.session?.user) {
        cart = await cartService.getCart({ sessionId: req.session.id });
    } else {
        cart = await cartService.getCart({ userId: req.session.user });
    }

    res.status(200).json({
        status: "success",
        statusCode: 200,
        data: cart,
    });
});

module.exports.getCartQuantity = catchAsync(async (req, res, next) => {
    let quantity = 0;
    if (!req.session?.user) {
        quantity = await cartService.getCartQuantity({ sessionId: req.session.id });
    } else {
        quantity = await cartService.getCartQuantity({ userId: req.session.user });
    }

    res.status(200).json({
        status: "success",
        statusCode: 200,
        data: { quantity },
    });
});

// module.exports.getCartQuantity = catchAsync(async (req, res, next) => {
//     let cart;
//     if (!req.session?.user) {
//         cart = await cartService.getCart({ sessionId: req.session.id });
//     } else {
//         cart = await cartService.getCart({ userId: req.session.user });
//     }

//     res.status(200).json({
//         status: "success",
//         statusCode: 200,
//         data: { quantity: cart.totalItems, quantityAdjustedToAvaiablility: cart.quantityAdjustedToAvaiablility },
//     });
// });
