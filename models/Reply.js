const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema({
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
  reported: Boolean,
  delete_password: {
    type: String,
    required: true,
    trim: true,
    minlength: 4,
  },
});

exports.Reply = mongoose.model("Reply", ReplySchema);
