const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userInfo = new mongoose.Schema({
  name: {
    type: String,
    default: "Elise Bouer",
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    default:
      "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Elise.png",
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Link is not Valid",
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Email is not Valid",
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    select: false,
  },
});
userInfo.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      console.log(user + " (models/userInfo.js line 43)");
      if (!user) {
        return Promise.reject(new Error("Incorrect password or email"));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        console.log(matched) + " (models/userInfo.js line 49)";
        if (!matched) {
          return Promise.reject(new Error("Incorrect password or email"));
        }

        return user;
      });
    });
};

module.exports = mongoose.model("userInfo", userInfo);
