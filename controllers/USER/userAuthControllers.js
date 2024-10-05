const bcrypt = require('bcrypt');
const User = require('../../model/userModel');
const { createToken, createUserToken } = require('../../utils/createToken');


const Rating = require('../../model/ratingModel');
const Admin = require('../../model/adminModel');



const login = async (req, res, next) => {
   
  try {
    const { email, password } = req.body
    
    
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

    


    res.cookie("Token",token,{
      httpOnly: true,
      secure: true, 
      sameSite: 'None' 
    })

    


    res.status(200).json({ success: true,data:{_id:existingUser._id}, message: "user login successfull" });


  } catch (error) {
    next(error)
  }


}


const signup = async (req, res,next) => {

  try {

    
    const { name, email, password } = req.body  //
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "all fields are required",
        erro: true,
        success: false
      })
    }

    const existingUser = await User.findOne({ email }) //

    if (existingUser) {
      return res.status(409).json({
        message: "user already exists",
        error: false,
        success: true
      })
    }

    const saltRounds = 10; 


   
    const hashedPassword = bcrypt.hashSync(password, saltRounds) 

  
    

    const newUser = new User({ name, email, password: hashedPassword })

    await newUser.save() 

   
    res.status(201).json({
      message: "user saved",
      data: {_id:newUser._id},
      success: true,
      error: false
    })

  } catch (error) {
    next(error) 
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
    
   
   
   
    res.clearCookie("Token" ,{
      httpOnly: true,
      secure: true, 
      sameSite: "None",
    })

      
      res.status(200).json({ message: "user logout success", success: true,error:false });
      
  } catch (error) {
    
      next(error)
  }
};

 
const checkUser = async (req, res, next) => {
  try {
  
      const { user } = req;
      if (!user) {
          res.status(401).json({ success: false, message: "user not autherized" });
      }

      res.json({ success: true, message: "user autherized",data:user });
  } catch (error) {
     
      res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    
    const userId = req.params.userId;

    let user = await User.findOne({ _id: userId });


   
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false
      });
    }

   
    if (!user.role.includes('admin')) {
      user.role.push('admin');


      
      const newAdmin = new Admin({
        email: user.email,
        password: user.password, 
      });
      await newAdmin.save();
     
    }

    await user.save();



    res.status(200).json({
      message: "User role updated",
      error: false,
      success: true
    });
  } catch (error) {

    next(error);
  }
};



const passwordChange = async(req,res,next)=>{
  const { currentPassword, newPassword } = req.body;

  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }


    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

   
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

   
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
  
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