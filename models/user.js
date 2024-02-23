//Here we are going to make a schema for our user deatils.
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema= new Schema({
    email: {
        type: String,
        required: true,
    }
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",userSchema);