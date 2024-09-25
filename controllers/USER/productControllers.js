const Admin = require("../../model/adminModel");
const Notification = require("../../model/notificationModel");
const Product = require("../../model/productModel");
const { handleImageUpload } = require("../../utils/imageUpload");

const addProduct = async (req, res, next) => {

  const sellerId = req.seller.id

  try {

    const { name, category, brand, price, sellingPrice, stock, description,colour } = req.body

    // console.log(req.body)
    
    if (!name || !category || !price || !sellingPrice || !description || !stock || !brand || !colour) {
      return res.status(409).json({
        message: "all fields are required",
        error: true,
        success: false
      })
    }


    const existingProduct = await Product.find({name,brand,category,colour})

   
  

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

      // console.log(imageUrls)

     


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
        colour,
        verified:false
      })
  
   

         const newProduct = await product.save()

     
      const admins = await Admin.find()

    //  console.log(admins)
      
  
  
      for( let admin of admins){
         const notification = new Notification({
           senderId:sellerId,
           receiverId:admin._id,
           message:"product verification request",
           data:product
         })
          await notification.save()
       console.log(notification,"mmmmmmmmmmm")
        
      }
    
     console.log(product)
   
      


      res.status(201).json({
        message:"product saved waiting for verificvation",
        data:product,
        error:false,
        success:true
      })


  } catch (error) {
   
    next(error)
  }

}


const verifyProduct = async (req, res, next) => {
  
  const { productId } = req.params;
 
  const adminId = req.admin.id

  console.log(productId,"1111")

  console.log(adminId,"2222")


  try {
    const product = await Product.findById(productId);
  
    if (!product) {  
      return res.status(404).json({
        
        message: "Product not found",
        error: true,
        success: false
      });
    }

    product.verified = true; // Update the verification status
    await product.save();
   
     console.log(product,"fuck")

     console.log(product.sellerId)

    const notification = new Notification({
      senderId:adminId,
      receiverId:product.sellerId,
      data:product,
      message:'Product verification success'
    })

    await notification.save()
   console.log(notification,"mairu")
 

    res.status(200).json({
      message: "Product verified successfully",
      data: product,
      error: false,
      success: true
    });

  } catch (error) {
    next(error);
  }
};








const getCategoryProducts = async (req, res, next) => {
  try {
    const { brand, name, category, sort, ...filters } = req.query;
    let query = { verified: true }

    // Apply filters dynamically
    if (category) {
      query.category = category;
    }
    if (brand) {
      query.brand = brand;
    }
    if (name) {
      query.name = name;
    }
    
    // Add additional filters
    for (const [key, value] of Object.entries(filters)) {
      query[key] = value;
    }

    console.log("Query Object: ", query);

    // Find products based on the query
    let products = await Product.find(query);

    // Apply sorting if specified
    if (sort) {
      products = products.sort((a, b) => {
        if (sort === 'price_asc') return a.price - b.price;
        if (sort === 'price_desc') return b.price - a.price;
        return 0;
      });
    }

    console.log("Products: ", products);

    res.json({
      message: 'category products',
      data: products,
      error: false,
      success: true 
    });
  } catch (error) {
    next(error);
  }
};


const getProductById = async (req, res, next) => {

  try {
   
    const {productId} = req.params
    
   
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
  try {
    const { category } = req.params;

    // Filter for products that are verified and belong to the specified category
    const query = { category, verified: true };

    // Fetch distinct brands, colours, and names for verified products in the category
    const brands = await Product.find(query).distinct('brand');
    const colours = await Product.find(query).distinct('colour');
    const name = await Product.find(query).distinct('name');

    res.json({
      message: "Category products",
      data: { brands, colours, name },
      success: true,
      error: false
    });
  } catch (error) {
    next(error);
  }
};


const productsByQueries = async (req, res, next) => {
  try {
    const searchQuery = req.query.q; // Get the search query from the request

    if (!searchQuery) {
      return res.status(400).json({
        message: "No search query provided",
        error: true,
        success: false,
      });
    }

    // Split the search query into words for better search (e.g., 'puma jeans' becomes ['puma', 'jeans'])
    const searchWords = searchQuery.split(' ').filter(word => word);

    // Create regex for each search word
    const regexQueries = searchWords.map(word => new RegExp(word, 'i'));

    // Find products where any word matches the name, category, or brand
    const products = await Product.find({
      "$or": [
        { name: { $in: regexQueries } },
        { category: { $in: regexQueries } },
        { brand: { $in: regexQueries } },
      ]
    });

    if (!products || products.length === 0) {
      return res.status(404).json({
        message: 'No products found',
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: 'Products found',
      error: false,
      success: true,
      data: products,
    });

  } catch (error) {
    next(error);
  }
};


const updateProduct = async(req,res,next)=>{
try {
  

   const sellerId = req.seller.id
   const productId = req.params.productId
   
   console.log(sellerId)
   console.log(productId)
 
  const { name, category, brand, price, sellingPrice, stock, description, existingImages,colour } = req.body;



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


const getSellerProducts= async (req, res, next) => {
  try {
   
    const sellerId = req.params.sellerId

    // Get the page and limit query params from the request, or set default values
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 6; // Default limit to 6 products per page

    // Calculate how many products to skip based on current page
    const skip = (page - 1) * limit;

    const products = await Product.find({ deleted: false,sellerId:sellerId,verified:true })
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


module.exports = {
  addProduct, getCategoryProducts,
  getProductById, productByCategory, productsByQueries,updateProduct,getSellerProducts,verifyProduct
}

