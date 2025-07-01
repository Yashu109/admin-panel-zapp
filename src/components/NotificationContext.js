import React, { createContext, useContext, useState, useEffect } from 'react';
import { ref, query, orderByChild, onValue, update } from 'firebase/database';
import { db } from '../firebase/config';
import { cleanupOldNotifications } from './notificationService';
import { Bell, MessageSquare, Store, Package, AlertTriangle } from 'lucide-react';

// Create context
const NotificationContext = createContext();

// Replace the formatTime function in your NotificationContext.js

/**
 * Format time properly accounting for timezone differences
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} - Formatted time string
 */
export const formatTime = (timestamp) => {
  if (!timestamp) return 'Unknown time';

  try {
    // Parse the timestamp string to a Date object
    const date = new Date(timestamp);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error('Invalid timestamp:', timestamp);
      return 'Invalid date';
    }

    const now = new Date();

    // Calculate the difference in milliseconds
    const diffMs = now.getTime() - date.getTime();

    // Debug logging
    console.log(`Timestamp: ${timestamp}, Parsed: ${date.toISOString()}, Now: ${now.toISOString()}, Diff ms: ${diffMs}`);

    // Convert to minutes, hours, days
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    // Format based on the time difference
    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      // For older notifications, show the actual date
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Error calculating time';
  }
};

// Provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch notifications from Firebase
  // Replace the useEffect hook that fetches notifications in NotificationContext.js

  // Fetch notifications from Firebase
  useEffect(() => {
    console.log('Setting up notifications listener');
    const notificationsRef = query(ref(db, 'notifications'), orderByChild('timestamp'));

    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      setLoading(true);

      if (snapshot.exists()) {
        const notificationsData = [];
        snapshot.forEach((childSnapshot) => {
          const notificationId = childSnapshot.key;
          const notificationData = childSnapshot.val();

          // Validate notification data before adding to state
          if (isValidNotification(notificationData)) {
            // Ensure we don't modify the timestamp
            notificationsData.push({
              id: notificationId,
              ...notificationData,
              // Make sure the timestamp is preserved exactly as stored
              timestamp: notificationData.timestamp
            });
          }
        });

        // Debug logging
        console.log(`Fetched ${notificationsData.length} notifications`);
        if (notificationsData.length > 0) {
          console.log('First notification timestamp:', notificationsData[0].timestamp);
        }

        // Sort by timestamp (newest first)
        notificationsData.sort((a, b) => {
          // Ensure we're comparing valid date objects
          const dateA = new Date(a.timestamp || 0);
          const dateB = new Date(b.timestamp || 0);

          // Check if dates are valid
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            console.error('Invalid date comparison:', a.timestamp, b.timestamp);
            return 0;
          }

          return dateB.getTime() - dateA.getTime();
        });

        setNotifications(notificationsData);

        // Count unread notifications
        const unreadNotifications = notificationsData.filter(n => !n.read && !n.cleared).length;
        setUnreadCount(unreadNotifications);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }

      setLoading(false);
    }, (error) => {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    });

    // Run cleanup of old notifications on component mount
    cleanupOldNotifications(30).catch(err =>
      console.error('Error cleaning up old notifications:', err)
    );

    // Setup periodic cleanup (every 24 hours)
    const cleanupInterval = setInterval(() => {
      cleanupOldNotifications(30);
    }, 24 * 60 * 60 * 1000);

    return () => {
      console.log('Cleaning up notifications listener');
      unsubscribe();
      clearInterval(cleanupInterval);
    };
  }, []); // Empty dependency array to ensure this only runs once
  const markAsSeen = (notificationId) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, seen: true }
          : notification
      )
    );
  };
  // Validate notification data
  const isValidNotification = (notification) => {
    // Check if notification has all required fields
    if (!notification || !notification.type || !notification.message || !notification.sourceId) {
      return false;
    }

    // For order notifications, validate amount and customer info
    if (notification.type === 'order' && notification.sourceData) {
      // Skip notifications with zero amount
      if (notification.sourceData.amount <= 0) {
        return false;
      }

      // Skip notifications with empty customer name
      if (!notification.sourceData.customerName || notification.sourceData.customerName === 'Customer') {
        return false;
      }
    }

    return true;
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const notificationRef = ref(db, `notifications/${notificationId}`);
      await update(notificationRef, { read: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const updates = {};
      notifications.forEach(notification => {
        if (!notification.read) {
          updates[`notifications/${notification.id}/read`] = true;
        }
      });

      if (Object.keys(updates).length > 0) {
        await update(ref(db), updates);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Clear read notifications
  const clearReadNotifications = async () => {
    try {
      const updates = {};
      notifications.forEach(notification => {
        if (notification.read) {
          updates[`notifications/${notification.id}/cleared`] = true;
        }
      });

      if (Object.keys(updates).length > 0) {
        await update(ref(db), updates);
      }
    } catch (error) {
      console.error('Error clearing read notifications:', error);
    }
  };

  // Get recent notifications
  const getRecentNotifications = (count = 5) => {
    return notifications
      .filter(n => !n.cleared)
      .slice(0, count);
  };

  // Get filtered notifications
  const getFilteredNotifications = (type = 'all') => {
    if (type === 'all') {
      return notifications.filter(n => !n.cleared);
    }
    return notifications.filter(n => n.type === type && !n.cleared);
  };

  // Get unread count
  const getUnreadCount = (type = 'all') => {
    if (type === 'all') {
      return unreadCount;
    }
    return notifications.filter(n => n.type === type && !n.read && !n.cleared).length;
  };

  // Get notification icon based on type and action
  const getNotificationIcon = (notification) => {
    if (!notification) return <Bell />;

    switch (notification.type) {
      case 'order':
        if (notification.action === 'canceled') return <AlertTriangle className="notification-icon canceled" />;
        return <Package className="notification-icon" />;

      case 'vendor_request':
        return <Store className="notification-icon vendor" />;

      case 'support_ticket':
        return <MessageSquare className="notification-icon support" />;

      default:
        return <Bell className="notification-icon" />;
    }
  };

  // Get notification icon as text (for components using FontAwesome)
  const getNotificationIconText = (type) => {
    switch (type) {
      case 'order':
        return '📦';
      case 'vendor_request':
        return '🏪';
      case 'support_ticket':
        return '💬';
      default:
        return '🔔';
    }
  };

  // Get priority level based on issue type
  const getPriorityLevel = (notification) => {
    if (!notification) return { level: 'normal', class: 'priority-normal' };

    // Check if it's a high priority notification
    if (notification.priority === 'high') {
      return { level: 'high', class: 'priority-high' };
    }

    return { level: 'normal', class: 'priority-normal' };
  };

  const value = {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAsSeen,                     // Add this
    markAllAsRead,
    clearReadNotifications,
    getRecentNotifications,
    // getRecentUnseenNotifications,   // Add this
    getFilteredNotifications,
    getUnreadCount,
    getNotificationIcon,
    getNotificationIconText,
    getPriorityLevel,
    formatTime
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;