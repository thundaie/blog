const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogModel = new Schema({
  state: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
    unique: true,
  },

  body: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  tags: { type: [String], default: [] },

  readCount: { type: Number, default: 0 },

  readingTime: { type: Number, default: 1 }, // in minutes

  timestamp: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("Blogs", blogModel);
