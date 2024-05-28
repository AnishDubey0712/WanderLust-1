const User = require("../models/user.js");

module.exports.renderSignUp = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signUP = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        
        req.login(registerUser, (err) => {
            if (err) {
                return next(err); // Properly pass the error to the next middleware
            }
            req.flash("success", "Welcome to WanderLust");
            const redirectUrl = res.locals.redirectUrl || "/Listings"; // Fallback URL
            res.redirect(redirectUrl);
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.Login = async (req, res) => {
    const clientName = req.user.username;
    req.flash("success", `Welcome Back ${clientName}`);
    let redirectUrl = res.locals.redirectUrl || "/Listings";
    res.redirect(redirectUrl);
};

module.exports.Logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are successfully logged out!");
        res.redirect("/Listings");
    });
};
