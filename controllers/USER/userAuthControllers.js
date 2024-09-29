const bcrypt = require('bcrypt');
const User = require('../../model/userModel');
const { createToken, createUserToken } = require('../../utils/createToken');


const { findByIdAndUpdate } = require('../../model/addressModel');
const { updateMany } = require('../../model/orderModel');
const Rating = require('../../model/ratingModel');
const { options } = require('../../routes');


const login = async (req, res, next) => {
   
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

    const token =  createUserToken(existingUser._id, existingUser.role)


    res.cookie("Token", token,{
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
      sameSite: 'None' // Allows cross-site cookie sending
    })
    res.status(200).json({ success: true,data:{_id:existingUser._id}, message: "user login successfull" });


  } catch (error) {
    next(error)
  }


}


//controller for user signup
const signup = async (req, res,next) => {

  try {

    
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

  
    

    const newUser = new User({ name, email, password: hashedPassword }) // creating new user

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
    console.log("going")  
     
    console.log(req.cookies,"moneee")

    res.clearCookie("Token", {
      sameSite: "None",
      secure: true,
      httpOnly: true,
  });
      
      res.status(200).json({ message: "user logout success", success: true,error:false });
      
  } catch (error) {
    
      next(error)
  }
};

 
const checkUser = async (req, res, next) => {
  try {
    console.log("puuui")
      const { user } = req;
      if (!user) {
          res.status(401).json({ success: false, message: "user not autherized" });
      }

      res.json({ success: true, message: "user autherized",data:user });
  } catch (error) {
     
      res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

const updateUserRole = async (req, res,next) => {
  try {
 
  
    const userId = req.params.userId
   
    let user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false
      });
    }

    if (!user.role.includes('admin')) {
      user.role.push('admin')
    }

  
    await user.save();

  



    res.status(200).json({
      message: "User role updated",
      error: false,
      success: true,
     
    });
  } catch (error) {
    
    next(error)
  }
};


const passwordChange = async(req,res,next)=>{
  const { currentPassword, newPassword } = req.body;
  console.log(currentPassword,newPassword)
  const userId = req.user.id; // Assuming you're using authentication middleware
  console.log(userId,"fffff")
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log(user)
    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}


const getAllUsers =  async(req,res,next)=>{

   try {

    const allUsers = await User.find()

    if(!allUsers){
      return res.status(401).status({
        message:"no users found",
        error:false,
        success:true
      })
    }

    res.status(200).json({
      message:"All users",
      error:false,
      success:true,
      data:allUsers
    })
   } catch (error) {
    next(error)
   }
}


const deleteUser = async(req,res,next)=>{

  try {

    const {userId} = req.params


    await Rating.deleteMany({ userId: userId });


    const user = await User.findByIdAndDelete(userId)

    if(!user){
      return res.status(404).json({
        message:"User not found",
        error:true,
        success:false,
        
      })
    }

    res.status(200).json({
      message:"User deleted",
      error:false,
      success:true
    })

  } catch (error) {
    next(error) 
  }
}


module.exports = {login,signup, userProfile,userLogout,checkUser,updateUserRole,passwordChange,getAllUsers,deleteUser}