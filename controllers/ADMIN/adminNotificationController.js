const Notification = require("../../model/notificationModel");

const getAdminNotification = async (req, res, next) => {
  try {
    const adminId = req.admin.id;

    console.log("admin ===",adminId)

    // Assuming notifications are linked to the admin using receiverId
    const notifications = await Notification.find({ receiverId: adminId });

    if (!notifications || notifications.length === 0) {
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

module.exports = getAdminNotification;
