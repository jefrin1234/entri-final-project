const Account = require("../../model/accountModel")

const addBankAccount = async(req,res)=>{

try {
  const sellerId = req.user.id

  const {accountHolderName,accountNumber,ifsc,bankName} = req.body

  if(!accountHolderName || !accountNumber || !ifsc || !bankName){
    return res.status(409).json({
      message:"all fields are required",
      error:true,
      success:false
    })
  }

  const existingBankDetails = await Account.find({ifsc,accountNumber,accountHolderName})

  if(existingBankDetails){
    return res.status(401).json({
      message:"Invalid account details"
    })
  }

  const newAccount = new Account({
    sellerId,
    ifsc,
    accountHolderName,
    bankName,
    accountNumber
  })

  await newAccount.save()

  res.status(201).json({
    message:"new account created",
    data:newAccount,
    error:false,
    success:true
  })
} catch (error) {
  next(error)
}
 


}

module.exports = {addBankAccount}