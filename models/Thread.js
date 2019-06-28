const mongoose = require("mongoose");
const Reply = require("./Reply");

const ThreadSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    minlength: 4,
  },
  created_on: {
    type: Date,
    default: new Date(),
  },
  bumped_on: {
    type: Date,
    default: new Date(),
  },
  reported: Boolean,
  delete_password: {
    type: String,
    required: true,
    trim: true,
    minlength: 4,
  },
  replies: [Reply],
});

exports.Thread = mongoose.model("Thread", ThreadSchema);
