const express = require("express");
const viewController = require("../controllers/views.controller");
const userController = require("../controllers/user.controller");
// const bookingController = require("../controllers/bookingController");

const router = express.Router();

// router.use(authController.isLoggedIn);

router.get("/", userController.isLoggedIn, viewController.getOverview);
// router.get("/tour/:slug", authController.isLoggedIn, viewController.getTour);
router.get("/login", userController.isLoggedIn, viewController.getLoginForm);
router.get("/signup", userController.isLoggedIn, viewController.getSignUpForm);
router.get("/cart", userController.isLoggedIn, viewController.getCartPage);
router.get("/checkout", userController.isLoggedIn, viewController.getCheckoutPage);
// router.get("/me", authController.protect, viewController.getAccount);
// router.get("/my-tours", authController.protect, viewController.getMyTours);

// router.post("/submit-user-data", viewController.updateUserData);

module.exports = router;
