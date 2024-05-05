const productService = require("../services/product.service");
const catchAsync = require("../utils/catchAsync");

module.exports.getAllProducts = catchAsync(async (req, res, next) => {
    const products = await productService.getAllProducts();

    res.status(200).json({
        status: "success",
        statusCode: 200,
        totalItems: products.length,
        data: { products },
    });
});

module.exports.getProductById = catchAsync(async (req, res, next) => {
    const productId = req.params.productId;
    const product = await productService.getProductById(productId);

    if (!product) {
        return res.status(404).json({
            status: "fail",
            statusCode: 404,
            message: `Product with id: ${productId} not found`,
        });
    }

    res.status(200).json({
        status: "success",
        statusCode: 200,
        data: { product },
    });
});
