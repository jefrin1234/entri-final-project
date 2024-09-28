
const Product = require("../../model/productModel");
const Seller = require("../../model/sellerModel");

const getAllSellers = async (req, res, next) => {
  try {
   
    const adminId = req.admin.adminId;

  
    const sellers = await Seller.find({deleted:false})
      .sort({ createdAt: -1 })
      .select("email phone state businessName verified");

     
    if (!sellers || sellers.length === 0) {
      return res.status(404).json({
        message: "No sellers found",
        error: true,
        success: false,
      });
    }

    res.status(200).json({
      message: "All sellers",
      error: false,
      success: true,
      data: sellers,
    });
  } catch (error) {
    next(error);
  }
};


const deleteSeller = async(req,res,next)=>{
  

try {

  const sellerId = req.params.sellerId

  const seller = await Seller.findByIdAndDelete(sellerId)

  if(!seller){

    return res.status(404).json(

      {
        message:"seller not found",
        error:true,
        success:false
      }

    )
  }

  res.status(200).json({
    message:"Seller account deleted",
    error:false,
    success:true
  })

} catch (error) {

  next(error)

}
}


const unverifySeller = async(req,res,next)=>{

  try {
    const sellerId = req.params.sellerId

  const seller = await Seller.findById(sellerId)

  if(!seller){
    return res.status(404).json({
      message:"seller not found",
      error:true,
      success:false
    })
  }

  seller.verified = false

 await seller.save()


 const products = await Product.find({sellerId})

 if(products){
  await Product.updateMany(
    { sellerId }, 
    { $set: { verified: false } } 
  );
 }

 const updatedProducts = await Product.find({ sellerId });

 console.log(updatedProducts);

 res.status(200).json({
  message:"seller account unverified",
  error:false,
  success:true
 })

  } catch (error) {
    next(error)
  }

   
}

module.exports = { getAllSellers,deleteSeller,unverifySeller };
