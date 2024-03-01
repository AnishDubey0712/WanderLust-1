//This page is rpouter page and have all things about our Reviews
const express = require("express");
const router = express.Router({mergeParams : true});//for merging parameter from parent to this so we will get proper id for anything
const wrapAsync = require("../utils/wrapAsync.js");//for err handling and easy way to write try&catch
const ExpressError = require("../utils/ExpressError.js");
const {validateReview, isLoggedIn, isReviewAuthor} =  require("../middleware.js")
const Review = require("../models/review");
const Listing = require("../models/listing.js");



//Reviews Route(Post route)
router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
    //Here both are used validateReview for review err handling and wrapAsync for basic err handling
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);// we take review from req body and add it as new review in schema model
    newReview.author = req.user._id;//If user is logged in then he will be our author and then we'll push author in review 
    listing.reviews.push(newReview); // ad we will push that into our reviews model
    await newReview.save();//we will save it to our db
    await listing.save(); 
    req.flash("success","New Review Added!")
    res.redirect(`/Listings/${listing._id}`);
}));

//Delete Reviews Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
   let{id , reviewId} = req.params;
   await Listing.findByIdAndUpdate(id,{$pull: {reviews : reviewId}});
   //we've used pull operator of Mongodb.So, we've passed our id then from reviews array any id get matched with our passed id we'll pull it and remove it.
   await Review.findByIdAndDelete(reviewId);//by pulling our reviewId here we'll delete it
   req.flash("success","Review Deleted!")
   res.redirect(`/Listings/${id}`);
}));

module.exports=router;