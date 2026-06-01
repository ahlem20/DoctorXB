import Notification from '../models/Notification.js';

// @desc    Get all notifications matching user or broadcast
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      $and: [
        {
          $or: [
            { targetUser: null },
            { targetUser: req.user._id }
          ]
        },
        {
          $or: [
            { targetRole: null },
            { targetRole: req.user.role }
          ]
        }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(30);

    const mapped = notifications.map(notif => {
      const isRead = notif.readBy && Array.isArray(notif.readBy) ? notif.readBy.includes(req.user._id) : false;
      return {
        _id: notif._id,
        message: notif.message,
        type: notif.type,
        createdAt: notif.createdAt,
        isRead
      };
    });

    res.json(mapped);
  } catch (error) {
    console.error('Error in getNotifications:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
      if (!notification.readBy) {
        notification.readBy = [];
      }
      if (!notification.readBy.includes(req.user._id)) {
        notification.readBy.push(req.user._id);
        await notification.save();
      }
      res.json({ message: 'Notification marked as read' });
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message || 'Action failed' });
  }
};

// @desc    Mark all matching notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    const notifications = await Notification.find({
      $and: [
        {
          $or: [
            { targetUser: null },
            { targetUser: req.user._id }
          ]
        },
        {
          $or: [
            { targetRole: null },
            { targetRole: req.user.role }
          ]
        },
        {
          readBy: { $ne: req.user._id }
        }
      ]
    });

    for (let notif of notifications) {
      if (!notif.readBy) {
        notif.readBy = [];
      }
      notif.readBy.push(req.user._id);
      await notif.save();
    }

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(550).json({ message: error.message || 'Action failed' });
  }
};

export { getNotifications, markAsRead, markAllAsRead };
