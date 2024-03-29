const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = require("express").Router();

//UPDATE USER

router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("account has been updated")
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("you can update only your account!");
    }
})

/*
router.put("/update-username", async (req, res) => {
    const userId = req.body.userId; // Assuming you send userId in the request body
    const newUsername = req.body.newUsername;
  
    try {
      // Update the username in the database
      const updatedUser = await User.findByIdAndUpdate(userId, {
        $set: { userName: newUsername },
      });
  
      res.status(200).json("Username has been updated");
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  });
  */
//DELETE USER

router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {

        try {
           // const user = await User.deleteOne(req.params.id);
           await User.findByIdAndDelete(req.params.id);
            res.status(200).json("account has been deleted")
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("you can delete only your account!");
    }
})

//GET A USER

router.get("/:id", async (req, res) => {
    try {
        const user =await User.findById(req.params.id);
        const {password,updatedAt,...other}=user._doc
        res.status(200).json(other)
    } catch (err) {
        return res.status(500).json(err);
    }
});

//FOLLOW A USER

router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id ){
        try {
            const user =await User.findById(req.params.id);
            const currentUser =await User.findById(req.body.userId);
          if(!user.followers.includes(req.body.userId)){
            await user.updateOne({$push:{followers:req.body.userId}});
            await currentUser.updateOne({$push:{following:req.params.id}});
            res.status(200).json("user has been followed")
          }else{
            res.status(403).json("you already follow this user")
          }
            res.status(200).json(other)
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("you can follow yourself");
    }
})

//UNFOLLOW A USER

router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id ){
        try {
            const user =await User.findById(req.params.id);
            const currentUser =await User.findById(req.body.userId);
          if(user.followers.includes(req.body.userId)){
            await user.updateOne({$pull:{followers:req.body.userId}});
            await currentUser.updateOne({$pull:{following:req.params.id}});
            res.status(200).json("user has been unfollowed")
          }else{
            res.status(403).json("you dont follow this user")
          }
            res.status(200).json(other)
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("you cant unfollow yourself"); 
    }
})
module.exports = router
