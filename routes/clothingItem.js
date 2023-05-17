const router = require("express").Router();
const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  updateLike,
  deleteLike,
} = require("../controllers/clothingItem");

router.post("/", createItem);
router.get("/", getItems);
router.put("/:itemId", updateItem);
router.delete("/:itemId", deleteItem);

router.put("/:itemId/likes", updateLike);
router.delete("/:itemId/likes", deleteLike);

module.exports = router;
