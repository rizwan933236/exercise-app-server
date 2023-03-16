const  mongoose  = require("mongoose");

const User = new mongoose.Schema({
    name:{
        type:String,
        trim:true,  
        required:true
    },
    email:{
        type:String,
        trim:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    exercises:[
        {
            type:mongoose.Types.ObjectId,
            ref:"Excercise"
        }
    ]
    

})

module.exports = mongoose.model("User",User)