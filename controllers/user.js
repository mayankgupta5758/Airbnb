const User = require("../models/user");

module.exports.signUpGet = (req, res) => {
    res.render('users/signup.ejs');
};

module.exports.signUpPost = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const regUser = await User.register(newUser, password);
        console.log(regUser);
        req.login(regUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome To Wanderlust!")
            res.redirect("/listings");
        })
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
};

module.exports.loginGet = (req, res) => {
    res.render('users/login.ejs');
};

module.exports.loginPost = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redrictURL || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logout Successfully!");
        res.redirect("/listings");
    })
};