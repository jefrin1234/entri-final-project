const jwt = require("jsonwebtoken");


const adminAuth = (req,res,next)=>{

  const token = req.cookies.token
try{
  
  if(!token){
    return res.status(401).json({
      message:"user not authorized",
      success:false,
      error:true
    })
  }

  const verifyToken = jwt.verify(token,process.env.JWT_SECRET_KEY)

  if(!verifyToken){
    return res.status(401).json({
      message:"user not authorized",
      success:false,
      error:true
    })
  }

  console.log(verifyToken)

  if(verifyToken.roles.includes("admin")){
    req.admin = verifyToken

    next()
  }else{
    return res.json({
      message:"user not authorized",
      success:false,
      error:true
    })
  }


}catch(error){
  next(error)
}


}

module.exports = adminAuth