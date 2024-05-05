const Cart = require("../models/cart.model");
const mongoose = require("mongoose");
/*
module.exports.addToCart = async ({ userId, cartItem }) => {
    try {
        const { productId, quantity } = cartItem;
        const userCart = await Cart.findOne({ userId });

        if (!userCart) {
            return Cart.create({
                userId,
                items: [cartItem],
            });
        }

        const items = userCart.items;

        const itemIndex = items.findIndex((item) => item.productId.toString() === cartItem.productId);

        return Cart.updateOne(
            { _id: userCart._id },
            {
                $addToSet: { items: { productId: , quantity } },
            }
        );

        // if (itemIndex === -1) {
        //     return Cart.updateOne(
        //         { _id: userCart._id },
        //         {
        //             $push: { items: { productId, quantity } },
        //         }
        //     );
        // } else {
        //     return Cart.updateOne(
        //         { "items.productId": productId },
        //         {
        //             $set: { "$items.$.quantity": quantity },
        //         }
        //     );
        // }

        if (itemIndex === -1) {
            userCart.items.push({ productId, quantity });
            return userCart.save();
            // return Cart.updateOne(
            //     { _id: userCart._id },
            //     {
            //         $push: { items: { productId, quantity } },
            //     }
            // );
        } else {
            userCart.items[itemIndex].quantity = quantity;
            return userCart.save();
            // return Cart.updateOne(
            //     { "items.productId": productId },
            //     {
            //         $set: { "$items.$.quantity": quantity },
            //     }
            // );
        }

        // const items = userCart.items;
        // return cartItem;
    } catch (error) {
        throw error;
    }
};
*/

module.exports.addToCart = async ({ userId, cartItem }) => {
    try {
        // const { productId, quantity } = cartItem;
        const userCart = await Cart.findOne({ userId, "items.productId": cartItem.productId });

        if (userCart) {
            return Cart.updateOne(
                { userId, "items.productId": cartItem.productId },
                { $set: { "items.$.quantity": cartItem.quantity } }
            );
        } else {
            return Cart.updateOne({ userId }, { $push: { items: cartItem } }, { upsert: true });
        }

        // if (!userCart) {
        //     return Cart.create({
        //         userId,
        //         items: [cartItem],
        //     });
        // }

        // const items = userCart.items;

        // const existingItem = items.find((item) => item.productId.toString() === cartItem.productId);

        // if (existingItem) {
        //     // Update quantity if the product already exists
        //     return Cart.updateOne(
        //         { userId, "items.productId": existingItem.productId },
        //         { $set: { "items.$.quantity": cartItem.quantity } }
        //     );
        // } else {
        //     // Add the new item to the cart
        //     return Cart.updateOne(
        //         { userId },
        //         { $addToSet: { items: { productId: Object(cartItem.productId), quantity: cartItem.quantity } } }
        //     );
        // }
    } catch (error) {
        throw error;
    }
};
