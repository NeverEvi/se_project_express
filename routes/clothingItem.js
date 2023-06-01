const router = require("express").Router();
const getToken = require("../middlewares/auth");
const {
  createItem,
  getItems,
  deleteItem,
  updateLike,
  deleteLike,
} = require("../controllers/clothingItem");

router.post("/", getToken, createItem);
router.get("/", getItems);
router.delete("/:itemId", getToken, deleteItem);

router.put("/:itemId/likes", getToken, updateLike);
router.delete("/:itemId/likes", getToken, deleteLike);

module.exports = router;
