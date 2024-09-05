const mongoose = require('mongoose')
const Product = require('./productModel')

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: { 
        type: Number,
        required: true,
        default: 1,
        min: [1], 
      }
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
},
  {
    timestamps: true
  })


cartSchema.methods.calculateTotalPrice = function () {
  this.totalPrice = this.items.reduce((total, item) => total + item.price * item.quantity, 0);
};

const Cart = new mongoose.model('Cart', cartSchema)

module.exports = Cart