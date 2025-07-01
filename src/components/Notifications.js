// import React, { useState, useEffect } from 'react';
// import { 
//   Bell, 
//   Package, 
//   Store, 
//   MessageSquare, 
//   X, 
//   CheckCircle, 
//   Clock, 
//   XCircle, 
//   AlertTriangle,
//   RefreshCw,
//   ChevronRight,
//   Trash2,
//   Info
// } from 'lucide-react';
// import { ref, onValue, update, query, orderByChild, limitToLast } from 'firebase/database';
// import { db } from '../firebase/config';
// import '../styles/Notifications.css';

// const Notifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [filteredNotifications, setFilteredNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeFilter, setActiveFilter] = useState('all');
//   const [showClearConfirm, setShowClearConfirm] = useState(false);

//   // Fetch notifications from Firebase
//   useEffect(() => {
//     const notificationsRef = query(ref(db, 'notifications'), orderByChild('timestamp'), limitToLast(50));
    
//     const unsubscribe = onValue(notificationsRef, (snapshot) => {
//       setLoading(true);
      
//       if (snapshot.exists()) {
//         const notificationsData = [];
//         snapshot.forEach((childSnapshot) => {
//           const notificationId = childSnapshot.key;
//           const notificationData = childSnapshot.val();
          
//           // Validate notification data before adding to state
//           if (isValidNotification(notificationData)) {
//             notificationsData.push({ id: notificationId, ...notificationData });
//           } else {
//             // Optionally clean up invalid notifications
//             cleanupInvalidNotification(notificationId);
//           }
//         });
        
//         // Sort by timestamp (newest first)
//         notificationsData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
//         setNotifications(notificationsData);
//         applyFilter(activeFilter, notificationsData);
//       } else {
//         setNotifications([]);
//         setFilteredNotifications([]);
//       }
      
//       setLoading(false);
//     }, (error) => {
//       console.error('Error fetching notifications:', error);
//       setLoading(false);
//     });
    
//     return () => unsubscribe();
//   }, [activeFilter]);
  
//   // Validate notification data
//   const isValidNotification = (notification) => {
//     // Check if notification has all required fields
//     if (!notification || !notification.type || !notification.message || !notification.sourceId) {
//       return false;
//     }
    
//     // For order notifications, validate amount and customer info
//     if (notification.type === 'order' && notification.sourceData) {
//       // Skip notifications with zero amount
//       if (notification.sourceData.amount <= 0) {
//         return false;
//       }
      
//       // Skip notifications with empty customer name
//       if (!notification.sourceData.customerName || notification.sourceData.customerName === 'Customer') {
//         return false;
//       }
//     }
    
//     return true;
//   };
  
//   // Mark invalid notification for cleanup
//   const cleanupInvalidNotification = async (notificationId) => {
//     try {
//       const notificationRef = ref(db, `notifications/${notificationId}`);
//       await update(notificationRef, { cleared: true });
//     } catch (error) {
//       console.error('Error cleaning up invalid notification:', error);
//     }
//   };
  
//   // Apply filter
//   const applyFilter = (filter, notificationsList = notifications) => {
//     setActiveFilter(filter);
    
//     if (filter === 'all') {
//       setFilteredNotifications(notificationsList);
//     } else {
//       const filtered = notificationsList.filter(notification => notification.type === filter);
//       setFilteredNotifications(filtered);
//     }
//   };
  
//   // Mark notification as read
//   const markAsRead = async (notificationId) => {
//     try {
//       const notificationRef = ref(db, `notifications/${notificationId}`);
//       await update(notificationRef, { read: true });
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//     }
//   };
  
//   // Mark all notifications as read
//   const markAllAsRead = async () => {
//     try {
//       const updates = {};
//       notifications.forEach(notification => {
//         if (!notification.read) {
//           updates[`notifications/${notification.id}/read`] = true;
//         }
//       });
      
//       if (Object.keys(updates).length > 0) {
//         await update(ref(db), updates);
//       }
//     } catch (error) {
//       console.error('Error marking all notifications as read:', error);
//     }
//   };
  
//   // Clear all read notifications
//   const clearReadNotifications = async () => {
//     try {
//       const updates = {};
//       notifications.forEach(notification => {
//         if (notification.read) {
//           updates[`notifications/${notification.id}/cleared`] = true;
//         }
//       });
      
//       if (Object.keys(updates).length > 0) {
//         await update(ref(db), updates);
//         setShowClearConfirm(false);
//       }
//     } catch (error) {
//       console.error('Error clearing read notifications:', error);
//     }
//   };
  
//   // Format time
//   const formatTime = (timestamp) => {
//     const date = new Date(timestamp);
//     const now = new Date();
//     const diffMs = now - date;
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMins / 60);
//     const diffDays = Math.floor(diffHours / 24);
    
//     if (diffMins < 1) {
//       return 'Just now';
//     } else if (diffMins < 60) {
//       return `${diffMins}m ago`;
//     } else if (diffHours < 24) {
//       return `${diffHours}h ago`;
//     } else if (diffDays < 7) {
//       return `${diffDays}d ago`;
//     } else {
//       return date.toLocaleDateString('en-IN', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     }
//   };
  
//   // Get notification icon based on type and action
//   const getNotificationIcon = (notification) => {
//     switch (notification.type) {
//       case 'order':
//         if (notification.action === 'new') return <Package className="notification-icon order" />;
//         if (notification.action === 'canceled') return <XCircle className="notification-icon canceled" />;
//         if (notification.action === 'processed') return <RefreshCw className="notification-icon processed" />;
//         if (notification.action === 'delivered') return <CheckCircle className="notification-icon delivered" />;
//         return <Package className="notification-icon" />;
        
//       case 'vendor_request':
//         return <Store className="notification-icon vendor" />;
        
//       case 'support_ticket':
//         return <MessageSquare className="notification-icon support" />;
        
//       default:
//         return <Bell className="notification-icon" />;
//     }
//   };
  
//   // Get notification badge class
//   const getNotificationBadgeClass = (notification) => {
//     switch (notification.type) {
//       case 'order':
//         if (notification.action === 'new') return 'badge-new';
//         if (notification.action === 'canceled') return 'badge-canceled';
//         return 'badge-order';
        
//       case 'vendor_request':
//         return 'badge-vendor';
        
//       case 'support_ticket':
//         if (notification.priority === 'high') return 'badge-high';
//         return 'badge-support';
        
//       default:
//         return 'badge-default';
//     }
//   };
  
//   // Get notification title
//   const getNotificationTitle = (notification) => {
//     switch (notification.type) {
//       case 'order':
//         if (notification.action === 'new') return 'New Order Placed';
//         if (notification.action === 'canceled') return 'Order Canceled';
//         if (notification.action === 'processed') return 'Order Processing';
//         if (notification.action === 'delivered') return 'Order Delivered';
//         return 'Order Update';
        
//       case 'vendor_request':
//         return 'New Vendor Request';
        
//       case 'support_ticket':
//         return 'New Support Ticket';
        
//       default:
//         return 'Notification';
//     }
//   };
  
//   // Get unread count
//   const getUnreadCount = (type = 'all') => {
//     if (type === 'all') {
//       return notifications.filter(n => !n.read && !n.cleared).length;
//     }
//     return notifications.filter(n => n.type === type && !n.read && !n.cleared).length;
//   };
  
//   // Notification click handler
//   const handleNotificationClick = (notification) => {
//     // Mark as read when clicked
//     if (!notification.read) {
//       markAsRead(notification.id);
//     }
    
//     // Navigate to relevant section based on notification type
//     switch (notification.type) {
//       case 'order':
//         window.location.href = `/orders?id=${notification.sourceId}`;
//         break;
        
//       case 'vendor_request':
//         window.location.href = `/support?tab=vendor_requests&id=${notification.sourceId}`;
//         break;
        
//       case 'support_ticket':
//         window.location.href = `/support?tab=tickets&id=${notification.sourceId}`;
//         break;
        
//       default:
//         break;
//     }
//   };
  
//   return (
//     <div className="notifications-container">
//       <div className="notifications-header">
//         <h1>Notifications</h1>
//         <div className="notifications-actions">
//           <button className="action-button read-all" onClick={markAllAsRead}>
//             <CheckCircle size={16} />
//             Mark All as Read
//           </button>
//           <button 
//             className="action-button clear-read" 
//             onClick={() => setShowClearConfirm(true)}
//           >
//             <Trash2 size={16} />
//             Clear Read
//           </button>
//         </div>
//       </div>
      
//       {showClearConfirm && (
//         <div className="confirm-dialog">
//           <div className="confirm-content">
//             <AlertTriangle size={24} className="confirm-icon" />
//             <p>Are you sure you want to clear all read notifications?</p>
//             <div className="confirm-actions">
//               <button 
//                 className="confirm-button cancel" 
//                 onClick={() => setShowClearConfirm(false)}
//               >
//                 Cancel
//               </button>
//               <button 
//                 className="confirm-button confirm" 
//                 onClick={clearReadNotifications}
//               >
//                 Clear
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
      
//       <div className="filter-tabs">
//         <button 
//           className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
//           onClick={() => applyFilter('all')}
//         >
//           All
//           {getUnreadCount('all') > 0 && (
//             <span className="filter-badge">{getUnreadCount('all')}</span>
//           )}
//         </button>
        
//         <button 
//           className={`filter-tab ${activeFilter === 'order' ? 'active' : ''}`}
//           onClick={() => applyFilter('order')}
//         >
//           Orders
//           {getUnreadCount('order') > 0 && (
//             <span className="filter-badge">{getUnreadCount('order')}</span>
//           )}
//         </button>
        
//         <button 
//           className={`filter-tab ${activeFilter === 'vendor_request' ? 'active' : ''}`}
//           onClick={() => applyFilter('vendor_request')}
//         >
//           Vendor Requests
//           {getUnreadCount('vendor_request') > 0 && (
//             <span className="filter-badge">{getUnreadCount('vendor_request')}</span>
//           )}
//         </button>
        
//         <button 
//           className={`filter-tab ${activeFilter === 'support_ticket' ? 'active' : ''}`}
//           onClick={() => applyFilter('support_ticket')}
//         >
//           Support Tickets
//           {getUnreadCount('support_ticket') > 0 && (
//             <span className="filter-badge">{getUnreadCount('support_ticket')}</span>
//           )}
//         </button>
//       </div>
      
//       <div className="notifications-list">
//         {loading ? (
//           <div className="loading-message">Loading notifications...</div>
//         ) : filteredNotifications.length === 0 ? (
//           <div className="empty-notifications">
//             <Bell size={32} className="empty-icon" />
//             <p>No notifications to display</p>
//           </div>
//         ) : (
//           filteredNotifications
//             .filter(notification => !notification.cleared)
//             .map(notification => (
//               <div 
//                 key={notification.id} 
//                 className={`notification-item ${!notification.read ? 'unread' : ''}`}
//                 onClick={() => handleNotificationClick(notification)}
//               >
//                 {getNotificationIcon(notification)}
                
//                 <div className="notification-content">
//                   <div className="notification-header">
//                     <h3 className="notification-title">
//                       {getNotificationTitle(notification)}
//                     </h3>
//                   </div>
                  
//                   <p className="notification-message">{notification.message}</p>
                  
//                   <div className="notification-meta">
//                     <span className="notification-time">
//                       <Clock size={14} />
//                       {formatTime(notification.timestamp)}
//                     </span>
//                   </div>
//                 </div>
                
//                 <ChevronRight className="notification-action" />
//               </div>
//             ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Notifications;

import { ref, get } from 'firebase/database';
import { db } from '../firebase/config';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from './NotificationContext';
import '../styles/Notifications.css';
import { 
  Bell, 
  Package, 
  Store, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  ChevronRight,
  Trash2
} from 'lucide-react';

const Notifications = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const navigate = useNavigate();
  
  const { 
    loading, 
    getFilteredNotifications, 
    getUnreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearReadNotifications,
    formatTime,
    getNotificationIcon 
  } = useNotifications();
  
  const filteredNotifications = getFilteredNotifications(activeFilter);
  
  // Get notification title
  const getNotificationTitle = (notification) => {
    switch (notification.type) {
      case 'order':
        if (notification.action === 'new') return 'New Order Placed';
        if (notification.action === 'canceled') return 'Order Canceled';
        if (notification.action === 'processed') return 'Order Processing';
        if (notification.action === 'delivered') return 'Order Delivered';
        return 'Order Update';
        
      case 'vendor_request':
        return 'New Vendor Request';
        
      case 'support_ticket':
        return 'New Support Ticket';
        
      default:
        return 'Notification';
    }
  };
  const inspectNotification = async (notificationId) => {
  try {
    // Fetch the raw notification data from Firebase
    const notificationRef = ref(db, `notifications/${notificationId}`);
    const snapshot = await get(notificationRef);
    
    if (snapshot.exists()) {
      const rawData = snapshot.val();
      
      // Create a more readable timestamp for display
      const timestamp = rawData.timestamp;
      const date = new Date(timestamp);
      const readableDate = date.toLocaleString();
      
      // Calculate how old this notification really is
      const now = new Date();
      const ageMs = now - date;
      const ageMinutes = Math.floor(ageMs / 60000);
      const ageHours = Math.floor(ageMinutes / 60);
      const ageDays = Math.floor(ageHours / 24);
      
      let ageText;
      if (ageDays > 0) {
        ageText = `${ageDays} days`;
      } else if (ageHours > 0) {
        ageText = `${ageHours} hours`;
      } else {
        ageText = `${ageMinutes} minutes`;
      }
      
      // Show details in an alert
      alert(`Notification Details:
ID: ${notificationId}
Type: ${rawData.type}
Action: ${rawData.action || 'none'}
Source ID: ${rawData.sourceId}
Message: ${rawData.message}
Timestamp: ${timestamp}
Human readable: ${readableDate}
Actual age: ${ageText}
Read: ${rawData.read ? 'Yes' : 'No'}
Cleared: ${rawData.cleared ? 'Yes' : 'No'}
      `);
      
      console.log('Raw notification data:', rawData);
    } else {
      alert('Notification not found in database!');
    }
  } catch (error) {
    console.error('Error inspecting notification:', error);
    alert(`Error inspecting notification: ${error.message}`);
  }
};
  // Notification click handler
const handleNotificationClick = (notification, event) => {
  // If right-click, inspect the notification instead of normal click behavior
  if (event && event.button === 2) {
    event.preventDefault();
    inspectNotification(notification.id);
    return;
  }
  
  // Mark as read when clicked
  if (!notification.read) {
    markAsRead(notification.id);
  }
  
  // Navigate to relevant section based on notification type
  switch (notification.type) {
    case 'order':
      navigate(`/orders?id=${notification.sourceId}`);
      break;
      
    case 'vendor_request':
      navigate(`/support?tab=vendor_requests&id=${notification.sourceId}`);
      break;
      
    case 'support_ticket':
      navigate(`/support?tab=tickets&id=${notification.sourceId}`);
      break;
      
    default:
      break;
  }
};
  
  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1>Notifications</h1>
        <div className="notifications-actions">
          <button className="action-button read-all" onClick={markAllAsRead}>
            <CheckCircle size={16} />
            Mark All as Read
          </button>
          <button 
            className="action-button clear-read" 
            onClick={() => setShowClearConfirm(true)}
          >
            <Trash2 size={16} />
            Clear Read
          </button>
        </div>
      </div>
      
      {showClearConfirm && (
        <div className="confirm-dialog">
          <div className="confirm-content">
            <AlertTriangle size={24} className="confirm-icon" />
            <p>Are you sure you want to clear all read notifications?</p>
            <div className="confirm-actions">
              <button 
                className="confirm-button cancel" 
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-button confirm" 
                onClick={() => {
                  clearReadNotifications();
                  setShowClearConfirm(false);
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="filter-tabs">
        <button 
          className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All
          {getUnreadCount('all') > 0 && (
            <span className="filter-badge">{getUnreadCount('all')}</span>
          )}
        </button>
        
        <button 
          className={`filter-tab ${activeFilter === 'order' ? 'active' : ''}`}
          onClick={() => setActiveFilter('order')}
        >
          Orders
          {getUnreadCount('order') > 0 && (
            <span className="filter-badge">{getUnreadCount('order')}</span>
          )}
        </button>
        
        <button 
          className={`filter-tab ${activeFilter === 'vendor_request' ? 'active' : ''}`}
          onClick={() => setActiveFilter('vendor_request')}
        >
          Vendor Requests
          {getUnreadCount('vendor_request') > 0 && (
            <span className="filter-badge">{getUnreadCount('vendor_request')}</span>
          )}
        </button>
        
        <button 
          className={`filter-tab ${activeFilter === 'support_ticket' ? 'active' : ''}`}
          onClick={() => setActiveFilter('support_ticket')}
        >
          Support Tickets
          {getUnreadCount('support_ticket') > 0 && (
            <span className="filter-badge">{getUnreadCount('support_ticket')}</span>
          )}
        </button>
      </div>
      
      <div className="notifications-list">
        {loading ? (
          <div className="loading-message">
            <RefreshCw className="spinning" />
            <span>Loading notifications...</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="empty-notifications">
            <Bell size={32} className="empty-icon" />
            <p>No notifications to display</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
              onClick={() => handleNotificationClick(notification)}
            >
              {getNotificationIcon(notification)}
              
              <div className="notification-content">
                <div className="notification-header">
                  <h3 className="notification-title">
                    {getNotificationTitle(notification)}
                  </h3>
                </div>
                
                <p className="notification-message">{notification.message}</p>
                
                <div className="notification-meta">
                  <span className="notification-time">
                    <Clock size={14} />
                    {formatTime(notification.timestamp)}
                  </span>
                </div>
              </div>
              
              <ChevronRight className="notification-action" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
