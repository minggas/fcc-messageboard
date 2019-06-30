const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema({
  thread_id: { type: mongoose.Schema.Types.ObjectId, ref: "Thread" },
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
});

exports.Reply = mongoose.model("Reply", ReplySchema);
