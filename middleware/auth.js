const jwt = require("jsonwebtoken");
const UserModel = require("../model/userModel");

const SIGNING_SECRET = process.env.JWT_SECRET;

module.exports = async function (req, res, next) {
  const token = req.cookies["token"];
  if (!token) return res.status(401).redirect("/signin");

  try {
    const result = jwt.verify(token, SIGNING_SECRET);

    req.user = await UserModel.findOne({ _id: result.user });
    if (!req.user) return res.status(401).redirect("/signin");

    next();
  } catch (err) {
    res.redirect("/signin");
  }
};
