const mongoose = require("mongoose");

require("dotenv").config();

const CONNECTION_URI = process.env.CONNECTION_URI;

function connectDatabase() {
  mongoose.connect(CONNECTION_URI);

  mongoose.connection.on("connected", () => {
    console.log("connection with the database has been established");
  });

  mongoose.connection.on("error", (err) => {
    console.log(err);
  });
}

module.exports = connectDatabase;
