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

//read
router.get("/", getItems);

//update

router.put("/:itemId", updateItem);
//delete
router.delete("/:itemId", deleteItem);
/////////////////////

router.put("/:itemId/likes", updateLike);
//delete
router.delete("/:itemId/likes", deleteLike);

////////////////////
module.exports = router;
