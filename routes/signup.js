const express = require("express");
const UserModel = require("../model/userModel");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("user/signup");
});

router.post("/", async (req, res) => {
  const user = new UserModel({
    email: req.body.email,
    password: req.body.password,
    lastName: req.body.lastname,
    firstName: req.body.firstname,
  });

  try {
    await user.save();
    res.status(200).send("Sign up successful");
  } catch (err) {
    console.log(err);
    res.redirect("/signup");
  }
});

module.exports = router;
