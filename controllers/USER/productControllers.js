const Product = require("../../model/productModel");
const { handleImageUpload } = require("../../utils/imageUpload");

const addProduct = async(req,res,next)=>{

  try{
    
    
   console.log("hitted");
   
      
    const {name,category,brand,price,sellingPrice,stock,description,sellerId} = req.body
   
    //  console.log(req.files)
    if(!name || !category  || !price || !sellingPrice || !description || !sellerId ||!stock){
      return res.status(409).json({
        message:"all fields are required",
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

    console.log(imageUrls,"image+++++++")


    const product = new Product({
      sellerId,
      name,
      category,
      brand,
      images:imageUrls,
      price,
      sellingPrice,
      stock,
      description,
    })

    console.log(product,"proooooo")

    const newProduct = await product.save()

    res.status(201).json({
      message:"product added",
      data:newProduct,
      error:false,
      success:true
    })


  }catch(error){
    next(error)
  }

}






const getAllProducts = async(req,res,next)=>{

  
 try{
  
  console.log("hitted")

  const products = await Product.find({})

  if(!products || products.length === 0){
    return res.status(404).json({
      message:"No products found",
      error:true,
      success:false
    })
  }

  res.status(200).json({
    message:"All products",
    data:products,
    error:false,
    success:true
  })
 }catch(error){

  next(error)

 }


}




const getProductById =  async(req,res,next)=>{

try{

  const productId = req.params.productId
  console.log("hirr")
  const product = await Product.findById({_id:productId})

  if(!product){

    return res.status(404).json({
      message:"Product not found",
      error:false,
      success:true
    })
  }

  res.status(200).json({
    message:"Product details",
    error:true,
    data:product,
    success:false
  })

}catch(error){

  next(error)

}

}



const productByCategory = async(req,res)=>{

 const {category} = req.query
 console.log("hites")
 console.log(category)

 const products = await Product.find({category})

 if(!products){
  res.status(404).json({
    message:"error fetching products",
    error:true,
    success:false
  })
 }


 res.json({
  message:"Category products",
  data:products,
  success:true,
  error:false
 })


}


const productsByQueries = async(req,res,next)=>{

try {

  const {category,name,price,brand} = req.query

  // {category:men}
  // {type:top}
  // {brand:adidas}
  // {price:lo-high}

  console.log(category,name,price,brand)

  let filterings = {}
  
  if(category){
    filterings.category =  new RegExp(category, 'i');
    
  }
  if(name){
    filterings.type = new RegExp(name, 'i');
  }
  if(brand){
    filterings.brand = new RegExp(brand, 'i');
  }

  let sortings = {}

  if(price && price === 'low-high'){
   sortings.sellingPrice = 1
  }
  if(price && price === 'high-low'){
    sortings.sellingPrice = -1
  }

  console.log({category:category,name:name,brand:brand,})

    const products = await Product.find({category:category,name:name,brand:brand,}).sort(sortings)

  if(!products || products.length == 0){
    return res.status(404).json({
      message:"products not found",
      error:true,
      success:false
    })
  }

  res.status(200).json({
    message:"products  ",
    data:products,
    error:false,
    success:true
  })

  console.log("products",products)

} catch (error) {

  next(error)

}


}
 






module.exports = {addProduct,getAllProducts,
  getProductById,productByCategory,productsByQueries}

