const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const cartService = require("../services/cart.service");

function isEmptyObject(obj) {
    return Object.getOwnPropertyNames(obj).length === 0;
}

module.exports.createNewOrder = async ({ userId }) => {
    const cart = await cartService.getCart({ userId });

    if (!cart || isEmptyObject(cart)) {
        return {
            status: "fail",
            message: "No cart found! Please add items to cart",
        };
    }

    const items = [];

    for (const item of cart.cart) {
        const newItem = {
            name: item.name,
            thumbnail: item.thumbnail,
            quantity: item.quantity,
            productId: item.productId,
            price: item.price,
            link: `/products/${item.productId}`,
        };

        items.push(newItem);
    }

    const newOrder = {
        totalItems: cart.totalItems,
        orderTotal: cart.totalPrice,
        items,
        userId,
    };

    const order = await Order.create(newOrder);

    return {
        message: "Order successfully placed",
        status: "success",
        order,
    };
};

module.exports.getAllOrders = async ({ userId }) => {
    return Order.find({ userId }).sort({ createdAt: -1 });
};

module.exports.getOrderById = async ({ orderId, userId }) => {
    return Order.findOne({ _id: orderId, userId });
};
