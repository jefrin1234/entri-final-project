const Product = require("../../model/productModel");
const { handleImageUpload } = require("../../utils/imageUpload");

const addProduct = async (req, res, next) => {

  const sellerId = req.seller.id

  try {

    const { name, category, brand, price, sellingPrice, stock, description,colour } = req.body

    
    if (!name || !category || !price || !sellingPrice || !description || !stock || !brand || !colour) {
      return res.status(409).json({
        message: "all fields are required",
        error: true,
        success: false
      })
    }


    const existingProduct = await Product.find({name,brand,category})

  

    if(existingProduct.length != 0){
     
      return res.status(409).json({
        message:"Product already exists",
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
        colour
      })

   

      const newProduct = await product.save()

    

      res.status(201).json({
        message:"product added",
        data:newProduct,
        error:false,
        success:true
      })


  } catch (error) {
   
    next(error)
  }

}



const getAllProducts = async (req, res, next) => {
  try {
    console.log("Hit the product API");

    // Get the page and limit query params from the request, or set default values
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 6; // Default limit to 6 products per page

    // Calculate how many products to skip based on current page
    const skip = (page - 1) * limit;

    const products = await Product.find({ deleted: false })
      .skip(skip) // Skip the products for previous pages
      .limit(limit); // Limit the number of products per page

    const totalProducts = await Product.countDocuments({ deleted: false }); // Get total product count

    if (!products || products.length === 0) {
      return res.status(404).json({
        message: "No products found",
        error: true,
        success: false
      });
    }

    res.status(200).json({
      message: "All products",
      data: products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      error: false,
      success: true
    });
  } catch (error) {
    next(error);
  }
};




const getProductById = async (req, res, next) => {

  try {
    console.log("herima ")
    const {productId} = req.query
   
    const product = await Product.findById({_id:productId})

    if (!product) {

      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false
      })
    }

    res.status(200).json({
      message: "Product details",
      error: false,
      data: product,
      success: true
    })

  } catch (error) {

    next(error)

  }

}



const productByCategory = async (req, res, next) => {



  const { category } = req.query


  const products = await Product.find({
    category: category, deleted: false
  })

  if (!products) {
    res.status(404).json({
      message: "error fetching products",
      error: true,
      success: false
    })
  }


  res.json({
    message: "Category products",
    data: products,
    success: true,
    error: false
  })


}


const productsByQueries = async (req, res, next) => {

  try {

    const { category, name, price, brand,colour } = req.query

  
    let filterings = {}

    if (category) {
      filterings.category = new RegExp(category, 'i');

    }
    if (name) {
      filterings.type = new RegExp(name, 'i');
    }
    if (brand) {
      filterings.brand = new RegExp(brand, 'i');
    }
    if(colour){
      filterings.colour = new RegExp(brand, 'i');
    }

    let sortings = {}

    if (price && price === 'low-high') {
      sortings.sellingPrice = 1
    }
    if (price && price === 'high-low') {
      sortings.sellingPrice = -1
    }


    const products = await Product.find({
      category: category, name: name, brand: brand, deleted: false
    }).sort(sortings)

    if (!products || products.length == 0) {
      return res.status(404).json({
        message: "products not found",
        error: true,
        success: false
      })
    }

    res.status(200).json({
      message: "products  ",
      data: products,
      error: false,
      success: true
    })


  } catch (error) {

    next(error)

  }


}

const updateProduct = async(req,res,next)=>{
try {
  

   const sellerId = req.seller.id
   const productId = req.params.productId
  
 
  const { name, category, brand, price, sellingPrice, stock, description, existingImages,colour } = req.body;

  console.log(colour)

   if(!name || !category || !price || !sellingPrice || !description || !stock || !brand || !colour){
    return res.status(409).json({
      message:"All fields are required",
      error:true,
      success:false
    })
   }

   const product = await Product.findById(productId)

   if(!product){
    return res.json({
      message:'product not found',
      error:true,
      success:false
    })
   }

   

   let imageUrls = []

  if (Array.isArray(existingImages)) {
    imageUrls = [...existingImages];
  } else if (existingImages) {
    imageUrls.push(existingImages); // If only a single URL is provided
  }

  if(req.files && req.files.length > 0){
    for (const file of req.files) {
      // Upload the file to cloud storage (e.g., Cloudinary)
      const uploadResult = await handleImageUpload(file.path);
      imageUrls.push(uploadResult); // Add the uploaded image URL
    }
  }


  const payLoad = {
    sellerId,
    name,
    category,
    brand,
    price,
    sellingPrice,
    stock,
    description,
    colour,
    images: imageUrls, 
  } 

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { $set: payLoad },
    { new: true, runValidators: true }
  );

   console.log("updated",updatedProduct)

  res.status(200).json({
    message:"Product updated",
    error:false,
    success:true,
    data:updatedProduct
  })

} catch (error) {
  next(error)
}


}

module.exports = {
  addProduct, getAllProducts,
  getProductById, productByCategory, productsByQueries,updateProduct
}

