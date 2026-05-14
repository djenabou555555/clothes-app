const express = require("express");

const router = express.Router();

const {
  addClothe,
  getClothes,
  deleteClothe
} = require("../controllers/clothesController");

router.post(
  "/",
  addClothe
);

router.get(
  "/",
  getClothes
);

router.delete(
  "/:id",
  deleteClothe
);

module.exports = router;