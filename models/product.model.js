const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter product name"],
        },

        description: {
            type: String,
        },

        price: {
            type: Number,
            required: [true, "Please enter product price"],
            min: [1, "Product price must be greater than 0"],
        },

        category: {
            type: String,
            default: "Other",
        },

        stock: {
            type: Number,
            required: [true, "Please enter available stock quantity of the product"],
        },

        thumbnail: {
            type: String,
            default: "https://m.media-amazon.com/images/I/51S-A7DAI3L._SL1000_.jpg",
        },

        images: [
            {
                type: String,
            },
        ],
    },

    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// productSchema.virtual("links").get(function () {
//     return [
//         { rel: "self", href: `/products/${this._id}` },
//         { rel: "addToCart", method: "POST", href: "/cart" },
//     ];
// });

const Product = new mongoose.model("Product", productSchema);
module.exports = Product;
