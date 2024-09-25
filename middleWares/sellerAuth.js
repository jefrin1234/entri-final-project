// const jwt = require("jsonwebtoken");


// const sellerAuth = (req,res,next)=>{

//   const token = req.cookies.token


// try{
  
//   if(!token){
//     return res.status(401).json({
//       message:"no token provided",
//       success:false,
//       error:true
//     })
//   }

//   const verifyToken = jwt.verify(token,process.env.JWT_SECRET_KEY)

//   console.log(verifyToken)

  

//   if(!verifyToken){
//     return res.status(401).json({
//       message:"seller not authorized",
//       success:false,
//       error:true
//     })
//   }

//   if(!verifyToken.roles.includes("seller") ){
//    return res.status(401).json({
//     message:" permission denied",
//     error:false,
//     success:true
//    })
//   }
//   req.seller = verifyToken
//   next()
// }catch(error){
//   next(error)
// }


// }

// module.exports = sellerAuth


const jwt = require("jsonwebtoken");

const sellerAuth = (req, res, next) => {
  const token = req.cookies.sellerToken; // Look for 'sellerToken'

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

    req.seller = verifyToken; // Attach seller info to request
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = sellerAuth;
