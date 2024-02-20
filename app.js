const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path")//setting up ejs
const methodOverride = require("method-override");//for converting post req into put for updation
const ejsMate = require("ejs-mate");//its used to keep things common in webpages
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js"); //required our listing.js in which er are using router
const reviews = require("./routes/review.js")
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

//For review Error handling
const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);//validating joi and checking all parameters
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

app.use("/Listings",listings)
app.use("/Listings/:id/reviews",reviews)


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