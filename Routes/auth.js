const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt= require ('jsonwebtoken')
//SIGN UP

router.post("/SignUp", async (req, res) => {
   
try{
    //generate password
    const salt =await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(req.body.password,salt);

    //create new user
    const newUser = new User({
        userName:req.body.username,
        email:req.body.email,
        birthday:req.body.birthday,
        mobile: req.body.mobile,
        location:req.body.location, 
         password:hashedPassword,
 });
const user = await newUser.save();
res.status(200).json(user);
} catch (err) {
console.error("Error during user registration:", err);
res.status(500).json({ error: "Internal Server Error" });
}
});

//LOGIN

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            const response = await bcrypt.compare(password, user.password);
            if (response) {
                const token = jwt.sign({email:user.email},"localconnectsecretkey",{expiresIn:"1d"})
                res.cookie("token",token);
                //res.json("success");
                res.status(200).json({ success: true, message: 'Login successful', token ,_id:user._id,userName:user.userName});
            } else {
                res.json("incorrect password");
            }
        } else {
            res.json("no record existed");
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


//now going to use postman:request for the application

/*   router.get("/register", async (req, res) => {
    const user = await new User({
        username: "lakshmi",
        email: "lakshmi@gmail.com",
        password: "12345"
    })
    await user.save();
    res.send("ok")
});           THIS IS THE GET METHOD WHILE THIS WE CAN DIRECTLY SAVE THE DATA TO MONGODB COMPASS
*/


//LOGIN
/*router.post("/login",async(req,res)=>{
    try{
const user =await User.findOne({email:req.body.email});
!user && res.status(404).send ("user not found");

const validPassword = await bcrypt.compare(req.body.password, user.password)
!validPassword && res.status(400).json("wrong password")

res.status(200).json(user);
    } catch (err){
        res.status(500).json(err);
    }
})

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            console.log("User not found");
            return res.status(404).send("User not found");
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            console.log("Wrong password");
            return res.status(400).json("Wrong password");
        }

        console.log("Login successful");
        res.status(200).json(user);
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json(err);
    }
});
*/
module.exports = router;