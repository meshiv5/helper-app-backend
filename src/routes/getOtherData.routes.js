const userModel = require("../models/user.model");
const express = require("express");
const verifyUser = require("../middlewares/verifyUser");
const Router = express.Router();

Router.get("/:id", verifyUser, async (req, res) => {
  const { id } = req.params;
  try {
    const userId = id;
    const userData = await userModel.findOne({ _id: userId });
    if (!userData) return res.status(400).send({ status: false, message: "User Not Found" });
    return res.status(200).send({ status: true, data: userData });
  } catch (err) {
    return res.status(404).send({ status: false });
  }
});
module.exports = Router;
