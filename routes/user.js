//This page will have routes for user singnup
const express = require("express");
const router = express.Router();
const User= require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport =  require("passport")

//SignUp Route
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
});

router.post("/signup",wrapAsync (async (req,res)=>{
    try{
     let {username,email,password}=req.body;//We'll get all details from user input body
const newUser =  new User({email,username}); // we'll make new user in db
const registerUser = await User.register(newUser,password); //By register method we'll reg it to db
req.flash("success","Welcome to WanderLust"+newUser.username);
res.redirect("/Listings")
}
catch(err){
req.flash("error",err.message);// we'll catch err and display err to user
res.redirect("/signup"); // and redirect to same page
}
}));

//Login Route
router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
});

//Post req route will check user details in db and match it 
//all this authentication work will do our passport middleware
//in this authenticate middleware 1st we pass our Stratergy so we've used local stratergy 
//And if login fails we'll redirect to login page again
router.post("/login",passport.authenticate("local",{failureRedirect: '/login',failureFlash: true}),
async (req,res)=>{
  
req.flash("success",`Welcome Back`);
res.redirect("/Listings");
})


module.exports=router;