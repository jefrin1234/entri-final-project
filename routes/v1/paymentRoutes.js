const express = require('express')
const userAuth = require('../../middleWares/userAuth');
const Product = require('../../model/productModel');
const Cart = require('../../model/cartModel');
const Order = require('../../model/orderModel');
const router = express.Router()
const stripe = require("stripe")(process.env.Stripe_Private_Api_Key);

const CLIENT_URL = process.env.CLIENT_DOMAIN;

router.post('/create-checkout-session', userAuth, async (req, res, next) => {
  try {

    const userId = req.user.id

    const { items, address, totalPrice, shipping_rate } = req.body

    // console.log(items)


    // console.log(shipping_rate)

    // console.log(address.emailAddress)

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
          unit_amount: Math.round(shipping_rate * 100), // Convert to cents
        },
        quantity: 1 // Quantity of 1 for shipping
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: address.emailAddress,
      mode: 'payment',
      success_url:  `${CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`, 
      
      cancel_url: `${CLIENT_URL}/failure`,
      metadata: {
        userId: userId, // Include additional metadata (e.g., user ID)
        totalPrice: totalPrice, // Store the total price for future reference
        address: JSON.stringify(address), // Store the address as JSON (if needed)

      },
    })

  


    const totalInDollars = (session.amount_total / 100).toFixed(2); // Converts cents to dollars
    console.log(`Total Amount: $${totalInDollars}`);


    const order = new Order({
      userId: userId,
      sessionId: session.id,
      items: items.map(item => ({
        productId: item.productId._id, // Reference to the product
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



    // console.log(order,"orderrerere")

    res.json({ id: session.id })

  } catch (error) {
    console.error('Error creating checkout session:', error);
    next(error); // Pass the error to the next middleware for handling
  }
})




router.post("/payment-success", userAuth, async (req, res, next) => {
  try {


    const { sessionId } = req.body;
    const userId = req.user.id;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const trimmedSessionId = sessionId.trim();
    const order = await Order.findOne({ sessionId: trimmedSessionId });

    // console.log(order, "xxxxxxx")

    if (order) {
      order.paymentStatus = session.payment_status; // Update the payment status

      await order.save(); // Save the updated order

    } else {
      console.log("Order not found");
    }

    // console.log("ima herr")

    let productsToRemove;

    if (session.payment_status === 'paid') {
       productsToRemove = order.items.map(item => item.productId.toString()); // Extract product IDs

      // console.log(productsToRemove, "hiiii")
    }

    for (const productId of productsToRemove) {
      // Simulating the deleteCart logic directly here
      const cart = await Cart.findOne({ userId });
      // console.log("reached here")
      // console.log(cart, "ssss")

      if (!cart) {
        console.log("Cart not found");
        continue; // Skip if cart not found
      }

      const updatedItems = cart.items.filter(item => !item.productId.equals(productId));

      if (updatedItems.length === cart.items.length) {
        console.log("Product not found in cart");
        continue; // Skip if product not found in cart
      }

      // Update the cart items and recalculate total price
      cart.items = updatedItems;
      await cart.calculateTotalPrice(); // Ensure this function exists and works properly

      // Save the updated cart
      await cart.save();

      // console.log(cart,"///////////")

    }

    for (const item of order.items) {
      const product = await Product.findById(item.productId);

      if (product) {
        console.log(product,"000999000")
        // Subtract the ordered quantity from the product's stock
        product.stock -= item.quantity;

        // Ensure stock doesn't go below 0 (optional)
        if (product.stock < 0) {
          product.stock = 0;
        }

        // Save the updated product with new stock value
        await product.save();
        // console.log(`Updated stock for product ${product._id}: New stock is ${product.stock}`);
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


