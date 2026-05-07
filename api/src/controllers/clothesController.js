const db = require("../config/db");

const addClothe = (req, res) => {

  const { name, category, size, color } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Name is required"
    });
  }

  const query =
    "INSERT INTO clothes (user_id, name, category, size, color) VALUES (?, ?, ?, ?, ?)";

  db.query(
    query,
    [
      1,
      name,
      category,
      size,
      color
    ],
    (error, result) => {

      if (error) {
        return res.status(500).json({
          success: false,
          message: "Database error"
        });
      }

      return res.status(201).json({
        success: true,
        message: "Clothe added successfully"
      });

    }
  );

};

const getClothes = (req, res) => {

  const query =
    "SELECT * FROM clothes WHERE user_id = ?";

  db.query(query, [1], (error, results) => {

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Database error"
      });
    }

    return res.status(200).json({
      success: true,
      clothes: results
    });

  });

};

const deleteClothe = (req, res) => {

  const { id } = req.params;

  const query =
    "DELETE FROM clothes WHERE id = ? AND user_id = ?";

  db.query(
    query,
    [id, 1],
    (error, result) => {

      if (error) {
        return res.status(500).json({
          success: false,
          message: "Database error"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Clothe deleted successfully"
      });

    }
  );

};

module.exports = {
  addClothe,
  getClothes,
  deleteClothe
};