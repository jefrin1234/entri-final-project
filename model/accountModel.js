const mongoose = require('mongoose')
 
const accountSchema = new mongoose.Schema({

  sellerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Seller'
  },
  accountHolderName:{
    type:String,
    required:true
  },
  accountNumber:{
    type:String,
    required:true
  },
  bankName:{
    type:String,
    required:true,
  },
  ifsc:{
    type:String,
    required:true
  },
 
})

const Account = new mongoose.model('Account',accountSchema)

module.exports = Account