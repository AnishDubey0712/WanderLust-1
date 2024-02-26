//This file will have middleware 
//isAuthenticated is an passport method by automatically we can check if user is logged in or not
//If user is logged in then only he can do changes or create new listings
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You must be logged in to create listing!");
        res.redirect("/login")
    }
    next()
}