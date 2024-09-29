const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true
  },
  receiverId: {
    type: String,  
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data:{
    type: mongoose.Schema.Types.Mixed,
  },
  isRead:{
    type:Boolean,
    default:false
  },
  deleted: { type: Boolean, default: false },
},{
  timestamps:true
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
