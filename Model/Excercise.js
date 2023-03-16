const  mongoose  = require("mongoose");

const Excercise = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    des:{
        type:String,
    },
    type:{
        type:String,
        enum:["Running","Walking","Swiming","Hiking","Cycling"],
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    }

})

module.exports = mongoose.model("Excercise",Excercise)