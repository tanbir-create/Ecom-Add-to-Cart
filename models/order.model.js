const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            index: true,
            required: true,
        },

        totalItems: {
            type: Number,
            default: 0,
        },

        orderTotal: {
            type: Number,
        },

        status: {
            type: String,
            enum: ["PROCESSING", "SHIPPED", "DELIVERED"],
            default: "PROCESSING",
        },

        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: [true, "Product Id is required"],
                },

                name: String,

                price: Number,

                thumbnail: String,

                link: String,

                quantity: Number,
            },
        ],

        tracking: [
            {
                time: {
                    type: Date,
                },

                address: {
                    type: String,
                    required: true,
                },

                status: {
                    type: String,
                    enum: ["SHIPPED_TO", "ARRIVED_AT", "OUT_FOR_DELIVERY", "DELIVERED"],
                },
            },
        ],

        address: {
            type: String,
            default: "Address Line1",
        },
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

// cartSchema.pre("validate", function (next) {
//     if (!this.userId && !this.sessionId) return next(new Error("Cart must belong to a user or a session"));
//     next();
// });

const Order = new mongoose.model("Order", orderSchema);

module.exports = Order;
