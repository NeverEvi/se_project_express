const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/userInfo");
const getToken = require("../middlewares/auth");
const { validateProfileAvatar } = require("../middlewares/validation");

// GET current user
router.get("/me", getToken, getCurrentUser);
router.patch("/me", getToken, validateProfileAvatar, updateUser);

module.exports = router;
