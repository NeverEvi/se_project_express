const router = require("express").Router();
const clothingItem = require("./clothingItem");
const userInfo = require("./userInfo");

router.use("/items", clothingItem);
router.use("/users", userInfo);

router.use((req, res) => {
  res.status(404).send({ message: "Router not found" });
});

module.exports = router;
