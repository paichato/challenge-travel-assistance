const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      index: true,
      min: 6,
      max: 255,
    },
    email: {
      type: String,
      required: false,
      max: 255,
      min: 6,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      min: 6,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("travel-users", userSchema);
