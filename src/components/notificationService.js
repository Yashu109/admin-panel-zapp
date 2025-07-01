// import { ref, push, serverTimestamp } from 'firebase/database';
// import { db } from '../firebase/config';

// /**
//  * Create a new notification in the database
//  * @param {Object} notification - The notification object
//  * @param {string} notification.type - Type of notification (order, vendor_request, support_ticket)
//  * @param {string} notification.action - Action that triggered the notification (new, canceled, etc.)
//  * @param {string} notification.message - The notification message
//  * @param {string} notification.sourceId - ID of the source (order ID, vendor request ID, etc.)
//  * @param {Object} notification.sourceData - Additional data related to the source
//  * @param {string} notification.priority - Priority level (normal, high)
//  * @returns {Promise<string>} - The ID of the created notification
//  */
// export const createNotification = async (notification) => {
//   try {
//     // Validate required fields
//     if (!notification.type || !notification.message || !notification.sourceId) {
//       console.error('Missing required notification fields');
//       return null;
//     }
    
//     const notificationsRef = ref(db, 'notifications');
    
//     const newNotification = {
//       ...notification,
//       timestamp: new Date().toISOString(),
//       read: false,
//       cleared: false
//     };
    
//     const newNotificationRef = await push(notificationsRef, newNotification);
//     return newNotificationRef.key;
//   } catch (error) {
//     console.error('Error creating notification:', error);
//     return null;
//   }
// };

// /**
//  * Create an order notification
//  * @param {string} orderId - The order ID
//  * @param {string} action - The action (new, canceled, processed, delivered)
//  * @param {Object} orderData - Order data
//  * @returns {Promise<string>} - The ID of the created notification
//  */
// export const createOrderNotification = async (orderId, action, orderData) => {
//   // Validate order data
//   if (!orderId || !action || !orderData) {
//     console.error('Invalid order data for notification');
//     return null;
//   }
  
//   // Validate that order has a valid amount
//   if (!orderData.totalAmount || orderData.totalAmount <= 0) {
//     console.error('Order has invalid amount, skipping notification');
//     return null;
//   }
  
//   // Validate that order has customer info
//   if (!orderData.customer || !orderData.customer.fullName) {
//     console.error('Order lacks customer information, skipping notification');
//     return null;
//   }
  
//   let message = '';
//   let priority = 'normal';
  
//   switch (action) {
//     case 'new':
//       message = `New order #${orderData.displayId || orderId} placed by ${orderData.customer?.fullName} for ${formatCurrency(orderData.totalAmount)}.`;
//       break;
      
//     case 'canceled':
//       message = `Order #${orderData.displayId || orderId} has been canceled. Reason: ${orderData.cancellationReason || 'Not specified'}.`;
//       priority = 'high';
//       break;
      
//     case 'processed':
//       message = `Order #${orderData.displayId || orderId} is being processed by ${orderData.vendor?.name || 'vendor'}.`;
//       break;
      
//     case 'delivered':
//       message = `Order #${orderData.displayId || orderId} has been delivered to ${orderData.customer?.fullName}.`;
//       break;
      
//     default:
//       message = `Order #${orderData.displayId || orderId} has been updated.`;
//   }
  
//   return createNotification({
//     type: 'order',
//     action,
//     message,
//     sourceId: orderId,
//     sourceData: {
//       customerName: orderData.customer?.fullName || '',
//       vendorName: orderData.vendor?.name || '',
//       amount: orderData.totalAmount || 0,
//       status: orderData.status || ''
//     },
//     priority
//   });
// };

// /**
//  * Create a vendor request notification
//  * @param {string} requestId - The request ID
//  * @param {Object} requestData - Request data
//  * @returns {Promise<string>} - The ID of the created notification
//  */
// export const createVendorRequestNotification = async (requestId, requestData) => {
//   // Validate request data
//   if (!requestId || !requestData || !requestData.vendorName && !requestData.shopName) {
//     console.error('Invalid vendor request data for notification');
//     return null;
//   }
  
//   const message = `New vendor request from ${requestData.vendorName || requestData.shopName}: ${requestData.type || 'General Request'}.`;
  
//   return createNotification({
//     type: 'vendor_request',
//     action: 'new',
//     message,
//     sourceId: requestId,
//     sourceData: {
//       vendorName: requestData.vendorName || requestData.shopName || '',
//       requestType: requestData.type || '',
//       details: requestData.details || ''
//     },
//     priority: 'normal'
//   });
// };

// /**
//  * Create a support ticket notification
//  * @param {string} ticketId - The ticket ID
//  * @param {Object} ticketData - Ticket data
//  * @returns {Promise<string>} - The ID of the created notification
//  */
// export const createSupportTicketNotification = async (ticketId, ticketData) => {
//   // Validate ticket data
//   if (!ticketId || !ticketData || !ticketData.customerName) {
//     console.error('Invalid support ticket data for notification');
//     return null;
//   }
  
//   // Define high priority issues
//   const highPriorityIssues = [
//     'Quality Issues with Meat',
//     'Order Delayed'
//   ];
  
//   // Check if it's a high priority issue type
//   const isHighPriorityIssue = highPriorityIssues.includes(ticketData.issueType);
  
//   const message = `New support ticket from ${ticketData.customerName}: ${ticketData.issueType || 'General Issue'}.`;
  
//   return createNotification({
//     type: 'support_ticket',
//     action: 'new',
//     message,
//     sourceId: ticketId,
//     sourceData: {
//       customerName: ticketData.customerName || '',
//       issueType: ticketData.issueType || '',
//       details: ticketData.customerNote || ''
//     },
//     priority: isHighPriorityIssue ? 'high' : 'normal'
//   });
// };

// /**
//  * Format currency
//  * @param {number} amount - The amount to format
//  * @returns {string} - Formatted currency string
//  */
// const formatCurrency = (amount) => {
//   return new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//     minimumFractionDigits: 0
//   }).format(amount || 0);
// };


import { ref, push, query, orderByChild, equalTo, get, remove, update } from 'firebase/database';
import { db } from '../firebase/config';

// Cache to track notifications we've already created in this session
// This prevents duplicate notifications even after page reloads
const processedNotifications = new Set();

/**
 * Create a new notification in the database
 * @param {Object} notification - The notification object
 * @param {string} notification.type - Type of notification (order, vendor_request, support_ticket)
 * @param {string} notification.action - Action that triggered the notification (new, canceled, etc.)
 * @param {string} notification.message - The notification message
 * @param {string} notification.sourceId - ID of the source (order ID, vendor request ID, etc.)
 * @param {Object} notification.sourceData - Additional data related to the source
 * @param {string} notification.priority - Priority level (normal, high)
 * @returns {Promise<string>} - The ID of the created notification
 */
export const createNotification = async (notification) => {
  try {
    // Validate required fields
    if (!notification.type || !notification.message || !notification.sourceId) {
      console.error('Missing required notification fields');
      return null;
    }
    
    // Create a unique key for this notification to prevent duplicates
    const notificationKey = `${notification.type}_${notification.sourceId}_${notification.action || 'default'}`;
    
    // First check our in-memory cache (prevents duplicates during the same session)
    if (processedNotifications.has(notificationKey)) {
      console.log('Duplicate notification prevented (in-memory):', notificationKey);
      return null;
    }
    
    // Check for duplicate notifications in the database (same sourceId and action within last 24 hours)
    const duplicateCheck = await checkForDuplicateNotification(
      notification.sourceId, 
      notification.action,
      notification.type
    );
    
    if (duplicateCheck) {
      console.log('Duplicate notification prevented (database):', notificationKey);
      // Add to our processed cache even though we didn't create it
      processedNotifications.add(notificationKey);
      return null;
    }
    
    // Add timestamp if not provided
    const timestamp = notification.timestamp || new Date().toISOString();
    
    const notificationsRef = ref(db, 'notifications');
    
    const newNotification = {
      ...notification,
      timestamp,
      read: false,
      cleared: false
    };
    
    const newNotificationRef = await push(notificationsRef, newNotification);
    console.log(`Created notification: ${notification.type} - ${notification.action}`);
    
    // Add to our processed cache to prevent duplicates
    processedNotifications.add(notificationKey);
    
    return newNotificationRef.key;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

/**
 * Check if a similar notification exists recently
 * @param {string} sourceId - The source ID
 * @param {string} action - The action
 * @param {string} type - The notification type
 * @returns {Promise<boolean>} - True if duplicate exists
 */
const checkForDuplicateNotification = async (sourceId, action, type) => {
  try {
    // Query for notifications with the same sourceId
    const notificationsRef = query(
      ref(db, 'notifications'), 
      orderByChild('sourceId'), 
      equalTo(sourceId)
    );
    
    const snapshot = await get(notificationsRef);
    
    if (snapshot.exists()) {
      // Check if there's a notification with the same action in the last 24 hours
      // Using a longer window (24h instead of 5min) to be more conservative
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      let duplicate = false;
      snapshot.forEach(childSnapshot => {
        const notification = childSnapshot.val();
        
        if (notification.action === action && 
            notification.type === type && 
            notification.timestamp > twentyFourHoursAgo) {
          duplicate = true;
        }
      });
      
      return duplicate;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking for duplicate notification:', error);
    return false; // In case of error, let the notification through
  }
};

/**
 * Create an order notification
 * @param {string} orderId - The order ID
 * @param {string} action - The action (new, canceled, processed, delivered)
 * @param {Object} orderData - Order data
 * @returns {Promise<string>} - The ID of the created notification
 */
export const createOrderNotification = async (orderId, action, orderData) => {
  // Enhanced validation
  if (!orderId || !action || !orderData) {
    console.error('Invalid order data for notification');
    return null;
  }
  
  // Calculate total amount if not provided directly
  const totalAmount = orderData.totalAmount || calculateOrderTotal(orderData);
  
  // Validate that order has a valid amount
  if (!totalAmount || totalAmount <= 0) {
    console.error('Order has invalid amount, skipping notification');
    return null;
  }
  
  // Validate that order has customer info
  if (!orderData.customer || 
      !orderData.customer.fullName || 
      orderData.customer.fullName === 'Customer') {
    console.error('Order lacks valid customer information, skipping notification');
    return null;
  }
  
  let message = '';
  let priority = 'normal';
  
  switch (action) {
    case 'new':
      message = `New order #${orderData.displayId || orderId.slice(-6)} placed by ${orderData.customer?.fullName} for ${formatCurrency(totalAmount)}.`;
      break;
      
    case 'canceled':
      message = `Order #${orderData.displayId || orderId.slice(-6)} has been canceled. Reason: ${orderData.cancellationReason || 'Not specified'}.`;
      priority = 'high';
      break;
      
    case 'processed':
      message = `Order #${orderData.displayId || orderId.slice(-6)} is being processed by ${orderData.vendor?.name || 'vendor'}.`;
      break;
      
    case 'delivered':
      message = `Order #${orderData.displayId || orderId.slice(-6)} has been delivered to ${orderData.customer?.fullName}.`;
      break;
      
    default:
      message = `Order #${orderData.displayId || orderId.slice(-6)} has been updated.`;
  }
  
  return createNotification({
    type: 'order',
    action,
    message,
    sourceId: orderId,
    sourceData: {
      customerName: orderData.customer?.fullName || '',
      vendorName: orderData.vendor?.name || '',
      amount: totalAmount,
      status: orderData.status || ''
    },
    priority
  });
};

/**
 * Calculate total amount from order data
 * @param {Object} orderData - The order data
 * @returns {number} - The calculated total amount
 */
const calculateOrderTotal = (orderData) => {
  let total = 0;
  
  // Try to calculate from items
  if (orderData.items && Array.isArray(orderData.items)) {
    total = orderData.items.reduce((sum, item) => {
      return sum + ((item.price || 0) * (item.quantity || 1));
    }, 0);
  }
  
  // Add delivery charge if available
  if (orderData.deliveryCharge) {
    total += orderData.deliveryCharge;
  }
  
  // Add subtotal if available and items calculation failed
  if (total === 0 && orderData.subtotal) {
    total = orderData.subtotal;
  }
  
  return total;
};

/**
 * Create a vendor request notification
 * @param {string} requestId - The request ID
 * @param {Object} requestData - Request data
 * @returns {Promise<string>} - The ID of the created notification
 */
export const createVendorRequestNotification = async (requestId, requestData) => {
  // Validate request data
  if (!requestId || !requestData || (!requestData.vendorName && !requestData.shopName)) {
    console.error('Invalid vendor request data for notification');
    return null;
  }
  
  const message = `New vendor request from ${requestData.vendorName || requestData.shopName}: ${requestData.type || 'General Request'}.`;
  
  return createNotification({
    type: 'vendor_request',
    action: 'new',
    message,
    sourceId: requestId,
    sourceData: {
      vendorName: requestData.vendorName || requestData.shopName || '',
      requestType: requestData.type || '',
      details: requestData.details || ''
    },
    priority: 'normal'
  });
};

/**
 * Create a support ticket notification
 * @param {string} ticketId - The ticket ID
 * @param {Object} ticketData - Ticket data
 * @returns {Promise<string>} - The ID of the created notification
 */
export const createSupportTicketNotification = async (ticketId, ticketData) => {
  // Validate ticket data
  if (!ticketId || !ticketData || !ticketData.customerName) {
    console.error('Invalid support ticket data for notification:', ticketId, ticketData);
    return null;
  }
  
  // Define high priority issues
  const highPriorityIssues = [
    'Quality Issues with Meat',
    'Order Delayed',
    'Missing Items',
    'Wrong Order'
  ];
  
  // Check if it's a high priority issue type
  const isHighPriorityIssue = ticketData.issueType && highPriorityIssues.includes(ticketData.issueType);
  const priorityLevel = ticketData.priority === 'high' || isHighPriorityIssue ? 'high' : 'normal';
  
  console.log(`Creating support ticket notification: ${ticketId} with priority ${priorityLevel}`);
  
  const message = `New support ticket from ${ticketData.customerName}: ${ticketData.issueType || 'General Issue'}.`;
  
  return createNotification({
    type: 'support_ticket',
    action: 'new',
    message,
    sourceId: ticketId,
    sourceData: {
      customerName: ticketData.customerName || '',
      issueType: ticketData.issueType || '',
      details: ticketData.customerNote || ''
    },
    priority: priorityLevel
  });
};

/**
 * Clean up old notifications
 * @param {number} days - Number of days to keep notifications (default: 30)
 * @returns {Promise<number>} - Number of deleted notifications
 */
export const cleanupOldNotifications = async (days = 30) => {
  try {
    // Calculate cutoff date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffDateStr = cutoffDate.toISOString();
    
    // Get all notifications
    const notificationsRef = ref(db, 'notifications');
    const snapshot = await get(notificationsRef);
    
    if (!snapshot.exists()) {
      return 0;
    }
    
    // Count and remove old notifications
    let deletedCount = 0;
    const deletionPromises = [];
    
    snapshot.forEach(childSnapshot => {
      const notification = childSnapshot.val();
      
      // Delete if older than cutoff date or already cleared
      if (notification.timestamp < cutoffDateStr || notification.cleared) {
        const notificationRef = ref(db, `notifications/${childSnapshot.key}`);
        deletionPromises.push(remove(notificationRef));
        deletedCount++;
      }
    });
    
    // Wait for all deletions to complete
    await Promise.all(deletionPromises);
    
    console.log(`Deleted ${deletedCount} old notifications`);
    return deletedCount;
  } catch (error) {
    console.error('Error cleaning up old notifications:', error);
    return 0;
  }
};

/**
 * Format currency
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount || 0);
};