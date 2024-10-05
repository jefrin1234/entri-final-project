const Address = require("../../model/addressModel")

const addAddress = async(req,res,next)=>{

try{

  const userId = req.user.id


  const {fullName,phoneNumber,emailAddress,streetAddress,city,state,postalCode} = req.body

 
  if(!fullName || !phoneNumber || !emailAddress || !streetAddress || !city || !state || !postalCode ){
   
    return res.status(409).json({
      message:"All fields are required",
      error:true,
      success:false
    })

  }

 

   const newAddress = new Address({userId,fullName,phoneNumber,emailAddress,streetAddress,city,state,postalCode})



    await newAddress.save()

  

  res.status(201).json({
    message:"new address added",
    data:newAddress,
    error:false,
    success:true
  })

}catch(error){
  next(error)

 
}
}






const deleteAddress = async(req,res,next)=>{

try{

  const userId = req.user.id
  
  const {addressId} = req.body

  if(!addressId){
    return res.status(409).json({
      message:"addressId is required",
      error:false,
      success:true
    })
  }

  const deletedAdress = await Address.findByIdAndDelete({_id:addressId})

  if(!deletedAdress){
    return res.status(404).json({
      message:"couldnt find address",
      error:true,
      success:false
    })
  }

  res.status(200).json({
    message:"adddress deleted",
    success:true,
    error:false
  })

}catch(error){
  
  next(error)
 
}

}


const getAddress = async(req,res,next)=>{

try{
  const userId = req.user.id
 

  const address = await Address.find({userId})



  if(!address || address.length === 0){
    return res.status(404).json({
      message:"counldnt find address",
      error:true,
      success:true
    })
  }

  

  res.status(200).json({
    message:"user address fetched",
    data:address,
    error:false,
    success:true
  })
}catch(error){
  next(error)
}
}

 



const addressById = async(req,res,next)=>{

 try{
  
  const userId = req.user.id
 
  const {addressId} = req.body
  

 


   const address  = await Address.findById(addressId)



  if(!address){
    return res.status(404).json({
      message:"counldnt find address",
      error:true,
      success:false
    })
  }

  res.status(200).json({
    message:"address details",
    data:address,
    error:false,
    success:true
  })


 }catch(error){

   next(error)

 }
}

const updateAddress = async (req, res, next) => {

  try {
    const userId = req.user.id

    const { addressId, ...addressData } = req.body

    if (!addressId) {
      return res.status(409).json({
        message: "provide address id",
        error: true,
        success: false
      })
    }

    const updatedAdress = await Address.findOneAndUpdate({ _id: addressId, userId }, { ...addressData }, { new: true })

    if (!updatedAdress) {
      return res.status(409).json({
        message: "couldnt find address",
        error: true,
        success: false
      })
    }


    res.status(200).json({
      message: "address updated",
      data: updatedAdress,
      success: true,
      error: false
    })
  } catch (error) {
    next(error)
  }
}






module.exports = {addAddress,deleteAddress
,getAddress,addressById,updateAddress}