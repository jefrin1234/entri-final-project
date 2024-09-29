const mongoose = require('mongoose');

const favouriteListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true 
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ]
}, { timestamps: true });

const Favourite = mongoose.model('Favourite', favouriteListSchema);

module.exports = Favourite;
