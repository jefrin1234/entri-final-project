const Cart = require("../../model/cartModel")

const addToCart = async (req, res, next) => {

  try {
    const { productId, price, quantity } = req.body
    const userId = req.user.id
    // console.log(userId,req.body)

    

    if (!productId || !price || !quantity) {
      return res.status(409).json({
        message: "All fields are required",
        success: false,
        error: true
      })
    }

    let cart = await Cart.findOne({userId})
    let existingProduct = null

    console.log(cart)

    if(cart){
    
       existingProduct = cart.items.find(item => item.productId.toString() === productId);

       if (existingProduct) {
        return res.status(401).json({
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
    const userId = req.user.id
    const { productId } = req.body

    if (!productId) {
      return res.status(409).json({
        message: "product id  is required",
        success: false,
        error: true
      })
    }

    const cart = await Cart.findOne({ userId })

    if (!cart) {
      return res.status(404).json({
        message: "cart not found",
        success: false,
        error: true
      })
    }



    const updateCart = cart.items.filter(item => !item.productId.equals(productId))

    cart.items = updateCart

    await cart.calculateTotalPrice();

    await cart.save()

    res.status(200).json({
      message: "product removed from the cart",
      data: cart,
      success: true,
      error: false
    })

  } catch (error) {
    next(error)
  }


}

 

const getCart = async (req, res, next) => {

  try {
    const userId = req.user.id
    console.log(userId)

    const cartData = await Cart.findOne({ userId })

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
 
  console.log("hitted")
  const userId = req.user.id
  const {productId,quantity} = req.body
  console.log("****",userId)

  //findin the cart of the user with the userId
  const cart = await Cart.findOne({userId}) 

  console.log("carrrrrr",cart)

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