const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review.js")

const listingSchema=new Schema({
    title :{type:String,
    required:true} ,
    description : String,
    //For image we'll use ternary operator so if user will input url then we'll use his url otherwise we set our default url for that data.
    image: {
        url: String,
        filename: String,
      },
    
    price: Number,
    location : String,
    country: String,
    reviews: [
      {
        type : Schema.Types.ObjectId, //All reviews to our perticular hotel and thier objectId will get stored in this array
        ref : "Review" //we will use review model as ref.
      }
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref : "User"
    },
    category: {
      type : String,
      enum : ["Rooms", "Hotels", "Beach", "Arctic", "Swimming Pool", "Camping", "Hill-Station", "Vineyards", "Lake", "National Parks",]
    }
});
//This post middleware will call after delete reviews will get called
listingSchema.post("findOneAndDelete",async(Listing)=>{
  if(Listing){
await review.deleteMany({_id:{ $in: Listing.reviews}})};//this will delete all corresponding reviews to that listing
});
const Listing = mongoose.model("Listing",listingSchema);
module.exports= Listing;




 