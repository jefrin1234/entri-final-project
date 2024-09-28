const mongoose = require('mongoose')

const sellerSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique:true
  }
  ,
  password: {
    type: String,
    required:true
  },
  businessName:{
    type:String,
    required:true                  
  },
  city: {                                   
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  phone:{
    type:Number,
    required:true,
    unique:true
  },
  pan:{
    type:String,
    required:true,
    unique:true
  },

  gstinNumber: {
    type: String,
    required: true,
    unique:true,

  },
  registrationCetificate:{
    type:[String],
    required:true
  },
  pickupLocation:{
    type:String,
    required:true
  },
  accountHolderName:{
    type:String,
    required:true
  },
  accountNumber:{
    type:String,
    required:true,
    unique:true
  },
  bankName:{
    type:String,
    required:true,
  },
  ifsc:{
    type:String,
    required:true
  },
  verified:{
    type:Boolean,
    default:false
  },
  deleted: { type: Boolean, default: false },
 
},
{
  timestamps:true
})


const Seller = new mongoose.model('Seller', sellerSchema)

module.exports = Seller