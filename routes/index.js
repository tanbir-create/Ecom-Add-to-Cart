const router = require("express").Router();
const Cart = require("../models/cart.model");

const userRouter = require("./user.router");
const cartRouter = require("./cart.router");
const productRouter = require("./product.router");

router.use("/users", userRouter);
router.use("/cart", cartRouter);
router.use("/products", productRouter);
router.get("/c", async (req, res) => {
    const a = await Cart.find();

    res.json({ a });
});
module.exports = router;
