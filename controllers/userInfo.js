const userInfo = require("../models/userInfo");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  JWT_SECRET = eb28135ebcfc17578f96d4d65b6c7871f2c803be4180c165061d5c2db621c51b,
} = process.env;

const {
  BAD_DATA,
  DOC_NOTFOUND_ERROR,
  DEFAULT_ERROR,
  UNAUTHORIZED,
  DUPLICATE_ERROR,
} = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  userInfo
    .findOne({ email })
    .then((foundUser) => {
      if (foundUser) {
        const err = new Error("Create User Failed: Email in use");
        err.status = DUPLICATE_ERROR;
        err.name = "DUPLICATE";
        throw err;
      }
      return bcrypt.hash(password, 10);
    })

    .then((hash) => userInfo.create({ name, avatar, email, password: hash }))
    .then((user) => {
      res.send({
        name: user.name,
        avatar: user.avatar,
        _id: user._id,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_DATA).send({ message: "Create User Failed", err });
        return;
      } else if (err.name === "DUPLICATE") {
        res
          .status(DUPLICATE_ERROR)
          .send({ message: "Create User Failed: Email in use", err });
        return;
      }
      res.status(DEFAULT_ERROR).send({ message: "Create User Failed", err });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return userInfo
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })
    .catch((err) => {
      console.error(err);
      res.status(UNAUTHORIZED).send({ message: "Login Failed", err });
    });
};

const getUsers = (req, res) => {
  userInfo
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res
          .status(DOC_NOTFOUND_ERROR)
          .send({ message: "Get Users Failed", err });
        return;
      }
      res.status(DEFAULT_ERROR).send({ message: "Get Users Failed", err });
    });
};
const getUser = (req, res) => {
  userInfo
    .findById(req.params.userid)
    .orFail()
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(BAD_DATA).send({ message: "Get User Failed", err });
        return;
      }
      if (err.name === "DocumentNotFoundError") {
        res
          .status(DOC_NOTFOUND_ERROR)
          .send({ message: "Get User Failed", err });
        return;
      }
      res.status(DEFAULT_ERROR).send({ message: "Get User Failed", err });
    });
};
const getCurrentUser = (req, res) => {
  const { _id } = req.user;

  userInfo
    .findById(_id)
    .orFail()
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(BAD_DATA).send({ message: "Get User Failed", err });
        return;
      }
      if (err.name === "DocumentNotFoundError") {
        res
          .status(DOC_NOTFOUND_ERROR)
          .send({ message: "Get User Failed", err });
        return;
      }
      res.status(DEFAULT_ERROR).send({ message: "Get User Failed", err });
    });
};
module.exports = { createUser, getUser, getUsers, getCurrentUser, login };
