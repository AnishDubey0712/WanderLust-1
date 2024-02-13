const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path")//setting up ejs
const methodOverride = require("method-override");//for converting post req into put for updation
const ejsMate = require("ejs-mate");//its used to keep things common in webpages
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {ListingSchema} = require("./schema.js")

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views")); // for ejs
app.use(express.urlencoded({extended:true}));// for Data parsing
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));





app.listen(8080,()=>{
    console.log("App is Listening");
});

const MONGO_URL= "mongodb://127.0.0.1:27017/WanderLust";// this is for connecting with DB
main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
};
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

// Define a route handler for the root URL
app.get("/", (req, res) => {
    // Redirect to the Listings page or any other page you want
    res.redirect("/Listings");
});


//Index route
app.get("/Listings",wrapAsync(async (req,res)=>{
const allListings = await Listing.find({});
   res.render("listings/index.ejs",{allListings})
}));

//New Route (get req for new listings then it send post req from new.ejs  )
app.get("/Listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

// Show Route
app.get("/Listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params; // here we got id now we find data by using id
    const listing = await Listing.findById(id);// here listing is object which is finding From Listing DB schema
    res.render("listings/show.ejs",{listing});
}));

//Create Route (Post req for new listings)
app.post("/Listings",validateListing,wrapAsync(async(req,res,next)=>{
    //Here we've converted JS object to our new Listing and so it will add as new Listing into Db
     const newlisting =  new Listing (req.body.listing) ;
     await newlisting.save(); // here we'll save our newlisting data in db
    
     res.redirect("/Listings");
}));

//Edit Route
app.get("/Listings/:id/edit",wrapAsync( async(req,res)=>{
    let {id} = req.params; // here we got id now we find data by using id
    const listing = await Listing.findById(id);
    console.log("Listing Object:", listing);
// here listing is object which is finding From Listing DB schema
res.render("listings/edit.ejs",{ listing });
//we'll get our id from req and then we'll find that particular listing by id and then pass it to edit.ejs
}));

//Update Route
app.put("/Listings/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing}) //req.body.listing is our JS object in which there are all parameters and we'll deconstruct it and we'll convert them into individual value and pass it in new updated value
  res.redirect("/Listings");
}));
// Delete Route
app.delete("/Listings/:id", wrapAsync(async (req,res)=>{
    let {id}= req.params;
    let dltListing = await Listing.findByIdAndDelete(id)
 res.redirect("/Listings");
}));

//We've added wrapSync func to all req so if some error occurs we'll handle it and our server won't get crash
//Errors
app.all("*",(req,res,next)=>{
//This route is for page not found err if someone send req to wrong page or path it will show page not found
//here * means all route when user req will not match with any of our page then his req will come here.
next(new ExpressError(404,"Page not found!"));
});

app.use((err,req,res,next)=>{
//we've set default statusCode & message if err does not have its own status code then it will send default msg & statuscode
let {statusCode=500,message="Something went wrong!"} = err;//Here we'll deconstruct our code to err
 res.status(statusCode).render("error.ejs",{message})
//then we'll set our status to statuscode and send our message
// res.status(statusCode).send(message);
//To handle error
//here we'll catch expressError and after deconstruct we'll send it to statuscode and message 
});