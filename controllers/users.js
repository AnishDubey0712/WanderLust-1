const User= require("../models/user.js");

//Render SignUp Route
module.exports.renderSignUp = (req,res)=>{
    res.render("users/signup.ejs")
}

//SignUp Route
module.exports.signUP = async (req,res)=>{
    try{
     let {username,email,password}=req.body;//We'll get all details from user input body
const newUser =  new User({email,username}); // we'll make new user in db
const registerUser = await User.register(newUser,password); //By register method we'll reg it to db
//req.login is passport method which automatically login user after signup 
req.login(registerUser,(err)=>{
    if(err){
        next(err);
    }
    req.flash("success","Welcome to WanderLust");
res.redirect(res.locals.redirectUrl);
})
}
catch(err){
req.flash("error",err.message);// we'll catch err and display err to user
res.redirect("/signup"); // and redirect to same page
}
};

//Render Login Route
module.exports.renderLogin = (req,res)=>{
    res.render("users/login.ejs");
};

//Post req route will check user details in db and match it 
//all this authentication work will do our passport middleware
//in this authenticate middleware 1st we pass our Stratergy so we've used local stratergy 
//And if login fails we'll redirect to login page again

//Login Route
module.exports.Login = async (req,res)=>{
    const clientName = req.user.username; // By this we'll get username from req and then we can pass it with flash

    req.flash("success",`Welcome Back ${clientName}`);
    let redirectUrl = res.locals.redirectUrl || "/Listings";
//If redirectUrl is saved url path then we'll use it otherwise if redirectUrl is undefined then we'll redirect to listings page
res.redirect(redirectUrl);//req.session
};

//Logout Route
module.exports.Logout = (req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
    }
    req.flash("success","You are successfully logged out!");
    res.redirect("/Listings");
});
};

