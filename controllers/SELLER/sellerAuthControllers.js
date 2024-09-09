const bcrypt = require('bcrypt');
const User = require('../../model/userModel');
const { createToken } = require('../../utils/createToken');
const Seller = require('../../model/sellerModel');
const  Admin = require('../../model/adminModel');
const { handleImageUpload } = require('../../utils/imageUpload');
const Notification = require('../../model/notificationModel');
const nodemailer = require('nodemailer');


//controller for seller  account creation
const sellerSignup = async (req, res,next) => {

  try {

    console.log("hited")
  
     //destructuring  name,email,password and profile picture from the  body
    const { name, email, password ,accountHolderName,accountNumber,bankName,ifsc,pan,city,state,postalCode,phone,gstinNumber,pickupLocation, businessName} = req.body  

    req.file
   

    //checking for all required fields .if name,email,and password not in the request body sending 404 error message
    if (!name || !email || !password || !accountHolderName || !accountNumber || !bankName || !ifsc ||  !pan || !city || !state || !postalCode || !phone || !gstinNumber || !pickupLocation || ! businessName) {
      return res.status(400).json({
        message: "all fields are required",
        error: true,
        success: false
      })
    }

    const existingUser = await Seller.findOne({
      $or: [
        { email },
        { accountNumber },
        { gstinNumber }
      ]
    });
    //checking for existing user

    //if the user exists sending 404 error, conflict with the current state of the resource which is the email already exists
    if (existingUser) {
      console.log("error ")
      return res.status(409).json({
        message: "seller already exists",
        error: true,
        success: false
      })
    }

    const saltRounds = 10; //determines the  complexity of generating a salt for hashing a password 


   
    const hashedPassword = bcrypt.hashSync(password, saltRounds) // hashing the password

  
    let imageUrl;
   
    if (req.file) {
      imageUrl = await handleImageUpload(req.file.path);
    }

        console.log("image path++++",imageUrl)
      
    
    

    const newSeller = new Seller({ name, email, password: hashedPassword,accountHolderName,accountNumber,bankName,ifsc,registrationCetificate:imageUrl,pan,city,state,postalCode,phone,gstinNumber,pickupLocation, businessName}) // creating new user

    await newSeller.save() // saving newSeller

    console.log("new seller -=--+-",newSeller)

   const admins = await Admin.find()

   for( let admin of admins){
      const notification = new Notification({
        senderId:newSeller._id,
        receiverId:admin._id,
        message:"Seller verification request",
        data:newSeller
      })
      await notification.save()
   }

   
   

    //sending status 201 for creating  new user successfull
    res.status(201).json({
      message: "seller account created waiting for varification",
      data: newSeller,
      success: true,
      error: false
    })

  } catch (error) {
    next(error) // sending error to the next function by using next()
  }

}


const verifySeller = async(req,res)=>{

  const {sellerId} = req.body
  const adminId = req.admin.id

  let seller = await Seller.findById(sellerId)

  if(!seller){
    return res.status(404).json({
      message:"seller not found",
      error:true,
      success:false
    })
  }

  seller.verified = true

  await seller.save()

  const transporter = nodemailer.createTransport({
    service: 'gmail', // or another email service provider
    auth: {
      user: 'jefrinjames212@gmail.com', // your email
      pass: 'saln jyjr kwfn blrl' // your email password or an application-specific password
    }
  });

  const mailOptions = {
    from: 'jefrinjames212@gmail.com',
    to: seller.email,
    subject: 'Seller Verification Success',
    html: `
      <h1>Congratulations!</h1>
      <p>Your seller account has been successfully verified.</p>
      <p><a href=http://localhost:5173/login>Click here to log in to your account</a></p>
      <p>If you did not request this verification, please contact support.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully.');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }


  res.status(200).json({
    message:"seller verification success",
    data:seller,
    error:false,
    success:true
  })



}


const SellerLogin = async (req, res, next) => {

  try {
    const { email, password } = req.body
     console.log(req.body);
    
    if (!email || !password) {
      return res.status(400).json({
        message: "all fields are required",
        erro: true,
        success: false
      })
    }

    const existingUser = await Seller.findOne({ email })

    
    

    if (!existingUser) {
      return res.status(404).json({
        message: "seller not found",
        error: true,
        success: true
      })
    }

    const passwordCheck = bcrypt.compareSync(password, existingUser.password)

    
    if (!passwordCheck) {
      return res.json({
        message: "password doesnt match",
        error: true,
        success: false
      })
    }

    const token =  createToken(existingUser._id, 'seller')

    

    res.cookie("token", token);
    res.status(200).json({ success: true,data:existingUser, message: "Seller login successfull" });


  } catch (error) {
    next(error)
  }


}





const sellerProfile = async (req, res, next) => {

  try {

    const { sellerId } = req.user.id

    const user = await Seller.findOne(sellerId)

    if (!user) {
      return res.status(404).json({
        message: "user not found",
        success: false,
        error: true
      })
    }

    res.status(200).json({
      message:"seller details ",
      data:user,
      success:true,
      error:false
    })

  } catch (error) {

    next(error)

  }


}



const checkSeller = async (req, res, next) => {
  try {
      const { seller } = req;
      console.log(seller,"sekler")


     
      if (!seller) {
        return   res.status(401).json({ success: false, message: " not autherized route" });
        
      }

      res.json({ success: true, message: " autherization success",data:seller });
  } catch (error) {
      console.log(error);
     next(error)
  }
};



const sellerLogout = async (req, res, next) => {
  try {
      res.clearCookie("token");
      res.json({ message: "seller logout success", success: true });
  } catch (error) {
      console.log(error);
      next(error)
  }
};


 



module.exports = {sellerSignup,SellerLogin,
  sellerProfile,sellerLogout,verifySeller,checkSeller}