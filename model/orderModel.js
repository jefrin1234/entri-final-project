
const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: { type: String, required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true }, 
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      status: { type: String, enum: ['pending', 'shipped', 'delivered'], default: 'pending' },
    },
  ],
  address: { type: Object, required: true },
  totalPrice: { type: Number, required: true },
  paymentStatus: { type: String, default: 'pending' },
  orderStatus: { type: String, enum: ['pending', 'partially shipped', 'shipped', 'delivered'], default: 'pending' }, 
  paymentMethod: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});



const Order = mongoose.model('Order', orderSchema);

module.exports = Order
