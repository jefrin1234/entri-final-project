const mongoose = require("mongoose");
const Order = require("../../model/orderModel")
const Product = require("../../model/productModel")
const Rating = require("../../model/ratingModel")


const hasPurchasedProduct = async (userId, productId) => {

  try {
    const order = await Order.findOne({
      userId: userId,
      "items.productId": productId,
      paymentStatus: 'paid'
    })

    return order !== null;
  } catch (error) {

    return false
  }
};

const addRating = async (req, res, next) => {
  try {

    const userId = req.user.id;

    const { productId, rating, comment } = req.body;


    if (!productId || !rating || !comment) {
      return res.status(400).json({
        message: "All fields are required",
        error: true,
        success: false,
      });
    }

    const purchased = await hasPurchasedProduct(userId, productId);
    if (!purchased) {
      return res.status(403).json({
        message: "You must purchase the product before rating",
        error: true,
        success: false,
      });
    }



    const existingRating = await Rating.findOne({ userId, productId });

    if (existingRating) {

      return res.status(400).json({
        message: "You cannot add more than one rating for a product",
        error: true,
        success: false,
      });
    }



    const newRating = new Rating({ userId, productId, rating, comment });
    console.log(newRating)
    await newRating.save();

    console.log(newRating)

    res.status(201).json({
      message: "Rating added",
      data: newRating,
      error: false,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};


const getProductRatings = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    if (!productId) {
      return res.status(400).json({
        message: "Bad request",
        error: true,
        success: false,
      });
    }

    const totalRatings = await Rating.countDocuments({ productId }); 
    const productRatings = await Rating.find({ productId })
      .populate({
        path: 'userId',
        select: '-password -email -image -role',
      }).skip((page - 1) * limit).limit(limit);

    if (!productRatings || productRatings.length === 0) {
      return res.status(200).json({
        message: "No one has rated this product",
        error: false,
        success: true,
      });
    }

    res.status(200).json({
      message: "Product ratings",
      data: productRatings,
      totalRatings,
      success: true,
      error: false,
    });
  } catch (error) {
    next(error);
  }
};



const getAllRatings = async (req, res, next) => {

  try {

    const ratings = await Rating.find({})

    if (!ratings || ratings.length === 0) {
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
    const userId = req.user.id // Getting userId from request parameters


    // Use find method to search by userId
    const ratings = await Rating.find({
      userId
    });

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


const updateRating = async (req, res, next) => {

  try {

    const userId = req.user.id

    const { rating, comment, ratingId } = req.body


    const findRating = await Rating.findOne({ _id: ratingId })


    if (!findRating) {
      return res.status(404).json({
        message: "rating not found",
        error: false,
        success: true
      })
    }

    const updatedRating = await Rating.findOneAndUpdate({ _id: ratingId, userId }, { rating, comment, }, { new: true })



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

    const { ratingId } = req.body; 


   const  rating = await Rating.findByIdAndDelete(ratingId);

     

    if (!rating) {
      return res.status(404).json({
        message: "Rating not found",
        error: true,
        success: false
      });
    }

   
    res.status(200).json({
      message: "Rating deleted successfully",
      error: false,
      success: true
    });

  } catch (error) {
    next(error);
  }
};



module.exports = { addRating, getProductRatings, getAllRatings, updateRating, deleteRating, getRatingByUserId }