const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  senderId: {
    type: String,  // String type for ID
    required: true
  },
  receiverId: {
    type: String,  // String type for ID
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data:{
    type:String,
    
  },
  isRead:{
    type:Boolean,
    default:false
  }
},{
  timestamps:true
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
