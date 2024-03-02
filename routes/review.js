//This page is rpouter page and have all things about our Reviews
const express = require("express");
const router = express.Router({mergeParams : true});//for merging parameter from parent to this so we will get proper id for anything
const wrapAsync = require("../utils/wrapAsync.js");//for err handling and easy way to write try&catch
const ExpressError = require("../utils/ExpressError.js");
const {validateReview, isLoggedIn, isReviewAuthor} =  require("../middleware.js")
const Review = require("../models/review");
const Listing = require("../models/listing.js");
const reviewController = require("../controllers/reviews.js")



//Reviews Route(Post route)
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//Delete Reviews Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports=router;