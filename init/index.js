const mongoose = require("mongoose");
const initData = require ("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL= "mongodb://127.0.0.1:27017/WanderLust1";// this is for connecting with DB
main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
};

const initDB = async ()=>{
await Listing.deleteMany({});//  first we'll delete current data 
await Listing.insertMany(initData.data) // here initData is object in data.js and we'll access key data so we'll get data
};
initDB();