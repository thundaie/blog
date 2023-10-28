require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const connectDatabase = require("./connection/connect");
connectDatabase();

const app = express();
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const signUp = require("./routes/signup");
const signIn = require("./routes/signin");
const blogRoute = require("./routes/blog");

const PORT = process.env.PORT;

app.use("/signin", signIn);
app.use("/signup", signUp);

app.use("/blogs", blogRoute);

app.get("/", (req, res) => {
  res.send("This is the home page");
});

app.use(function (err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);
  res.json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
