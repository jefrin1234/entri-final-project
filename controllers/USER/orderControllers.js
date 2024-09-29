const Order = require("../../model/orderModel")


const allOrders = async (req, res, next) => {
  try {
    const { sortBy, sortOrder, orderStatus, paymentMethod } = req.query;

    // Construct sort object based on the sortField and sortOrder
    let sort = {};
    if (sortBy === 'totalPrice') {
      sort.totalPrice = sortOrder === 'asc' ? 1 : -1; // Ascending or Descending based on sortOrder
    } else if (sortBy === 'createdAt') {
      sort.createdAt = sortOrder === 'asc' ? 1 : -1; // Sorting by createdAt as a fallback
    }

    // Construct filter object based on orderStatus and paymentMethod
    let filter = {};
    if (orderStatus) {
      filter.orderStatus = orderStatus;
    }
    if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
    }

    // Fetch orders based on filter and sort options
    const orders = await Order.find(filter)
      .populate({ path: 'items.productId' })
      .populate({ path: 'items.sellerId', select: 'businessName' })
      .sort(sort)
      .lean();

    res.status(200).json({ data: orders }); // Ensure response matches frontend expectations
  } catch (error) {
    next(error);
  }
};





const sellerOrders = async (req, res, next) => {
  try {

     console.log("herrrrrrrrrr")
     const sellerId = req.params.sellerId || req.
     console.log(sellerId,"//////////")
     console.log(req.params.sellerId)

    const orders = await Order.find().populate({
      path: 'items.productId',
      match: { sellerId: sellerId }, // Only get products belonging to this seller
    }).exec();


  

    if(!orders){
      return res.status(404).json({
        message:"No orders found",
        error:true,
        success:false
      })
    }

   
    const filteredOrders = orders.filter(order => 
      order.items.some(item => item.productId) 
    );

   // console.log(filteredOrders,"77777777777")

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

    // Find orders, populate 'productId', sort by 'createdAt' in descending order, and filter out unpaid card payments
    const orders = await Order.find({
      userId,
      $nor: [
        { paymentStatus: 'unpaid', paymentMethod: 'card' }, // Exclude orders with both 'unpaid' and 'card' payment method
      ],
    })
      .populate({
        path: 'items.productId',
        model: 'Product', // Adjust 'Product' to match your actual product model name
      })
      .sort({ createdAt: -1 }); // Sort orders by 'createdAt' in descending order

    if (!orders || orders.length === 0) { // Checking if there are no orders
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