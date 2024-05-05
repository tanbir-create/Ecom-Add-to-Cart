const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

module.exports.addToCart = async ({ sessionId, userId, cartItem }) => {
    const cart = await Cart.findOne({ $and: [{ userId: userId }, { sessionId: sessionId }] }).select(
        "sessionId userId items totalItems"
    );
    let quantityAdjustedToAvaiablility = false;

    if (!cart) {
        if (cartItem.quantity > cartItem.stock) {
            quantityAdjustedToAvaiablility = true;
            cartItem.quantity = cartItem.stock;
        }
        const newCart = await Cart.create({
            totalItems: cartItem.quantity,
            userId,
            sessionId,
            items: [{ productId: cartItem.productId, quantity: cartItem.quantity }],
        });

        return {
            cart: newCart,
            quantityAdjustedToAvaiablility,
        };
    }

    const itemIndex = cart.items.findIndex((item) => String(item.productId) === cartItem.productId);

    if (itemIndex === -1) {
        // if cart quantity exceeds the available stock update it to available stock
        if (cartItem.quantity > cartItem.stock) {
            cartItem.quantity = cartItem.stock;
            quantityAdjustedToAvaiablility = true;
        }
        cart.items.push(cartItem);
        cart.totalItems += Number(cartItem.quantity);
    } else {
        //if item exists in cart and new_quantity + previous_quantity doesnt exceed stock then update the quantity
        if (cartItem.quantity + cart.items[itemIndex].quantity <= cartItem.stock) {
            cart.items[itemIndex].quantity += cartItem.quantity;
            cart.totalItems += Number(cartItem.quantity);
        } else {
            // else add only the quantity available in stock and notify user about it
            const adjustedQuantity = cartItem.stock - cart.items[itemIndex].quantity;
            cart.items[itemIndex].quantity += adjustedQuantity;
            cart.totalItems += adjustedQuantity;
            quantityAdjustedToAvaiablility = true;
        }
    }
    const updatedCart = await cart.save();
    updatedCart.sessionId = undefined;
    return {
        cart: updatedCart,
        quantityAdjustedToAvaiablility,
    };
};

module.exports.getCart = async ({ userId, sessionId }) => {
    const cart = await Cart.findOne({ $and: [{ userId: userId }, { sessionId: sessionId }] })
        .select("sessionId userId items totalItems")
        .populate({ path: "items.productId", select: "_id stock name price thumbnail" });

    if (!cart) {
        return {};
    }

    let quantityAdjustedToAvaiablility = false;

    const generatedCart = [];
    let totalItems = 0;
    let totalPrice = 0;
    for (let item of cart.items) {
        const product = item.productId;
        let cartQuantity = item.quantity;

        if (cartQuantity > product.stock) {
            quantityAdjustedToAvaiablility = true;
            cartQuantity = product.stock;
            item.quantity = product.stock;
        }
        totalItems += cartQuantity;
        totalPrice += cartQuantity * product.price;
        const it = {
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity: cartQuantity,
            stock: product.stock,
            thumbnail: product.thumbnail,
        };

        generatedCart.push(it);
    }

    cart.totalItems = totalItems;
    await cart.save();
    cart.sessionId = undefined;

    return {
        totalItems: cart.totalItems,
        totalPrice,
        cart: generatedCart,
        quantityAdjustedToAvaiablility,
    };
};

module.exports.mergeCarts = async ({ userId, sessionId }) => {
    const sessionCart = await Cart.findOne({ sessionId }).populate({
        path: "items.productId",
        select: "_id stock name price thumbnail",
    });

    if (!sessionCart) {
        return;
    }

    const userCart = await Cart.findOne({ userId });

    if (!userCart) {
        const items = sessionCart.items.map((item) => ({ productId: item.productId._id, quantity: item.quantity }));
        await Cart.deleteOne({ sessionId });
        return Cart.create({
            totalItems: sessionCart.totalItems,
            userId,
            items,
        });
    }

    const sessionCartItemsMap = new Map();

    for (let item of sessionCart.items) {
        sessionCartItemsMap.set(String(item.productId._id), { quantity: item.quantity, stock: item.productId.stock });
    }

    // upadate all the common items from both cart based on their availability
    userCart.items.forEach((item) => {
        if (sessionCartItemsMap.has(String(item.productId))) {
            const sessionCartItem = sessionCartItemsMap.get(String(item.productId));

            if (sessionCartItem.quantity + item.quantity <= sessionCartItem.stock) {
                item.quantity += sessionCartItem.quantity;
            } else {
                const adjustedQuantity = sessionCartItem.stock - item.quantity;
                item.quantity += adjustedQuantity;
            }
            sessionCartItemsMap.delete(String(item.productId));
        }
    });

    // add rest of the items from session cart
    for (let [productId, itemWithStats] of sessionCartItemsMap) {
        userCart.items.push({
            productId,
            quantity: itemWithStats.quantity > itemWithStats.stock ? itemWithStats.stock : itemWithStats.quantity,
        });
    }

    const totalItems = userCart.items.reduce((acc, item) => acc + Number(item.quantity), 0);
    userCart.totalItems = totalItems;
    // delete the session cart as it is merged
    await Cart.deleteOne({ sessionId });
    return userCart.save();
};

module.exports.updateCart = async ({ userId, sessionId, cartItem }) => {
    const cart = await Cart.findOneAndUpdate(
        { $and: [{ userId: userId }, { sessionId: sessionId }], "items.productId": cartItem.productId },
        { $set: { "items.$.quantity": cartItem.quantity } },
        { returnDocument: "after" }
    ).select("sessionId userId items totalItems");

    const totalItems = cart.items.reduce((acc, item) => acc + Number(item.quantity), 0);
    cart.totalItems = totalItems;

    await cart.save();
    cart.sessionId = undefined;
    return cart;
};

module.exports.deleteProductFromCart = async ({ productId, userId, sessionId }) => {
    const cart = await Cart.findOneAndUpdate(
        { $and: [{ userId: userId }, { sessionId: sessionId }] },
        { $pull: { items: { productId: Object(productId) } } },
        { returnDocument: "after" }
    ).select("sessionId userId items totalItems");

    if (cart.items.length === 0) {
        await Cart.deleteOne({ $and: [{ userId: userId }, { sessionId: sessionId }] });
        return {};
    }
    const totalItems = cart.items.reduce((acc, item) => acc + Number(item.quantity), 0);
    cart.totalItems = totalItems;

    await cart.save();
    cart.sessionId = undefined;
    return cart.items.length === 0 ? {} : cart;
};

module.exports.getCartQuantity = async ({ userId, sessionId }) => {
    const cart = await Cart.findOne({ userId, sessionId });

    if (!cart) {
        return 0;
    }

    return cart.totalItems;
};

// const a = await Cart.findOne({ $in: [{ userId: userId }, { sessionId: sessionId }] }).select(
//     "sessionId userId items"
// );

// const a = await Cart.aggregate[
//     ({
//         $match: { $or: [{ userId: userId }, { sessionId: sessionId }] },
//     },
//     {
//         $unwind: {
//             path: "$items",
//         },
//     })
// ];

// find the products from sessioncart, and their quantities,

//     const cartItemLinks = new Map();
//  for (let item of cart.links) {
//      cartItemLinks.set(String(item.productId), item.links);
//  }
//  links: cartItemLinks.get(String(product._id)),
