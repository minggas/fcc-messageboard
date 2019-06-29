const mongoose = require("mongoose");
const Reply = require("./Reply").Reply;

const ThreadSchema = new mongoose.Schema({
  board: {
    type: String,
    required: true,
    trim: true,
    minlength: 4,
  },
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
  reported: {
    type: Boolean,
    default: false,
  },
  delete_password: {
    type: String,
    required: true,
    trim: true,
    minlength: 4,
  },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reply" }],
});

exports.Thread = mongoose.model("Thread", ThreadSchema);
