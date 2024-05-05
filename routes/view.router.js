const express = require("express");
const viewController = require("../controllers/views.controller");
const userController = require("../controllers/user.controller");

const router = express.Router();

router.get("/", userController.isLoggedIn, viewController.getOverview);

router.get("/login", userController.isLoggedIn, viewController.getLoginForm);
router.get("/signup", userController.isLoggedIn, viewController.getSignUpForm);
router.get("/cart", userController.isLoggedIn, viewController.getCartPage);
router.get("/checkout", userController.isLoggedIn, viewController.getCheckoutPage);

module.exports = router;
