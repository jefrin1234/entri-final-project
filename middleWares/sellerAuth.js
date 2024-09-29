


const jwt = require("jsonwebtoken");

const sellerAuth = (req, res, next) => {
  const token = req.cookies.sellerToken; 
  
  

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
      success: false,
      error: true,
    });
  }

  try {
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!verifyToken || !verifyToken.roles.includes("seller")) {
      return res.status(403).json({
        message: "Permission denied",
        success: false,
        error: true,
      });
    }

    console.log(verifyToken,"KKKKK")

    req.seller = verifyToken; 
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = sellerAuth;
