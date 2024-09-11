const bcrypt = require('bcrypt');
const User = require('../../model/userModel');
const { createToken } = require('../../utils/createToken');
const { cloudinaryInstance } = require("../../config/cloudinaryConfig");
const { handleImageUpload } = require("../../utils/imageUpload");
const { findByIdAndUpdate } = require('../../model/addressModel');


const login = async (req, res, next) => {
   console.log("hteref")
  try {
    const { email, password } = req.body
    // console.log(req.body);
    
    if (!email || !password) {
      return res.status(400).json({
        message: "all fields are required",
        erro: true,
        success: false
      })
    }

    const existingUser = await User.findOne({ email })

    
    

    if (!existingUser) {
      return res.status(404).json({
        message: "user not found",
        error: true,
        success: true
      })
    }

    const passwordCheck = bcrypt.compareSync(password, existingUser.password)

    
    if (!passwordCheck) {
      return res.status(401).json({
        message: "user not authorized",
        error: true,
        success: true
      })
    }

    const token =  createToken(existingUser._id, existingUser.role)

    console.log("tokennnn",token);
    

    res.cookie("token", token);
    res.status(200).json({ success: true,data:{_id:existingUser._id}, message: "user login successfull" });


  } catch (error) {
    next(error)
  }


}


//controller for user signup
const signup = async (req, res,next) => {

  try {

    console.log("hitted")
    // console.log(req.file)

    let imageUrl;

    const { name, email, password } = req.body  //destructuring  name,email,password and profile picture from the  body

    //checking for all required fields .if name,email,and password not in the request body sending 404 error message
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "all fields are required",
        erro: true,
        success: false
      })
    }

    const existingUser = await User.findOne({ email }) //checking for existing user

    // if the user exists sending 404 error, conflict with the current state of the resource which is the email already exists
    if (existingUser) {
      return res.status(409).json({
        message: "user already exists",
        error: false,
        success: true
      })
    }

    const saltRounds = 10; //determines the  complexity of generating a salt for hashing a password 


   
    const hashedPassword = bcrypt.hashSync(password, saltRounds) // hashing the password

    //if the file from the front-end is true then calling the handleImageUpload   function and sending the path that is received from the multer to the function
    if (req.file) {
      imageUrl = await handleImageUpload(req.file.path);
    }

    

    const newUser = new User({ name, email, password: hashedPassword, image: imageUrl }) // creating new user

    await newUser.save() // saving newuser

    //sending status 201 for creating  new user successfull
    res.status(201).json({
      message: "user saved",
      data: {_id:newUser._id},
      success: true,
      error: false
    })

  } catch (error) {
    next(error) // sending error to the next function by using next()
  }

}



const userProfile = async (req, res, next) => {

  try {


    console.log("hited");
    
    const  userId  = req.user.id

    const user = await User.findById(userId).select("-password")

    if (!user) {
      return res.status(404).json({
        message: "user not found",
        success: false,
        error: true
      })
    }

    res.status(200).json({
      message:"user details ",
      data:user,
      success:true,
      error:false
    })

  } catch (error) {

    next(error)

  }


}


const userLogout = async (req, res, next) => {
  try {
      res.clearCookie("token");
      res.json({ message: "user logout success", success: true });
  } catch (error) {
      console.log(error);
      next(error)
  }
};

 
const checkUser = async (req, res, next) => {
  try {
      const { user } = req;
      if (!user) {
          res.status(401).json({ success: false, message: "user not autherized" });
      }

      res.json({ success: true, message: "user autherized" });
  } catch (error) {
      console.log(error);
      res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const userId = req.user.id;

   
    let user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false
      });
    }

    if (!user.roles.includes('admin')) {
      user.roles.push('admin');
    }

  
    await user.save();

    res.status(200).json({
      message: "User role updated",
      error: false,
      success: true,
      data: user
    });
  } catch (error) {
    
    next(error)
  }
};


module.exports = {login,signup, userProfile,userLogout,checkUser,updateUserRole}