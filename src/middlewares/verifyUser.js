const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyUser = (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    const details = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.body.user = details;
    next();
  } catch {
    return res.status(403).send("Forbidden");
  }
};

module.exports = verifyUser;
