const jwt = require("jsonwebtoken");

const adminOrSellerAuth = (req, res, next) => {
  const adminToken = req.cookies.adminToken; 
  const sellerToken = req.cookies.sellerToken; 

 
  if (!adminToken && !sellerToken) {
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

    if (sellerToken) {
      const verifySellerToken = jwt.verify(sellerToken, process.env.JWT_SECRET_KEY);

      if (verifySellerToken && verifySellerToken.roles.includes("seller")) {
        req.seller = verifySellerToken;
        console.log("reached ivide")
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

module.exports = adminOrSellerAuth;
