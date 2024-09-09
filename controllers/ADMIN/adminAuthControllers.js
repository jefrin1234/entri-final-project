
const bcrypt = require('bcrypt');
const User = require('../../model/userModel');
const { createToken } = require('../../utils/createToken');
const Admin = require('../../model/adminModel');




//controller for user signup
const signup = async (req, res,next) => {

  try {

    console.log("hitted")
    // console.log(req.file)

    

    const {  email, password } = req.body  //destructuring  name,email,password and profile picture from the  body

    //checking for all required fields .if name,email,and password not in the request body sending 404 error message


  
    // if the user exists sending 404 error, conflict with the current state of the resource which is the email already exists


    const saltRounds = 10; //determines the  complexity of generating a salt for hashing a password 


   
    const hashedPassword = bcrypt.hashSync(password, saltRounds) // hashing the password

    //if the file from the front-end is true then calling the handleImageUpload   function and sending the path that is received from the multer to the function

    

    const newAdmin = new Admin({  email, password: hashedPassword, }) // creating new user

    await newAdmin.save() // saving newuser

    //sending status 201 for creating  new user successfull
    res.status(201).json({
      message: "admin saved",
      data: newAdmin,
      success: true,
      error: false
    })

  } catch (error) {
    next(error) // sending error to the next function by using next()
  }

}


const login = async (req, res, next) => {

  try {
   


    const { email, password } = req.body
     console.log("=='][][",req.body);
    
    if (!email || !password) {
      return res.status(400).json({
        message: "all fields are required",
        erro: true,
        success: false
      })
    }

    const admin = await Admin.findOne({ email })

    console.log("admin",admin)

    if (!admin) {
      return res.status(404).json({
        message: "couldnt find admin account",
        error: true,
        success: true
      })
    }

    const passwordCheck = bcrypt.compareSync(password, admin.password)

    
    if (!passwordCheck) {
      return res.status(401).json({
        message: "user not authorized",
        error: true,
        success: false
      })
    }


    

    const token =  createToken(admin._id,'admin')

    console.log("tokennnn",token);
    

    res.cookie("token", token);
    res.status(200).json(
      {  message: "admin login successfull",
         success: true,
         data:admin,
         });


  } catch (error) {
    next(error)
  }

}

  
const adminProfile = async(req, res, next)=>{

  try {


    console.log("hited");
    
    const adminId = req.user.id
    const role   = req.user.role

    const admin = await User.findById(adminId)

    if (!admin) {
      return res.status(404).json({
        message: "user not found",
        success: false,
        error: true
      })
    }

    if(admin.role != 'admin'){
      return  res.status(401).json({
        Message:"error getting details",
        erro:true,
        success:false
      })
    }


    res.status(200).json({
      message:"admin profile details",
      data:admin,
      error:false,
      success:true
    })

  } catch (error) {

    next(error)

  }


}


const logOut = async (req, res, next) => {
  try {
      res.clearCookie("token");
      res.json({ message: " logout success", success: true });
  } catch (error) {
      console.log(error);
      next(error)
  }
};

 




module.exports = {login,logOut,adminProfile,signup}


