const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique:true
  },
  emailAddress: {
    type: String,
    required:true
  },
    streetAddress: {
      type: String,
      required: true,
      
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    addressType: {
    type: String,
    enum: ['Residential', 'Business'],
    default: 'Residential'
    },

}, {
  timestamps: true
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
