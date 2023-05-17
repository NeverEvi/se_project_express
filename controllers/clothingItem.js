const ClothingItem = require("../models/clothingItem");
const {
  BAD_DATA,
  DOC_NOTFOUND_ERROR,
  DEFAULT_ERROR,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.userId;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_DATA).send({ message: "Create Item Failed", err });
        return;
      }
      if (err.name === "CastError") {
        res.status(BAD_DATA).send({ message: "Create Item Failed", err });
        return;
      }
      if (err.name === "DocumentNotFoundError") {
        res
          .status(DOC_NOTFOUND_ERROR)
          .send({ message: "Create Item Failed", err });
        return;
      }
      res.status(DEFAULT_ERROR).send({ message: "Create Item Failed", err });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_DATA).send({ message: "Get Items Failed", err });
        return;
      }
      if (err.name === "CastError") {
        res.status(BAD_DATA).send({ message: "Get Items Failed", err });
        return;
      }
      if (err.name === "DocumentNotFoundError") {
        res
          .status(DOC_NOTFOUND_ERROR)
          .send({ message: "Get Items Failed", err });
        return;
      }
      res.status(DEFAULT_ERROR).send({ message: "Get Items Failed", err });
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
        res.status(BAD_DATA).send({ message: "Update Item Failed", err });
        return;
      }
      if (err.name === "CastError") {
        res.status(BAD_DATA).send({ message: "Update Item Failed", err });
        return;
      }
      if (err.name === "DocumentNotFoundError") {
        res
          .status(DOC_NOTFOUND_ERROR)
          .send({ message: "Update Item Failed", err });
        return;
      }
      res.status(DEFAULT_ERROR).send({ message: "Update Item Failed", err });
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
        res.status(BAD_DATA).send({ message: "Delete Item Failed", err });
        return;
      }
      if (err.name === "CastError") {
        res.status(BAD_DATA).send({ message: "Delete Item Failed", err });
        return;
      }
      if (err.name === "DocumentNotFoundError") {
        res
          .status(DOC_NOTFOUND_ERROR)
          .send({ message: "Delete Item Failed", err });
        return;
      }
      res.status(DEFAULT_ERROR).send({ message: "Delete Item Failed", err });
    });
};

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
        res.status(BAD_DATA).send({ message: "Update Like Failed", err });
        return;
      }
      if (err.name === "CastError") {
        res.status(BAD_DATA).send({ message: "Update Like Failed", err });
        return;
      }
      if (err.name === "DocumentNotFoundError") {
        res
          .status(DOC_NOTFOUND_ERROR)
          .send({ message: "Update Like Failed", err });
        return;
      }
      res.status(DEFAULT_ERROR).send({ message: "Update Like Failed", err });
    });
};

const deleteLike = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findById(
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
        res.status(BAD_DATA).send({ message: "Delete Like Failed", err });
        return;
      }
      if (err.name === "CastError") {
        res.status(BAD_DATA).send({ message: "Delete Like Failed", err });
        return;
      }
      if (err.name === "DocumentNotFoundError") {
        res
          .status(DOC_NOTFOUND_ERROR)
          .send({ message: "Delete Like Failed", err });
        return;
      }
      res.status(DEFAULT_ERROR).send({ message: "Delete Like Failed", err });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  updateLike,
  deleteLike,
};
