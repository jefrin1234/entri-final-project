const express = require('express')
const userAuth = require('../../middleWares/userAuth');
const Product = require('../../model/productModel');
const Cart = require('../../model/cartModel');
const Order = require('../../model/orderModel');
const Sales = require('../../model/salesModel');
const { logOut } = require('../../controllers/ADMIN/adminAuthControllers');
const router = express.Router()
const stripe = require("stripe")(process.env.Stripe_Private_Api_Key);



router.post('/create-checkout-session', userAuth, async (req, res, next) => {
  try {

    const userId = req.user.id

    const { items, address, totalPrice, shipping_rate } = req.body
   
   
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          images: [item.productId.images[0]],
          name: item.productId.name
        },
        unit_amount: Math.round(item.productId.sellingPrice * 100),
      },
      quantity: item.quantity

    }))

    if (shipping_rate) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping Cost',
          },
          unit_amount: Math.round(shipping_rate * 100),
        },
        quantity: 1
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: address.emailAddress,
      mode: 'payment',
      success_url:  `https://entri-final-project-user-page.vercel.app/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://entri-final-project-user-page.vercel.app//failure`,
      metadata: {
        userId: userId, 
        totalPrice: totalPrice,
        address: JSON.stringify(address), 

      },
    })

  


    const totalInDollars = (session.amount_total / 100).toFixed(2); 
    console.log(`Total Amount: $${totalInDollars}`);


    const order = new Order({
      userId: userId,
      sessionId: session.id,
      items: items.map(item => ({
        productId: item.productId._id,
        sellerId: item.productId.sellerId,
        price: item.price,
        quantity: item.quantity,
        status: 'pending'
      })),
      address: address,
      totalPrice: totalInDollars,
      shippingRate: shipping_rate,
      orderStatus: 'pending',
      paymentStatus: session.payment_status,
      paymentMethod: 'card'
    })





    await order.save()


    res.json({ id: session.id })

  } catch (error) {
    console.error('Error creating checkout session:', error);
    next(error); 
  }
})




router.post("/payment-success", userAuth, async (req, res, next) => {
  try {


    const { sessionId } = req.body;
    const userId = req.user.id;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const trimmedSessionId = sessionId.trim();
    const order = await Order.findOne({ sessionId: trimmedSessionId });


    if (order) {
      order.paymentStatus = session.payment_status; 

      await order.save();
    } else {
      console.log("Order not found");
    }

   

    let productsToRemove;

    if (session.payment_status === 'paid') {
       productsToRemove = order.items.map(item => item.productId.toString()); // 
      
    
    }

    for (const productId of productsToRemove) {
    
      const cart = await Cart.findOne({ userId });
     
      if (!cart) {
        console.log("Cart not found");
        continue;
      }

      const updatedItems = cart.items.filter(item => !item.productId.equals(productId));

     

      if (updatedItems.length === cart.items.length) {
     
        continue;
      }

      
      cart.items = updatedItems;
      await cart.calculateTotalPrice();

     
      await cart.save();

   

    }


    for (const item of order.items) {
      const product = await Product.findById(item.productId);

      if (product) {
       
        product.stock -= item.quantity;

       
        if (product.stock < 0) {
          product.stock = 0;
        }

       
        await product.save();
       
      }
    }

 
    const items = order.items;

    for (let item of items) {
    
      const product = await Product.findById(item.productId);

      
    
      if (product) {
        const saleData = new Sales({
          productId: item.productId,
          sellerId: product.sellerId, 
          userId:userId,
          images:product.images[0],
          quantity: item.quantity,
          saleAmount: item.quantity * item.price,
          dateOfSale: new Date(),
        });
    
        try {
          await saleData.save(); 
         
        } catch (error) {
          console.error("Error saving sale record:", error);
        }
      } else {
        console.log(`Product with ID ${item.productId} not found.`);
      }
    }



    res.json({
      message: "payment is successfull",
      error: false,
      success: true,
      data: order
    })

  }

  catch (error) {
    next(error);
  }
});


module.exports = router


