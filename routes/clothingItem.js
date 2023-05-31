const router = require("express").Router();
const getToken = require("../middlewares/auth");
const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  updateLike,
  deleteLike,
} = require("../controllers/clothingItem");

router.post("/", getToken, createItem);
router.get("/", getItems);
router.put("/:itemId", getToken, updateItem);
router.delete("/:itemId", getToken, deleteItem);

router.put("/:itemId/likes", updateLike);
router.delete("/:itemId/likes", deleteLike);

module.exports = router;
