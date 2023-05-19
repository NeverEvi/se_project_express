const router = require("express").Router();
const { DOC_NOTFOUND_ERROR } = require("../utils/errors");
const clothingItem = require("./clothingItem");
const userInfo = require("./userInfo");

router.use("/items", clothingItem);
router.use("/users", userInfo);

router.use((req, res) => {
  res.status(DOC_NOTFOUND_ERROR).send({ message: "Router not found" });
});

module.exports = router;
