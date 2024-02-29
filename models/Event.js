const mongoose = require("mongoose")
const EventSchema = new mongoose.Schema({
  date: {
    type: Date,    
  },
  eventname: {
    type: String,
    required: true
  },
  description: {
    type: String,
    max: 500
  },
})
  module.exports = mongoose.model("Event", EventSchema)