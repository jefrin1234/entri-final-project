const bcrypt = require('bcrypt');
const User = require('../../model/userModel');
const {createSellerToken } = require('../../utils/createToken');
const Seller = require('../../model/sellerModel');
const  Admin = require('../../model/adminModel');
const { handleImageUpload } = require('../../utils/imageUpload');
const Notification = require('../../model/notificationModel');
const nodemailer = require('nodemailer');
const Product = require('../../model/productModel');


const sellerSignup = async (req, res,next) => {

  try {

  
    
    const { name, email, password ,accountHolderName,accountNumber,bankName,ifsc,pan,city,state,postalCode,phone,gstinNumber,pickupLocation, businessName} = req.body  
   

   
  

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
    
    if (existingUser) {
     
      return res.status(409).json({
        message: "seller already exists",
        error: true,
        success: false
      })
    }

  

     const saltRounds = 10; 

   
     const hashedPassword = bcrypt.hashSync(password, saltRounds) 
  
     let imageUrl;
   
    if (req.file) {
      imageUrl = await handleImageUpload(req.file.path);
    }

    


     const newSeller = new Seller({ name, email, password: hashedPassword,accountHolderName,accountNumber,bankName,ifsc,registrationCetificate:imageUrl,pan,city,state,postalCode,phone,gstinNumber,pickupLocation, businessName})

    await newSeller.save()
   
    const sellerData = newSeller.toObject();
    delete sellerData.password; 
    



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

   
  } catch (error) {
    return next(error); 
  }


  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: 'jefrinjames212@gmail.com', 
      pass: 'saln jyjr kwfn blrl', 
    },
  });

  // Email details
  const mailOptions = {
    from: 'jefrinjames212@gmail.com',
    to:seller.email,
    subject: 'Seller Verification Success',
    html: `
      <h1>Congratulations!</h1>
      <p>Your seller account has been successfully verified.</p>
      <p><a href="https://entri-final-project-user-page.vercel.app/login">Click here to log in to your account</a></p>
      <p>If you did not request this verification, please contact support.</p>
    `,
  };

  
  try {

    await transporter.sendMail(mailOptions);

    seller.verified = true;
    await seller.save();

    await Product.updateMany(
      { sellerId:seller._id }, 
      { $set: { verified: true } } 
    );

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Failed to verify seller. Email not sent.",
      error: true,
      success: false,
    });
  }

  const sellerData = seller.toObject();
  delete sellerData.password; 
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

    if(existingUser.verified === false){
      return res.status(404).json({
        message:"Not authorized",
        error:false,
        success:true
      })
    }

    const sellerToken = createSellerToken(existingUser._id, "seller");

 

    res.cookie("sellerToken", sellerToken,{
      httpOnly: true,
      secure: true, 
      sameSite: 'None'
    })

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