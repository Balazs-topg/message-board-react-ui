const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    message: { type: String, required: true },
    time: { type: String, required: true },
  },
  { versionKey: false }
);

const messageModel = mongoose.model("messages", messageSchema);
module.exports = messageModel;
