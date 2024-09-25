// const jwt = require("jsonwebtoken");


// const adminAuth = (req,res,next)=>{

//   const token = req.cookies.token
// try{
  
//   if(!token){
//     return res.status(401).json({
//       message:"user not authorized",
//       success:false,
//       error:true
//     })
//   }

//   const verifyToken = jwt.verify(token,process.env.JWT_SECRET_KEY)

//   if(!verifyToken){
//     return res.status(401).json({
//       message:"user not authorized",
//       success:false,
//       error:true
//     })
//   }



//   if(verifyToken.roles.includes("admin")){
//     req.admin = verifyToken

//     next()
//   }else{
//     return res.json({
//       message:"user not authorized",
//       success:false,
//       error:true
//     })
//   }


// }catch(error){
//   next(error)
// }


// }

// module.exports = adminAuth


const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  const token = req.cookies.adminToken; // Look for 'adminToken'

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
      success: false,
      error: true,
    });
  }

  try {
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!verifyToken || !verifyToken.roles.includes("admin")) {
      return res.status(403).json({
        message: "Permission denied",
        success: false,
        error: true,
      });
    }

    req.admin = verifyToken; // Attach admin info to request
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = adminAuth;
