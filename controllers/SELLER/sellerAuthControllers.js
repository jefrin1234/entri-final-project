const bcrypt = require('bcrypt');
const User = require('../../model/userModel');
const { createToken } = require('../../utils/createToken');
const Seller = require('../../model/sellerModel');

const SellerLogin = async (req, res, next) => {

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
      return res.status(401).json({
        message: "seller not authorized",
        error: true,
        success: true
      })
    }

    const token =  createToken(existingUser._id, 'seller')
    
    console.log("tokennnn",token);
    

    res.cookie("token", token);
    res.status(200).json({ success: true,data:existingUser, message: "Seller login successfull" });


  } catch (error) {
    next(error)
  }


}





//controller for user signup
const sellerSignup = async (req, res,next) => {

  try {

    console.log("hitted")
    // console.log(req.file)

                                                                

    const { name, email, password } = req.body  //destructuring  name,email,password and profile picture from the  body

    //checking for all required fields .if name,email,and password not in the request body sending 404 error message
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "all fields are required",
        erro: true,
        success: false
      })
    }

    const existingUser = await Seller.findOne({ email }) //checking for existing user

    // if the user exists sending 404 error, conflict with the current state of the resource which is the email already exists
    if (existingUser) {
      return res.status(409).json({
        message: "seller already exists",
        error: false,
        success: true
      })
    }

    const saltRounds = 10; //determines the  complexity of generating a salt for hashing a password 


   
    const hashedPassword = bcrypt.hashSync(password, saltRounds) // hashing the password

  
    

    const newSeller = new Seller({ name, email, password, password: hashedPassword,role:'seller'}) // creating new user

    await newSeller.save() // saving newuser



    //sending status 201 for creating  new user successfull
    res.status(201).json({
      message: "seller saved",
      data: newSeller,
      success: true,
      error: false
    })

  } catch (error) {
    next(error) // sending error to the next function by using next()
  }

}




const sellerProfile = async (req, res, next) => {

  try {

    const { sellerId } = req.user.id

    const user = await Seller.findById(sellerId)

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
  sellerProfile,sellerLogout}