const router = require("express").Router();
const clothingItem = require("./clothingItem");

const userInfo = require("./userInfo");
const { createUser, login } = require("../controllers/userInfo");
const { validateAuth, validateUserCreation } = require("../middlewares/validation");
const NotFoundError = require("../errors/NotFoundError")

router.post("/signup", validateUserCreation, createUser);
router.post("/signin", validateAuth, login);

router.use("/items", clothingItem);
router.use("/users", userInfo);

router.use(("*", req, res, next) => {
  next(new NotFoundError("Router not found"));
});

module.exports = router;
