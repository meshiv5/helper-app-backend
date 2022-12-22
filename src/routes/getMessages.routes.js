const messageModel = require("../models/message.model");
const express = require("express");
const verifyUser = require("../middlewares/verifyUser");
const Router = express.Router();

Router.get("/:id", verifyUser, async (req, res) => {
  const { id } = req.params;
  try {
    const roomID = id;
    console.log(roomID);
    const messageData = await messageModel.findOne({ roomID: roomID });
    if (!messageData) return res.status(400).send({ status: false, message: "messages Not Found" });
    return res.status(200).send({ status: true, data: messageData });
  } catch (err) {
    return res.status(404).send({ status: false });
  }
});
module.exports = Router;
