const app = require("express").Router();
const userModel = require("../models/user.model");
const argon2 = require("argon2");
const signToken = require("../controllers/signToken");
const passport = require("../controllers/passport");

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    await userModel.create({
      name,
      email,
      password: await argon2.hash(password),
    });
    return res.status(201).send("Account created");
  } catch {
    return res.status(400).send("Bad request");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({
      email,
    });
    if (await argon2.verify(user.password, password)) {
      const token = signToken(user);
      return res.status(200).send({ token, message: "Login success" });
    }
    return res.status(401).send("Unauthorized");
  } catch {
    return res.status(400).send("Bad request");
  }
});

app.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    res.send(signToken(req.user));
  }
);

module.exports = app;
