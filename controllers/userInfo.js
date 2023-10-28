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
const { DUPLICATE_ERROR } = require("../utils/errors");

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
        next(new BadRequestError("Create User Failed: Validation Error"));
        //res.status(BAD_DATA).send({ message: "Create User Failed" });
        //return;
      }
      if (err.name === "DUPLICATE") {
        next(new ConflictError("Create User Failed: Email in use"));
        //res
        //  .status(DUPLICATE_ERROR)
        //  .send({ message: "Create User Failed: Email in use" });
        //return;
      } else {
        next(new DefaultError("Create User Failed: A server error occured"));
      }
      //res.status(DEFAULT_ERROR).send({ message: "Create User Failed" });
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
      res.send({ token });
    })
    .catch(() => {
      //res.status(UNAUTHORIZED).send({ message: "Login Failed" });
      next(new UnauthorizedError("Login Failed: Unauthorized"));
    });
};

const getCurrentUser = (req, res) => {
  const { _id } = req.user;

  userInfo
    .findById(_id)
    .orFail()
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Get User Failed: Bad data"));
        //res.status(BAD_DATA).send({ message: "Get User Failed" });
        //return;
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Get User Failed: Document not found"));
        //res.status(DOC_NOTFOUND_ERROR).send({ message: "Get User Failed" });
        //return;
      } else {
        next(new DefaultError("Get User Failed: A server error occured"));
      }
      //res.status(DEFAULT_ERROR).send({ message: "Get User Failed" });
    });
};
const updateUser = (req, res) => {
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
        //res.status(BAD_DATA).send({ message: "Update User Failed" });
        //return;
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Update User Failed: Document not found"));
        //res.status(DOC_NOTFOUND_ERROR).send({ message: "Update User Failed" });
        //return;
      } else {
        next(new DefaultError("Update User Failed: A server error occured"));
      }
      //res.status(DEFAULT_ERROR).send({ message: "Update User Failed" });
    });
};
module.exports = {
  createUser,
  getCurrentUser,
  updateUser,
  login,
};
