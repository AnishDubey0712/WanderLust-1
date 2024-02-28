const mongoose = require("mongoose");
const initData = require ("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL= "mongodb://127.0.0.1:27017/WanderLust";// this is for connecting with DB
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
initData.data=initData.data.map((obj)=>({...obj,owner:"65d9dced35c8d8913d2e019e"}));
//In upside code 1st we'll intialize data with data and then map it. So object will have its all property but new we'll add owner also with it
await Listing.insertMany(initData.data) // here initData is object in data.js and we'll access key data so we'll get data
console.log("zzzz")
};
initDB();