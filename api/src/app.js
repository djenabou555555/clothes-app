const express = require("express");
const cors = require("cors");

require("./config/db");
const userRoutes = require("./routes/userRoutes");
const clothesRoutes = require("./routes/clothesRoutes");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/clothes", clothesRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Clothes API is running successfully"
  });
});

module.exports = app;