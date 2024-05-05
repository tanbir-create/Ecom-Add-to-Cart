const catchAsync = require("../utils/catchAsync");
const cartService = require("../services/cart.service.prev");
const productService = require("../services/product.service");

function addToSessionCart(req, res, { productId, quantity, quantityAdjustedToAvaiablility }) {
    const message = quantityAdjustedToAvaiablility ? "Adjusted quantity to availble stock" : "Added product to cart";

    if (req.session?.cart) {
        const cart = req.session.cart;

        const itemIndex = cart.items.findIndex((item) => item.productId === productId);
        if (itemIndex === -1) {
            req.session.cart.items.push({ productId, quantity });
        } else {
            req.session.cart.items[itemIndex].quantity = quantity;
        }
    } else {
        // if cart doenst exist in session
        const items = [{ productId, quantity }];
        req.session.cart = {};
        req.session.cart.items = items;
    }

    return res.status(200).json({
        status: "success",
        statusCode: 200,
        data: req.session.cart,
        message,
    });
}

module.exports.addToCart = catchAsync(async (req, res, next) => {
    let { productId, quantity } = req.body;

    if (quantity === 0) {
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

    let quantityAdjustedToAvaiablility = false;
    if (quantity > productAvailableQuantity) {
        quantityAdjustedToAvaiablility = true;
        quantity = productAvailableQuantity;
    }

    // when user is logged out
    if (!req.session?.user) {
        return addToSessionCart(req, res, { productId, quantity, quantityAdjustedToAvaiablility });
    }

    const cart = await cartService.addToCart({
        userId: req.session.user,
        cartItem: { productId, quantity, quantityAdjustedToAvaiablility },
    });

    return res.status(200).json({ cart });
});

module.exports.getCart = catchAsync(async (req, res, next) => {
    let cart;
    if (!req.session?.user) {
        if (!req.session?.cart) {
            return res.status(404).json({
                status: "fail",
                statusCode: 404,
                message: "The cart is empty, Please login to view your cart",
            });
        }
        cart = req.session.cart;
    } else {
        cart = await cartService.getCartByUserId(req.session.user);
    }
    const cartWithDetails = await cartService.generateCart(cart);

    res.status(200).json({
        status: "success",
        statusCode: 200,
        data: cartWithDetails,
    });
});
