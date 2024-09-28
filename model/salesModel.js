// models/salesModel.js
const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, required: true },
  saleAmount: { type: Number, required: true },
  dateOfSale: { type: Date, default: Date.now },
});

const Sales = new mongoose.model('Sales', salesSchema);

module.exports = Sales;
