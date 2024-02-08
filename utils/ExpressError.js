// This will handel express error
class ExpressError extends Error {
    //here there is class named expresserror which extends error class
    constructor(statusCode,message){
        //this class have its constructor and constructor will call its super constructor and our parameters
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}
module.exports = ExpressError;