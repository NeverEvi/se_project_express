const ClothingItem = require("../models/clothingItem");
const {
  BAD_DATA,
  DOC_NOTFOUND_ERROR,
  DEFAULT_ERROR,
  UNAUTHORIZED,
  FORBIDDEN,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  console.log(owner + " (controllers/clothingItem.js line 12)");
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_DATA).send({ message: "Create Item Failed", err });
        return;
      }
      res.status(DEFAULT_ERROR).send({ message: "Create Item Failed", err });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
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
  console.log(itemId + " (controllers/clothingItem.js line 68)");
  console.log(req.user._id);
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      console.log(item);
      if (item.owner._id != req.user._id) {
        const err = new Error("Failed. Cannot delete.");
        err.status = FORBIDDEN;
        err.name = "FORBIDDEN";
        throw err;
      }
    })
    .then(() => {
      res.status(200).send({ message: "Delete Item Successful", itemId });
      return ClothingItem.findByIdAndDelete(itemId);
    })
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
      if (err.name === "FORBIDDEN") {
        res.status(FORBIDDEN).send({ message: "Delete Item Failed", err });
        return;
      }
      res.status(DEFAULT_ERROR).send({ message: "Delete Item Failed", err });
    });
};

const updateLike = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId + " (from controllers/clothingItem.js line 103)");
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $set: { likes: req.userId } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      console.log(item);
      if (!item) {
        const err = new Error("No item found");
        err.status = DOC_NOTFOUND_ERROR;
        err.name = "DocumentNotFoundError";
        throw err;
      }
      res.status(200).send({ data: item });
    })
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

  console.log(itemId + " (from controllers/clothingItem.js line 141)");
  console.log(req.userId);
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.userId } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      console.log({ item });
      if (!item) {
        const err = new Error("No item found");
        err.status = DOC_NOTFOUND_ERROR;
        err.name = "DocumentNotFoundError";
        throw err;
      }
      res.status(200).send({ item });
    })
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
