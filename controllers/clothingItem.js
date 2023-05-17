const ClothingItem = require("../models/clothingItem");
const {
  BAD_DATA,
  DOC_NOTFOUND_ERROR,
  DEFAULT_ERROR,
} = require("../utils/errors.js");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.userId;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(BAD_DATA)
          .send({ message: "Create Item Failed", message: err.message });
      }
      if (err.name === "CastError") {
        res
          .status(BAD_DATA)
          .send({ message: "Create Item Failed", message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        res
          .status(DOC_NOTFOUND_ERROR)
          .send({ message: "Create Item Failed", message: err.message });
      } else {
        res
          .status(DEFAULT_ERROR)
          .send({ message: "Create Item Failed", message: err.message });
      }
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(BAD_DATA)
          .send({ message: "Get Items Failed", message: err.message });
      }
      if (err.name === "CastError") {
        res
          .status(BAD_DATA)
          .send({ message: "Get Items Failed", message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        res
          .status(DOC_NOTFOUND_ERROR)
          .send({ message: "Get Items Failed", message: err.message });
      } else {
        res
          .status(DEFAULT_ERROR)
          .send({ message: "Get Items Failed", message: err.message });
      }
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(BAD_DATA)
          .send({ message: "Update Item Failed", message: err.message });
      }
      if (err.name === "CastError") {
        res
          .status(BAD_DATA)
          .send({ message: "Update Item Failed", message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        res
          .status(DOC_NOTFOUND_ERROR)
          .send({ message: "Update Item Failed", message: err.message });
      } else {
        res
          .status(DEFAULT_ERROR)
          .send({ message: "Update Item Failed", message: err.message });
      }
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(200).send({}))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(BAD_DATA)
          .send({ message: "Delete Item Failed", message: err.message });
      }
      if (err.name === "CastError") {
        res
          .status(BAD_DATA)
          .send({ message: "Delete Item Failed", message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        res
          .status(DOC_NOTFOUND_ERROR)
          .send({ message: "Delete Item Failed", message: err.message });
      } else {
        res
          .status(DEFAULT_ERROR)
          .send({ message: "Delete Item Failed", message: err.message });
      }
    });
};
///////////////////////////////////////////////
const updateLike = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.userId } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(BAD_DATA)
          .send({ message: "Update Like Failed", message: err.message });
      }
      if (err.name === "CastError") {
        res
          .status(BAD_DATA)
          .send({ message: "Update Like Failed", message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        res
          .status(DOC_NOTFOUND_ERROR)
          .send({ message: "Update Like Failed", message: err.message });
      } else {
        res
          .status(DEFAULT_ERROR)
          .send({ message: "Update Like Failed", message: err.message });
      }
    });
};

const deleteLike = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(
    itemId,
    {
      $pull: { likes: req.userId },
    },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({}))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(BAD_DATA)
          .send({ message: "Delete Like Failed", message: err.message });
      }
      if (err.name === "CastError") {
        res
          .status(BAD_DATA)
          .send({ message: "Delete Like Failed", message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        res
          .status(DOC_NOTFOUND_ERROR)
          .send({ message: "Delete Like Failed", message: err.message });
      } else {
        res
          .status(DEFAULT_ERROR)
          .send({ message: "Delete Like Failed", message: err.message });
      }
    });
};

////////////////////////////////////////////////
module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  updateLike,
  deleteLike,
};
