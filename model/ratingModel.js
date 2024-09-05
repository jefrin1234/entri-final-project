const mongoose = require('mongoose')

const ratingSchema = new mongoose.Schema({
  userId:{
   type:mongoose.Schema.Types.ObjectId, 
   ref:'User'
  },
  productId:{
     type:mongoose.Schema.Types.ObjectId, 
   ref:'Product'
  },
  rating:{
    type:String,
    
  },
  comment:{
    type:String
  }
},
{
  timestamps:true
}
)


const Rating = new mongoose.model('Rating',ratingSchema)

module.exports = Rating