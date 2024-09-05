const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  image:
   {
   type:String,
   default:'https://static.vecteezy.com/system/resources/thumbnails/005/129/844/small_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg'
  },
  role:{
    type:[String],
    default:['user']
  },  
},
{
  timestamps:true
})

const User = new mongoose.model('User',userSchema)

module.exports = User