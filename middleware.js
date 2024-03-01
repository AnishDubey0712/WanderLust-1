//This file will have middleware 
//isAuthenticated is an passport method by automatically we can check if user is logged in or not
//If user is logged in then only he can do changes or create new listings
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {ListingSchema,reviewSchema} = require("./schema.js");//both are required Listing & Review Schema

module.exports.isLoggedIn=(req,res,next)=>{
  //  console.log(req.path,"..",originalUrl)
    if(!req.isAuthenticated()){
    //Here if user is not logged in then we'll save his originalUrl & then save that url to locals 
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to create listing!");
        return res.redirect("/login")
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
if(req.session.redirectUrl){ //If url saved in session then we'll save it to locals cuz passport does not have access to delete locals
    res.locals.redirectUrl = req.session.redirectUrl;
};
next();
};
//Middleware for checking currUser is equal to owner or not
module.exports.isOwner = async(req,res,next)=>{
    let {id}= req.params;
    let listing = await Listing.findById(id);
    if(! listing.owner.equals(res.locals.currUser._id)){
        //if owner is not equal to current user then he cannot do updations in listings
        req.flash("error","You don't have access to update listing!");
        return res.redirect(`/Listings/${id}`);
    }
    next();
};
//Listing validation
 module.exports.validateListing = (req,res,next)=>{
    let {error} = ListingSchema.validate(req.body);//validating joi and checking all parameters
  if(error){
      throw new ExpressError(404,error);// express error will send new error according to what we have mentioned in our expresserror.js file
  }
  else{
      next(); // If there is no error detected then will call next function
  }
};
//Review validation.For review Error handling
module.exports. validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);//validating joi and checking all parameters
  if(error){
      throw new ExpressError(404,error);// express error will send new error according to what we have mentioned in our expresserror.js file
  }
  else{
      next(); // If there is no error detected then will call next function
  }
};
//Middleware for checking currUser is equal to Author of review or not
module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId}= req.params; //we'll check id & reviewId first
    let review = await Review.findById(reviewId); // then we'll find that id & search it in db
    if(! review.author.equals(res.locals.currUser._id)){
        //if author is not equal to current user then he cannot delete the listings
        req.flash("error","You are not author of this review!");
        return res.redirect(`/Listings/${id}`);
    }
    next();
};
