const Listing = require("../models/listing.js");

//index function is an async function which will render our listings
module.exports.index= async (req,res)=>{
    const allListings = await Listing.find({});
      return res.render("listings/index.ejs",{allListings})
    };
    //new Route
    module.exports.newForm = (req,res)=>{
        res.render("listings/new.ejs");
    };

    //show Route
    module.exports.showListing = async (req,res)=>{
        let {id} = req.params; // here we got id now we find data by using id
        const listing = await Listing.findById(id)
        .populate({path : "reviews",populate:{path : "author",},})//Here is populate nesting for every review we'll populate its author
        .populate("owner");
        // here listing is object which is finding From Listing DB schema
       //To get data along with object id we use populate method and we'll get all reviews info and our owner 
       if(!listing){
        //This is if we search deleted listing again by its id then it will flash this message
        req.flash("error","Listing does not exist!");
        res.redirect("/Listings");
       }
        res.render("listings/show.ejs",{listing});
    };

    //Create Route
    module.exports.createListing = async(req,res,next)=>{
        let url = req.file.path;//we'll take file path from req to pass in db and to cloudinary
        let filename = req.path.filename;//And filename
      
        //Here we've converted JS object to our new Listing and so it will add as new Listing into Db
         const newlisting =  new Listing (req.body.listing) ;
         newlisting.owner = req.user._id;
         newlisting.image = {url,filename}; //We'll add url & filename in newListing
         newlisting.category = req.body.listing.category;
         await newlisting.save(); // here we'll save our newlisting data in db
        req.flash("success","New Listing Created!");
         res.redirect("/Listings");
    };

    //Edit Route
    module.exports.editListing = async(req,res)=>{
        let {id} = req.params; // here we got id now we find data by using id
        const listing = await Listing.findById(id);
        // console.log("Listing Object:", listing);
    // here listing is object which is finding From Listing DB schema
    if(!listing){
        //This is if we search deleted listing again by its id then it will flash this message
        req.flash("error","Listing does not exist!");
        res.redirect("/Listings");
       }
       let originalImageUrl = listing.image.url;
     originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250"); //We are replacing details
       //in our url after /upload we are replacing h_300,w_250 this are parameters from cloudinary Image transform   
    res.render("listings/edit.ejs",{ listing , originalImageUrl });
    //we'll get our id from req and then we'll find that particular listing by id and then pass it to edit.ejs
    };

   

    //Update Route
    module.exports.updateListing = async (req,res)=>{
        let {id}= req.params;
        let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing}) 
        //req.body.listing is our JS object in which there are all parameters and we'll deconstruct it and we'll convert them into individual value and pass it in new updated value
        if(typeof req.file !== "undefined"){
        let url = req.file.path;//we'll take file path from req to pass in db and to cloudinary
        let filename = req.path.filename;//And filename
        listing.image = { url , filename }; //We'll save url & filename in listing. This will complete new url&filename
        await listing.save();
    }
        //here if condition is for if someone does not done any updation in listing 
        //then no file will be passed towards backend and  our url path will be empty
        //so to encounter that prob we will put code in if statement that if file exist in req  
        //if file is not uploaded by user then we will get undefined to check undefined parameter in js
        //we use typeof operator in js. So, if req.file matches with undefined then we will not save updations
        req.flash("success","Listing Updated!")
        res.redirect(`/Listings/${id}`);
    };

    //Delete Route
    module.exports.deleteListing = async (req,res)=>{
        let {id}= req.params;
        let dltListing = await Listing.findByIdAndDelete(id);//We will first find our listing by id and then delete it.
        req.flash("success"," Listing Deleted!")
        res.redirect("/Listings");
    }