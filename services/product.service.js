const Product = require("../models/product.model");
const AppError = require("../utils/AppError");

module.exports.getProductQunatity = async (productId) => {
    try {
        const product = await Product.findById(productId);

        if (!product) {
            throw new AppError(`No product found with ID: ${productId}`, 404);
        }

        return product.stock;
    } catch (error) {
        throw error;
    }
};

module.exports.getItemsFromCart = async (cart) => {
    const productIds = cart.items.map((item) => item.productId);

    const products = await Product.find({ _id: { $in: [...productIds] } }).select("-description -category -images");

    return products;
};

module.exports.getAllProducts = async () => {
    return Product.find();
};

module.exports.getProductById = async (productId) => {
    return Product.findById(productId);
};
