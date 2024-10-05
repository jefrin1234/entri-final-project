

const jwt = require("jsonwebtoken");



const adminAuth = (req, res, next) => {
 
  const token = req.cookies.adminToken; 


  if (!token) {
    return res.status(401).json({
      message: "No token provided",
      success: false,
      error: true,
    });
  }

  try {
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

 

    if (!verifyToken || !verifyToken.roles.includes('admin')) {
      
      return res.status(403).json({
        message: "Permission denied",
        success: false,
        error: true,
      });
    }


    req.admin = verifyToken; 
  
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = adminAuth;

