const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  sellerId:{
      type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller'
  },
  name:{
    type:String,
    required:true,
  },
  category:{
    type:String,
    required:true
  },
  colour:{
    type:String,
    required:true
  },
  images:{
    type:[String],
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  sellingPrice:{
    type:Number,
    required:true
  },
  brand:{
    type:String,
    required:true 
  },
  stock:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  ratings:{
    type:mongoose.Schema.Types.ObjectId, 
   ref:'Rating'
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



const Product = new mongoose.model('Product',productSchema)


module.exports = Product