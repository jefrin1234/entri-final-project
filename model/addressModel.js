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
    required:true,
    unique:false
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
    default:{
      type:Boolean,

    },
   
    deleted: { type: Boolean, default: false },

}, {
  timestamps: true
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
