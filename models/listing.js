const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema=new Schema({
    title :{type:String,
    required:true} ,
    description : String,
    //For image we'll use ternary operator so if user will input url then we'll use his url otherwise we set our default url for that data.
    image :{filename:String,
        url:{type:String,
        default : "https://images.unsplash.com/photo-1446483050676-bd2fdf3ac2d6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    set:(v)=>v===""?
    "https://images.unsplash.com/photo-1446483050676-bd2fdf3ac2d6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,} ,},
    price: Number,
    location : String,
    country: String,
});
const Listing = mongoose.model("Listing",listingSchema);
module.exports= Listing;