const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    roomID: { type: String, required: true },
    messages: { type: Array, default: [] },
  },
  { vsersionKey: false, timestamps: true }
);

mongoose.models = {};
const messageModel = mongoose.model("message", messageSchema);

module.exports = messageModel;
