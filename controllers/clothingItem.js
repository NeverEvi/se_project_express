const ClothingItem = require("../models/clothingItem");
const {
  BAD_DATA,
  DOC_NOTFOUND_ERROR,
  DEFAULT_ERROR,
  FORBIDDEN,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_DATA).send({ message: "Create Item Failed" });
        return;
      }
      res.status(DEFAULT_ERROR).send({ message: "Create Item Failed" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(() => {
      res.status(DEFAULT_ERROR).send({ message: "Get Items Failed" });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_DATA).send({ message: "Update Item Failed" });
        return;
      }
      if (err.name === "CastError") {
        res.status(BAD_DATA).send({ message: "Update Item Failed" });
        return;
      }
      if (err.name === "DocumentNotFoundError") {
        res.status(DOC_NOTFOUND_ERROR).send({ message: "Update Item Failed" });
        return;
      }
      res.status(DEFAULT_ERROR).send({ message: "Update Item Failed" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        const err = new Error("Failed. Cannot delete.");
        err.status = FORBIDDEN;
        err.name = "FORBIDDEN";
        throw err;
      }
      return ClothingItem.findByIdAndDelete(itemId).then(() =>
        res.send({ message: "Delete Item Successful", itemId })
      );
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_DATA).send({ message: "Delete Item Failed" });
        return;
      }
      if (err.name === "CastError") {
        res.status(BAD_DATA).send({ message: "Delete Item Failed" });
        return;
      }
      if (err.name === "DocumentNotFoundError") {
        res.status(DOC_NOTFOUND_ERROR).send({ message: "Delete Item Failed" });
        return;
      }
      if (err.name === "FORBIDDEN") {
        res.status(FORBIDDEN).send({ message: "Delete Item Failed" });
        return;
      }
      res.status(DEFAULT_ERROR).send({ message: "Delete Item Failed" });
    });
};

const updateLike = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $set: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      if (!item) {
        const err = new Error("No item found");
        err.status = DOC_NOTFOUND_ERROR;
        err.name = "DocumentNotFoundError";
        throw err;
      }
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_DATA).send({ message: "Update Like Failed" });
        return;
      }
      if (err.name === "CastError") {
        res.status(BAD_DATA).send({ message: "Update Like Failed" });
        return;
      }
      if (err.name === "DocumentNotFoundError") {
        res.status(DOC_NOTFOUND_ERROR).send({ message: "Update Like Failed" });
        return;
      }
      res.status(DEFAULT_ERROR).send({ message: "Update Like Failed" });
    });
};

const deleteLike = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      if (!item) {
        const err = new Error("No item found");
        err.status = DOC_NOTFOUND_ERROR;
        err.name = "DocumentNotFoundError";
        throw err;
      }
      res.send({ item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_DATA).send({ message: "Delete Like Failed" });
        return;
      }
      if (err.name === "CastError") {
        res.status(BAD_DATA).send({ message: "Delete Like Failed" });
        return;
      }
      if (err.name === "DocumentNotFoundError") {
        res.status(DOC_NOTFOUND_ERROR).send({ message: "Delete Like Failed" });
        return;
      }
      res.status(DEFAULT_ERROR).send({ message: "Delete Like Failed" });
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
