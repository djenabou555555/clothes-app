const db = require("../config/db");

const getProfile = (req, res) => {

  const query =
    "SELECT id, email, full_name, created_at FROM users WHERE id = ?";

  db.query(query, [req.user.id], (error, results) => {

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Database error"
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      user: results[0]
    });

  });

};

module.exports = {
  getProfile
};