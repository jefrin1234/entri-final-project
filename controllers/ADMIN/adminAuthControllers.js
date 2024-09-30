
const bcrypt = require('bcrypt');
const User = require('../../model/userModel');
const {  createAdminToken } = require('../../utils/createToken');
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

    const admin = await Admin.findOne({ email })

 

    if (!admin) {
   
      return res.status(404).json({
        message: "admin not found",
        error: true,
        success: true
      })
    }

    const passwordCheck = bcrypt.compareSync(password, admin.password)

    
    if ( !passwordCheck) {
      return res.json({
        message: "password doesnt match",
        error: true,
        success: false
      })
    }



    const adminToken =  createAdminToken(admin._id, 'admin')

  


    res.cookie("adminToken",adminToken  ,{
      httpOnly: true,
      secure: true, 
      sameSite: 'None'
    })
 

    res.status(200).json({ success: true,data:{id:admin._id,roles:admin.roles}, message: " login successfull" });


  } catch (error) {
    next(error)
  }


}


  
const adminProfile = async(req, res, next)=>{

  try {


 
    const adminId = req.admin.id
   

    const admin = await Admin.findById(adminId).select("-password")

   

    if (!admin) {
      return res.status(404).json({
        message: "user not found",
        success: false,
        error: true
      })
    }

    console.log(admin)
  
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

  

      res.clearCookie("adminToken"  ,{
        httpOnly: true,
        secure: true, 
        sameSite: "None",
      });
      res.json({ message: " logout success", success: true });
  } catch (error) {
     
      next(error)
  }
};




 
const checkAdmin = async (req, res, next) => {
  try {
 
      const { admin } = req;
      if (!admin) {
          res.status(401).json({ success: false, message: "user not autherized" });
      }

      res.json({ success: true, message: "user autherized",data:admin });
  } catch (error) {
     
      res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};




const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.admin.id; 

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

   
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedNewPassword;
    await admin.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};



module.exports = {login,logOut,adminProfile,checkAdmin,changePassword}


