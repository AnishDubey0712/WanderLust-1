if(process.env.NODE_ENV !="production"){
    require('dotenv').config();//.env required
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path")//setting up ejs
const methodOverride = require("method-override");//for converting post req into put for updation
const ejsMate = require("ejs-mate");//its used to keep things common in webpages
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./routes/listing.js"); //required our listing.js in which er are using router
const reviewsRouter = require("./routes/review.js");
const userRouter= require("./routes/user.js");//User Login & singnup route
const session = require("express-session");//To make session_id for client
const flash = require("connect-flash");//To flash messages
//User authentication
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/user.js");
const Listing = require("./models/listing.js");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views")); // for ejs
app.use(express.urlencoded({extended:true}));// for Data parsing
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



const sessionOptions = {
    secret : "mysupersecretcode",
    resave : false,
    saveUninitialized : true,
    cookie: {
        expires : Date.now()+7*24*60*60*1000,
        maxAge : 7*24*60*60*1000 ,
        httpOnly: true,
    },
};


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
// app.get("/", (req, res) => {
//     // Redirect to the Listings page or any other page you want
//     res.redirect("/Listings");
// });
//We have to use both flash and session before our api routes
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());//To initialize package and this is already on npm(passport)we can refer from there
app.use(passport.session());//Session is used to know our web that same user is going from 1 webpage to another
passport.use(new LocalStratergy(User.authenticate()));//In this all users will be authenticated through LocalStratergy and to autheticate them we've used this authenticate method() made by mongoose
// use static serialize and deserialize of model for passport session support & code used from npm pass-local-mongoose
passport.serializeUser(User.serializeUser());//serialize used to store info regarding user
passport.deserializeUser(User.deserializeUser());//deserialize used to delete info regarding user

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");//Whenever we get success message then we'll call next
    //And we're gonna use this success variable in our index.ejs cuz its redirecting to listings
    res.locals.error=req.flash("error")
    res.locals.currUser = req.user; // this will store user details in currUser and we will access it in our navbar for login and logout
    next();
});
app.use("/Listings",listingsRouter)
app.use("/Listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

//This route is for our icons category provided on navbar
app.get("/category/:category", async (req, res, next) => {
    const category = req.params.category;
    try {
        const listings = await Listing.find({ category: category });
        res.render("listings/category.ejs", { category: category, listings: listings });
    } catch (error) {
        console.error("Error rendering category.ejs:", error);
        next(error); // Forward the error to the error handling middleware
    }
    // Rest of your route handler code
});
//This route will take req for search bar.
//We take searchTerm which is name of search bar which will pass user search params and we'll put in Term here
//And by DB.find we'll find it and use or & regex operator for finding(matching) with listing schema params.
//Then we'll pass it to ejs file in which user will get thier searched listings. 
app.get("/search",async(req,res)=>{
    try {
        const Term = req.query.searchTerm; // Assuming the search term is passed as a query parameter named 'term'

        // Perform a case-insensitive search for listings containing the search term
        const listings = await Listing.find({
            $or: [
                { title: { $regex: Term, $options: 'i' } },
              //  { description: { $regex: Term, $options: 'i' } },
                { location: { $regex: Term, $options: 'i' } },
                { country: { $regex: Term, $options: 'i' } }
            ]
        });

        // Render an EJS template with the search results
        res.render("listings/search.ejs", { listings, Term });
    } catch (err) {
        console.error('Error searching for listings:', err);
        res.status(500).send('Internal Server Error');
    }
})


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