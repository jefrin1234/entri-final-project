const bcrypt = require('bcrypt');
const User = require('../../model/userModel');
const {createSellerToken } = require('../../utils/createToken');
const Seller = require('../../model/sellerModel');
const  Admin = require('../../model/adminModel');
const { handleImageUpload } = require('../../utils/imageUpload');
const Notification = require('../../model/notificationModel');
const nodemailer = require('nodemailer');


//controller for seller  account creation
const sellerSignup = async (req, res,next) => {

  try {

  
     //destructuring  name,email,password and profile picture from the  body
    const { name, email, password ,accountHolderName,accountNumber,bankName,ifsc,pan,city,state,postalCode,phone,gstinNumber,pickupLocation, businessName} = req.body  
   

   
  
  //  checking for all required fields .if name,email,and password not in the request body sending 404 error message
    if (!name || !email || !password || !accountHolderName || !accountNumber || !bankName || !ifsc ||  !pan || !city || !state || !postalCode || !phone || !gstinNumber || !pickupLocation || ! businessName ) {
      return res.status(400).json({
        message: "all fields are required",
        error: true,
        success: false
      })
    }

    const existingUser = await Seller.findOne({
    accountNumber,deleted: false
    });
    //checking for existing user

   
   
   // if the user exists sending 404 error, conflict with the current state of the resource which is the email already exists
    if (existingUser) {
     
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

    


     const newSeller = new Seller({ name, email, password: hashedPassword,accountHolderName,accountNumber,bankName,ifsc,registrationCetificate:imageUrl,pan,city,state,postalCode,phone,gstinNumber,pickupLocation, businessName}) // creating new user


    await newSeller.save() // saving newSeller
   
    const sellerData = newSeller.toObject();
    delete sellerData.password; // Removing the password field
    



   const admins = await Admin.find()

   for( let admin of admins){
      const notification = new Notification({
        senderId:newSeller._id,
        receiverId:admin._id,
        message:"Seller verification request",
        data:sellerData
      })
      await notification.save()
   }

   
   

    res.status(201).json({
      message: "seller account created waiting for varification",
      data: {_id:sellerData._id},
      success: true,
      error: false
    })

  } catch (error) {
    next(error)
  }

}


const verifySeller = async (req, res, next) => {
  const { sellerId } = req.body;
  const adminId = req.admin.id;
 
  let seller;

  try {
    seller = await Seller.findById(sellerId);

    if (!seller) {
      return res.status(404).json({
        message: "Seller not found",
        error: true,
        success: false,
      });
    }

    seller.verified = true;
    await seller.save();
  } catch (error) {
    return next(error); // Pass the error to the error-handling middleware
  }

  // Setup nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or another email service provider
    auth: {
      user: 'jefrinjames212@gmail.com', // your email
      pass: 'saln jyjr kwfn blrl', // your email password or an application-specific password
    },
  });

  // Email details
  const mailOptions = {
    from: 'jefrinjames212@gmail.com',
    to: seller.email,
    subject: 'Seller Verification Success',
    html: `
      <h1>Congratulations!</h1>
      <p>Your seller account has been successfully verified.</p>
      <p><a href="http://localhost:5173/login">Click here to log in to your account</a></p>
      <p>If you did not request this verification, please contact support.</p>
    `,
  };

  // Try sending the email
  try {
    await transporter.sendMail(mailOptions);
   
  } catch (error) {
    return next(error); // If email sending fails, pass the error to the next middleware and exit
  }

  const sellerData = seller.toObject();
  delete sellerData.password; // Removing the password 

  // If everything works, send the success response
  return res.status(200).json({
    message: "Seller verification success",
    error: false,
    success: true,
  });
};


const SellerLogin = async (req, res, next) => {

  try {
    const { email, password } = req.body
     
    
    
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

  
    if ( !passwordCheck) {
      return res.json({
        message: "password doesnt match",
        error: true,
        success: false
      })
    }

    const sellerToken = createSellerToken(existingUser._id, "seller");


  

    res.cookie("sellerToken", sellerToken);
    res.status(200).json({ success: true,data:{id:existingUser._id,roles:existingUser.roles}, message: "Seller login successfull" });


  } catch (error) {
    next(error)
  }


}





const sellerProfile = async (req, res, next) => {

  try {

    const sellerId = req.seller?.id || req.params.sellerId 

    const seller = await Seller.findById(sellerId).select("-password")

    

    if (!seller) {
      return res.status(404).json({
        message: "user not found",
        success: false,
        error: true
      })
    }

    res.status(200).json({
      message:"seller details ",
      data:seller,
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
    


     
      if (!seller) {
        return   res.status(401).json({ success: false, message: " not autherized route" });
        
      }

      res.json({ success: true, message: " autherization success",data:seller });
  } catch (error) {
    
     next(error)
  }
};



const sellerLogout = async (req, res, next) => {
  try {
      res.clearCookie("sellerToken");
      res.json({ message: "seller logout success", success: true });
  } catch (error) {
    
      next(error)
  }
};


 



module.exports = {sellerSignup,SellerLogin,
  sellerProfile,sellerLogout,verifySeller,checkSeller}