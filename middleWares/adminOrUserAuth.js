const jwt = require("jsonwebtoken");

const adminOrUserAuth = (req, res, next) => {
  const adminToken = req.cookies.adminToken;
  const userToken = req.cookies.token; 

  if (!adminToken && !userToken) {
    return res.status(401).json({
      message: "No token provided",
      success: false,
      error: true,
    });
  }

  try {
  
    if (adminToken) {
      const verifyAdminToken = jwt.verify(adminToken, process.env.JWT_SECRET_KEY);

      if (verifyAdminToken && verifyAdminToken.roles.includes("admin")) {
        req.admin = verifyAdminToken;
        return next(); 
      }
    }

    
    if (userToken) {
      const verifyUserToken = jwt.verify(userToken, process.env.JWT_SECRET_KEY);

      if (verifyUserToken && verifyUserToken.roles.includes("user")) {
        req.user = verifyUserToken
        return next();
      }
    }
   return res.status(401).json({
      message: "Invalid token or insufficient permissions",
      success: false,
      error: true,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = adminOrUserAuth;
