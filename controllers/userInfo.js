const userInfo = require("../models/userInfo");
const {
  BAD_DATA,
  DOC_NOTFOUND_ERROR,
  DEFAULT_ERROR,
} = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  userInfo
    .create({ name, avatar })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_DATA).send({ message: "Create User Failed", err });
        return;
      }
      res.status(DEFAULT_ERROR).send({ message: "Create User Failed", err });
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
  const { userId } = req.params;
  userInfo
    .findById(userId)
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
module.exports = { createUser, getUser, getUsers };
