
const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  },
  registrationCetificate:{
    type:[String],
    required:true
  },
  pan:{
    type:String,
    required:true,
    unique:true
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
  phone:{
    type:String,
    required:true,
    unique:true
  },

  gstinNumber: {
    type: String,
    required: true,
    unique:true,

  },
  pickupLocation:{
    type:String,
    required:true
  }


}, {
  timestamps: true
});

const Business = mongoose.model('Business', BusinessSchema);

module.exports = Business;