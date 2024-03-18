//Cloudinary page where all info regarding cloudinary is there.
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});
//This storage will show where to store all info
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'WANDERLUST_DEV',//name of folder
      allowedformat: ["png","jpeg","jpg"],//Formats of files stored
      //public_id: (req, file) => 'computed-filename-using-request',
    },
  });

  module.exports={cloudinary,storage}