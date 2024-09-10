const  mongoose  = require("mongoose");
const Order = require("../../model/orderModel")
const Product = require("../../model/productModel")
const Rating = require("../../model/ratingModel")


const hasPurchasedProduct = async (userId, productId) => {

  try {
    const order = await Order.findOne({
      userId: userId,
      "items.productId": productId
    })

    return order !== null;
  } catch (error) {
    console.error("Error finding order:", error);
    return false
  }
};

const addRating = async (req, res,next) => {
 try {

    const userId = req.user.id
    console.log(userId)
 
    const { productId, rating, comment } = req.body
   



    if (!productId || !rating || !comment) {
      return res.status(400).json({
        message: "all fields are required",
        error: true,
        success: false
      })
    }

    // const purchased = await hasPurchasedProduct(userId, productId);
    // if (!purchased) {
    //   return res.status(403).json({
    //     message: "You must purchase the product before rating",
    //     error: true,
    //     success: false
    //   });
    // }


    const existingRating = await Rating.findOne({ userId, productId })

    if (existingRating) {
      return res.status(400).json({
        message: "cannot add more than one rating to  a product",
        error: true,
        success: false
      })
    }


    const newRating = new Rating({userId, productId, rating, comment,  })

    await newRating.save()

    res.status(201).json({
      message: "rating added",
      data: newRating,
      error: false,
      success: true
    })

  } catch (error) {
    next()
  }


}

const getProductRatings = async (req, res,next) => {
  try {
    const productId = req.params.productId
    const productRatings = await Rating.find({ productId,deleted: false
    })

    if (!productRatings) {
      return res.status(404).json({
        message: "no one has rated this product",
        error: false,
        success: true
      })
    }

    res.status(200).json({
      message: "product ratings ",
      data: productRatings,
      success: false,
      error: true
    })

  } catch (error) {
    next()
  }

}

const getAllRatings = async (req, res,next) => {

  try {
    console.log("g=hiitesd")
    const ratings = await Rating.find({deleted: false
    })

    if (!ratings || ratings.length != 0) {
      return res.status(404).json({
        message: "no ratings found",
        success: false,
        error: true
      })
    }

    res.status(200).json({
      message: "All ratings",
      data: ratings,
      error: false,
      success: true
    })

  } catch (error) {
    next(error)
  }

}

const getRatingByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId // Getting userId from request parameters
    console.log("///////", userId);

    // Use find method to search by userId
    const ratings = await Rating.find({ userId,deleted: false
    });
    console.log("-==0-=", ratings);

    if (ratings.length === 0) {
      return res.status(404).json({
        message: "Ratings not found",
        error: true,
        success: false
      });
    }

    // Respond with the user's ratings
    res.status(200).json({
      message: "User ratings retrieved successfully",
      data: ratings,
      error: false,
      success: true
    });

  } catch (error) {
    // Pass the error to the next middleware
    next(error);
  }
};


const updateRating = async (req, res,next) => {

 try {
   
    const userId = req.user.id
    console.log(userId)
    const { rating, comment, ratingId } = req.body
    console.log(req.body)

    const findRating = await Rating.findOne({ _id:ratingId })


    if (!findRating) {
      return res.status(404).json({
        message: "rating not found",
        error: false,
        success: true
      })
    }

    const updatedRating = await Rating.findOneAndUpdate({ _id: ratingId,userId }, { rating, comment, }, { new: true })

    

    res.status(200).json({
      message: "rating updated",
      data: updatedRating,
      error: false,
      success: true
    })

  } catch (error) {
    next(error)
  }

} 



const deleteRating = async (req, res, next) => {
  try {

    const ratingId = req.params.ratingId; // Assuming you're passing the ratingId in the request params
    const userId = req.user.id; 
    console.log(req.user);
    
    // ID of the currently logged-in user
    const userRole = req.user.roles;
    console.log(userRole)
    // Assuming `req.user.role` contains the user's role, e.g., 'user' or 'admin'

    // Find and delete the rating in one step
    let rating;

    // If the user is an admin, allow them to delete any rating
    if (userRole.includes('admin')) {
      rating = await Rating.findById(ratingId);
      rating.deleted = true
      await rating.save()
    } else {
      // If the user is not an admin, allow them to delete only their own rating
      rating = await Rating.findOne({ _id: ratingId, userId: userId });

      rating.deleted = true
      await rating.save()
    }

    // If no rating is found, return a 404 error
    if (!rating) {
      return res.status(404).json({
        message: "Rating not found",
        error: true,
        success: false
      });
    }

    // If rating is found and deleted, return a success response
    res.status(200).json({
      message: "Rating deleted successfully",
      error: false,
      success: true
    });

  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};



module.exports = { addRating, getProductRatings, getAllRatings, updateRating, deleteRating,getRatingByUserId }