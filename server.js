const express = require("express")
const cors = require("cors")
const JWT = require("jsonwebtoken")
const Connection = require("./Config/DBConnection")
const User = require("./Model/User")
const Excercise = require("./Model/Excercise")

Connection()
const SKey = "ThisisSecreatekey"

const app = express()
app.use(express.json())
app.use(cors({origin:"*"}))

//Middle for token 
app.use("/excercise",(req,res,next)=>{
    const token =req.headers.authorization
    if(token==null){
        res.status(401).send("Access denied")
    }
    else{
        JWT.verify(token,SKey,(err,data)=>{
            if(err){
                res.status(401).send("Not verified")
            }
            else{
                req.data = data
                next()
            }

        })

    }

})

//for User Resgistration 
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    console.log(req.body)
    try {
      const user = await User.findOne({ email });
     console.log("user")
     console.log(user)
      if (user) {
        // User is already registered
        res.status(409).send({ message: "User already registered" });
      } else {
        // Create a new user
        const result = await User.create({ name, email, password });
      
        res.status(200).send({
          message: "Register Successful",
          User: result,
        });
      }
    } catch (err) {
      res.status(500).send({ message: "Server error" });
    }
  });
  

//fro User Login
app.post("/login",async (req,res)=>{
    const {email,password} = req.body
    console.log(req.body)

    const result  = await User.findOne({email:email,password:password})

    if(result==null){
        res.status(400).send("Invalid Credentials")
    }
    else{
        const Token = JWT.sign({id:result["_id"]},SKey)
        res.send({Token:Token})
    }
})

// for adding excercise 
app.post("/excercise/addexcercise",async (req,res)=>{ 
    const UserId  = req.data.id
    const {title,des,type,duration} = req.body
    try{
        const result = await Excercise.create({title,des,type,duration})
        await User.findByIdAndUpdate(UserId,{$push:{exercises: result["_id"]}})

        res.send({
            message:"Excercise Added"
        })

    }
    catch(err){
        res.status(400).send({
            message:"Excercise Not Added",
            Error:err.message
        })
    }
})


//for Showing excercise data
app.get("/excercise/getexcercise",async (req,res)=>{
    const UserId = req.data.id
    const result = await User.findById(UserId).populate("exercises")

    res.send({exercises:result.exercises})
})



//for Showing excercise data
app.get("/excercise/getexcercise/:id",async (req,res)=>{
  const exid = req.params.id
  const result = await Excercise.findById(exid)
  res.send({exercise:result})
})


//for editing existing excercise data
app.put("/excercise/editExcercise/:id",async(req,res)=>{
 
  try {
    // console.log("this is id  :"+id)
    const exercise = await Excercise.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
   
    if (!exercise) {
      return res.status(404).json({ success: false, message: 'Exercise not found' });
    }
    res.json({ success: true, data: exercise });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
})


//for deleting excwrcise data
app.delete("/excercise/deleteExcercise/:id",async(req,res)=>{
    try {
       
        const exercise = await Excercise.findByIdAndDelete(req.params.id);
        if (!exercise) {
          return res.status(404).json({ success: false, message: 'Exercise not found' });
        }
        res.json({ success: true, message: 'Exercise deleted successfully' });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
})

// app.delete("/excercise/:exName",(req,res)=>{})

app.listen(5000)