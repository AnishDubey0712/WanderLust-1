//These file will contain our npm package named joi which used for validations for our schema
//We cannot mention every parameters of listing and make new err for that so we'll use joi which will handle that
//Joi = The most powerful schema description language and data validator for JavaScript.

const Joi = require("joi");//means we should object in joi and object name will be listing

module.exports.ListingSchema = Joi.object({
listing: Joi.object({
    title: Joi.string().required(),
   description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow("",null),
}).required(), //According to joi this object should be required means at every req in that there should be listing object
}); 