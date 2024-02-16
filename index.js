const express = require("express");
const app = express();
const mongoose= require ("mongoose");
const dotenv= require("dotenv");
const helmet = require ("helmet");
const morgan = require ("morgan");

const userRoute = require("./Routes/users");
const authRoute = require("./Routes/auth");
const postRoute = require("./Routes/posts");
const cors = require('cors');
const multer =require("multer")
const path = require("path")

app.use(cors());
dotenv.config();

mongoose.connect('mongodb://127.0.0.1:27017/Localconnectapp');
console.log("connected to MongoDB")  //this will disable when connected to atlas

//mongoose.connect(process.env.MONGO_URL,{useNewParser:true},()=>{
    //console.log("connected to MongoDB")
//});       atlas connection

app.use("/postImages",express.static(path.join(__dirname,"public/postImages")));

//MIDDLEWARE
app.use (express.json());
app.use(helmet());
app.use(morgan("common"));

const storage =multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"public/postImages/")
    },//uploaded file will store here
    filename:(req,file,cb)=>{
        cb(null,Date.now() + '-' + file.originalname);;//passed name from share.jsx
    },
});
const upload =multer({storage});
app.post("/api/upload",upload.single("file"),(req,res)=>{
    try{
return res.status(200).json({message:"file uploaded successfully",fileName:req.file.filename})
    }catch(err){
        console.log(err)
    }
})
/*app.get("/",(req,res)=>{
    res.send("welcome to homepage")
})
app.get("/users",(req,res)=>{
    res.send("welcome to user page")
})*/    //use when there is no routers

app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/posts",postRoute);
/*app.listen(8800,()=>{
    console.log("Backend server is running")
})*/
// ... other middleware and routes ...

// Start the server
const PORT = 8800;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// rqkaZwHdQhjC2pE4
// mongodb+srv://anushma2015:rqkaZwHdQhjC2pE4@cluster0.pzh0ozz.mongodb.net/
