// routes/events.js

const express = require('express');
const router = express.Router();
const Event = require('../models/Event');


router.post("/addEvent",async(req,res)=>{
  const newEvent = new Event(req.body)
  try{
      const savedEvent = await newEvent.save();
      res.status(200).json(savedEvent)
  }catch(err){
      res.status(500).json(err)
  }
  })

module.exports = router;
