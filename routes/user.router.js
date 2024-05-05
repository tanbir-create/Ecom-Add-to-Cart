const router = require("express").Router();

const validate = require("../middlewares/validate");
const userValidation = require("../validations/user.validation");
const userController = require("../controllers/user.controller");

router.post("/signup", validate(userValidation.createUser), userController.signup);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

module.exports = router;
