const Notification = require("../../model/notificationModel");

const getAdminNotification = async (req, res, next) => {
  try { 
   
    const adminId = req.admin.id;

    const notifications = await Notification.find({ receiverId: adminId, deleted: false })

    if (!notifications) {
      return res.status(404).json({
        message: "No notifications available",
        success: false,
        error: true,
      });
    }


    res.status(200).json({
      message: "Admin notifications",
      error: false,
      success: true,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};



const updateNotification = async (req, res) => {
  try {

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


const deleteNotification = async(req,res)=>{
  try {
    const { id } = req.params;

    
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

   
    await Notification.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}


module.exports = {getAdminNotification,updateNotification,deleteNotification}
