//This page will have routes for user singnup
const express = require("express");
const router = express.Router();
const User= require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport =  require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userController = require("../controllers/users.js");

//SignUp Route
router.get("/signup",userController.renderSignUp);
//Post signup Route
router.post("/signup",wrapAsync (userController.signUP));
//Login Route
router.get("/login",userController.renderLogin);
//Login Post route
router.post("/login",saveRedirectUrl,
passport.authenticate("local",{failureRedirect: '/login',failureFlash: true}),
userController.Login);
//Logout
router.get("/logout",userController.Logout)
//Router
module.exports=router;