const Cart = require("../../model/cartModel")

const addToCart = async (req, res, next) => {

  try {
    const { productId, price, quantity } = req.body
    const userId = req.user.id
   
  console.log(req.body,userId)
    

    if (!productId || !price || !quantity) {
      return res.status(409).json({
        message: "All fields are required",
        success: false,
        error: true
      })
    }

    let cart = await Cart.findOne({userId})
    let existingProduct = null



    if(cart){
    
       existingProduct = cart.items.find(item => item.productId.toString() === productId);

       if (existingProduct) {
        return res.status(409).json({
          message: "Item already exists in the cart",
          error: true,
          success: false,
        });
      }
  
      cart.items.push({productId, price, quantity})
  
  
      cart.calculateTotalPrice();
  
      await cart.save()

    }else{

      cart = new Cart({
        userId,
        items:[{productId, price, quantity}]
      })

      cart.calculateTotalPrice();

      await cart.save();

    }

    console.log(cart)

    res.status(201).json({
      message: "Product added to the cart",
      data:cart,
      error: false,
      success: true
    })

  } catch (error) {
    next(error)
  }



}



const cartCounts = async(req,res,next)=>{
try{
   
  const userId = req.user.id
  const cart = await Cart.findOne({userId})

  if(!cart){
    res.status(404).json({
      message:"cart not found",
      success:false,
      error:true
    })
  }

const cartItemsLength =   cart.items.length

res.status(200).json({
 message:'cart counts',
 data:cartItemsLength,
 success:true,
 error:false
})

}catch(error){
  next(error)
}
}


const deleteCart = async (req, res, next) => {

  try {

    const userId = req.user.id;

    const { productId } = req.params;

    console.log("++++",productId)

    // Ensure productId is provided
    if (!productId) {
      return res.status(409).json({
        message: "Product ID is required",
        success: false,
        error: true,
      });
    }

    // Find the cart for the user
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
        success: false,
        error: true,
      });
    }

    //  console.log(cart)

  
    const updatedItems = cart.items.filter(item => !item.productId.equals(productId));

    console.log(updatedItems,"1233")

    if (updatedItems.length === cart.items.length) {
      return res.status(404).json({
        message: "Product not found in cart",
        success: false,
        error: true,
      });
    }

    // Update the cart items and recalculate total price
    cart.items = updatedItems;
    await cart.calculateTotalPrice(); // Ensure this function exists and works properly

    // Save the updated cart
    await cart.save();

    res.status(200).json({
      message: "Product removed from the cart",
      data: cart,
      success: true,
      error: false,
    });
  } catch (error) {
    next(error);
  }
};


 

const getCart = async (req, res, next) => {

  try {
 
    const userId = req.user.id
    
    

    const cartData = await Cart.findOne({ userId }).populate('items.productId')


    if (!cartData) {
      return res.status(404).json({
        message: "cart not found",
        success: false,
        error: true
      })
    }


    res.status(200).json({
      message: "cart details",
      data: cartData,
      error: false,
      success: true

    })

  } catch (error) {
    next(error)
  }

}






const updateCart = async(req,res,next)=>{
try{
 
  console.log("home")

  const userId = req.user.id

  const {productId,quantity} = req.body


  //findin the cart of the user with the userId
  const cart = await Cart.findOne({userId}) 

   console.log(cart)

   if(!cart){

    return res.status(404).json({
      message:"cart not found",
      error:true,
      success:false
    })
  }

  //  finding the productId from the cart that need to be updated. below code checks if the productId received from the frontend matches the productId that is in the cart .if it is true that index of the item will be stored in the itemIndex variable
  
   const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId) 

  //findIndex return -1 if no items satifies the condition if it is -1 then that means no product in the cart which matches the productId from the fronend
  if (itemIndex === -1) {
    return res.status(404).json({
      message: "Product not found in cart",
      error: true,
      success: false
    });
  }

   cart.items[itemIndex].quantity = quantity

   cart.calculateTotalPrice();

   await cart.save()
  

  res.status(200).json({
    message:"cart updated",
    data:cart,
    success:true,
    error:true
  })
  
}catch(error){
  next(error)
}

}




 


module.exports = {addToCart, cartCounts,deleteCart,
  getCart,updateCart
 }