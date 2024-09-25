const jwt = require("jsonwebtoken");

const anyAuth = (req, res, next) => {
  const adminToken = req.cookies.adminToken; // Token for admin
  const sellerToken = req.cookies.sellerToken; // Token for seller

  // Check if either token is present
  if (!adminToken && !sellerToken) {
    return res.status(401).json({
      message: "No token provided",
      success: false,
      error: true,
    });
  }

  try {
    // If adminToken is present, verify it
    if (adminToken) {
      const verifyAdminToken = jwt.verify(adminToken, process.env.JWT_SECRET_KEY);

      if (verifyAdminToken && verifyAdminToken.roles.includes("admin")) {
        req.admin = verifyAdminToken; // Admin is authenticated
        return next(); // Proceed to the controller
      }
    }

    // If sellerToken is present, verify it
    if (sellerToken) {
      const verifySellerToken = jwt.verify(sellerToken, process.env.JWT_SECRET_KEY);

      if (verifySellerToken && verifySellerToken.roles.includes("seller")) {
        req.seller = verifySellerToken; // Seller is authenticated
        console.log("reached ivide")
        return next(); // Proceed to the controller
      }
    }

    // If neither token is valid
    return res.status(401).json({
      message: "Invalid token or insufficient permissions",
      success: false,
      error: true,
    });

  } catch (error) {
    next(error); // Pass any token-related error to the error handler
  }
};

module.exports = anyAuth;
