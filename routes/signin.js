const express = require("express");
const jwt = require("jsonwebtoken");
const UserModel = require("../model/userModel");
require("dotenv").config()

const SIGNING_SECRET = process.env.JWT_SECRET

const router = express.Router();

router.get("/", (req, res) => {
  res.render("user/signin");
});

router.post("/", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await UserModel.findOne({ email: email });

  if (!user || !user.comparePassword(password)) {
    res.status(401);
    res.send("No account found!");
    return;
  }

  const token = jwt.sign({ user: user._id }, SIGNING_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, { maxAge: 3600000 });
  res.redirect("/blogs/mine");
});

module.exports = router;
