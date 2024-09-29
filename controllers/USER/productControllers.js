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
    let query = { verified: true,deleted:false }

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

  
    const query = { category, verified: true ,deleted:false};

    
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
    const searchQuery = req.query.q;

    // Initial match query to filter deleted and unverified products
    let matchQuery = {
      deleted: false,
      verified: true,
    };

    // Check if a search query is provided
    if (searchQuery) {
      // Split the search query into individual words and filter out empty strings
      const searchWords = searchQuery.split(' ').filter(word => word);

      // Create regex queries for each search word (case-insensitive)
      const regexQueries = searchWords.map(word => new RegExp(word, 'i'));

      // Update matchQuery to search within name, category, and brand fields
      matchQuery = {
        ...matchQuery,
        "$or": [
          { name: { $in: regexQueries } },
          { category: { $in: regexQueries } },
          { brand: { $in: regexQueries } },
        ],
      };
    }

    // Find all products matching the search query without pagination
    const products = await Product.find(matchQuery);

    // Check if any products are found
    if (!products || products.length === 0) {
      return res.status(404).json({
        message: 'No products found',
        error: true,
        success: false,
      });
    }

    // Respond with the found products
    const response = {
      message: 'Products found',
      error: false,
      success: true,
      data: products,
    };

    return res.status(200).json(response);

  } catch (error) {
    next(error);
  }
};



const updateProduct = async(req,res,next)=>{
try {
  

   const sellerId = req.seller.id
   const productId = req.params.productId
   
 
 
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



const getSellerProducts = async (req, res, next) => {
  try {
   
     const sellerId = req.params.sellerId;


    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.q || ''; 

    const skip = (page - 1) * limit;

    
    const searchCriteria = {
      deleted: false,
      sellerId: sellerId,
      verified: true,
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { category: { $regex: searchQuery, $options: 'i' } },
        { brand: { $regex: searchQuery, $options: 'i' } } 
      ]
    };

    const products = await Product.find(searchCriteria)
      .skip(skip)
      .limit(limit);

  
    const totalProducts = await Product.countDocuments(searchCriteria);

    if (!products || products.length === 0) {
      return res.status(404).json({
        message: "No products found",
        error: true,
        success: false
      });
    }
    
    const totalPages = Math.ceil(totalProducts / limit)
    

 
    res.status(200).json({
      message: "All products",
      data: products,
      currentPage: page,
      totalPages:totalPages,
      totalProducts,
      error: false,
      success: true
    });

    

  } catch (error) {
    next(error);
  }
};


const toggleProductVerification = async (req, res, next) => {
  try {
    const adminId = req.admin.id;
    const productId = req.params.productId;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

  
  
product.verified = !product.verified;

await product.save();


const message = product.verified
  ? "Your product has been verified by the admin."
  : "Due to some reasons, this product has been unverified by the admin.";

const notification = new Notification({
  senderId: adminId,
  receiverId: product.sellerId,
  message,
  data: product,
});

await notification.save();

res.status(200).json({
  message: `Product has been ${product.verified ? 'verified' : 'unverified'}.`,
  error: false,
  success: true,
  data: product,
});

  } catch (error) {
    next(error);
  }
};

const deleteproduct = async(req,res,next)=>{
  try {
    const productId = req.params.productId

    const product = await Product.findByIdAndDelete(productId)

    if(!product){
      return res.status(404).json({
        message:"Product not found",
        error:true,
        success:false
      })
    }

    res.status(200).json({
      message:"Product deleted successfully",
      error:false,
      success:true
    })

  } catch (error) {
    next(error)
  }
}




module.exports = {
  addProduct, getCategoryProducts,
  getProductById, productByCategory, productsByQueries,updateProduct,getSellerProducts,verifyProduct,toggleProductVerification,deleteproduct
}

