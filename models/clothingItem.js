const mongoose = require("mongoose");
const validator = require("validator");
const userInfo = require("./userInfo");

const clothingItem = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  weather: {
    type: String,
    required: true,
    enum: ["hot", "warm", "cold"],
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Link is not Valid",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: userInfo,
    required: true,
  },
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "userInfo" }],
    default: [],
  },
  createdAt: {
    type: Date,
    value: Date.now,
  },
});

module.exports = mongoose.model("clothingItems", clothingItem);
