const Review = require("../models/review");
const Listing = require("../models/listing.js");

//Create review
module.exports.createReview = async(req,res)=>{
    //Here both are used validateReview for review err handling and wrapAsync for basic err handling
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);// we take review from req body and add it as new review in schema model
    newReview.author = req.user._id;//If user is logged in then he will be our author and then we'll push author in review 
    listing.reviews.push(newReview); // ad we will push that into our reviews model
    await newReview.save();//we will save it to our db
    await listing.save(); 
    req.flash("success","New Review Added!")
    res.redirect(`/Listings/${listing._id}`);
}

//Delete review
module.exports.deleteReview = async(req,res)=>{
    let{id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews : reviewId}});
    //we've used pull operator of Mongodb.So, we've passed our id then from reviews array any id get matched with our passed id we'll pull it and remove it.
    await Review.findByIdAndDelete(reviewId);//by pulling our reviewId here we'll delete it
    req.flash("success","Review Deleted!")
    res.redirect(`/Listings/${id}`);
 }