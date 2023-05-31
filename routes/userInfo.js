const router = require("express").Router();
const {
  getUsers,
  getCurrentUser,
  getUser,
} = require("../controllers/userInfo");
const getToken = require("../middlewares/auth");

// GET all users
router.get("/", getToken, getUsers);
// GET current user
router.get("/me", getToken, getCurrentUser);
router.get("/:userid", getToken, getUser);

module.exports = router;
