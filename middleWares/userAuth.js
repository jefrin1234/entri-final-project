const jwt = require("jsonwebtoken");

const userAuth = (req, res, next) => {

  try {
   
    const token = req.cookies.Token


   
    if (!token) {
      return res.status(401).json({
        message: "user not authorized",
        success: false,
        error: true
      })
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY)

    

    if (!verifyToken) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
        error: true
      })
    }

    req.user = verifyToken

    next()


  } catch (error){

    next(error)

  }



}

module.exports = userAuth