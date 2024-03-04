const router = require("express").Router();
const Post = require("../models/Post")
const User =require ("../models/User")

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.single("image"), async (req, res) => {
    try {
      const { description, location, userId } = req.body;
      
      // Check if an image is provided
      const image = req.file ? req.file.buffer.toString('base64') : undefined;
  
      const newPost = new Post({
        description,
        location: location || "Default Location",
        userId,
        image,
      });
  
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
    } catch (err) {
      console.error(err);
      res.status(500).json(err.message || "Internal Server Error");
    }
  });
  

/*
router.get("/",(req,res)=>{
    console.log("post page")
})


//create a post
router.post("/",async(req,res)=>{
const newPost = new Post(req.body)
try{
    const savedPost = await newPost.save();
    res.status(200).json(savedPost)
}catch(err){
    res.status(500).json(err)
}
})

//update a post
/*router.put("/:id",async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId){
            await post.updateOne({$set:req.body});
            res.status(200).json("the post has been updated")
        }else{
            res.status(403).json("you can update only your post")
        }
        }catch (err){
            res.status(500).json(err);
        }
    })
*/
// Assuming your Post model has a 'location' field
router.put("/:id", upload.single("image"), async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      console.log(req.files,req.file,"checking file")
      if (!post) {
        return res.status(404).json("Post not found");
      }
  
      if (post.userId !== req.body.userId) {
        return res.status(403).json("You can update only your post");
      }
  
      // Update the post fields
      post.description = req.body.description;
      post.location = req.body.location; // Assuming 'location' is a field in your Post model
  
      // Check if a new image is provided
      if (req.file) {
        // Update the image only if a new one is provided
        post.image = req.file.buffer.toString('base64'); // Convert the image to base64 string
      }
  
      const updatedPost = await post.save();
      res.status(200).json(updatedPost);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
//delete a post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json("Post not found");
        }

        if (post.userId.toString() !== req.body.userId) {
            return res.status(403).json("You can delete only your post");
        }

        await post.deleteOne();
        return res.status(200).json("The post has been deleted");
    } catch (err) {
        console.error(err);
        return res.status(500).json(err.message || "Internal Server Error");
    }
});

//like a post and dislike post
router.put("/:id/like",async (req,res)=>{
    try{
        const post =await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}});
            res.status(200).json("the post has been liked")
        }else{
            await post.updateOne({$pull:{likes:req.body.userId}});
            res.status(200).json("the post has been disliked");
        }
    }catch (err){
        res.status(500).json(err);
    }
})


//get a post
router.get("/:id",async(req,res)=>{
    try{
        const post =await Post.findById(req.params.id)
        res.status(200).json(post)
    }catch (err){
        res.status(500).json(err);
    }
});

//get timeline posts
/*
router.get("/timeline/all",async(req,res)=>{
try{
    const currentUser = await User.findById(req.body.userId)
    const userPosts = await Post.find({userId:currentUser._id});
    const friendPosts= await Promise.all(
        currentUser.following.map((friendId)=>{
           return Post.find({userId:friendId});
        })
    )
    res.json(userPosts.concat(...friendPosts))
}catch (err){
    res.status(500).json(err);
}
});


router.get("/timeline/:userId", async (req, res) => {
    try {
        
        const currentUser = await User.findById(req.params.userId);
      
        const userPosts = await Post.find({userId:currentUser._id});
        const friendPosts= await Promise.all(
            currentUser.following.map((friendId)=>{
               return Post.find({userId:friendId});
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
        
        res.status(500).json(err);
    }
});
*/
//get posts of all users
router.get("/", (req, res) => {
    Post.find().then((response) => {
        res.status(200).json(response)
    })
        .catch((err) => {
            res.status(500).json(err)
        })
})


/*
router.get('timeline/all', async (req, res) => {
    try {
      const allPosts = await Post.find().sort({ createdAt: -1 }); // Sort by createdAt in descending order
      res.json(allPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.get("/timeline/:userId", async (req, res) => {
    try {
      console.log("Reached timeline route");
      const userId = req.params.userId;
      console.log("User ID:", userId);
  
      // Fetch current user
      const currentUser = await User.findById(userId);
      console.log("Current User:", currentUser);
  
      // Fetch user posts
      const userPosts = await Post.find({ userId: currentUser._id });
      console.log("User Posts:", userPosts);
  
      // Fetch friend posts
      const friendPosts = await Promise.all(
        currentUser.following.map((friendId) => {
          return Post.find({ userId: friendId });
        })
      );
  
      // Combine user and friend posts and send response
      const timelinePosts = userPosts.concat(...friendPosts);
      res.status(200).json(timelinePosts);
    } catch (err) {
      console.error("Error in timeline route:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  *
  router.get('/posts', async (req, res) => {
    try {
      // Assume you have a logged-in user
      const currentUser = req.user; // Use your authentication logic to get the current user
  
      // Fetch friends of the current user
      const user = await User.findById(currentUser._id).populate('friends', 'username');
  
      // Extract friend ids
      const friendIds = user.friends.map(friend => friend._id);
  
      // Fetch posts from friends
      const friendsPosts = await Post.find({ userId: { $in: friendIds } }).populate('userId', 'username');
  
      res.json(friendsPosts);
    } catch (error) {
      console.error('Error fetching friends posts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
 
  router.get('/', async (req, res) => {
    try {
      const posts = await Post.find({location}); // Assuming you are using Mongoose for MongoDB
  
      // Extract locations from the posts
     
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get("/:location",async (req, res) => {
    try {
        const result = await Post.find({ location })
        res.status(200).json(result)
    } catch (error) {
    }
})
 */

router.get("/location/:location", async (req, res) => {
    try {
        const location = req.params.location;
        const posts = await Post.find({ location: location });
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



//get user's post
router.get("/timeline/:userId", async (req, res) => {
    try {        
        const currentUser = await User.findById(req.params.userId);
        if (!currentUser) {
            return res.status(404).json({ error: "User not found" });
        }
        const userPosts = await Post.find({ userId: currentUser._id }); 
        res.status(200).json(userPosts);  // Send the user's posts in the response
    } catch (err) {        
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
module.exports = router;
