const router = require("express").Router();

const cartController = require("../controllers/cart.controller");

router.post("/", cartController.addToCart);
router.get("/", cartController.getCart);
router.patch("/", cartController.updateCart);
router.delete("/:productId", cartController.deleteProductFromCart);
router.get("/cart_quantity", cartController.getCartQuantity);
module.exports = router;
