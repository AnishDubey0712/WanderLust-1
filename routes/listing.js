//This page is router page and have all things about our listings
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");//for err handling and easy way to write try&catch
const ExpressError = require("../utils/ExpressError.js");
const {ListingSchema} = require("../schema.js");//both are required Listing & Review Schema
const Listing = require("../models/listing.js");


// validateListing, 
//this middleware ensures that the data received in the request body conforms to the expected structure and validation rules defined by the ListingSchema. 
//If there's an error, it halts further processing and sends an appropriate error response.
// Otherwise, it allows the request to proceed to the next middleware or route handler.
//Basically , one middleware for create and update api routes

const validateListing = (req,res,next)=>{
    let {error} = ListingSchema.validate(req.body);//validating joi and checking all parameters
  if(error){
      throw new ExpressError(404,error);// express error will send new error according to what we have mentioned in our expresserror.js file
  }
  else{
      next(); // If there is no error detected then will call next function
  }
}


//Index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
       res.render("listings/index.ejs",{allListings})
    }));
    
    //New Route (get req for new listings then it send post req from new.ejs  )
    router.get("/new",(req,res)=>{
        res.render("listings/new.ejs");
    })
    
    // Show Route
    router.get("/:id",wrapAsync(async (req,res)=>{
        let {id} = req.params; // here we got id now we find data by using id
        const listing = await Listing.findById(id).populate("reviews");// here listing is object which is finding From Listing DB schema
       //To get data along with object id we use populate method
        res.render("listings/show.ejs",{listing});
    }));
    
    //Create Route (Post req for new listings)
    router.post("/",validateListing,wrapAsync(async(req,res,next)=>{
        //Here we've converted JS object to our new Listing and so it will add as new Listing into Db
         const newlisting =  new Listing (req.body.listing) ;
         await newlisting.save(); // here we'll save our newlisting data in db
        
         res.redirect("/Listings");
    }));

    //Edit Route
router.get("/:id/edit",wrapAsync( async(req,res)=>{
    let {id} = req.params; // here we got id now we find data by using id
    const listing = await Listing.findById(id);
    console.log("Listing Object:", listing);
// here listing is object which is finding From Listing DB schema
res.render("listings/edit.ejs",{ listing });
//we'll get our id from req and then we'll find that particular listing by id and then pass it to edit.ejs
}));

//Update Route
router.put("/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing}) //req.body.listing is our JS object in which there are all parameters and we'll deconstruct it and we'll convert them into individual value and pass it in new updated value
  res.redirect("/Listings");
}));
// Delete Route 
router.delete("/:id", wrapAsync(async (req,res)=>{
    let {id}= req.params;
    let dltListing = await Listing.findByIdAndDelete(id);//We will first find our listing by id and then delete it.
 res.redirect("/Listings");
}));


module.exports=router;