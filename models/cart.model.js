const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            index: true,
        },

        sessionId: {
            type: String,
            select: false,
            index: true,
        },

        totalItems: {
            type: Number,
            default: 0,
        },

        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: [true, "Product Id is required"],
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ],
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true,
    }
);

// cartSchema.virtual("links").get(function () {
//     return this.items.map((item) => {
//         return {
//             productId: item.productId,
//             quantity: item.quantity,
//             links: [
//                 {
//                     rel: "deleteFromCart",
//                     method: "DELETE",
//                     href: `/cart/${item.productId.toString()}`,
//                 },
//             ],
//         };
//     });
// });

cartSchema.pre("validate", function (next) {
    if (!this.userId && !this.sessionId) return next(new Error("Cart must belong to a user or a session"));
    next();
});

const Cart = new mongoose.model("Cart", cartSchema);

module.exports = Cart;
