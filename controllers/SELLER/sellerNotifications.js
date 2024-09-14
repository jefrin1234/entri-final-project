const Notification = require("../../model/notificationModel")

const getSellerNotifications = async(req,res,next)=>{

try {
  const sellerId = req.seller.id

  const notifications = await Notification.find({sellerId,deleted: false
  })

  

  if( notifications.length === 0){
   
    return res.status(200).json({
      message:"No notifications found",
      data:notifications,
      
    })
  }

  res.status(200).json({
    message:'seller notifications',
    data:notifications,
    error:false,
    success:true
  })
} catch (error) {
  next(error)
}

}


const deleteSellerNotification = async(req,res,next)=>{

try {
  const notificationId = req.params.notificationId

  const notification = await Notification.findById(notificationId)

  if(!notification){
    return res.json({
      message:"Cannot find notifcation",
      error:true,
      success:false
    })
  }

  notification.deleted = true
  await notification.save()

  res.status(200).json({
    message:"Notification deleted",
    error:false,
    success:true
  })

} catch (error) {
  next(error)
}
}

module.exports = {getSellerNotifications,deleteSellerNotification}