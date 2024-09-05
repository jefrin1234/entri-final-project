const mongoose = require('mongoose')

const sellerSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
  ,
  password: {
    type: String,
    required:true
  },
  business:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Business'
  },
  role:{
    type:String,
    default:'seller'
  },
  account:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Account'
  },
  verified:{
    type:String,
    default:false
  }
 
},
{
  timestamps:true
})


const Seller = new mongoose.model('Seller', sellerSchema)

module.exports = Seller