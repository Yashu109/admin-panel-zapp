// import React, { useState, useEffect, useRef } from 'react';
// import { Bell } from 'lucide-react';
// import { ref, query, orderByChild, onValue } from 'firebase/database';
// import { db } from '../firebase/config';
// import { Link } from 'react-router-dom';
// import '../styles/NotificationIcon.css';

// const NotificationIcon = () => {
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [notifications, setNotifications] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const dropdownRef = useRef(null);

//   // Fetch notifications from Firebase
//   useEffect(() => {
//     const notificationsRef = query(ref(db, 'notifications'), orderByChild('timestamp'));
    
//     const unsubscribe = onValue(notificationsRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const notificationsData = [];
//         snapshot.forEach((childSnapshot) => {
//           const notificationId = childSnapshot.key;
//           const notificationData = childSnapshot.val();
//           notificationsData.push({ id: notificationId, ...notificationData });
//         });
        
//         // Sort by timestamp (newest first)
//         notificationsData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
//         // Get recent notifications (last 5)
//         const recentNotifications = notificationsData
//           .filter(n => !n.cleared)
//           .slice(0, 5);
        
//         // Count unread notifications
//         const unreadNotifications = notificationsData.filter(n => !n.read && !n.cleared).length;
        
//         setNotifications(recentNotifications);
//         setUnreadCount(unreadNotifications);
//       } else {
//         setNotifications([]);
//         setUnreadCount(0);
//       }
//     }, (error) => {
//       console.error('Error fetching notifications:', error);
//     });
    
//     return () => unsubscribe();
//   }, []);

//   // Handle click outside to close dropdown
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };
    
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // Format time
//   const formatTime = (timestamp) => {
//     const date = new Date(timestamp);
//     const now = new Date();
//     const diffMs = now - date;
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMins / 60);
    
//     if (diffMins < 1) {
//       return 'Just now';
//     } else if (diffMins < 60) {
//       return `${diffMins}m ago`;
//     } else if (diffHours < 24) {
//       return `${diffHours}h ago`;
//     } else {
//       return date.toLocaleDateString('en-IN', {
//         month: 'short',
//         day: 'numeric'
//       });
//     }
//   };

//   // Get notification icon
//   const getNotificationIcon = (type) => {
//     switch (type) {
//       case 'order':
//         return '📦';
//       case 'vendor_request':
//         return '🏪';
//       case 'support_ticket':
//         return '💬';
//       default:
//         return '🔔';
//     }
//   };

//   return (
//     <div className="notification-icon-container" ref={dropdownRef}>
//       <button 
//         className="notification-icon-button" 
//         onClick={() => setShowDropdown(!showDropdown)}
//         aria-label="Notifications"
//       >
//         <Bell className="notification-bell-icon" />
//         {unreadCount > 0 && (
//           <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
//         )}
//       </button>
      
//       {showDropdown && (
//         <div className="notification-dropdown">
//           <div className="notification-dropdown-header">
//             <h3>Notifications</h3>
//             <Link 
//               to="/notifications" 
//               className="view-all-link"
//               onClick={() => setShowDropdown(false)}
//             >
//               View All
//             </Link>
//           </div>
          
//           <div className="notification-dropdown-content">
//             {notifications.length === 0 ? (
//               <div className="no-notifications">
//                 <p>No new notifications</p>
//               </div>
//             ) : (
//               <div className="notification-list">
//                 {notifications.map(notification => (
//                   <Link 
//                     key={notification.id}
//                     to={notification.type === 'order' 
//                       ? `/orders?id=${notification.sourceId}`
//                       : notification.type === 'vendor_request'
//                       ? `/support?tab=vendor_requests&id=${notification.sourceId}`
//                       : `/support?tab=tickets&id=${notification.sourceId}`
//                     }
//                     className={`notification-item ${!notification.read ? 'unread' : ''}`}
//                     onClick={() => setShowDropdown(false)}
//                   >
//                     <span className="notification-icon">
//                       {getNotificationIcon(notification.type)}
//                     </span>
//                     <div className="notification-content">
//                       <p className="notification-message">{notification.message}</p>
//                       <span className="notification-time">{formatTime(notification.timestamp)}</span>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationIcon;

import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/NotificationIcon.css';
import { useNotifications } from './NotificationContext';

const NotificationIcon = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  const { 
    unreadCount, 
    getRecentNotifications, 
    markAsRead, 
    getNotificationIcon,
    formatTime 
  } = useNotifications();
  
  const notifications = getRecentNotifications(5);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle notification click
  const handleNotificationClick = (notification) => {
    // Mark as read when clicked
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Navigate to relevant section based on notification type
    let destination = '';
    
    switch (notification.type) {
      case 'order':
        destination = `/orders?id=${notification.sourceId}`;
        break;
        
      case 'vendor_request':
        destination = `/support?tab=vendor_requests&id=${notification.sourceId}`;
        break;
        
      case 'support_ticket':
        destination = `/support?tab=tickets&id=${notification.sourceId}`;
        break;
        
      default:
        destination = '/notifications';
        break;
    }
    
    // Close dropdown
    setShowDropdown(false);
    
    // Navigate
    navigate(destination);
  };

  return (
    <div className="notification-icon-container" ref={dropdownRef}>
      <button 
        className="notification-icon-button" 
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label="Notifications"
      >
        <Bell className="notification-bell-icon" />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>
      
      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            <h3>Notifications</h3>
            <button 
              className="view-all-link"
              onClick={() => {
                setShowDropdown(false);
                navigate('/notifications');
              }}
            >
              View All
            </button>
          </div>
          
          <div className="notification-dropdown-content">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <p>No new notifications</p>
              </div>
            ) : (
              <div className="notification-list">
                {notifications.map(notification => (
                  <div 
                    key={notification.id}
                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <span className="notification-icon">
                      {getNotificationIcon(notification)}
                    </span>
                    <div className="notification-content">
                      <p className="notification-message">{notification.message}</p>
                      <span className="notification-time">{formatTime(notification.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;