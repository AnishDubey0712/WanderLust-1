module.exports.index= async (req,res)=>{
    const allListings = await Listing.find({});
      return res.render("listings/index.ejs",{allListings})
    };//index function is an async function which will render our listings