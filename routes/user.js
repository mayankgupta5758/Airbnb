const express = require("express")
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRegisterUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");


router
    .route("/signup")
    .get(userController.signUpGet)
    .post(wrapAsync(userController.signUpPost));

router
    .route("/login")
    .get(userController.loginGet)
    .post(saveRegisterUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), userController.loginPost);

router.get("/logout", userController.logout);


module.exports = router;