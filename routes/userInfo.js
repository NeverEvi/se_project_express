const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/userInfo");
const getToken = require("../middlewares/auth");

// GET current user
router.get("/me", getToken, getCurrentUser);
router.patch("/me", getToken, updateUser);

module.exports = router;
