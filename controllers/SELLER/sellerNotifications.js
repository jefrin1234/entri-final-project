const Notification = require("../../model/notificationModel")

const getSellerNotifications = async(req,res,next)=>{

try {
  const sellerId = req.seller.id
  console.log("hiotted")
  console.log(sellerId,"iddddn")
  const notifications = await Notification.find({sellerId})

  console.log(notifications)

  if( notifications.length === 0){
    console.log("error ")
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

  const notification = await Notification.findByIdAndDelete(notificationId)

  if(!notification){
    return res.json({
      message:"Cannot find notifcation",
      error:true,
      success:false
    })
  }

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