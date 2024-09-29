const Favourite = require('../../model/favouriteModel');

const getAllFavourites = async (req, res, next) => {
  try {
    console.log("hittt")
    const userId = req.user.id;

    const favourites = await Favourite.findOne({ userId }).populate('products');

    if (!favourites) {
      return res.status(404).json({
        message: "No favourites found for this user",
        error: true,
        success: false
      });
    }

    res.status(200).json({
      message: 'User favourites',
      data: favourites.products,
      error: false,
      success: true
    });
  } catch (error) {
    next(error);
  }
};


const addToFavourites = async (req, res, next) => {
  try {
    console.log("hittinggggg")
    const userId = req.user.id;
     const { productId } = req.body
    console.log(req.body)
    let favourites = await Favourite.findOne({ userId });

    if (!favourites) {
      favourites = new Favourite({
        userId,
        products: [productId]
      });
    } else {
      
      if (favourites.products.includes(productId)) {
        return res.status(400).json({
          message: "Product is already in favourites",
          error: true,
          success: false
        });
      }
      favourites.products.push(productId);
    }

    await favourites.save();

    res.status(200).json({
      message: "Product added to favourites",
      error: false,
      success: true,
      data:favourites
    });
  } catch (error) {
    next(error);
  }
};



  
const removeFromFavourites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const favourites = await Favourite.findOne({ userId });

    if (!favourites) {
      return res.status(404).json({
        message: "No favourites found for this user",
        error: true,
        success: false
      });
    }

    if (!favourites.products.includes(productId)) {
      return res.status(404).json({
        message: "Product not found in favourites",
        error: true,
        success: false
      });
    }

 
    favourites.products = favourites.products.filter(
      (id) => id.toString() !== productId
    );

    await favourites.save();

    res.status(200).json({
      message: "Product removed from favourites",
      error: false,
      success: true
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {addToFavourites,removeFromFavourites,getAllFavourites}