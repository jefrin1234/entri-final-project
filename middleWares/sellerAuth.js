const jwt = require("jsonwebtoken");


const sellerAuth = (req,res,next)=>{

  const token = req.cookies.token


try{
  
  if(!token){
    return res.status(401).json({
      message:"no token provided",
      success:false,
      error:true
    })
  }

  const verifyToken = jwt.verify(token,process.env.JWT_SECRET_KEY)

  console.log("+++++",verifyToken)

  if(!verifyToken){
    return res.status(401).json({
      message:"seller not authorized",
      success:false,
      error:true
    })
  }

  if(!verifyToken.roles.includes("admin") && !verifyToken.roles.includes("seller")){
   return res.status(401).json({
    message:" permission denied",
    error:false,
    success:true
   })
  }
  req.user = verifyToken
  next()
}catch(error){
  next(error)
}


}

module.exports = sellerAuth