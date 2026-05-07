const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  getProfile
} = require("../controllers/userController");

router.get(
  "/me",
  authMiddleware,
  getProfile
);

module.exports = router;