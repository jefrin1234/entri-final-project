const mongoose = require('mongoose')

const purchaseSchema = new mongoose.Schema({
  userId:{
   type:mongoose.Schema.Types.ObjectId, 
   ref:'User'
  },
  productId:{
     type:mongoose.Schema.Types.ObjectId, 
   ref:'Product'
  },
  purchaseDate: { type: Date, default: Date.now },
},
{
  timestamps:true
})


const Purchase = new mongoose.model('Purchase',purchaseSchema)

module.exports = Purchase