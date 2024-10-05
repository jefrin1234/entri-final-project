const Admin = require("../../model/adminModel");
const Notification = require("../../model/notificationModel");
const Order = require("../../model/orderModel");
const Product = require("../../model/productModel");
const Sales = require("../../model/salesModel");
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
     
        for (const file of req.files) {
          const imageUrl = await handleImageUpload(file.path);
          imageUrls.push(imageUrl); 
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

    product.verified = true; 
    await product.save();
   
   


    const notification = new Notification({
      senderId:adminId,
      receiverId:product.sellerId,
      data:product,
      message:'Product verification success'
    })

    await notification.save()

 

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

    
    if (category) {
      query.category = category;
    }
    if (brand) {
      query.brand = brand;
    }
    if (name) {
      query.name = name;
    }
    
   
    for (const [key, value] of Object.entries(filters)) {
      query[key] = value;
    }

 

    
    let products = await Product.find(query);

   
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit;

    let matchQuery = {
      deleted: false,
      verified: true,
    };

    
    if (searchQuery) {
      const searchWords = searchQuery.split(' ').filter(word => word);
      const regexQueries = searchWords.map(word => new RegExp(word, 'i'));

      matchQuery = {
        ...matchQuery,
        "$or": [
          { name: { $in: regexQueries } },
          { category: { $in: regexQueries } },
          { brand: { $in: regexQueries } },
        ],
      };
    }

  
    const totalCount = await Product.countDocuments(matchQuery);

    const products = await Product.find(matchQuery)
      .skip(skip)
      .limit(limit);

    
    if (!products || products.length === 0) {
      return res.status(404).json({
        message: 'No products found',
        error: true,
        success: false,
      });
    }

   
    const totalPages = Math.ceil(totalCount / limit);
    const response = {
      message: 'Products found',
      error: false,
      success: true,
      data: products,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
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
    imageUrls.push(existingImages); 
  }

  if(req.files && req.files.length > 0){
    for (const file of req.files) {
    
      const uploadResult = await handleImageUpload(file.path);
      imageUrls.push(uploadResult); 
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

const topSellingProducts = async (req, res, next) => {
  try {
    const products = await Sales.aggregate([
      {
        $group: {
          _id: "$productId",
          totalQuantity: { $sum: "$quantity" },
          totalSales: { $sum: "$saleAmount" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 9 },
      {
        $lookup: {
          from: "products",
          localField: "_id", 
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails", 
      },
      {
        $project: {
          productId: "$_id",
          name: "$productDetails.name",
          totalQuantity: 1,
          totalSales: 1,
          images: "$productDetails.images", 
          brand: "$productDetails.brand", 
          sellingPrice: "$productDetails.sellingPrice", 
          price: "$productDetails.price", 
        },
      },
    ]);

    if (!products) {
      return res.json({
        message: "No products found",
        error: true,
        success: false,
      });
    }

    res.json({
      message: "Top products", 
      error: false,
      success: true,
      data: products,           
    });
  } catch (error) {
    next(error);
  }
};

const latestCollections = async(req,res,next)=>{
 

  try {
   
    const products = await Product.find() 
      .sort({ createdAt: -1 }) 
      .limit(9); 
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
  
  
    res.status(500).json({
      success: false,
      message: 'Failed to fetch latest products',
    });
  }

}


module.exports = {
  addProduct, getCategoryProducts,
  getProductById, productByCategory, productsByQueries,updateProduct,getSellerProducts,verifyProduct,toggleProductVerification,deleteproduct,topSellingProducts,latestCollections
}

