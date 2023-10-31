const router = require("express").Router();
const getToken = require("../middlewares/auth");
const {
  createItem,
  getItems,
  deleteItem,
  updateLike,
  deleteLike,
} = require("../controllers/clothingItem");
const { validateCard, validateId } = require("../middlewares/validation");

router.post("/", getToken, validateCard, createItem);
router.get("/", getItems);
router.delete("/:itemId", getToken, validateId, deleteItem);

router.put("/:itemId/likes", getToken, validateId, updateLike);
router.delete("/:itemId/likes", getToken, validateId, deleteLike);

module.exports = router;
