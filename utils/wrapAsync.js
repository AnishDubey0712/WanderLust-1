module.exports=(fn)=>{ //fn = function and this function will return another function in which it will
    //contain req,res,next
    return(req,res,next)=>{
        fn(req,res,next).catch(next); //if err occurs then we will call next by catch block
    }
}
//WrapAsync is the better way to write try and catch block