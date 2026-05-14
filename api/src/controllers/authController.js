const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const register = async (req, res) => {
  try {

    const { email, password, full_name } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters"
      });
    }

    const checkUserQuery =
      "SELECT * FROM users WHERE email = ?";

    db.query(checkUserQuery, [email], async (error, results) => {

      if (error) {
        return res.status(500).json({
          success: false,
          message: "Database error"
        });
      }

      if (results.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Email already exists"
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const insertQuery =
        "INSERT INTO users (email, password_hash, full_name) VALUES (?, ?, ?)";

      db.query(
        insertQuery,
        [email, hashedPassword, full_name],
        (error, result) => {

          if (error) {
            return res.status(500).json({
              success: false,
              message: "Registration failed"
            });
          }

          return res.status(201).json({
            success: true,
            message: "User registered successfully"
          });

        }
      );

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};

const login = (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const query =
      "SELECT * FROM users WHERE email = ?";

    db.query(query, [email], async (error, results) => {

      if (error) {
        return res.status(500).json({
          success: false,
          message: "Database error"
        });
      }

      if (results.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials"
        });
      }

      const user = results[0];

      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials"
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h"
        }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token
      });

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};
const logout = (req, res) => {

  return res.status(200).json({
    success: true,
    message: "Logout successful"
  });

};

module.exports = {
  register,
  login,
  logout
};