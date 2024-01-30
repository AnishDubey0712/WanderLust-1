const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path")//setting up ejs
const methodOverride = require("method-override");//for converting post req into put for updation
const ejsMate = require("ejs-mate");//its used to keep things common in webpages

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

//Index route
app.get("/Listings",async (req,res)=>{
const allListings = await Listing.find({});
   res.render("listings/index.ejs",{allListings})
});

//New Route (get req for new listings then it send post req from new.ejs  )
app.get("/Listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

// Show Route
app.get("/Listings/:id",async (req,res)=>{
    let {id} = req.params; // here we got id now we find data by using id
    const listing = await Listing.findById(id);// here listing is object which is finding From Listing DB schema
    res.render("listings/show.ejs",{listing});
});

//Create Route (Post req for new listings)
app.post("/Listings",async(req,res)=>{
    //Here we've converted JS object to our new Listing and so it will add as new Listing into Db
     let newlisting =  new Listing (req.body.listing) ;
     await newlisting.save(); // here we'll save our newlisting data in db
     res.redirect("/Listings");
});

//Edit Route
app.get("/Listings/:id/edit", async(req,res)=>{
    let {id} = req.params; // here we got id now we find data by using id
    const listing = await Listing.findById(id);// here listing is object which is finding From Listing DB schema
res.render("listings/edit.ejs",{listing});
//we'll get our id from req and then we'll find that particular listing by id and then pass it to edit.ejs
});

//Update Route
app.put("/Listings/:id",async (req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing}) //req.body.listing is our JS object in which there are all parameters and we'll deconstruct it and we'll convert them into individual value and pass it in new updated value
  res.redirect("/Listings");
});
// Delete Route
app.delete("/Listings/:id", async (req,res)=>{
    let {id}= req.params;
    let dltListing = await Listing.findByIdAndDelete(id)
 res.redirect("/Listings");
})