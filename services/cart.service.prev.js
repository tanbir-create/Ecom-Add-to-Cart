const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const productService = require("./product.service");

module.exports.addToCart = async ({ userId, cartItem }) => {
    try {
        const userCart = await Cart.findOne({ userId, "items.productId": cartItem.productId });

        if (userCart) {
            return Cart.updateOne(
                { userId, "items.productId": cartItem.productId },
                { $set: { "items.$.quantity": cartItem.quantity } }
            );
        } else {
            return Cart.updateOne({ userId }, { $push: { items: cartItem } }, { upsert: true });
        }
    } catch (error) {
        throw error;
    }
};

module.exports.mergeSessionCart = async ({ userId, cartItems }) => {
    const userCart = await Cart.findOne({ userId });

    if (!userCart) {
        return Cart.create({
            userId,
            items: [...cartItems],
        });
    }

    // adding all session cart items to an obj with the productid as key to compare if the product already
    // exits in user cart
    const obj = {};
    const itemIds = cartItems.map((item) => {
        obj[item.productId] = item;
        return item.productId;
    });

    const items = await Product.find({ _id: { $in: [...itemIds] } }).select("_id, quantity");

    // after fetching the available quatity we update the object so that each session cart
    // item has the session quantity and the available quantity to be compared later
    items.forEach((item) => {
        if (obj[item._id]) {
            obj[item._id].availableQuantity = item.quantity;
        }
    });

    // if user has item already in cart add both quantities, if after adding, quantity exceeds item's available quantity
    // set the quantity to the avaiable qty

    // for all common items in session and user cart
    userCart.items.forEach((item) => {
        if (obj[item.productId]) {
            const addedQuantity = obj[item.productId].quantity + item.quantity;
            if (addedQuantity > obj[item.productId].availableQuantity) {
                item.quantity = obj[item.productId].availableQuantity;
            } else {
                item.quantity = addedQuantity;
            }

            delete obj[item.productId];
        }
    });

    // for new items from session cart
    Object.values(obj).forEach((o) => {
        userCart.items.push({
            productId: o.productId,
            quantity: o.quantity > o.availableQuantity ? o.availableQuantity : o.quantity,
        });
    });

    return userCart.save();
};

module.exports.getCartByUserId = async (userId) => {
    return Cart.findOne({ userId });
};

module.exports.generateCart = async (cart) => {
    // create a map of the items to quantity to later update the quantities with available quantity
    const itemMap = new Map();
    cart.items.forEach((item) => {
        itemMap.set(String(item.productId), item.quantity);
    });

    const products = await productService.getItemsFromCart(cart);
    let totalPrice = 0;
    let totalItems = 0;

    for (product of products) {
        // update the cart quantity if it exceeds available quantity
        if (itemMap.get(String(product._id)) < product.quantity) {
            product.quantity = itemMap.get(String(product._id));
        }

        totalPrice += product.price * product.quantity;
        totalItems += product.quantity;
    }

    return {
        totalItems,
        totalPrice,
        products,
    };

    // console.log(products);
};
