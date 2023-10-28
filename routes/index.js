const router = require("express").Router();
const { DOC_NOTFOUND_ERROR } = require("../utils/errors");
const clothingItem = require("./clothingItem");
const userInfo = require("./userInfo");
const { createUser, login } = require("../controllers/userInfo");

router.post("/signup", createUser);
router.post("/signin", login);

router.use("/items", clothingItem);
router.use("/users", userInfo);

router.use((req, res) => {
  res.status(500).send({ message: "U fucked. Router not found" });
});

module.exports = router;
