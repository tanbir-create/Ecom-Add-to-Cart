const router = require("express").Router();

const productController = require("../controllers/product.controller");

router.get("/", productController.getAllProducts);
router.get("/:productId", productController.getProductById);
// router.delete("/:productId", cartController.deleteProductFromCart);
module.exports = router;
