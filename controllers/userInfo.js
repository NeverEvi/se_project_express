const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userInfo = require("../models/userInfo");

const {
  JWT_SECRET = "eb28135ebcfc17578f96d4d65b6c7871f2c803be4180c165061d5c2db621c51b",
} = process.env;

const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");
const DefaultError = require("../errors/DefaultError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const NotFoundError = require("../errors/NotFoundError");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  userInfo
    .findOne({ email })
    .then((foundUser) => {
      if (foundUser) {
        const err = new ConflictError("Create User Failed: Email in use");
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
        next(new BadRequestError("Create User Failed: Validation Error"));
      }
      if (err.name === "DUPLICATE") {
        next(new ConflictError("Create User Failed: Email in use"));
      } else {
        next(new DefaultError("Create User Failed: A server error occured"));
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return userInfo
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError("Login Failed: Unauthorized"));
    });
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  userInfo
    .findById(_id)
    .orFail()
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Get User Failed: Bad data"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Get User Failed: Document not found"));
      } else {
        next(new DefaultError("Get User Failed: A server error occured"));
      }
    });
};
const updateUser = (req, res, next) => {
  const { _id } = req.user;
  const { name, avatar } = req.body;
  userInfo
    .findByIdAndUpdate(
      _id,
      { name, avatar },
      { new: true, runValidators: true }
    )
    .orFail()
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === "CastError" || err.name === "ValidationError") {
        next(new BadRequestError("Update User Failed: Bad or Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Update User Failed: Document not found"));
      } else {
        next(new DefaultError("Update User Failed: A server error occured"));
      }
    });
};
module.exports = {
  createUser,
  getCurrentUser,
  updateUser,
  login,
};
