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
  role:{
    type:[String],
    default:['user']
  },  
  deleted: { type: Boolean, default: false },
},
{
  timestamps:true
})

const User = new mongoose.model('User',userSchema)

module.exports = User