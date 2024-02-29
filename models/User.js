const mongoose = require("mongoose")
const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        require: true,
        min: 3,
        max: 20, 
        unique: true
    },
    email: {
        type: String,
        require: true,
        max: 50,
        unique: true
    },
   
    profilePicture: {
        type: String,
        default: ""
    },
   
    birthday:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        
    },
   
  mobile :{
        type:Number,   
    },
    password:{
        type:String,
        required:true
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    description: {
        type: String,
        max: 50
    },
    location: {
        type: String,
        max: 50
    },
 followers:{
    type:Array,
    default:[]
 },
 following:{
    type:Array,
    default:[]
 },
},
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema)