const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path")//setting up ejs

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views")); // for ejs


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

app.get("/Listings",async (req,res)=>{
const allListings = await Listing.find({});
   res.render("listings/index.ejs",{allListings})
});
