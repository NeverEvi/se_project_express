const BadRequestError = require("../errors/BadRequestError");
const DefaultError = require("../errors/DefaultError");
const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");
const ClothingItem = require("../models/clothingItem");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Create Item Failed: Validation Error"));
      } else {
        next(new DefaultError("Create Item Failed: A server error occured"));
      }
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(() => {
      next(new DefaultError("Get Item Failed: A server error occured"));
    });
};

const updateItem = (req, res, next) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(new BadRequestError("Update Item Failed: Validation Error"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Update Item Failed: Not Found"));
      } else {
        next(new DefaultError("Create Item Failed: A server error occured"));
      }
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        const err = new ForbiddenError("Delete Item Failed: Forbidden");
        throw err;
      }
      return ClothingItem.findByIdAndDelete(itemId).then(() =>
        res.send({ message: "Delete Item Successful", itemId })
      );
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(new BadRequestError("Delete Item Failed: Validation Error"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Delete Item Failed: Not Found"));
      }
      if (err.name === "ForbiddenError") {
        next(new ForbiddenError("Delete Item Failed: Forbidden"));
      } else {
        next(new DefaultError("Delete Item Failed: A server error occured"));
      }
    });
};

const updateLike = (req, res, next) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $set: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      if (!item) {
        const err = new NotFoundError("No item found");
        err.name = "DocumentNotFoundError";
        throw err;
      }
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(new BadRequestError("Like Item Failed: Validation Error"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Like Item Failed: Not Found"));
      } else {
        next(new DefaultError("Like Item Failed: A server error occured"));
      }
    });
};

const deleteLike = (req, res, next) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      if (!item) {
        const err = new NotFoundError("No item found");
        err.name = "DocumentNotFoundError";
        throw err;
      }
      res.send({ item });
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(new BadRequestError("UnLike Item Failed: Validation Error"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("UnLike Item Failed: Not Found"));
      } else {
        next(new DefaultError("UnLike Item Failed: A server error occured"));
      }
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
