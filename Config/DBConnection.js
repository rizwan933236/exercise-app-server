const mongoose = require("mongoose");
const Url = "mongodb+srv://rizwan933236:rizwan123@cluster0.dwss0hn.mongodb.net/exerciseapp?retryWrites=true&w=majority"

function connection(){
    
    mongoose.connect(Url)
    .then(()=>{
        console.log("DB Connected")
    })
    .catch(()=>{
        console.log("DB Connection Failed")
    })

}


module.exports = connection