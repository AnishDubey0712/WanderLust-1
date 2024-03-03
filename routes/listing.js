//This page is router page and have all things about our listings
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");//for err handling and easy way to write try&catch
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");//required to pass as middleware in func.
const listingController = require("../controllers/listings.js");
const multer = require("multer"); //Multer is middleware npm package used to handle multipart/form-data
const upload = multer({dest: '/uploads'});//Multer will get data(file) & automatically make upload folder & save files
//But later we'll use 3rd party cloud service to upload these files
//Index route
router.get("/",wrapAsync(listingController.index));//this index is defined in controllers/listings.js
    
    //New Route (get req for new listings then it send post req from new.ejs  )
    router.get("/new",isLoggedIn,listingController.newForm)
    
    // Show Route
    router.get("/:id",wrapAsync(listingController.showListing));
    
    //Create Route (Post req for new listings)
    // router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createListing));
    router.post("/",upload.single('listing[image]'),(req,res)=>{
        res.send(req.file);
    })

    //Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing));

//Update Route
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));
// Delete Route 
router.delete("/:id",isLoggedIn,isOwner ,wrapAsync(listingController.deleteListing));


module.exports=router;