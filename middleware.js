//This file will have middleware 
//isAuthenticated is an passport method by automatically we can check if user is logged in or not
//If user is logged in then only he can do changes or create new listings
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
    //Here if user is not logged in then we'll save his originalUrl & then save that url to locals 
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to create listing!");
        res.redirect("/login")
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
if(req.session.redirectUrl){ //If url saved in session then we'll save it to locals cuz passport does not have access to delete locals
    res.locals.redirectUrl = req.session.redirectUrl;
};
next();
}