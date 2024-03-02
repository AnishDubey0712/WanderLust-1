//This page is router page and have all things about our listings
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");//for err handling and easy way to write try&catch
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");//required to pass as middleware in func.


// validateListing, 
//this middleware ensures that the data received in the request body conforms to the expected structure and validation rules defined by the ListingSchema. 
//If there's an error, it halts further processing and sends an appropriate error response.
// Otherwise, it allows the request to proceed to the next middleware or route handler.
//Basically , one middleware for create and update api routes



//Index route
router.get("/",wrapAsync());
    
    //New Route (get req for new listings then it send post req from new.ejs  )
    router.get("/new",isLoggedIn,(req,res)=>{
        res.render("listings/new.ejs");
    })
    
    // Show Route
    router.get("/:id",wrapAsync(async (req,res)=>{
        let {id} = req.params; // here we got id now we find data by using id
        const listing = await Listing.findById(id)
        .populate({path : "reviews",populate:{path : "author",},})//Here is populate nesting for every review we'll populate its author
        .populate("owner");
        // here listing is object which is finding From Listing DB schema
       //To get data along with object id we use populate method and we'll get all reviews info and our owner 
       if(!listing){
        //This is if we search deleted listing again by its id then it will flash this message
        req.flash("error","Listing does not exist!");
        res.redirect("/Listings");
       }
    //    console.log(listing)
        res.render("listings/show.ejs",{listing});
    }));
    
    //Create Route (Post req for new listings)
    router.post("/",isLoggedIn,validateListing,wrapAsync(async(req,res,next)=>{
        //Here we've converted JS object to our new Listing and so it will add as new Listing into Db
         const newlisting =  new Listing (req.body.listing) ;
         console.log(req.user)
         newlisting.owner = req.user._id;
         await newlisting.save(); // here we'll save our newlisting data in db
        req.flash("success","New Listing Created!");
         res.redirect("/Listings");
    }));

    //Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync( async(req,res)=>{
    let {id} = req.params; // here we got id now we find data by using id
    const listing = await Listing.findById(id);
    // console.log("Listing Object:", listing);
// here listing is object which is finding From Listing DB schema
if(!listing){
    //This is if we search deleted listing again by its id then it will flash this message
    req.flash("error","Listing does not exist!");
    res.redirect("/Listings");
   }
res.render("listings/edit.ejs",{ listing });
//we'll get our id from req and then we'll find that particular listing by id and then pass it to edit.ejs
}));

//Update Route
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async (req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing}) 
    //req.body.listing is our JS object in which there are all parameters and we'll deconstruct it and we'll convert them into individual value and pass it in new updated value
    req.flash("success","Listing Updated!")
    res.redirect(`/Listings/${id}`);
}));
// Delete Route 
router.delete("/:id",isLoggedIn,isOwner ,wrapAsync(async (req,res)=>{
    let {id}= req.params;
    let dltListing = await Listing.findByIdAndDelete(id);//We will first find our listing by id and then delete it.
    req.flash("success"," Listing Deleted!")
    res.redirect("/Listings");
}));


module.exports=router;