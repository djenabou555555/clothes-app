const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Access denied"
    });
  }

  try {

    const token = authHeader.split(" ")[1];

    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = verified;

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });

  }

};

module.exports = authMiddleware;