const Business = require("../../model/businessModel")
const { handleImageUpload } = require("../../utils/imageUpload")

const  addbusinessDetails = async (req,res,next)=>{

try{
  console.log("hitted")
    const sellerId = req.user.id

   const { pan,city,state,postalCode,phone,gstinNumber,pickupLocation } = req.body
   console.log(req.body)

   console.log(req.files)

   if(!pan || !city || !state || !postalCode || !phone || !gstinNumber || !pickupLocation){
    return res.status(409).json({
      message:"all fields are required",
     error:true,
     success:false
    })
   }

  const checkBusiness = await Business.findOne({gstinNumber,pan})

  if(checkBusiness){
    return res.status(401).json({
      message:" invalid bussiness details",
      error:true,
      success:false
    })
  }

  let imageUrls = [];

  if (req.files && req.files.length > 0) {
    // Loop through each file and upload it
    for (const file of req.files) {
      const imageUrl = await handleImageUpload(file.path);
      imageUrls.push(imageUrl); // Collect the URL of the uploaded image
    }
  }

  console.log(imageUrls,"+_+_+_")

  const bussinessDetails = new Business({
    sellerId,
    city,
    state,
    postalCode,
    phone,
    gstinNumber,
    pan,
    pickupLocation,
    registrationCetificate:imageUrls
  }) 

  await bussinessDetails.save()

  res.status(201).json({
    message:"New business details added",
    data:bussinessDetails,
    error:false,
    success:true
  })
}catch(error){
   next(error)
}

  
  

}


// const updateBusinessDetails = async(req,res,next)=>{
  
//   // const businessId = req.params.id

// }




module.exports = {addbusinessDetails,}