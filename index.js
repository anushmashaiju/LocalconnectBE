const express = require("express");
const app = express();
const mongoose= require ("mongoose");
const dotenv= require("dotenv");
const jwt = require ('jsonwebtoken')
const cookieParser = require ('cookie-parser')
const cors = require('cors');
const multer =require("multer")
const path = require("path")

const userRoute = require("./Routes/users");
const authRoute = require("./Routes/auth");
const postRoute = require("./Routes/posts");
const eventRoute = require('./Routes/events'); 


app.use(cors({
    origin:["http://localhost:3000"],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}));
app.use(cookieParser())
dotenv.config();

mongoose.connect('mongodb://127.0.0.1:27017/Localconnectapp');
console.log("connected to MongoDB")  //this will disable when connected to atlas

//mongoose.connect(process.env.MONGO_URL,{useNewParser:true},()=>{
    //console.log("connected to MongoDB")
//});       atlas connection
const verifyUser = (req,res,next)=>{
    const token= req.cookies.token;
    console.log(token);  
    if (!token){
        return res.json ("token not available")
    }else{
        jwt.verify(token,"localconnectsecretkey",(err,decoded )=>{
            if (err) return res.json ("wrong token")
            req.user=decoded;
            next();
        })
    }
    }
app.get('/home',verifyUser,(req,res)=>{
//return res.json ("success")
return res.status(200).json({ success: true, message: "Authentication successful", user: req.user });
})


app.use("/postImages",express.static(path.join(__dirname,"public/postImages")));

//MIDDLEWARE
app.use (express.json());
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
app.use('/api/events', eventRoute);
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
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });
  
  //here i given set interval to delete the events which are outdated to do that i had given a router and this set interval nothing i changed in my rightbar.jsx
  setInterval(async () => {
    try {
      const result = await Event.deleteMany({ date: { $lt: new Date() } });
      console.log(`Deleted ${result.deletedCount} outdated events.`);
    } catch (error) {
      console.error('Error deleting outdated events:', error);
    }
  }, 24 * 60 * 60 * 1000); // Run every 24 hours