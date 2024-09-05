const mongoose = require('mongoose') //importing mongoose

const ConnectDB = async()=>{
  try{
    await mongoose.connect(process.env.MONGO_URL) // connecting  with the database
  console.log("connected")
  }catch(error){
    console.log(error)
  }
 
}

module.exports = ConnectDB