const Order = require("../../model/orderModel")

const allOrders = async(req,res,next)=>{

 try {
  const adminId = req.admin.id

  const orders = await Order.find({})

  res.json({
    message:"All orders",
    success:true,
    error:false,
    data:orders
  })
 } catch (error) {
  next(error)
 }

}

const sellerOrders = async (req, res, next) => {
  try {
    const sellerId = req.seller.id;

    // Fetch orders and filter them to include only those with products belonging to the seller
    const orders = await Order.find().populate({
      path: 'items.productId',
      match: { sellerId: sellerId }, // Only get products belonging to this seller
    }).exec();

   

    // Filter out orders that do not contain any products belonging to the seller
    const filteredOrders = orders.filter(order => 
      order.items.some(item => item.productId) // Keep orders that have products populated
    );

    res.status(200).json({
      message: 'Seller orders',
      data: filteredOrders,
      success: true,
      error: false
    });

  } catch (error) {
    next(error);
  }
};



const userOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    

    // Find orders and populate the 'productId' field within 'items'
    const orders = await Order.find({ userId }).populate({
      path: 'items.productId',
      model: 'Product', // Adjust 'Product' to match your actual product model name
     
    });
    

    if (!orders) {
      return res.status(404).json({
        message: "User orders not found",
        error: true,
        success: false,
      });
    }

    res.status(200).json({
      message: "User orders",
      data: orders,
      success: true,
      error: false,
    });
  } catch (error) {
    next(error);
  }
};


const updateProductStatus = async (req, res, next) => {
  try {

   

    const { orderId, itemId, newStatus } = req.body; 

     const sellerId = req.seller.id;

    const order = await Order.findOne({
      _id: orderId,
      'items.productId':itemId,
      'items.sellerId': sellerId, 
    });

   

     

    if (!order) {
      return res.status(404).json({
        message: "Order or product not found for this seller",
        error: true,
        success: false,
      });
    }

   
    order.items.forEach(item => {
      if (item.productId.toString() ===itemId && item.sellerId.toString() === sellerId) {
        item.status = newStatus;
      }
    });


    const allDelivered = order.items.every(item => item.status === 'delivered');
    const someShipped = order.items.some(item => item.status === 'shipped');

    if (allDelivered) {
      order.orderStatus = 'delivered';
    } else if (someShipped) {
      order.orderStatus = 'partially shipped';
    } else {
      order.orderStatus = 'pending';
    }

    await order.save();

    res.status(200).json({
      message: "Product status updated",
      error: false,
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};




module.exports = {allOrders,sellerOrders,userOrders,updateProductStatus}