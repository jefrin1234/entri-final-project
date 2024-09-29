const { errorMonitor } = require("nodemailer/lib/xoauth2")
const Notification = require("../../model/notificationModel")

const getSellerNotifications = async(req,res,next)=>{

try {
  console.log("hereeee")
  const sellerId = req.seller.id
  console.log(sellerId)

  const notifications = await Notification.find({receiverId:sellerId,deleted: false
  })

  console.log(notifications,"eeeee")

  if(!notifications){
   
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




const getNotificationById = async (req, res) => {
  try {
    const { notificationId } = req.params; 


    const notification = await Notification.findById(notificationId);

   
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found',error:true,success:false });
    }

    // R
     res.status(200).json({
      message:"notification details",
      error:false,
      success:true,
      data:notification
    });
  } catch (error) {
  next(error)
    
  }
};





const deleteSellerNotification = async(req,res,next)=>{

try {
  const {notificationId} = req.params

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



const updateNotification = async (req, res) => {
  try {
    console.log("hiite")
    const notificationId = req.params.notificationId;
    const newData = req.body;

    const updatedNotification = await Notification.findByIdAndUpdate(notificationId, newData, { new: true });

    if (!updatedNotification) {
      return res.status(404).json({
        message: "Notification not found",
        error: true,
        success: false,
      });
    }

    res.status(200).json({
      message: "Notification updated",
      error: false,
      success: true,
      data: updatedNotification,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating notification",
      success: false,
      error: true,
    });
  }
};

module.exports = {getSellerNotifications,deleteSellerNotification,getNotificationById,updateNotification}