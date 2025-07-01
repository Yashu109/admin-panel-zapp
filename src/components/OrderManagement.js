



// import React, { useState, useEffect } from 'react';
// import { 
//   Package, 
//   Filter, 
//   Search,
//   MapPin,
//   Star,
//   Trash2,
//   ChevronRight,
//   CheckCircle,
//   Clock,
//   Truck,
//   XCircle,
//   RefreshCw,
//   Utensils,
//   Calendar,
//   ChevronDown,
//   ChevronUp,
//   ArrowUp,
//   ArrowDown,
//   Download,
//   Send,
//   Map,
//   Navigation,
//   AlertTriangle
// } from 'lucide-react';
// import { ref, onValue, update, get, remove } from 'firebase/database';
// import { db } from '../firebase/config';
// import '../styles/OrderManagement.css';
// import '../styles/AdminAlerts.css';
// import OrderItems from './OrderItems';
// import AdminAlerts from './AdminAlerts';
// import { createOrderNotification } from './notificationService';

// const OrderManagement = () => {
//   // State for active tab
//   const [activeTab, setActiveTab] = useState('all');
  
//   // State for search term
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // State for selected order
//   const [selectedOrder, setSelectedOrder] = useState(null);
  
//   // State for orders
//   const [orders, setOrders] = useState([]);
  
//   // State for loading
//   const [loading, setLoading] = useState(true);
  
//   // State for error
//   const [error, setError] = useState('');

//   // Map to store order ID mappings (Firebase ID -> Display ID)
//   const [orderIdMap, setOrderIdMap] = useState({});

//   // State for sorting
//   const [sortBy, setSortBy] = useState('date');
//   const [sortDirection, setSortDirection] = useState('desc');

//   // State for date filter
//   const [dateFilter, setDateFilter] = useState('all');
//   const [customDateRange, setCustomDateRange] = useState({
//     start: '',
//     end: ''
//   });

//   // State for area filter
//   const [areaFilter, setAreaFilter] = useState('all');
//   const [availableAreas, setAvailableAreas] = useState([]);

//   // State for admin alerts
//   const [adminAlerts, setAdminAlerts] = useState([]);

//   // State to track orders we've already notified about
//   const [notifiedOrders, setNotifiedOrders] = useState([]);

//   // Generate simplified order IDs for display
//   const generateOrderIdMap = (orders) => {
//     const idMap = {};
//     orders.forEach((order, index) => {
//       idMap[order.id] = `ORD-${index + 1}`;
//     });
//     setOrderIdMap(idMap);
//     return idMap;
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const options = { 
//       year: 'numeric', 
//       month: 'short', 
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return new Date(dateString).toLocaleDateString('en-IN', options);
//   };

//   // Format currency
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 2
//     }).format(amount);
//   };

//   // Fetch orders from Realtime Database in real-time
//   useEffect(() => {
//     const ordersRef = ref(db, 'orders');
//     setLoading(true);
    
//     const unsubscribe = onValue(ordersRef, (snapshot) => {
//       const data = snapshot.val();
//       const ordersData = data ? Object.keys(data).map(key => {
//         const order = {
//           id: key,
//           ...data[key],
//           timeline: data[key].timeline || [
//             { 
//               status: 'order_placed', 
//               time: data[key].orderDate || new Date().toISOString(),
//               note: 'Order placed successfully' 
//             }
//           ]
//         };
//         // Validate and clean timeline entries
//         order.timeline = order.timeline.map(event => ({
//           ...event,
//           time: event.time || new Date().toISOString() // Ensure time is always defined
//         }));
//         return order;
//       }) : [];
      
//       const idMap = generateOrderIdMap(ordersData);
//       setOrders(ordersData);
      
//       // Extract and set available areas
//       const areas = extractAreas(ordersData);
//       setAvailableAreas(areas);
      
//       // Check for new orders and status changes
//       checkForOrderChanges(ordersData, idMap);
      
//       setLoading(false);
//     }, (err) => {
//       console.error('Error fetching orders:', err);
//       setError('Failed to load orders. Please try again later.');
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [notifiedOrders]);

//   // Function to extract unique areas from orders
//   const extractAreas = (ordersData) => {
//     const areas = new Set();
//     ordersData.forEach(order => {
//       const address = order.customer?.address || '';
//       const city = order.customer?.city || '';
      
//       // Extract area from address (simplified version)
//       const addressParts = address.split(',');
//       if (addressParts.length > 0) {
//         const area = addressParts[0].trim();
//         if (area) areas.add(area);
//       }
      
//       // Add city as area if available
//       if (city) areas.add(city);
//     });
    
//     return Array.from(areas).sort();
//   };

//   // Check for new orders and status changes
//   const checkForOrderChanges = (ordersData, idMap) => {
//     // Get any orders that were created or updated in the last 5 minutes
//     const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
//     ordersData.forEach(order => {
//       // Check if this order or a status update is new
//       const orderDate = new Date(order.orderDate);
      
//       // Check the latest timeline event
//       const latestEvent = order.timeline && order.timeline.length > 0 
//         ? order.timeline[order.timeline.length - 1] 
//         : null;
      
//       if (latestEvent) {
//         const eventTime = new Date(latestEvent.time);
//         const notificationKey = `${order.id}-${latestEvent.status}`;
        
//         // If the event happened in the last 5 minutes and we haven't notified about it yet
//         if (eventTime > fiveMinutesAgo && !notifiedOrders.includes(notificationKey)) {
//           console.log("Checking order event:", notificationKey, latestEvent.status);
          
//           // Create notifications based on event type
//           switch(latestEvent.status) {
//             case 'order_placed':
//               console.log("Creating notification for new order:", order.id);
//               createOrderNotification(order.id, 'new', {
//                 ...order,
//                 displayId: idMap[order.id] || order.id
//               });
//               break;
              
//             case 'cancelled':
//               console.log("Creating notification for canceled order:", order.id);
//               createOrderNotification(order.id, 'canceled', {
//                 ...order,
//                 displayId: idMap[order.id] || order.id
//               });
//               break;
              
//             case 'processing':
//               console.log("Creating notification for processing order:", order.id);
//               createOrderNotification(order.id, 'processed', {
//                 ...order,
//                 displayId: idMap[order.id] || order.id
//               });
//               break;
              
//             case 'delivered':
//               console.log("Creating notification for delivered order:", order.id);
//               createOrderNotification(order.id, 'delivered', {
//                 ...order,
//                 displayId: idMap[order.id] || order.id
//               });
//               break;
              
//             default:
//               // No notification for other status changes
//               break;
//           }
          
//           // Mark this order event as notified
//           setNotifiedOrders(prev => [...prev, notificationKey]);
//         }
//       }
//     });
//   };

//   // Delete order from Firebase
//   const deleteOrder = async (orderId) => {
//     const confirmed = window.confirm(`Are you sure you want to delete order ${orderIdMap[orderId] || orderId}? This action cannot be undone.`);
//     if (!confirmed) return;

//     try {
//       const orderRef = ref(db, `orders/${orderId}`);
//       await remove(orderRef);
//       alert(`Order ${orderIdMap[orderId] || orderId} has been deleted.`);
//     } catch (err) {
//       console.error('Error deleting order:', err);
//       alert('Failed to delete order. Please try again.');
//     }
//   };

//   // Cancel order
//   const cancelOrder = async (orderId) => {
//     const confirmed = window.confirm(`Are you sure you want to cancel order ${orderIdMap[orderId] || orderId}? This will initiate a refund process.`);
//     if (!confirmed) return;

//     try {
//       const order = orders.find(o => o.id === orderId);
//       if (!order) {
//         throw new Error('Order not found in state');
//       }

//       // Validate and clean timeline entries
//       const cleanedTimeline = order.timeline.map(event => ({
//         ...event,
//         time: event.time || new Date().toISOString() // Ensure time is always defined
//       }));

//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, {
//         status: 'cancelled',
//         refundStatus: 'initiated',
//         cancellationReason: 'Cancelled by admin',
//         timeline: [
//           ...cleanedTimeline,
//           {
//             status: 'cancelled',
//             time: new Date().toISOString(),
//             note: 'Order cancelled by admin'
//           },
//           {
//             status: 'refund_initiated',
//             time: new Date().toISOString(),
//             note: 'Refund initiated'
//           }
//         ]
//       });
      
//       // Create notification for canceled order
//       createOrderNotification(orderId, 'canceled', {
//         ...order,
//         displayId: orderIdMap[orderId] || orderId,
//         cancellationReason: 'Cancelled by admin'
//       });
      
//       alert(`Order ${orderIdMap[orderId] || orderId} has been cancelled and refund initiated.`);
//     } catch (err) {
//       console.error('Error cancelling order:', err);
//       alert(`Failed to cancel order: ${err.message}`);
//     }
//   };

//   // Assign order to vendor
//   const assignOrder = async (orderId) => {
//     try {
//       // Implementation details for vendor assignment
//       // This would trigger a notification through the updated order
//       alert(`Order ${orderIdMap[orderId] || orderId} has been assigned.`);
//     } catch (err) {
//       console.error('Error assigning order:', err);
//       alert('Failed to assign order. Please try again.');
//     }
//   };

//   // Handle sorting change
//   const handleSortChange = (field) => {
//     if (sortBy === field) {
//       // Toggle direction if clicking the same field
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       // Set new field and default to descending
//       setSortBy(field);
//       setSortDirection('desc');
//     }
//   };

//   // Handle date filter change
//   const handleDateFilterChange = (filter) => {
//     setDateFilter(filter);
//   };

//   // Handle area filter change
//   const handleAreaFilterChange = (filter) => {
//     setAreaFilter(filter);
//   };

//   // Apply date filter to orders
//   const getDateFilteredOrders = (ordersList) => {
//     if (dateFilter === 'all') return ordersList;
    
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     const yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);
    
//     const lastWeekStart = new Date(today);
//     lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    
//     const lastMonthStart = new Date(today);
//     lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    
//     return ordersList.filter(order => {
//       const orderDate = new Date(order.orderDate);
      
//       switch (dateFilter) {
//         case 'today':
//           return orderDate >= today;
//         case 'yesterday':
//           return orderDate >= yesterday && orderDate < today;
//         case 'last7days':
//           return orderDate >= lastWeekStart;
//         case 'last30days':
//           return orderDate >= lastMonthStart;
//         case 'custom':
//           const startDate = customDateRange.start ? new Date(customDateRange.start) : null;
//           const endDate = customDateRange.end ? new Date(customDateRange.end) : null;
          
//           if (startDate && endDate) {
//             // Set end date to end of day
//             endDate.setHours(23, 59, 59, 999);
//             return orderDate >= startDate && orderDate <= endDate;
//           } else if (startDate) {
//             return orderDate >= startDate;
//           } else if (endDate) {
//             endDate.setHours(23, 59, 59, 999);
//             return orderDate <= endDate;
//           }
//           return true;
//         default:
//           return true;
//       }
//     });
//   };

//   // Apply area filter to orders
//   const getAreaFilteredOrders = (ordersList) => {
//     if (areaFilter === 'all') return ordersList;
    
//     return ordersList.filter(order => {
//       const address = `${order.customer?.address || ''}, ${order.customer?.city || ''}, ${order.customer?.pincode || ''}`;
//       return address.toLowerCase().includes(areaFilter.toLowerCase());
//     });
//   };

//   // Sort orders based on current sort settings
//   const getSortedOrders = (ordersList) => {
//     return [...ordersList].sort((a, b) => {
//       let comparison = 0;
      
//       switch (sortBy) {
//         case 'date':
//           comparison = new Date(a.orderDate) - new Date(b.orderDate);
//           break;
//         case 'amount':
//           comparison = a.totalAmount - b.totalAmount;
//           break;
//         case 'customer':
//           comparison = (a.customer?.fullName || '').localeCompare(b.customer?.fullName || '');
//           break;
//         case 'status':
//           comparison = (a.status || '').localeCompare(b.status || '');
//           break;
//         default:
//           comparison = 0;
//       }
      
//       return sortDirection === 'asc' ? comparison : -comparison;
//     });
//   };

//   // Filter orders based on active tab, search term, and other filters
//   const getFilteredOrders = () => {
//     let filtered = orders.filter(order => {
//       if (activeTab !== 'all' && order.status !== activeTab) {
//         return false;
//       }
//       if (searchTerm && 
//           !(orderIdMap[order.id] || '').toLowerCase().includes(searchTerm.toLowerCase()) && 
//           !order.id.toLowerCase().includes(searchTerm.toLowerCase()) && 
//           !order.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())) {
//         return false;
//       }
//       return true;
//     });
    
//     // Apply date filtering
//     filtered = getDateFilteredOrders(filtered);
    
//     // Apply area filtering
//     filtered = getAreaFilteredOrders(filtered);
    
//     // Apply sorting
//     return getSortedOrders(filtered);
//   };

//   // Status icon mapping
//   const getStatusIcon = (status) => {
//     switch(status) {
//       case 'pending': return <Clock className="status-icon pending" />;
//       case 'pending_vendor_confirmation': return <AlertTriangle className="status-icon pending" />;
//       case 'pending_vendor_manual_acceptance': return <AlertTriangle className="status-icon pending" />;
//       case 'processing': return <RefreshCw className="status-icon processing" />;
//       case 'prepared': return <Utensils className="status-icon prepared" />;
//       case 'ready_for_pickup': return <Package className="status-icon ready-for-pickup" />;
//       case 'delivery_assigned': return <Truck className="status-icon delivery-assigned" />;
//       case 'out_for_delivery': return <Navigation className="status-icon out-for-delivery" />;
//       case 'delivered': return <CheckCircle className="status-icon delivered" />;
//       case 'cancelled': return <XCircle className="status-icon cancelled" />;
//       default: return <Clock className="status-icon" />;
//     }
//   };

//   // Status text formatting
//   const getStatusText = (status) => {
//     if (!status) return 'Unknown'; // Safeguard for undefined status
//     switch(status) {
//       case 'pending': return 'Pending';
//       case 'pending_vendor_confirmation': return 'Awaiting Vendor Confirmation';
//       case 'pending_vendor_manual_acceptance': return 'Awaiting Manual Acceptance';
//       case 'processing': return 'Processing';
//       case 'prepared': return 'Prepared';
//       case 'ready_for_pickup': return 'Ready for Pickup';
//       case 'delivery_assigned': return 'Delivery Assigned';
//       case 'out_for_delivery': return 'Out for Delivery';
//       case 'delivered': return 'Delivered';
//       case 'cancelled': return 'Cancelled';
//       case 'order_placed': return 'Order Placed';
//       case 'order_confirmed': return 'Order Confirmed';
//       case 'refund_initiated': return 'Refund Initiated';
//       case 'refund_processed': return 'Refund Processed';
//       default: return status.split('_').map(word => 
//         word.charAt(0).toUpperCase() + word.slice(1)
//       ).join(' ');
//     }
//   };

//   // Function to dismiss an alert
//   const dismissAlert = (index) => {
//     setAdminAlerts(prevAlerts => prevAlerts.filter((_, i) => i !== index));
//   };

//   // Export orders to CSV
//   const exportOrdersCSV = () => {
//     const filteredOrders = getFilteredOrders();
    
//     // Define CSV headers
//     const headers = [
//       'Order ID',
//       'Customer Name',
//       'Customer Email',
//       'Customer Phone',
//       'Address',
//       'Date & Time',
//       'Amount',
//       'Status',
//       'Vendor',
//       'Delivery Person',
//       'Items'
//     ];
    
//     // Map orders to CSV rows
//     const rows = filteredOrders.map(order => {
//       const itemsString = order.items ? order.items
//         .map(item => `${item.name} x ${item.quantity}`)
//         .join('; ') : '';
      
//       return [
//         orderIdMap[order.id] || order.id,
//         order.customer?.fullName || '',
//         order.customer?.email || '',
//         order.customer?.phone || '',
//         `${order.customer?.address || ''}, ${order.customer?.city || ''}, ${order.customer?.pincode || ''}`,
//         formatDate(order.orderDate),
//         order.totalAmount,
//         getStatusText(order.status),
//         order.vendor?.name || (order.assignedVendor?.name ? `${order.assignedVendor.name} (pending)` : ''),
//         order.delivery?.partnerName || (order.deliveryPerson?.name || ''),
//         itemsString
//       ];
//     });
    
//     // Combine headers and rows
//     const csvContent = [
//       headers.join(','),
//       ...rows.map(row => row.map(cell => 
//         // Escape special characters in CSV
//         typeof cell === 'string' ? `"${cell.replace(/"/g, '""')}"` : cell
//       ).join(','))
//     ].join('\n');
    
//     // Create a Blob with the CSV content
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
    
//     // Create a link element and trigger download
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', `orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const filteredOrders = getFilteredOrders();

//   // Detail view for selected order
//   if (selectedOrder) {
//     const order = orders.find(o => o.id === selectedOrder);
    
//     if (!order) return <div className="order-management">Order not found</div>;

//     return (
//       <div className="order-management">
//         {/* Add AdminAlerts component */}
//         <AdminAlerts alerts={adminAlerts} onDismiss={dismissAlert} />
        
//         <div className="order-detail-header">
//           <button className="back-button" onClick={() => setSelectedOrder(null)}>
//             ← Back to Orders
//           </button>
//           <h1>Order Details: {orderIdMap[order.id] || order.id}</h1>
//           <div className="order-status-badge">
//             {getStatusIcon(order.status)}
//             <span>{getStatusText(order.status)}</span>
//           </div>
//         </div>

//         <div className="order-detail-container">
//           <div className="order-detail-card customer-info">
//             <h2>Customer Information</h2>
//             <p><strong>Name:</strong> {order.customer?.fullName}</p>
//             <p><strong>Address:</strong> {`${order.customer?.address}, ${order.customer?.city}, ${order.customer?.pincode}`}</p>
//             <p><strong>Email:</strong> {order.customer?.email}</p>
//             <p><strong>Phone:</strong> {order.customer?.phone}</p>
//             <p><strong>Order Date:</strong> {formatDate(order.orderDate)}</p>
//           </div>

//           <div className="order-detail-card vendor-info">
//             <h2>Vendor Information</h2>
//             {order.vendor ? (
//               <>
//                 <p><strong>Name:</strong> {order.vendor.name}</p>
//                 <p><strong>Rating:</strong> {order.vendor.rating || 'N/A'} <Star size={14} className="star-icon" /></p>
//                 <p><strong>Address:</strong> {order.vendor.location?.address}</p>
//               </>
//             ) : order.assignedVendor ? (
//               <>
//                 <p><strong>Name:</strong> {order.assignedVendor.name} 
//                   <span className={`pending-badge ${order.status === 'pending_vendor_manual_acceptance' ? 'manual' : ''}`}>
//                     ({order.status === 'pending_vendor_manual_acceptance' ? 'Awaiting manual acceptance' : 'Awaiting confirmation'})
//                   </span>
//                 </p>
//                 <p><strong>Rating:</strong> {order.assignedVendor.rating || 'N/A'} <Star size={14} className="star-icon" /></p>
//                 <p><strong>Address:</strong> {order.assignedVendor.location?.address}</p>
//                 <p><strong>Distance:</strong> {order.assignedVendor.distanceText || order.assignedVendor.distance}</p>
//                 <p><strong>Assigned At:</strong> {formatDate(order.vendorAssignedAt)}</p>
//                 <p><strong>Assignment Type:</strong> {order.assignmentType === 'auto' ? 'Automatic' : (order.assignmentType === 'manual_required' ? 'Manual Acceptance Required' : 'Manual')}</p>
//                 <p><strong>Status:</strong> <span className={`status-text ${order.assignedVendor.status === 'active' ? 'active-status' : 'inactive-status'}`}>
//                   {order.assignedVendor.status === 'active' ? 'Active' : 'Inactive'}
//                 </span></p>
//                 {order.vendorAssignedAt && order.status === 'pending_vendor_confirmation' && (
//                   <div className="confirmation-timer">
//                     <AlertTriangle size={14} className="timer-icon" />
//                     <span>Vendor must confirm within 5 minutes</span>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <div className="no-vendor">
//                 <p>No vendor assigned yet. Auto-assignment in progress...</p>
//                 <button className="assign-vendor-button" onClick={() => assignOrder(order.id)}>
//                   Manually Assign Vendor
//                 </button>
//               </div>
//             )}
//           </div>

//           <div className="order-detail-card delivery-info">
//             <h2>Delivery Information</h2>
//             {(order.delivery || order.deliveryPerson) ? (
//               <>
//                 <p><strong>Delivery Person:</strong> {order.delivery?.partnerName || order.deliveryPerson?.name}</p>
//                 {(order.delivery?.partnerPhone || order.deliveryPerson?.phone) && (
//                   <p><strong>Phone:</strong> {order.delivery?.partnerPhone || order.deliveryPerson?.phone}</p>
//                 )}
//                 {(order.delivery?.trackingId || order.deliveryPerson?.bookingId) && (
//                   <p><strong>Tracking ID:</strong> {order.delivery?.trackingId || order.deliveryPerson?.bookingId}</p>
//                 )}
//                 {(order.delivery?.estimatedPickupTime || order.deliveryPerson?.estimatedPickupTime) && (
//                   <p><strong>Est. Pickup:</strong> {formatDate(order.delivery?.estimatedPickupTime || order.deliveryPerson?.estimatedPickupTime)}</p>
//                 )}
//                 {(order.delivery?.estimatedDeliveryTime || order.deliveryPerson?.estimatedDeliveryTime) && (
//                   <p><strong>Est. Delivery:</strong> {formatDate(order.delivery?.estimatedDeliveryTime || order.deliveryPerson?.estimatedDeliveryTime)}</p>
//                 )}
//                 {(order.status === 'out_for_delivery' && (order.delivery?.trackingUrl || order.deliveryPerson?.trackingUrl)) && (
//                   <div className="tracking-link">
//                     <a 
//                       href={order.delivery?.trackingUrl || order.deliveryPerson?.trackingUrl} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="track-button"
//                     >
//                       Track Live Location
//                     </a>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <p>Delivery will be assigned by the vendor when the order is ready for pickup.</p>
//             )}
//           </div>

//           {/* Replace the existing order items table with our new component */}
//           <OrderItems 
//             items={order.items}
//             subtotal={order.subtotal}
//             deliveryCharge={order.deliveryCharge}
//             // tax={order.tax}
//             totalAmount={order.totalAmount}
//             formatCurrency={formatCurrency}
//           />

//           <div className="order-detail-card order-timeline">
//             <h2>Order Timeline</h2>
//             <div className="timeline">
//               {order.timeline?.map((event, index) => (
//                 event.status ? (
//                   <div className="timeline-item" key={index}>
//                     <div className="timeline-marker"></div>
//                     <div className="timeline-content">
//                       <h3>{getStatusText(event.status)}</h3>
//                       <p className="timeline-time">{formatDate(event.time)}</p>
//                       <p className="timeline-note">{event.note}</p>
//                     </div>
//                   </div>
//                 ) : (
//                   console.warn(`Invalid timeline event at index ${index} for order ${order.id}:`, event) || null
//                 )
//               ))}
//             </div>
//           </div>

//           {order.status !== 'delivered' && order.status !== 'cancelled' && (
//             <div className="order-actions">
//               <button className="cancel-order-button" onClick={() => cancelOrder(order.id)}>
//                 Cancel Order & Initiate Refund
//               </button>
//             </div>
//           )}

//           {order.status === 'cancelled' && (
//             <div className="refund-info order-detail-card">
//               <h2>Refund Information</h2>
//               <p><strong>Cancellation Reason:</strong> {order.cancellationReason || 'Not specified'}</p>
//               <p><strong>Refund Status:</strong> {order.refundStatus === 'processed' ? 'Refund Processed' : 'Refund Pending'}</p>
//               {order.timeline
//                 .filter(event => event.status && event.status.includes('refund'))
//                 .map((event, index) => (
//                   <p key={index}><strong>{getStatusText(event.status)}:</strong> {formatDate(event.time)}</p>
//                 ))
//               }
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // Main orders table view
//   return (
//     <div className="order-management">
//       {/* Add AdminAlerts component */}
//       <AdminAlerts alerts={adminAlerts} onDismiss={dismissAlert} />
      
//       <h1>Order Management</h1>

//       {error && <div className="error-message">{error}</div>}
//       {loading && <div className="loading-message">Loading orders...</div>}

//       <div className="order-filters">
//         <div className="search-container">
//           <Search className="search-icon" />
//           <input 
//             type="text"
//             placeholder="Search orders by ID or customer name..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="search-input"
//           />
//         </div>

//         <div className="filter-tabs">
//           <button 
//             className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
//             onClick={() => setActiveTab('all')}
//           >
//             All Orders
//           </button>
//           <button 
//             className={`filter-tab ${activeTab === 'pending' ? 'active' : ''}`}
//             onClick={() => setActiveTab('pending')}
//           >
//             Pending
//           </button>
//           <button 
//             className={`filter-tab ${activeTab === 'pending_vendor_confirmation' ? 'active' : ''}`}
//             onClick={() => setActiveTab('pending_vendor_confirmation')}
//           >
//             Awaiting Vendor
//           </button>
//           <button 
//             className={`filter-tab ${activeTab === 'pending_vendor_manual_acceptance' ? 'active' : ''}`}
//             onClick={() => setActiveTab('pending_vendor_manual_acceptance')}
//           >
//             Manual Acceptance
//           </button>
//           <button 
//             className={`filter-tab ${activeTab === 'processing' ? 'active' : ''}`}
//             onClick={() => setActiveTab('processing')}
//           >
//             Processing
//           </button>
//           <button 
//             className={`filter-tab ${activeTab === 'ready_for_pickup' ? 'active' : ''}`}
//             onClick={() => setActiveTab('ready_for_pickup')}
//           >
//             Ready for Pickup
//           </button>
//           <button 
//             className={`filter-tab ${activeTab === 'out_for_delivery' ? 'active' : ''}`}
//             onClick={() => setActiveTab('out_for_delivery')}
//           >
//             Out for Delivery
//           </button>
//           <button 
//             className={`filter-tab ${activeTab === 'delivered' ? 'active' : ''}`}
//             onClick={() => setActiveTab('delivered')}
//           >
//             Delivered
//           </button>
//           <button 
//             className={`filter-tab ${activeTab === 'cancelled' ? 'active' : ''}`}
//             onClick={() => setActiveTab('cancelled')}
//           >
//             Cancelled
//           </button>
//         </div>
//       </div>

//       {/* Advanced filters */}
//       <div className="advanced-filters">
//         <div className="filters-container">
//           <div className="date-filters">
//             <div className="date-filter-label">
//               <Calendar size={16} />
//               <span>Date Filter:</span>
//             </div>
//             <select 
//               value={dateFilter} 
//               onChange={(e) => handleDateFilterChange(e.target.value)}
//               className="date-filter-select"
//             >
//               <option value="all">All Time</option>
//               <option value="today">Today</option>
//               <option value="yesterday">Yesterday</option>
//               <option value="last7days">Last 7 Days</option>
//               <option value="last30days">Last 30 Days</option>
//               <option value="custom">Custom Range</option>
//             </select>
            
//             {dateFilter === 'custom' && (
//               <div className="custom-date-range">
//                 <input
//                   type="date"
//                   value={customDateRange.start}
//                   onChange={(e) => setCustomDateRange({...customDateRange, start: e.target.value})}
//                   className="date-input"
//                   placeholder="Start Date"
//                 />
//                 <span>to</span>
//                 <input
//                   type="date"
//                   value={customDateRange.end}
//                   onChange={(e) => setCustomDateRange({...customDateRange, end: e.target.value})}
//                   className="date-input"
//                   placeholder="End Date"
//                 />
//               </div>
//             )}
//           </div>
          
//           <div className="area-filters">
//             <div className="area-filter-label">
//               <Map size={16} />
//               <span>Area Filter:</span>
//             </div>
//             <select 
//               value={areaFilter} 
//               onChange={(e) => handleAreaFilterChange(e.target.value)}
//               className="area-filter-select"
//             >
//               <option value="all">All Areas</option>
//               {availableAreas.map(area => (
//                 <option key={area} value={area}>{area}</option>
//               ))}
//             </select>
//           </div>
          
//           <div className="export-container">
//             <button className="export-button" onClick={exportOrdersCSV}>
//               <Download size={16} />
//               Export Orders
//             </button>
//           </div>
//         </div>
        
//         <div className="sort-filters">
//           <div className="sort-filter-label">
//             <Filter size={16} />
//             <span>Sort By:</span>
//           </div>
//           <div className="sort-options">
//             <button 
//               className={`sort-option ${sortBy === 'date' ? 'active' : ''}`}
//               onClick={() => handleSortChange('date')}
//             >
//               Date
//               {sortBy === 'date' && (
//                 sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
//               )}
//             </button>
//             <button 
//               className={`sort-option ${sortBy === 'amount' ? 'active' : ''}`}
//               onClick={() => handleSortChange('amount')}
//             >
//               Amount
//               {sortBy === 'amount' && (
//                 sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
//               )}
//             </button>
//             <button 
//               className={`sort-option ${sortBy === 'customer' ? 'active' : ''}`}
//               onClick={() => handleSortChange('customer')}
//             >
//               Customer
//               {sortBy === 'customer' && (
//                 sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
//               )}
//             </button>
//             <button 
//               className={`sort-option ${sortBy === 'status' ? 'active' : ''}`}
//               onClick={() => handleSortChange('status')}
//             >
//               Status
//               {sortBy === 'status' && (
//                 sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {filteredOrders.length > 0 ? (
//         <div className="orders-table-container">
//           <table className="orders-table">
//             <thead>
//               <tr>
//                 <th>Order ID</th>
//                 <th>Customer</th>
//                 <th>Date & Time</th>
//                 <th>Amount</th>
//                 <th style={{textAlign:'center', position:'relative'}}>Vendor</th>
//                 <th style={{textAlign:'center', position:'relative'}}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredOrders.map((order) => (
//                 <tr key={order.id} className={`order-row ${order.status}`}>
//                   <td className="order-id-cell">
//                     <div className="order-id-with-status">
//                       <Package className="order-icon" />
//                       <span className="order-id-text">{orderIdMap[order.id] || order.id}</span>
//                       <div className={`order-status-indicator ${order.status}`}>
//                         {getStatusIcon(order.status)}
//                         <span className="status-text">{getStatusText(order.status)}</span>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="customer-cell">
//                     <div className="customer-name">{order.customer?.fullName}</div>
//                   </td>
//                   <td className="date-cell">
//                     {formatDate(order.orderDate)}
//                   </td>
//                   <td className="amount-cell">
//                     {/* <div className="order-amount">{formatCurrency(order.totalAmount)}</div> */}
//                     <div className="order-amount">{formatCurrency((order.subtotal || 0) + (order.deliveryCharge || 0))}</div>
//                     <div className="items-count">{order.items?.length} items</div>
//                   </td>
//                   <td className="vendor-cell">
//                     {order.vendor ? (
//                       <div className="vendor-info">
//                         <div className="vendor-name">{order.vendor.name}</div>
//                       </div>
//                     ) : order.assignedVendor ? (
//                       <div className="vendor-info">
//                         <div className="vendor-name">{order.assignedVendor.name}</div>
//                         <div className="vendor-status">
//                           <span className={`status-badge ${order.assignedVendor.status === 'active' ? 'active' : 'inactive'}`}>
//                             {order.assignedVendor.status === 'active' ? 'Active' : 'Inactive'}
//                           </span>
//                           {order.status === 'pending_vendor_confirmation' && (
//                             <>
//                               <AlertTriangle size={14} className="awaiting-icon" />
//                               <span>Awaiting confirmation</span>
//                             </>
//                           )}
//                           {order.status === 'pending_vendor_manual_acceptance' && (
//                             <>
//                               <AlertTriangle size={14} className="awaiting-icon" />
//                               <span>Awaiting manual acceptance</span>
//                             </>
//                           )}
//                         </div>
//                       </div>
//                     ) : (
//                       <button 
//                         className="assign-vendor-button small"
//                         onClick={() => assignOrder(order.id)}
//                       >
//                         Assign Vendor
//                       </button>
//                     )}
//                   </td>
                  
//                   <td className="actions-cell">
//                     <div className="order-actions-container">
//                       <button 
//                         className="view-details-button1"
//                         onClick={() => setSelectedOrder(order.id)}
//                       >
//                         View Details
//                       </button>
//                       {(order.status === 'pending' || order.status === 'processing' || 
//                         order.status === 'pending_vendor_confirmation' || 
//                         order.status === 'pending_vendor_manual_acceptance') && (
//                         <button 
//                           className="cancel-order-button"
//                           onClick={() => cancelOrder(order.id)}
//                         >
//                           Cancel
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="no-orders-found">
//           <p>{loading ? 'Loading...' : 'No orders found matching your criteria.'}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderManagement;









// import React, { useState, useEffect } from 'react';
// import { 
//   Package, 
//   Filter, 
//   Search,
//   MapPin,
//   Star,
//   Trash2,
//   ChevronRight,
//   CheckCircle,
//   Clock,
//   Truck,
//   XCircle,
//   RefreshCw,
//   Utensils,
//   Calendar,
//   ChevronDown,
//   ChevronUp,
//   ArrowUp,
//   ArrowDown,
//   Download,
//   Send,
//   Map,
//   Navigation,
//   AlertTriangle
// } from 'lucide-react';
// import { ref, onValue, update, get, remove } from 'firebase/database';
// import { db } from '../firebase/config';
// import '../styles/OrderManagement.css';
// import '../styles/AdminAlerts.css';
// import OrderItems from './OrderItems';
// import AdminAlerts from './AdminAlerts';
// import { createOrderNotification } from './notificationService';

// const OrderManagement = () => {
//   // Function to calculate amount without tax
//   const calculateAmountWithoutTax = (order) => {
//     return (order.subtotal || 0) + (order.deliveryCharge || 0);
//   };

//   // State for active tab
//   const [activeTab, setActiveTab] = useState('all');
  
//   // State for search term
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // State for selected order
//   const [selectedOrder, setSelectedOrder] = useState(null);
  
//   // State for orders
//   const [orders, setOrders] = useState([]);
  
//   // State for loading
//   const [loading, setLoading] = useState(true);
  
//   // State for error
//   const [error, setError] = useState('');

//   // Map to store order ID mappings (Firebase ID -> Display ID)
//   const [orderIdMap, setOrderIdMap] = useState({});

//   // State for sorting
//   const [sortBy, setSortBy] = useState('date');
//   const [sortDirection, setSortDirection] = useState('desc');

//   // State for date filter
//   const [dateFilter, setDateFilter] = useState('all');
//   const [customDateRange, setCustomDateRange] = useState({
//     start: '',
//     end: ''
//   });

//   // State for area filter
//   const [areaFilter, setAreaFilter] = useState('all');
//   const [availableAreas, setAvailableAreas] = useState([]);

//   // State for admin alerts
//   const [adminAlerts, setAdminAlerts] = useState([]);

//   // State to track orders we've already notified about
//   const [notifiedOrders, setNotifiedOrders] = useState([]);
  
//   // State for cleanup in progress
//   const [isCleaningUp, setIsCleaningUp] = useState(false);

//   // Generate simplified order IDs for display
//   const generateOrderIdMap = (orders) => {
//     const idMap = {};
//     orders.forEach((order, index) => {
//       idMap[order.id] = `ORD-${index + 1}`;
//     });
//     setOrderIdMap(idMap);
//     return idMap;
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const options = { 
//       year: 'numeric', 
//       month: 'short', 
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return new Date(dateString).toLocaleDateString('en-IN', options);
//   };

//   // Format currency
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 2
//     }).format(amount);
//   };
  
//   // Validate order function to prevent empty orders
//   const validateOrder = (order) => {
//     const errors = [];
    
//     // Check if order has items
//     if (!order.items || order.items.length === 0) {
//       errors.push('Order must contain at least one item');
//     }
    
//     // Check if order has a valid amount
//     if ((order.subtotal || 0) <= 0) {
//       errors.push('Order must have a valid amount');
//     }
    
//     // Check if order has customer information
//     if (!order.customer || !order.customer.fullName) {
//       errors.push('Order must have customer information');
//     }
    
//     return {
//       isValid: errors.length === 0,
//       errors
//     };
//   };
  
//   // Clean up empty orders
//   const cleanupEmptyOrders = async () => {
//     if (isCleaningUp) return;
    
//     try {
//       setIsCleaningUp(true);
      
//       // Create a temporary alert
//       setAdminAlerts(prev => [
//         ...prev, 
//         { 
//           id: 'cleanup-alert',
//           type: 'info',
//           message: 'Searching for empty orders...',
//           icon: <RefreshCw className="spinning" />
//         }
//       ]);
      
//       const ordersRef = ref(db, 'orders');
//       const snapshot = await get(ordersRef);
      
//       if (!snapshot.exists()) {
//         setAdminAlerts(prev => [
//           ...prev.filter(a => a.id !== 'cleanup-alert'), 
//           { 
//             id: 'no-orders',
//             type: 'info',
//             message: 'No orders found in the database.',
//             autoClose: true
//           }
//         ]);
//         setIsCleaningUp(false);
//         return;
//       }
      
//       const emptyOrders = [];
      
//       snapshot.forEach((childSnapshot) => {
//         const order = childSnapshot.val();
//         if (!order.items || order.items.length === 0 || 
//             ((order.subtotal || 0) + (order.deliveryCharge || 0) <= 0)) {
//           emptyOrders.push({
//             id: childSnapshot.key,
//             ...order
//           });
//         }
//       });
      
//       // Remove the searching alert
//       setAdminAlerts(prev => prev.filter(a => a.id !== 'cleanup-alert'));
      
//       if (emptyOrders.length === 0) {
//         setAdminAlerts(prev => [
//           ...prev, 
//           { 
//             id: 'no-empty-orders',
//             type: 'success',
//             message: 'No empty orders found in the database.',
//             autoClose: true
//           }
//         ]);
//         setIsCleaningUp(false);
//         return;
//       }
      
//       // Prompt to confirm deletion
//       const confirmed = window.confirm(
//         `Found ${emptyOrders.length} empty orders. Would you like to delete them?\n\n` +
//         `Orders IDs: ${emptyOrders.map(o => orderIdMap[o.id] || o.id).join(', ')}`
//       );
      
//       if (!confirmed) {
//         setAdminAlerts(prev => [
//           ...prev, 
//           { 
//             id: 'cleanup-cancelled',
//             type: 'info',
//             message: 'Cleanup cancelled.',
//             autoClose: true
//           }
//         ]);
//         setIsCleaningUp(false);
//         return;
//       }
      
//       // Add a processing alert
//       setAdminAlerts(prev => [
//         ...prev, 
//         { 
//           id: 'cleanup-processing',
//           type: 'info',
//           message: `Deleting ${emptyOrders.length} empty orders...`,
//           icon: <RefreshCw className="spinning" />
//         }
//       ]);
      
//       // Delete the empty orders
//       for (const order of emptyOrders) {
//         const orderRef = ref(db, `orders/${order.id}`);
//         await remove(orderRef);
//         console.log(`Deleted empty order: ${order.id}`);
//       }
      
//       // Remove the processing alert
//       setAdminAlerts(prev => prev.filter(a => a.id !== 'cleanup-processing'));
      
//       // Add success alert
//       setAdminAlerts(prev => [
//         ...prev, 
//         { 
//           id: 'cleanup-success',
//           type: 'success',
//           message: `Successfully deleted ${emptyOrders.length} empty orders.`,
//           autoClose: true
//         }
//       ]);
      
//     } catch (error) {
//       console.error('Error cleaning up empty orders:', error);
      
//       // Remove any processing alerts
//       setAdminAlerts(prev => prev.filter(a => a.id !== 'cleanup-alert' && a.id !== 'cleanup-processing'));
      
//       // Add error alert
//       setAdminAlerts(prev => [
//         ...prev, 
//         { 
//           id: 'cleanup-error',
//           type: 'error',
//           message: `Error cleaning up empty orders: ${error.message}`,
//           autoClose: true
//         }
//       ]);
//     } finally {
//       setIsCleaningUp(false);
//     }
//   };

//   // Fetch orders from Realtime Database in real-time
//   useEffect(() => {
//     const ordersRef = ref(db, 'orders');
//     setLoading(true);
    
//     const unsubscribe = onValue(ordersRef, (snapshot) => {
//       const data = snapshot.val();
//       const ordersData = data ? Object.keys(data).map(key => {
//         const order = {
//           id: key,
//           ...data[key],
//           timeline: data[key].timeline || [
//             { 
//               status: 'order_placed', 
//               time: data[key].orderDate || new Date().toISOString(),
//               note: 'Order placed successfully' 
//             }
//           ]
//         };
//         // Validate and clean timeline entries
//         order.timeline = order.timeline.map(event => ({
//           ...event,
//           time: event.time || new Date().toISOString() // Ensure time is always defined
//         }));
//         return order;
//       }) : [];
      
//       const idMap = generateOrderIdMap(ordersData);
//       setOrders(ordersData);
      
//       // Extract and set available areas
//       const areas = extractAreas(ordersData);
//       setAvailableAreas(areas);
      
//       // Check for new orders and status changes
//       checkForOrderChanges(ordersData, idMap);
      
//       setLoading(false);
//     }, (err) => {
//       console.error('Error fetching orders:', err);
//       setError('Failed to load orders. Please try again later.');
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [notifiedOrders]);

//   // Function to extract unique areas from orders
//   const extractAreas = (ordersData) => {
//     const areas = new Set();
//     ordersData.forEach(order => {
//       const address = order.customer?.address || '';
//       const city = order.customer?.city || '';
      
//       // Extract area from address (simplified version)
//       const addressParts = address.split(',');
//       if (addressParts.length > 0) {
//         const area = addressParts[0].trim();
//         if (area) areas.add(area);
//       }
      
//       // Add city as area if available
//       if (city) areas.add(city);
//     });
    
//     return Array.from(areas).sort();
//   };

//   // Check for new orders and status changes
//   const checkForOrderChanges = (ordersData, idMap) => {
//     // Get any orders that were created or updated in the last 5 minutes
//     const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
//     ordersData.forEach(order => {
//       // Check if this order or a status update is new
//       const orderDate = new Date(order.orderDate);
      
//       // Check the latest timeline event
//       const latestEvent = order.timeline && order.timeline.length > 0 
//         ? order.timeline[order.timeline.length - 1] 
//         : null;
      
//       if (latestEvent) {
//         const eventTime = new Date(latestEvent.time);
//         const notificationKey = `${order.id}-${latestEvent.status}`;
        
//         // If the event happened in the last 5 minutes and we haven't notified about it yet
//         if (eventTime > fiveMinutesAgo && !notifiedOrders.includes(notificationKey)) {
//           console.log("Checking order event:", notificationKey, latestEvent.status);
          
//           // Create notifications based on event type
//           switch(latestEvent.status) {
//             case 'order_placed':
//               console.log("Creating notification for new order:", order.id);
//               createOrderNotification(order.id, 'new', {
//                 ...order,
//                 displayId: idMap[order.id] || order.id
//               });
//               break;
              
//             case 'cancelled':
//               console.log("Creating notification for canceled order:", order.id);
//               createOrderNotification(order.id, 'canceled', {
//                 ...order,
//                 displayId: idMap[order.id] || order.id
//               });
//               break;
              
//             case 'processing':
//               console.log("Creating notification for processing order:", order.id);
//               createOrderNotification(order.id, 'processed', {
//                 ...order,
//                 displayId: idMap[order.id] || order.id
//               });
//               break;
              
//             case 'delivered':
//               console.log("Creating notification for delivered order:", order.id);
//               createOrderNotification(order.id, 'delivered', {
//                 ...order,
//                 displayId: idMap[order.id] || order.id
//               });
//               break;
              
//             default:
//               // No notification for other status changes
//               break;
//           }
          
//           // Mark this order event as notified
//           setNotifiedOrders(prev => [...prev, notificationKey]);
//         }
//       }
//     });
//   };

//   // Delete order from Firebase
//   const deleteOrder = async (orderId) => {
//     const confirmed = window.confirm(`Are you sure you want to delete order ${orderIdMap[orderId] || orderId}? This action cannot be undone.`);
//     if (!confirmed) return;

//     try {
//       const orderRef = ref(db, `orders/${orderId}`);
//       await remove(orderRef);
//       alert(`Order ${orderIdMap[orderId] || orderId} has been deleted.`);
//     } catch (err) {
//       console.error('Error deleting order:', err);
//       alert('Failed to delete order. Please try again.');
//     }
//   };

//   // Cancel order
//   const cancelOrder = async (orderId) => {
//     const confirmed = window.confirm(`Are you sure you want to cancel order ${orderIdMap[orderId] || orderId}? This will initiate a refund process.`);
//     if (!confirmed) return;

//     try {
//       const order = orders.find(o => o.id === orderId);
//       if (!order) {
//         throw new Error('Order not found in state');
//       }

//       // Validate and clean timeline entries
//       const cleanedTimeline = order.timeline.map(event => ({
//         ...event,
//         time: event.time || new Date().toISOString() // Ensure time is always defined
//       }));

//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, {
//         status: 'cancelled',
//         refundStatus: 'initiated',
//         cancellationReason: 'Cancelled by admin',
//         timeline: [
//           ...cleanedTimeline,
//           {
//             status: 'cancelled',
//             time: new Date().toISOString(),
//             note: 'Order cancelled by admin'
//           },
//           {
//             status: 'refund_initiated',
//             time: new Date().toISOString(),
//             note: 'Refund initiated'
//           }
//         ]
//       });
      
//       // Create notification for canceled order
//       createOrderNotification(orderId, 'canceled', {
//         ...order,
//         displayId: orderIdMap[orderId] || orderId,
//         cancellationReason: 'Cancelled by admin'
//       });
      
//       alert(`Order ${orderIdMap[orderId] || orderId} has been cancelled and refund initiated.`);
//     } catch (err) {
//       console.error('Error cancelling order:', err);
//       alert(`Failed to cancel order: ${err.message}`);
//     }
//   };

//   // Assign order to vendor
//   const assignOrder = async (orderId) => {
//     try {
//       // Implementation details for vendor assignment
//       // This would trigger a notification through the updated order
//       alert(`Order ${orderIdMap[orderId] || orderId} has been assigned.`);
//     } catch (err) {
//       console.error('Error assigning order:', err);
//       alert('Failed to assign order. Please try again.');
//     }
//   };

//   // Handle sorting change
//   const handleSortChange = (field) => {
//     if (sortBy === field) {
//       // Toggle direction if clicking the same field
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       // Set new field and default to descending
//       setSortBy(field);
//       setSortDirection('desc');
//     }
//   };

//   // Handle date filter change
//   const handleDateFilterChange = (filter) => {
//     setDateFilter(filter);
//   };

//   // Handle area filter change
//   const handleAreaFilterChange = (filter) => {
//     setAreaFilter(filter);
//   };

//   // Apply date filter to orders
//   const getDateFilteredOrders = (ordersList) => {
//     if (dateFilter === 'all') return ordersList;
    
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     const yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);
    
//     const lastWeekStart = new Date(today);
//     lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    
//     const lastMonthStart = new Date(today);
//     lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    
//     return ordersList.filter(order => {
//       const orderDate = new Date(order.orderDate);
      
//       switch (dateFilter) {
//         case 'today':
//           return orderDate >= today;
//         case 'yesterday':
//           return orderDate >= yesterday && orderDate < today;
//         case 'last7days':
//           return orderDate >= lastWeekStart;
//         case 'last30days':
//           return orderDate >= lastMonthStart;
//         case 'custom':
//           const startDate = customDateRange.start ? new Date(customDateRange.start) : null;
//           const endDate = customDateRange.end ? new Date(customDateRange.end) : null;
          
//           if (startDate && endDate) {
//             // Set end date to end of day
//             endDate.setHours(23, 59, 59, 999);
//             return orderDate >= startDate && orderDate <= endDate;
//           } else if (startDate) {
//             return orderDate >= startDate;
//           } else if (endDate) {
//             endDate.setHours(23, 59, 59, 999);
//             return orderDate <= endDate;
//           }
//           return true;
//         default:
//           return true;
//       }
//     });
//   };

//   // Apply area filter to orders
//   const getAreaFilteredOrders = (ordersList) => {
//     if (areaFilter === 'all') return ordersList;
    
//     return ordersList.filter(order => {
//       const address = `${order.customer?.address || ''}, ${order.customer?.city || ''}, ${order.customer?.pincode || ''}`;
//       return address.toLowerCase().includes(areaFilter.toLowerCase());
//     });
//   };

//   // Sort orders based on current sort settings
//   const getSortedOrders = (ordersList) => {
//     return [...ordersList].sort((a, b) => {
//       let comparison = 0;
      
//       switch (sortBy) {
//         case 'date':
//           comparison = new Date(a.orderDate) - new Date(b.orderDate);
//           break;
//         case 'amount':
//           comparison = calculateAmountWithoutTax(a) - calculateAmountWithoutTax(b);
//           break;
//         case 'customer':
//           comparison = (a.customer?.fullName || '').localeCompare(b.customer?.fullName || '');
//           break;
//         case 'status':
//           comparison = (a.status || '').localeCompare(b.status || '');
//           break;
//         default:
//           comparison = 0;
//       }
      
//       return sortDirection === 'asc' ? comparison : -comparison;
//     });
//   };

//   // UPDATED: Filter orders based on active tab, search term, and other filters
//   // This now includes filtering out empty orders
//   const getFilteredOrders = () => {
//     let filtered = orders.filter(order => {
//       // Skip empty orders (those with no items or zero subtotal)
//       if (!order.items || order.items.length === 0 || 
//           calculateAmountWithoutTax(order) <= 0) {
//         return false;
//       }
      
//       if (activeTab !== 'all' && order.status !== activeTab) {
//         return false;
//       }
//       if (searchTerm && 
//           !(orderIdMap[order.id] || '').toLowerCase().includes(searchTerm.toLowerCase()) && 
//           !order.id.toLowerCase().includes(searchTerm.toLowerCase()) && 
//           !order.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())) {
//         return false;
//       }
//       return true;
//     });
    
//     // Apply date filtering
//     filtered = getDateFilteredOrders(filtered);
    
//     // Apply area filtering
//     filtered = getAreaFilteredOrders(filtered);
    
//     // Apply sorting
//     return getSortedOrders(filtered);
//   };

//   // Status icon mapping
//   const getStatusIcon = (status) => {
//     switch(status) {
//       case 'pending': return <Clock className="status-icon pending" />;
//       case 'pending_vendor_confirmation': return <AlertTriangle className="status-icon pending" />;
//       case 'pending_vendor_manual_acceptance': return <AlertTriangle className="status-icon pending" />;
//       case 'processing': return <RefreshCw className="status-icon processing" />;
//       case 'prepared': return <Utensils className="status-icon prepared" />;
//       case 'ready_for_pickup': return <Package className="status-icon ready-for-pickup" />;
//       case 'delivery_assigned': return <Truck className="status-icon delivery-assigned" />;
//       case 'out_for_delivery': return <Navigation className="status-icon out-for-delivery" />;
//       case 'delivered': return <CheckCircle className="status-icon delivered" />;
//       case 'cancelled': return <XCircle className="status-icon cancelled" />;
//       default: return <Clock className="status-icon" />;
//     }
//   };

//   // Status text formatting
//   const getStatusText = (status) => {
//     if (!status) return 'Unknown'; // Safeguard for undefined status
//     switch(status) {
//       case 'pending': return 'Pending';
//       case 'pending_vendor_confirmation': return 'Awaiting Vendor Confirmation';
//       case 'pending_vendor_manual_acceptance': return 'Awaiting Manual Acceptance';
//       case 'processing': return 'Processing';
//       case 'prepared': return 'Prepared';
//       case 'ready_for_pickup': return 'Ready for Pickup';
//       case 'delivery_assigned': return 'Delivery Assigned';
//       case 'out_for_delivery': return 'Out for Delivery';
//       case 'delivered': return 'Delivered';
//       case 'cancelled': return 'Cancelled';
//       case 'order_placed': return 'Order Placed';
//       case 'order_confirmed': return 'Order Confirmed';
//       case 'refund_initiated': return 'Refund Initiated';
//       case 'refund_processed': return 'Refund Processed';
//       default: return status.split('_').map(word => 
//         word.charAt(0).toUpperCase() + word.slice(1)
//       ).join(' ');
//     }
//   };

//   // Function to dismiss an alert
//   const dismissAlert = (index) => {
//     setAdminAlerts(prevAlerts => prevAlerts.filter((_, i) => i !== index));
//   };

//   // Export orders to CSV
//   const exportOrdersCSV = () => {
//     const filteredOrders = getFilteredOrders();
    
//     // Define CSV headers
//     const headers = [
//       'Order ID',
//       'Customer Name',
//       'Customer Email',
//       'Customer Phone',
//       'Address',
//       'Date & Time',
//       'Amount',
//       'Status',
//       'Vendor',
//       'Delivery Person',
//       'Items'
//     ];
    
//     // Map orders to CSV rows
//     const rows = filteredOrders.map(order => {
//       const itemsString = order.items ? order.items
//         .map(item => `${item.name} x ${item.quantity}`)
//         .join('; ') : '';
      
//       return [
//         orderIdMap[order.id] || order.id,
//         order.customer?.fullName || '',
//         order.customer?.email || '',
//         order.customer?.phone || '',
//         `${order.customer?.address || ''}, ${order.customer?.city || ''}, ${order.customer?.pincode || ''}`,
//         formatDate(order.orderDate),
//         calculateAmountWithoutTax(order),
//         getStatusText(order.status),
//         order.vendor?.name || (order.assignedVendor?.name ? `${order.assignedVendor.name} (pending)` : ''),
//         order.delivery?.partnerName || (order.deliveryPerson?.name || ''),
//         itemsString
//       ];
//     });
    
//     // Combine headers and rows
//     const csvContent = [
//       headers.join(','),
//       ...rows.map(row => row.map(cell => 
//         // Escape special characters in CSV
//         typeof cell === 'string' ? `"${cell.replace(/"/g, '""')}"` : cell
//       ).join(','))
//     ].join('\n');
    
//     // Create a Blob with the CSV content
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
    
//     // Create a link element and trigger download
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', `orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const filteredOrders = getFilteredOrders();

//   // Detail view for selected order
//   if (selectedOrder) {
//     const order = orders.find(o => o.id === selectedOrder);
    
//     if (!order) return <div className="order-management">Order not found</div>;

//     return (
//       <div className="order-management">
//         {/* Add AdminAlerts component */}
//         <AdminAlerts alerts={adminAlerts} onDismiss={dismissAlert} />
        
//         <div className="order-detail-header">
//           <button className="back-button" onClick={() => setSelectedOrder(null)}>
//             ← Back to Orders
//           </button>
//           <h1>Order Details: {orderIdMap[order.id] || order.id}</h1>
//           <div className="order-status-badge">
//             {getStatusIcon(order.status)}
//             <span>{getStatusText(order.status)}</span>
//           </div>
//         </div>

//         <div className="order-detail-container">
//           <div className="order-detail-card customer-info">
//             <h2>Customer Information</h2>
//             <p><strong>Name:</strong> {order.customer?.fullName}</p>
//             <p><strong>Address:</strong> {`${order.customer?.address}, ${order.customer?.city}, ${order.customer?.pincode}`}</p>
//             <p><strong>Email:</strong> {order.customer?.email}</p>
//             <p><strong>Phone:</strong> {order.customer?.phone}</p>
//             <p><strong>Order Date:</strong> {formatDate(order.orderDate)}</p>
//           </div>

//           <div className="order-detail-card vendor-info">
//             <h2>Vendor Information</h2>
//             {order.vendor ? (
//               <>
//                 <p><strong>Name:</strong> {order.vendor.name}</p>
//                 <p><strong>Rating:</strong> {order.vendor.rating || 'N/A'} <Star size={14} className="star-icon" /></p>
//                 <p><strong>Address:</strong> {order.vendor.location?.address}</p>
//               </>
//             ) : order.assignedVendor ? (
//               <>
//                 <p><strong>Name:</strong> {order.assignedVendor.name} 
//                   <span className={`pending-badge ${order.status === 'pending_vendor_manual_acceptance' ? 'manual' : ''}`}>
//                     ({order.status === 'pending_vendor_manual_acceptance' ? 'Awaiting manual acceptance' : 'Awaiting confirmation'})
//                   </span>
//                 </p>
//                 <p><strong>Rating:</strong> {order.assignedVendor.rating || 'N/A'} <Star size={14} className="star-icon" /></p>
//                 <p><strong>Address:</strong> {order.assignedVendor.location?.address}</p>
//                 <p><strong>Distance:</strong> {order.assignedVendor.distanceText || order.assignedVendor.distance}</p>
//                 <p><strong>Assigned At:</strong> {formatDate(order.vendorAssignedAt)}</p>
//                 <p><strong>Assignment Type:</strong> {order.assignmentType === 'auto' ? 'Automatic' : (order.assignmentType === 'manual_required' ? 'Manual Acceptance Required' : 'Manual')}</p>
//                 <p><strong>Status:</strong> <span className={`status-text ${order.assignedVendor.status === 'active' ? 'active-status' : 'inactive-status'}`}>
//                   {order.assignedVendor.status === 'active' ? 'Active' : 'Inactive'}
//                 </span></p>
//                 {order.vendorAssignedAt && order.status === 'pending_vendor_confirmation' && (
//                   <div className="confirmation-timer">
//                     <AlertTriangle size={14} className="timer-icon" />
//                     <span>Vendor must confirm within 5 minutes</span>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <div className="no-vendor">
//                 <p>No vendor assigned yet. Auto-assignment in progress...</p>
//                 <button className="assign-vendor-button" onClick={() => assignOrder(order.id)}>
//                   Manually Assign Vendor
//                 </button>
//               </div>
//             )}
//           </div>

//           <div className="order-detail-card delivery-info">
//             <h2>Delivery Information</h2>
//             {(order.delivery || order.deliveryPerson) ? (
//               <>
//                 <p><strong>Delivery Person:</strong> {order.delivery?.partnerName || order.deliveryPerson?.name}</p>
//                 {(order.delivery?.partnerPhone || order.deliveryPerson?.phone) && (
//                   <p><strong>Phone:</strong> {order.delivery?.partnerPhone || order.deliveryPerson?.phone}</p>
//                 )}
//                 {(order.delivery?.trackingId || order.deliveryPerson?.bookingId) && (
//                   <p><strong>Tracking ID:</strong> {order.delivery?.trackingId || order.deliveryPerson?.bookingId}</p>
//                 )}
//                 {(order.delivery?.estimatedPickupTime || order.deliveryPerson?.estimatedPickupTime) && (
//                   <p><strong>Est. Pickup:</strong> {formatDate(order.delivery?.estimatedPickupTime || order.deliveryPerson?.estimatedPickupTime)}</p>
//                 )}
//                 {(order.delivery?.estimatedDeliveryTime || order.deliveryPerson?.estimatedDeliveryTime) && (
//                   <p><strong>Est. Delivery:</strong> {formatDate(order.delivery?.estimatedDeliveryTime || order.deliveryPerson?.estimatedDeliveryTime)}</p>
//                 )}
//                 {(order.status === 'out_for_delivery' && (order.delivery?.trackingUrl || order.deliveryPerson?.trackingUrl)) && (
//                   <div className="tracking-link">
//                     <a 
//                       href={order.delivery?.trackingUrl || order.deliveryPerson?.trackingUrl} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="track-button"
//                     >
//                       Track Live Location
//                     </a>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <p>Delivery will be assigned by the vendor when the order is ready for pickup.</p>
//             )}
//           </div>

//           {/* Replace the existing order items table with our new component */}
//           <OrderItems 
//             items={order.items}
//             subtotal={order.subtotal}
//             deliveryCharge={order.deliveryCharge}
//             // tax={order.tax}
//             totalAmount={calculateAmountWithoutTax(order)} // Use amount without tax
//             formatCurrency={formatCurrency}
//           />

//           <div className="order-detail-card order-timeline">
//             <h2>Order Timeline</h2>
//             <div className="timeline">
//               {order.timeline?.map((event, index) => (
//                 event.status ? (
//                   <div className="timeline-item" key={index}>
//                     <div className="timeline-marker"></div>
//                     <div className="timeline-content">
//                       <h3>{getStatusText(event.status)}</h3>
//                       <p className="timeline-time">{formatDate(event.time)}</p>
//                       <p className="timeline-note">{event.note}</p>
//                     </div>
//                   </div>
//                 ) : (
//                   console.warn(`Invalid timeline event at index ${index} for order ${order.id}:`, event) || null
//                 )
//               ))}
//             </div>
//           </div>

//           {order.status !== 'delivered' && order.status !== 'cancelled' && (
//             <div className="order-actions">
//               <button className="cancel-order-button" onClick={() => cancelOrder(order.id)}>
//                 Cancel Order & Initiate Refund
//               </button>
//             </div>
//           )}

//           {order.status === 'cancelled' && (
//             <div className="refund-info order-detail-card">
//               <h2>Refund Information</h2>
//               <p><strong>Cancellation Reason:</strong> {order.cancellationReason || 'Not specified'}</p>
//               <p><strong>Refund Status:</strong> {order.refundStatus === 'processed' ? 'Refund Processed' : 'Refund Pending'}</p>
//               {order.timeline
//                 .filter(event => event.status && event.status.includes('refund'))
//                 .map((event, index) => (
//                   <p key={index}><strong>{getStatusText(event.status)}:</strong> {formatDate(event.time)}</p>
//                 ))
//               }
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // Main orders table view
//   return (
//     <div className="order-management">
//       {/* Add AdminAlerts component */}
//       <AdminAlerts alerts={adminAlerts} onDismiss={dismissAlert} />
      
//       <h1>Order Management</h1>

//       {error && <div className="error-message">{error}</div>}
//       {loading && <div className="loading-message">Loading orders...</div>}

//       <div className="order-filters">
//         <div className="search-container">
//           <Search className="search-icon" />
//           <input 
//             type="text"
//             placeholder="Search orders by ID or customer name..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="search-input"
//           />
//         </div>

//         <div className="filter-tabs">
//           <button 
//             className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
//             onClick={() => setActiveTab('all')}
//           >
//             All Orders
//           </button>
//           <button 
//             className={`filter-tab ${activeTab === 'pending' ? 'active' : ''}`}
//             onClick={() => setActiveTab('pending')}
//           >
//             Pending
//           </button>
//           <button 
//             className={`filter-tab ${activeTab === 'pending_vendor_confirmation' ? 'active' : ''}`}
//             onClick={() => setActiveTab('pending_vendor_confirmation')}
//           >
//             Awaiting Vendor
//           </button>
//           <button 
//             className={`filter-tab ${activeTab === 'pending_vendor_manual_acceptance' ? 'active' : ''}`}
//             onClick={() => setActiveTab('pending_vendor_manual_acceptance')}
//           >
//             Manual Acceptance
//           </button>
//           <button 
//             className={`filter-tab ${activeTab === 'processing' ? 'active' : ''}`}
//             onClick={() => setActiveTab('processing')}
//           >
//             Processing
//           </button>
//           <button 
//             className={`filter-tab ${activeTab === 'ready_for_pickup' ? 'active' : ''}`}
//             onClick={() => setActiveTab('ready_for_pickup')}
//           >
//             Ready for Pickup
//           </button>
//           <button 
//             className={`filter-tab ${activeTab === 'out_for_delivery' ? 'active' : ''}`}
//             onClick={() => setActiveTab('out_for_delivery')}
//           >
//             Out for Delivery
//           </button>
//           <button 
//             className={`filter-tab ${activeTab === 'delivered' ? 'active' : ''}`}
//             onClick={() => setActiveTab('delivered')}
//           >
//             Delivered
//           </button>
//           <button 
//             className={`filter-tab ${activeTab === 'cancelled' ? 'active' : ''}`}
//             onClick={() => setActiveTab('cancelled')}
//           >
//             Cancelled
//           </button>
//         </div>
//       </div>

//       {/* Advanced filters */}
//       <div className="advanced-filters">
//         <div className="filters-container">
//           <div className="date-filters">
//             <div className="date-filter-label">
//               <Calendar size={16} />
//               <span>Date Filter:</span>
//             </div>
//             <select 
//               value={dateFilter} 
//               onChange={(e) => handleDateFilterChange(e.target.value)}
//               className="date-filter-select"
//             >
//               <option value="all">All Time</option>
//               <option value="today">Today</option>
//               <option value="yesterday">Yesterday</option>
//               <option value="last7days">Last 7 Days</option>
//               <option value="last30days">Last 30 Days</option>
//               <option value="custom">Custom Range</option>
//             </select>
            
//             {dateFilter === 'custom' && (
//               <div className="custom-date-range">
//                 <input
//                   type="date"
//                   value={customDateRange.start}
//                   onChange={(e) => setCustomDateRange({...customDateRange, start: e.target.value})}
//                   className="date-input"
//                   placeholder="Start Date"
//                 />
//                 <span>to</span>
//                 <input
//                   type="date"
//                   value={customDateRange.end}
//                   onChange={(e) => setCustomDateRange({...customDateRange, end: e.target.value})}
//                   className="date-input"
//                   placeholder="End Date"
//                 />
//               </div>
//             )}
//           </div>
          
//           <div className="area-filters">
//             <div className="area-filter-label">
//               <Map size={16} />
//               <span>Area Filter:</span>
//             </div>
//             <select 
//               value={areaFilter} 
//               onChange={(e) => handleAreaFilterChange(e.target.value)}
//               className="area-filter-select"
//             >
//               <option value="all">All Areas</option>
//               {availableAreas.map(area => (
//                 <option key={area} value={area}>{area}</option>
//               ))}
//             </select>
//           </div>
          
//           <div className="export-container">
//             <button className="export-button" onClick={exportOrdersCSV}>
//               <Download size={16} />
//               Export Orders
//             </button>
            
//             {/* New button for cleaning up empty orders */}
//             <button 
//               className="cleanup-button"
//               onClick={cleanupEmptyOrders}
//               disabled={isCleaningUp}
//               title="Find and remove empty orders"
//               style={{
//                 marginLeft: '8px', 
//                 display: 'flex', 
//                 alignItems: 'center',
//                 backgroundColor: '#f44336',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '4px',
//                 padding: '6px 12px',
//                 cursor: isCleaningUp ? 'not-allowed' : 'pointer',
//                 opacity: isCleaningUp ? 0.7 : 1
//               }}
//             >
//               {isCleaningUp ? (
//                 <RefreshCw size={16} className="spinning" style={{ marginRight: '6px' }} />
//               ) : (
//                 <Trash2 size={16} style={{ marginRight: '6px' }} />
//               )}
//               Clean Up Empty Orders
//             </button>
//           </div>
//         </div>
        
//         <div className="sort-filters">
//           <div className="sort-filter-label">
//             <Filter size={16} />
//             <span>Sort By:</span>
//           </div>
//           <div className="sort-options">
//             <button 
//               className={`sort-option ${sortBy === 'date' ? 'active' : ''}`}
//               onClick={() => handleSortChange('date')}
//             >
//               Date
//               {sortBy === 'date' && (
//                 sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
//               )}
//             </button>
//             <button 
//               className={`sort-option ${sortBy === 'amount' ? 'active' : ''}`}
//               onClick={() => handleSortChange('amount')}
//             >
//               Amount
//               {sortBy === 'amount' && (
//                 sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
//               )}
//             </button>
//             <button 
//               className={`sort-option ${sortBy === 'customer' ? 'active' : ''}`}
//               onClick={() => handleSortChange('customer')}
//             >
//               Customer
//               {sortBy === 'customer' && (
//                 sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
//               )}
//             </button>
//             <button 
//               className={`sort-option ${sortBy === 'status' ? 'active' : ''}`}
//               onClick={() => handleSortChange('status')}
//             >
//               Status
//               {sortBy === 'status' && (
//                 sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {filteredOrders.length > 0 ? (
//         <div className="orders-table-container">
//           <table className="orders-table">
//             <thead>
//               <tr>
//                 <th>Order ID</th>
//                 <th>Customer</th>
//                 <th>Date & Time</th>
//                 <th>Amount</th>
//                 <th style={{textAlign:'center', position:'relative'}}>Vendor</th>
//                 <th style={{textAlign:'center', position:'relative'}}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredOrders.map((order) => (
//                 <tr key={order.id} className={`order-row ${order.status}`}>
//                   <td className="order-id-cell">
//                     <div className="order-id-with-status">
//                       <Package className="order-icon" />
//                       <span className="order-id-text">{orderIdMap[order.id] || order.id}</span>
//                       <div className={`order-status-indicator ${order.status}`}>
//                         {getStatusIcon(order.status)}
//                         <span className="status-text">{getStatusText(order.status)}</span>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="customer-cell">
//                     <div className="customer-name">{order.customer?.fullName}</div>
//                   </td>
//                   <td className="date-cell">
//                     {formatDate(order.orderDate)}
//                   </td>
//                   <td className="amount-cell">
//                     <div className="order-amount">{formatCurrency(calculateAmountWithoutTax(order))}</div>
//                     <div className="items-count">{order.items?.length} items</div>
//                   </td>
//                   <td className="vendor-cell">
//                     {order.vendor ? (
//                       <div className="vendor-info">
//                         <div className="vendor-name">{order.vendor.name}</div>
//                       </div>
//                     ) : order.assignedVendor ? (
//                       <div className="vendor-info">
//                         <div className="vendor-name">{order.assignedVendor.name}</div>
//                         <div className="vendor-status">
//                           <span className={`status-badge ${order.assignedVendor.status === 'active' ? 'active' : 'inactive'}`}>
//                             {order.assignedVendor.status === 'active' ? 'Active' : 'Inactive'}
//                           </span>
//                           {order.status === 'pending_vendor_confirmation' && (
//                             <>
//                               <AlertTriangle size={14} className="awaiting-icon" />
//                               <span>Awaiting confirmation</span>
//                             </>
//                           )}
//                           {order.status === 'pending_vendor_manual_acceptance' && (
//                             <>
//                               <AlertTriangle size={14} className="awaiting-icon" />
//                               <span>Awaiting manual acceptance</span>
//                             </>
//                           )}
//                         </div>
//                       </div>
//                     ) : (
//                       <button 
//                         className="assign-vendor-button small"
//                         onClick={() => assignOrder(order.id)}
//                       >
//                         Assign Vendor
//                       </button>
//                     )}
//                   </td>
                  
//                   <td className="actions-cell">
//                     <div className="order-actions-container">
//                       <button 
//                         className="view-details-button1"
//                         onClick={() => setSelectedOrder(order.id)}
//                       >
//                         View Details
//                       </button>
//                       {(order.status === 'pending' || order.status === 'processing' || 
//                         order.status === 'pending_vendor_confirmation' || 
//                         order.status === 'pending_vendor_manual_acceptance') && (
//                         <button 
//                           className="cancel-order-button"
//                           onClick={() => cancelOrder(order.id)}
//                         >
//                           Cancel
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="no-orders-found">
//           <p>{loading ? 'Loading...' : 'No orders found matching your criteria.'}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderManagement;




// import React, { useState, useEffect } from 'react';
// import { 
//   Package, 
//   Filter, 
//   Search,
//   MapPin,
//   Star,
//   Trash2,
//   ChevronRight,
//   CheckCircle,
//   Clock,
//   Truck,
//   XCircle,
//   RefreshCw,
//   Utensils,
//   Calendar,
//   ChevronDown,
//   ChevronUp,
//   ArrowUp,
//   ArrowDown,
//   Download,
//   Send,
//   Map,
//   Navigation,
//   AlertTriangle
// } from 'lucide-react';
// import { ref, onValue, update, get, remove } from 'firebase/database';
// import { db } from '../firebase/config';
// import '../styles/OrderManagement.css';
// import '../styles/AdminAlerts.css';
// import OrderItems from './OrderItems';
// import AdminAlerts from './AdminAlerts';
// import AssignVendorModal from './AssignVendorModal';
// import { createOrderNotification } from './notificationService';

// const OrderManagement = () => {
//   // Function to calculate amount without tax
//   const calculateAmountWithoutTax = (order) => {
//     return (order.subtotal || 0) + (order.deliveryCharge || 0);
//   };

//   // State for active tab
//   const [activeTab, setActiveTab] = useState('all');
  
//   // State for search term
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // State for selected order
//   const [selectedOrder, setSelectedOrder] = useState(null);
  
//   // State for orders
//   const [orders, setOrders] = useState([]);
  
//   // State for loading
//   const [loading, setLoading] = useState(true);
  
//   // State for error
//   const [error, setError] = useState('');

//   // Map to store order ID mappings (Firebase ID -> Display ID)
//   const [orderIdMap, setOrderIdMap] = useState({});

//   // State for sorting
//   const [sortBy, setSortBy] = useState('date');
//   const [sortDirection, setSortDirection] = useState('desc');

//   // State for date filter
//   const [dateFilter, setDateFilter] = useState('all');
//   const [customDateRange, setCustomDateRange] = useState({
//     start: '',
//     end: ''
//   });

//   // State for area filter
//   const [areaFilter, setAreaFilter] = useState('all');
//   const [availableAreas, setAvailableAreas] = useState([]);

//   // State for admin alerts
//   const [adminAlerts, setAdminAlerts] = useState([]);

//   // State to track orders we've already notified about
//   const [notifiedOrders, setNotifiedOrders] = useState([]);
  
//   // State for cleanup in progress
//   const [isCleaningUp, setIsCleaningUp] = useState(false);
  
//   // State for assign vendor modal
//   const [isAssignVendorModalOpen, setIsAssignVendorModalOpen] = useState(false);
//   const [orderToAssign, setOrderToAssign] = useState(null);

//   // Generate simplified order IDs for display
//   const generateOrderIdMap = (orders) => {
//     const idMap = {};
//     orders.forEach((order, index) => {
//       idMap[order.id] = `ORD-${index + 1}`;
//     });
//     setOrderIdMap(idMap);
//     return idMap;
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const options = { 
//       year: 'numeric', 
//       month: 'short', 
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return new Date(dateString).toLocaleDateString('en-IN', options);
//   };

//   // Format currency
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 2
//     }).format(amount);
//   };
  
//   // Validate order function to prevent empty orders
//   const validateOrder = (order) => {
//     const errors = [];
    
//     // Check if order has items
//     if (!order.items || order.items.length === 0) {
//       errors.push('Order must contain at least one item');
//     }
    
//     // Check if order has a valid amount
//     if ((order.subtotal || 0) <= 0) {
//       errors.push('Order must have a valid amount');
//     }
    
//     // Check if order has customer information
//     if (!order.customer || !order.customer.fullName) {
//       errors.push('Order must have customer information');
//     }
    
//     return {
//       isValid: errors.length === 0,
//       errors
//     };
//   };
  
//   // Clean up empty orders
//   const cleanupEmptyOrders = async () => {
//     if (isCleaningUp) return;
    
//     try {
//       setIsCleaningUp(true);
      
//       // Create a temporary alert
//       setAdminAlerts(prev => [
//         ...prev, 
//         { 
//           id: 'cleanup-alert',
//           type: 'info',
//           message: 'Searching for empty orders...',
//           icon: <RefreshCw className="spinning" />
//         }
//       ]);
      
//       const ordersRef = ref(db, 'orders');
//       const snapshot = await get(ordersRef);
      
//       if (!snapshot.exists()) {
//         setAdminAlerts(prev => [
//           ...prev.filter(a => a.id !== 'cleanup-alert'), 
//           { 
//             id: 'no-orders',
//             type: 'info',
//             message: 'No orders found in the database.',
//             autoClose: true
//           }
//         ]);
//         setIsCleaningUp(false);
//         return;
//       }
      
//       const emptyOrders = [];
      
//       snapshot.forEach((childSnapshot) => {
//         const order = childSnapshot.val();
//         if (!order.items || order.items.length === 0 || 
//             ((order.subtotal || 0) + (order.deliveryCharge || 0) <= 0)) {
//           emptyOrders.push({
//             id: childSnapshot.key,
//             ...order
//           });
//         }
//       });
      
//       // Remove the searching alert
//       setAdminAlerts(prev => prev.filter(a => a.id !== 'cleanup-alert'));
      
//       if (emptyOrders.length === 0) {
//         setAdminAlerts(prev => [
//           ...prev, 
//           { 
//             id: 'no-empty-orders',
//             type: 'success',
//             message: 'No empty orders found in the database.',
//             autoClose: true
//           }
//         ]);
//         setIsCleaningUp(false);
//         return;
//       }
      
//       // Prompt to confirm deletion
//       const confirmed = window.confirm(
//         `Found ${emptyOrders.length} empty orders. Would you like to delete them?\n\n` +
//         `Orders IDs: ${emptyOrders.map(o => orderIdMap[o.id] || o.id).join(', ')}`
//       );
      
//       if (!confirmed) {
//         setAdminAlerts(prev => [
//           ...prev, 
//           { 
//             id: 'cleanup-cancelled',
//             type: 'info',
//             message: 'Cleanup cancelled.',
//             autoClose: true
//           }
//         ]);
//         setIsCleaningUp(false);
//         return;
//       }
      
//       // Add a processing alert
//       setAdminAlerts(prev => [
//         ...prev, 
//         { 
//           id: 'cleanup-processing',
//           type: 'info',
//           message: `Deleting ${emptyOrders.length} empty orders...`,
//           icon: <RefreshCw className="spinning" />
//         }
//       ]);
      
//       // Delete the empty orders
//       for (const order of emptyOrders) {
//         const orderRef = ref(db, `orders/${order.id}`);
//         await remove(orderRef);
//         console.log(`Deleted empty order: ${order.id}`);
//       }
      
//       // Remove the processing alert
//       setAdminAlerts(prev => prev.filter(a => a.id !== 'cleanup-processing'));
      
//       // Add success alert
//       setAdminAlerts(prev => [
//         ...prev, 
//         { 
//           id: 'cleanup-success',
//           type: 'success',
//           message: `Successfully deleted ${emptyOrders.length} empty orders.`,
//           autoClose: true
//         }
//       ]);
      
//     } catch (error) {
//       console.error('Error cleaning up empty orders:', error);
      
//       // Remove any processing alerts
//       setAdminAlerts(prev => prev.filter(a => a.id !== 'cleanup-alert' && a.id !== 'cleanup-processing'));
      
//       // Add error alert
//       setAdminAlerts(prev => [
//         ...prev, 
//         { 
//           id: 'cleanup-error',
//           type: 'error',
//           message: `Error cleaning up empty orders: ${error.message}`,
//           autoClose: true
//         }
//       ]);
//     } finally {
//       setIsCleaningUp(false);
//     }
//   };

//   // Fetch orders from Realtime Database in real-time
//   useEffect(() => {
//     const ordersRef = ref(db, 'orders');
//     setLoading(true);
    
//     const unsubscribe = onValue(ordersRef, (snapshot) => {
//       const data = snapshot.val();
//       const ordersData = data ? Object.keys(data).map(key => {
//         const order = {
//           id: key,
//           ...data[key],
//           timeline: data[key].timeline || [
//             { 
//               status: 'order_placed', 
//               time: data[key].orderDate || new Date().toISOString(),
//               note: 'Order placed successfully' 
//             }
//           ]
//         };
//         // Validate and clean timeline entries
//         order.timeline = order.timeline.map(event => ({
//           ...event,
//           time: event.time || new Date().toISOString() // Ensure time is always defined
//         }));
//         return order;
//       }) : [];
      
//       const idMap = generateOrderIdMap(ordersData);
//       setOrders(ordersData);
      
//       // Extract and set available areas
//       const areas = extractAreas(ordersData);
//       setAvailableAreas(areas);
      
//       // Check for new orders and status changes
//       checkForOrderChanges(ordersData, idMap);
      
//       setLoading(false);
//     }, (err) => {
//       console.error('Error fetching orders:', err);
//       setError('Failed to load orders. Please try again later.');
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [notifiedOrders]);

//   // Function to extract unique areas from orders
//   const extractAreas = (ordersData) => {
//     const areas = new Set();
//     ordersData.forEach(order => {
//       const address = order.customer?.address || '';
//       const city = order.customer?.city || '';
      
//       // Extract area from address (simplified version)
//       const addressParts = address.split(',');
//       if (addressParts.length > 0) {
//         const area = addressParts[0].trim();
//         if (area) areas.add(area);
//       }
      
//       // Add city as area if available
//       if (city) areas.add(city);
//     });
    
//     return Array.from(areas).sort();
//   };

//   // Check for new orders and status changes
//   const checkForOrderChanges = (ordersData, idMap) => {
//     // Get any orders that were created or updated in the last 5 minutes
//     const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
//     ordersData.forEach(order => {
//       // Check if this order or a status update is new
//       const orderDate = new Date(order.orderDate);
      
//       // Check the latest timeline event
//       const latestEvent = order.timeline && order.timeline.length > 0 
//         ? order.timeline[order.timeline.length - 1] 
//         : null;
      
//       if (latestEvent) {
//         const eventTime = new Date(latestEvent.time);
//         const notificationKey = `${order.id}-${latestEvent.status}`;
        
//         // If the event happened in the last 5 minutes and we haven't notified about it yet
//         if (eventTime > fiveMinutesAgo && !notifiedOrders.includes(notificationKey)) {
//           console.log("Checking order event:", notificationKey, latestEvent.status);
          
//           // Create notifications based on event type
//           switch(latestEvent.status) {
//             case 'order_placed':
//               console.log("Creating notification for new order:", order.id);
//               createOrderNotification(order.id, 'new', {
//                 ...order,
//                 displayId: idMap[order.id] || order.id
//               });
//               break;
              
//             case 'cancelled':
//               console.log("Creating notification for canceled order:", order.id);
//               createOrderNotification(order.id, 'canceled', {
//                 ...order,
//                 displayId: idMap[order.id] || order.id
//               });
//               break;
              
//             case 'processing':
//               console.log("Creating notification for processing order:", order.id);
//               createOrderNotification(order.id, 'processed', {
//                 ...order,
//                 displayId: idMap[order.id] || order.id
//               });
//               break;
              
//             case 'delivered':
//               console.log("Creating notification for delivered order:", order.id);
//               createOrderNotification(order.id, 'delivered', {
//                 ...order,
//                 displayId: idMap[order.id] || order.id
//               });
//               break;
              
//             default:
//               // No notification for other status changes
//               break;
//           }
          
//           // Mark this order event as notified
//           setNotifiedOrders(prev => [...prev, notificationKey]);
//         }
//       }
//     });
//   };

//   // Delete order from Firebase
//   const deleteOrder = async (orderId) => {
//     const confirmed = window.confirm(`Are you sure you want to delete order ${orderIdMap[orderId] || orderId}? This action cannot be undone.`);
//     if (!confirmed) return;

//     try {
//       const orderRef = ref(db, `orders/${orderId}`);
//       await remove(orderRef);
//       alert(`Order ${orderIdMap[orderId] || orderId} has been deleted.`);
//     } catch (err) {
//       console.error('Error deleting order:', err);
//       alert('Failed to delete order. Please try again.');
//     }
//   };

//   // Cancel order
//   const cancelOrder = async (orderId) => {
//     const confirmed = window.confirm(`Are you sure you want to cancel order ${orderIdMap[orderId] || orderId}? This will initiate a refund process.`);
//     if (!confirmed) return;

//     try {
//       const order = orders.find(o => o.id === orderId);
//       if (!order) {
//         throw new Error('Order not found in state');
//       }

//       // Validate and clean timeline entries
//       const cleanedTimeline = order.timeline.map(event => ({
//         ...event,
//         time: event.time || new Date().toISOString() // Ensure time is always defined
//       }));

//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, {
//         status: 'cancelled',
//         refundStatus: 'initiated',
//         cancellationReason: 'Cancelled by admin',
//         timeline: [
//           ...cleanedTimeline,
//           {
//             status: 'cancelled',
//             time: new Date().toISOString(),
//             note: 'Order cancelled by admin'
//           },
//           {
//             status: 'refund_initiated',
//             time: new Date().toISOString(),
//             note: 'Refund initiated'
//           }
//         ]
//       });
      
//       // Create notification for canceled order
//       createOrderNotification(orderId, 'canceled', {
//         ...order,
//         displayId: orderIdMap[orderId] || orderId,
//         cancellationReason: 'Cancelled by admin'
//       });
      
//       alert(`Order ${orderIdMap[orderId] || orderId} has been cancelled and refund initiated.`);
//     } catch (err) {
//       console.error('Error cancelling order:', err);
//       alert(`Failed to cancel order: ${err.message}`);
//     }
//   };

//   // Open assign vendor modal
//   const openAssignVendorModal = (orderId) => {
//     setOrderToAssign(orderId);
//     setIsAssignVendorModalOpen(true);
//   };

//   // Assign order to vendor
//   const assignOrderToVendor = async (orderId, vendor) => {
//     try {
//       setLoading(true);
      
//       const order = orders.find(o => o.id === orderId);
//       if (!order) {
//         throw new Error('Order not found in state');
//       }

//       // Get the current timeline
//       const cleanedTimeline = order.timeline.map(event => ({
//         ...event,
//         time: event.time || new Date().toISOString()
//       }));

//       // Update order with vendor assignment - always using manual assignment
//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, {
//         assignedVendor: {
//           id: vendor.id,
//           name: vendor.name,
//           rating: vendor.rating || 0,
//           reviews: vendor.reviews || 0,
//           location: vendor.location || {},
//           category: vendor.category || '',
//           status: vendor.status || 'active',
//         },
//         // Manual assignment always requires manual acceptance
//         status: 'pending_vendor_manual_acceptance',
//         assignmentType: 'manual',
//         vendorAssignedAt: new Date().toISOString(),
//         timeline: [
//           ...cleanedTimeline,
//           {
//             status: 'pending_vendor_manual_acceptance',
//             time: new Date().toISOString(),
//             note: `Order manually assigned to ${vendor.name}`
//           }
//         ]
//       });

//       // Close modal
//       setIsAssignVendorModalOpen(false);
//       setOrderToAssign(null);
      
//       // Show success notification
//       setAdminAlerts(prev => [
//         ...prev, 
//         { 
//           id: `assign-success-${orderId}`,
//           type: 'success',
//           message: `Order ${orderIdMap[orderId] || orderId} has been manually assigned to ${vendor.name}.`,
//           autoClose: true
//         }
//       ]);
      
//       setLoading(false);
//     } catch (err) {
//       console.error('Error assigning order:', err);
      
//       // Show error notification
//       setAdminAlerts(prev => [
//         ...prev, 
//         { 
//           id: `assign-error-${orderId}`,
//           type: 'error',
//           message: `Failed to assign order: ${err.message}`,
//           autoClose: true
//         }
//       ]);
      
//       setLoading(false);
//     }
//   };

//   // Handle sorting change
//   const handleSortChange = (field) => {
//     if (sortBy === field) {
//       // Toggle direction if clicking the same field
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       // Set new field and default to descending
//       setSortBy(field);
//       setSortDirection('desc');
//     }
//   };

//   // Handle date filter change
//   const handleDateFilterChange = (filter) => {
//     setDateFilter(filter);
//   };

//   // Handle area filter change
//   const handleAreaFilterChange = (filter) => {
//     setAreaFilter(filter);
//   };

//   // Apply date filter to orders
//   const getDateFilteredOrders = (ordersList) => {
//     if (dateFilter === 'all') return ordersList;
    
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     const yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);
    
//     const lastWeekStart = new Date(today);
//     lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    
//     const lastMonthStart = new Date(today);
//     lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    
//     return ordersList.filter(order => {
//       const orderDate = new Date(order.orderDate);
      
//       switch (dateFilter) {
//         case 'today':
//           return orderDate >= today;
//         case 'yesterday':
//           return orderDate >= yesterday && orderDate < today;
//         case 'last7days':
//           return orderDate >= lastWeekStart;
//         case 'last30days':
//           return orderDate >= lastMonthStart;
//         case 'custom':
//           const startDate = customDateRange.start ? new Date(customDateRange.start) : null;
//           const endDate = customDateRange.end ? new Date(customDateRange.end) : null;
          
//           if (startDate && endDate) {
//             // Set end date to end of day
//             endDate.setHours(23, 59, 59, 999);
//             return orderDate >= startDate && orderDate <= endDate;
//           } else if (startDate) {
//             return orderDate >= startDate;
//           } else if (endDate) {
//             endDate.setHours(23, 59, 59, 999);
//             return orderDate <= endDate;
//           }
//           return true;
//         default:
//           return true;
//       }
//     });
//   };

//   // Apply area filter to orders
//   const getAreaFilteredOrders = (ordersList) => {
//     if (areaFilter === 'all') return ordersList;
    
//     return ordersList.filter(order => {
//       const address = `${order.customer?.address || ''}, ${order.customer?.city || ''}, ${order.customer?.pincode || ''}`;
//       return address.toLowerCase().includes(areaFilter.toLowerCase());
//     });
//   };

//   // Sort orders based on current sort settings
//   const getSortedOrders = (ordersList) => {
//     return [...ordersList].sort((a, b) => {
//       let comparison = 0;
      
//       switch (sortBy) {
//         case 'date':
//           comparison = new Date(a.orderDate) - new Date(b.orderDate);
//           break;
//         case 'amount':
//           comparison = calculateAmountWithoutTax(a) - calculateAmountWithoutTax(b);
//           break;
//         case 'customer':
//           comparison = (a.customer?.fullName || '').localeCompare(b.customer?.fullName || '');
//           break;
//         case 'status':
//           comparison = (a.status || '').localeCompare(b.status || '');
//           break;
//         default:
//           comparison = 0;
//       }
      
//       return sortDirection === 'asc' ? comparison : -comparison;
//     });
//   };

//   // UPDATED: Filter orders based on active tab, search term, and other filters
//   // This now includes filtering out empty orders
//   const getFilteredOrders = () => {
//     let filtered = orders.filter(order => {
//       // Skip empty orders (those with no items or zero subtotal)
//       if (!order.items || order.items.length === 0 || 
//           calculateAmountWithoutTax(order) <= 0) {
//         return false;
//       }
      
//       if (activeTab !== 'all' && order.status !== activeTab) {
//         return false;
//       }
//       if (searchTerm && 
//           !(orderIdMap[order.id] || '').toLowerCase().includes(searchTerm.toLowerCase()) && 
//           !order.id.toLowerCase().includes(searchTerm.toLowerCase()) && 
//           !order.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())) {
//         return false;
//       }
//       return true;
//     });
    
//     // Apply date filtering
//     filtered = getDateFilteredOrders(filtered);
    
//     // Apply area filtering
//     filtered = getAreaFilteredOrders(filtered);
    
//     // Apply sorting
//     return getSortedOrders(filtered);
//   };

//   // Status icon mapping
//   const getStatusIcon = (status) => {
//     switch(status) {
//       case 'pending': return <Clock className="status-icon pending" />;
//       case 'pending_vendor_confirmation': return <AlertTriangle className="status-icon pending" />;
//       case 'pending_vendor_manual_acceptance': return <AlertTriangle className="status-icon pending" />;
//       case 'processing': return <RefreshCw className="status-icon processing" />;
//       case 'prepared': return <Utensils className="status-icon prepared" />;
//       case 'ready_for_pickup': return <Package className="status-icon ready-for-pickup" />;
//       case 'delivery_assigned': return <Truck className="status-icon delivery-assigned" />;
//       case 'out_for_delivery': return <Navigation className="status-icon out-for-delivery" />;
//       case 'delivered': return <CheckCircle className="status-icon delivered" />;
//       case 'cancelled': return <XCircle className="status-icon cancelled" />;
//       default: return <Clock className="status-icon" />;
//     }
//   };

//   // Status text formatting
//   const getStatusText = (status) => {
//     if (!status) return 'Unknown'; // Safeguard for undefined status
//     switch(status) {
//       case 'pending': return 'Pending';
//       case 'pending_vendor_confirmation': return 'Awaiting Vendor Confirmation';
//       case 'pending_vendor_manual_acceptance': return 'Awaiting Manual Acceptance';
//       case 'processing': return 'Processing';
//       case 'prepared': return 'Prepared';
//       case 'ready_for_pickup': return 'Ready for Pickup';
//       case 'delivery_assigned': return 'Delivery Assigned';
//       case 'out_for_delivery': return 'Out for Delivery';
//       case 'delivered': return 'Delivered';
//       case 'cancelled': return 'Cancelled';
//       case 'order_placed': return 'Order Placed';
//       case 'order_confirmed': return 'Order Confirmed';
//       case 'refund_initiated': return 'Refund Initiated';
//       case 'refund_processed': return 'Refund Processed';
//       default: return status.split('_').map(word => 
//         word.charAt(0).toUpperCase() + word.slice(1)
//       ).join(' ');
//     }
//   };

//   // Function to dismiss an alert
//   const dismissAlert = (index) => {
//     setAdminAlerts(prevAlerts => prevAlerts.filter((_, i) => i !== index));
//   };

//   // Export orders to CSV
//   const exportOrdersCSV = () => {
//     const filteredOrders = getFilteredOrders();
    
//     // Define CSV headers
//     const headers = [
//       'Order ID',
//       'Customer Name',
//       'Customer Email',
//       'Customer Phone',
//       'Address',
//       'Date & Time',
//       'Amount',
//       'Status',
//       'Vendor',
//       'Delivery Person',
//       'Items'
//     ];
    
//     // Map orders to CSV rows
//     const rows = filteredOrders.map(order => {
//       const itemsString = order.items ? order.items
//         .map(item => `${item.name} x ${item.quantity}`)
//         .join('; ') : '';
      
//       return [
//         orderIdMap[order.id] || order.id,
//         order.customer?.fullName || '',
//         order.customer?.email || '',
//         order.customer?.phone || '',
//         `${order.customer?.address || ''}, ${order.customer?.city || ''}, ${order.customer?.pincode || ''}`,
//         formatDate(order.orderDate),
//         calculateAmountWithoutTax(order),
//         getStatusText(order.status),
//         order.vendor?.name || (order.assignedVendor?.name ? `${order.assignedVendor.name} (pending)` : ''),
//         order.delivery?.partnerName || (order.deliveryPerson?.name || ''),
//         itemsString
//       ];
//     });
    
//     // Combine headers and rows
//     const csvContent = [
//       headers.join(','),
//       ...rows.map(row => row.map(cell => 
//         // Escape special characters in CSV
//         typeof cell === 'string' ? `"${cell.replace(/"/g, '""')}"` : cell
//       ).join(','))
//     ].join('\n');
    
//     // Create a Blob with the CSV content
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
    
//     // Create a link element and trigger download
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', `orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const filteredOrders = getFilteredOrders();

//   // Detail view for selected order
//   if (selectedOrder) {
//     const order = orders.find(o => o.id === selectedOrder);
    
//     if (!order) return <div className="order-management">Order not found</div>;

//     return (
//       <div className="order-management">
//         {/* Add AdminAlerts component */}
//         <AdminAlerts alerts={adminAlerts} onDismiss={dismissAlert} />
        
//         {/* Assign Vendor Modal */}
//         <AssignVendorModal 
//           isOpen={isAssignVendorModalOpen}
//           onClose={() => setIsAssignVendorModalOpen(false)}
//           onAssign={assignOrderToVendor}
//           orderId={orderToAssign}
//         />
        
//         <div className="order-detail-header">
//           <button className="back-button" onClick={() => setSelectedOrder(null)}>
//             ← Back to Orders
//           </button>
//           <h1>Order Details: {orderIdMap[order.id] || order.id}</h1>
//           <div className="order-status-badge">
//             {getStatusIcon(order.status)}
//             <span>{getStatusText(order.status)}</span>
//           </div>
//         </div>

//         <div className="order-detail-container">
//           <div className="order-detail-card customer-info">
//             <h2>Customer Information</h2>
//             <p><strong>Name:</strong> {order.customer?.fullName}</p>
//             <p><strong>Address:</strong> {`${order.customer?.address}, ${order.customer?.city}, ${order.customer?.pincode}`}</p>
//             <p><strong>Email:</strong> {order.customer?.email}</p>
//             <p><strong>Phone:</strong> {order.customer?.phone}</p>
//             <p><strong>Order Date:</strong> {formatDate(order.orderDate)}</p>
//           </div>

//           <div className="order-detail-card vendor-info">
//             <h2>Vendor Information</h2>
//             {order.vendor ? (
//               <>
//                 <p><strong>Name:</strong> {order.vendor.name}</p>
//                 <p><strong>Rating:</strong> {order.vendor.rating || 'N/A'} <Star size={14} className="star-icon" /></p>
//                 <p><strong>Address:</strong> {order.vendor.location?.address}</p>
//               </>
//             ) : order.assignedVendor ? (
//               <>
//                 <p><strong>Name:</strong> {order.assignedVendor.name} 
//                   <span className={`pending-badge ${order.status === 'pending_vendor_manual_acceptance' ? 'manual' : ''}`}>
//                     ({order.status === 'pending_vendor_manual_acceptance' ? 'Awaiting manual acceptance' : 'Awaiting confirmation'})
//                   </span>
//                 </p>
//                 <p><strong>Rating:</strong> {order.assignedVendor.rating || 'N/A'} <Star size={14} className="star-icon" /></p>
//                 <p><strong>Address:</strong> {order.assignedVendor.location?.address}</p>
//                 <p><strong>Distance:</strong> {order.assignedVendor.distanceText || order.assignedVendor.distance}</p>
//                 <p><strong>Assigned At:</strong> {formatDate(order.vendorAssignedAt)}</p>
//                 <p><strong>Assignment Type:</strong> {order.assignmentType === 'auto' ? 'Automatic' : (order.assignmentType === 'manual_required' ? 'Manual Acceptance Required' : 'Manual')}</p>
//                 <p><strong>Status:</strong> <span className={`status-text ${order.assignedVendor.status === 'active' ? 'active-status' : 'inactive-status'}`}>
//                   {order.assignedVendor.status === 'active' ? 'Active' : 'Inactive'}
//                 </span></p>
//                 {order.vendorAssignedAt && order.status === 'pending_vendor_confirmation' && (
//                   <div className="confirmation-timer">
//                     <AlertTriangle size={14} className="timer-icon" />
//                     <span>Vendor must confirm within 5 minutes</span>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <div className="no-vendor">
//                 <p>No vendor assigned yet. Auto-assignment in progress...</p>
//                 <button className="assign-vendor-button" onClick={() => openAssignVendorModal(order.id)}>
//                   Manually Assign Vendor
//                 </button>
//               </div>
//             )}
//           </div>

//           <div className="order-detail-card delivery-info">
//             <h2>Delivery Information</h2>
//             {(order.delivery || order.deliveryPerson) ? (
//               <>
//                 <p><strong>Delivery Person:</strong> {order.delivery?.partnerName || order.deliveryPerson?.name}</p>
//                 {(order.delivery?.partnerPhone || order.deliveryPerson?.phone) && (
//                   <p><strong>Phone:</strong> {order.delivery?.partnerPhone || order.deliveryPerson?.phone}</p>
//                 )}
//                 {(order.delivery?.trackingId || order.deliveryPerson?.bookingId) && (
//                   <p><strong>Tracking ID:</strong> {order.delivery?.trackingId || order.deliveryPerson?.bookingId}</p>
//                 )}
//                 {(order.delivery?.estimatedPickupTime || order.deliveryPerson?.estimatedPickupTime) && (
//                   <p><strong>Est. Pickup:</strong> {formatDate(order.delivery?.estimatedPickupTime || order.deliveryPerson?.estimatedPickupTime)}</p>
//                 )}
//                 {(order.delivery?.estimatedDeliveryTime || order.deliveryPerson?.estimatedDeliveryTime) && (
//                   <p><strong>Est. Delivery:</strong> {formatDate(order.delivery?.estimatedDeliveryTime || order.deliveryPerson?.estimatedDeliveryTime)}</p>
//                 )}
//                 {(order.status === 'out_for_delivery' && (order.delivery?.trackingUrl || order.deliveryPerson?.trackingUrl)) && (
//                   <div className="tracking-link">
//                     <a 
//                       href={order.delivery?.trackingUrl || order.deliveryPerson?.trackingUrl} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="track-button"
//                     >
//                       Track Live Location
//                     </a>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <p>Delivery will be assigned by the vendor when the order is ready for pickup.</p>
//             )}
//           </div>

//           {/* Replace the existing order items table with our new component */}
//           <OrderItems 
//             items={order.items}
//             subtotal={order.subtotal}
//             deliveryCharge={order.deliveryCharge}
//             // tax={order.tax}
//             totalAmount={calculateAmountWithoutTax(order)} // Use amount without tax
//             formatCurrency={formatCurrency}
//           />

//           <div className="order-detail-card order-timeline">
//             <h2>Order Timeline</h2>
//             <div className="timeline">
//               {order.timeline?.map((event, index) => (
//                 event.status ? (
//                   <div className="timeline-item" key={index}>
//                     <div className="timeline-marker"></div>
//                     <div className="timeline-content">
//                       <h3>{getStatusText(event.status)}</h3>
//                       <p className="timeline-time">{formatDate(event.time)}</p>
//                       <p className="timeline-note">{event.note}</p>
//                     </div>
//                   </div>
//                 ) : (
//                   console.warn(`Invalid timeline event at index ${index} for order ${order.id}:`, event) || null
//                 )
//               ))}
//             </div>
//           </div>

//           {order.status !== 'delivered' && order.status !== 'cancelled' && (
//             <div className="order-actions">
//               <button className="cancel-order-button" onClick={() => cancelOrder(order.id)}>
//                 Cancel Order & Initiate Refund
//               </button>
//             </div>
//           )}

//           {order.status === 'cancelled' && (
//             <div className="refund-info order-detail-card">
//               <h2>Refund Information</h2>
//               <p><strong>Cancellation Reason:</strong> {order.cancellationReason || 'Not specified'}</p>
//               <p><strong>Refund Status:</strong> {order.refundStatus === 'processed' ? 'Refund Processed' : 'Refund Pending'}</p>
//               {order.timeline
//                 .filter(event => event.status && event.status.includes('refund'))
//                 .map((event, index) => (
//                   <p key={index}><strong>{getStatusText(event.status)}:</strong> {formatDate(event.time)}</p>
//                 ))
//               }
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // Main orders table view
//   return (
//     <div className="order-management">
//       {/* Add AdminAlerts component */}
//       <AdminAlerts alerts={adminAlerts} onDismiss={dismissAlert} />
      
//       {/* Assign Vendor Modal */}
//       <AssignVendorModal 
//         isOpen={isAssignVendorModalOpen}
//         onClose={() => setIsAssignVendorModalOpen(false)}
//         onAssign={assignOrderToVendor}
//         orderId={orderToAssign}
//       />
      
//       <h1>Order Management</h1>

//       {error && <div className="error-message">{error}</div>}
//       {loading && <div className="loading-message">Loading orders...</div>}

//       <div className="order-filters">
//         <div className="search-container">
//           <Search className="search-icon" />
//           <input 
//             type="text"
//             placeholder="Search orders by ID or customer name..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="search-input"
//           />
//         </div>

//         <div className="filter-tabs">
//           <button 
//             className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
//             onClick={() => setActiveTab('all')}
//           >
//             All Orders
//           </button>
//           <button 
//             className={`filter-tab ${activeTab === 'pending' ? 'active' : ''}`}
//             onClick={() => setActiveTab('pending')}
//           >
//             Pending
//           </button>
//           <button 
//             className={`filter-tab ${activeTab === 'pending_vendor_confirmation' ? 'active' : ''}`}
//             onClick={() => setActiveTab('pending_vendor_confirmation')}
//           >
//             Awaiting Vendor
//           </button>
//           <button 
//             className={`filter-tab ${activeTab === 'pending_vendor_manual_acceptance' ? 'active' : ''}`}
//             onClick={() => setActiveTab('pending_vendor_manual_acceptance')}
//           >
//             Manual Acceptance
//           </button>
//           <button 
//             className={`filter-tab ${activeTab === 'processing' ? 'active' : ''}`}
//             onClick={() => setActiveTab('processing')}
//           >
//             Processing
//           </button>
//           <button 
//             className={`filter-tab ${activeTab === 'ready_for_pickup' ? 'active' : ''}`}
//             onClick={() => setActiveTab('ready_for_pickup')}
//           >
//             Ready for Pickup
//           </button>
//           <button 
//             className={`filter-tab ${activeTab === 'out_for_delivery' ? 'active' : ''}`}
//             onClick={() => setActiveTab('out_for_delivery')}
//           >
//             Out for Delivery
//           </button>
//           <button 
//             className={`filter-tab ${activeTab === 'delivered' ? 'active' : ''}`}
//             onClick={() => setActiveTab('delivered')}
//           >
//             Delivered
//           </button>
//           <button 
//             className={`filter-tab ${activeTab === 'cancelled' ? 'active' : ''}`}
//             onClick={() => setActiveTab('cancelled')}
//           >
//             Cancelled
//           </button>
//         </div>
//       </div>

//       {/* Advanced filters */}
//       <div className="advanced-filters">
//         <div className="filters-container">
//           <div className="date-filters">
//             <div className="date-filter-label">
//               <Calendar size={16} />
//               <span>Date Filter:</span>
//             </div>
//             <select 
//               value={dateFilter} 
//               onChange={(e) => handleDateFilterChange(e.target.value)}
//               className="date-filter-select"
//             >
//               <option value="all">All Time</option>
//               <option value="today">Today</option>
//               <option value="yesterday">Yesterday</option>
//               <option value="last7days">Last 7 Days</option>
//               <option value="last30days">Last 30 Days</option>
//               <option value="custom">Custom Range</option>
//             </select>
            
//             {dateFilter === 'custom' && (
//               <div className="custom-date-range">
//                 <input
//                   type="date"
//                   value={customDateRange.start}
//                   onChange={(e) => setCustomDateRange({...customDateRange, start: e.target.value})}
//                   className="date-input"
//                   placeholder="Start Date"
//                 />
//                 <span>to</span>
//                 <input
//                   type="date"
//                   value={customDateRange.end}
//                   onChange={(e) => setCustomDateRange({...customDateRange, end: e.target.value})}
//                   className="date-input"
//                   placeholder="End Date"
//                 />
//               </div>
//             )}
//           </div>
          
//           <div className="area-filters">
//             <div className="area-filter-label">
//               <Map size={16} />
//               <span>Area Filter:</span>
//             </div>
//             <select 
//               value={areaFilter} 
//               onChange={(e) => handleAreaFilterChange(e.target.value)}
//               className="area-filter-select"
//             >
//               <option value="all">All Areas</option>
//               {availableAreas.map(area => (
//                 <option key={area} value={area}>{area}</option>
//               ))}
//             </select>
//           </div>
          
//           <div className="export-container">
//             <button className="export-button" onClick={exportOrdersCSV}>
//               <Download size={16} />
//               Export Orders
//             </button>
            
//             {/* New button for cleaning up empty orders */}
//             <button 
//               className="cleanup-button"
//               onClick={cleanupEmptyOrders}
//               disabled={isCleaningUp}
//               title="Find and remove empty orders"
//               style={{
//                 marginLeft: '8px', 
//                 display: 'flex', 
//                 alignItems: 'center',
//                 backgroundColor: '#f44336',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '4px',
//                 padding: '6px 12px',
//                 cursor: isCleaningUp ? 'not-allowed' : 'pointer',
//                 opacity: isCleaningUp ? 0.7 : 1
//               }}
//             >
//               {isCleaningUp ? (
//                 <RefreshCw size={16} className="spinning" style={{ marginRight: '6px' }} />
//               ) : (
//                 <Trash2 size={16} style={{ marginRight: '6px' }} />
//               )}
//               Clean Up Empty Orders
//             </button>
//           </div>
//         </div>
        
//         <div className="sort-filters">
//           <div className="sort-filter-label">
//             <Filter size={16} />
//             <span>Sort By:</span>
//           </div>
//           <div className="sort-options">
//             <button 
//               className={`sort-option ${sortBy === 'date' ? 'active' : ''}`}
//               onClick={() => handleSortChange('date')}
//             >
//               Date
//               {sortBy === 'date' && (
//                 sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
//               )}
//             </button>
//             <button 
//               className={`sort-option ${sortBy === 'amount' ? 'active' : ''}`}
//               onClick={() => handleSortChange('amount')}
//             >
//               Amount
//               {sortBy === 'amount' && (
//                 sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
//               )}
//             </button>
//             <button 
//               className={`sort-option ${sortBy === 'customer' ? 'active' : ''}`}
//               onClick={() => handleSortChange('customer')}
//             >
//               Customer
//               {sortBy === 'customer' && (
//                 sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
//               )}
//             </button>
//             <button 
//               className={`sort-option ${sortBy === 'status' ? 'active' : ''}`}
//               onClick={() => handleSortChange('status')}
//             >
//               Status
//               {sortBy === 'status' && (
//                 sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {filteredOrders.length > 0 ? (
//         <div className="orders-table-container">
//           <table className="orders-table">
//             <thead>
//               <tr>
//                 <th>Order ID</th>
//                 <th>Customer</th>
//                 <th>Date & Time</th>
//                 <th>Amount</th>
//                 <th style={{textAlign:'center', position:'relative'}}>Vendor</th>
//                 <th style={{textAlign:'center', position:'relative'}}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredOrders.map((order) => (
//                 <tr key={order.id} className={`order-row ${order.status}`}>
//                   <td className="order-id-cell">
//                     <div className="order-id-with-status">
//                       <Package className="order-icon" />
//                       <span className="order-id-text">{orderIdMap[order.id] || order.id}</span>
//                       <div className={`order-status-indicator ${order.status}`}>
//                         {getStatusIcon(order.status)}
//                         <span className="status-text">{getStatusText(order.status)}</span>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="customer-cell">
//                     <div className="customer-name">{order.customer?.fullName}</div>
//                   </td>
//                   <td className="date-cell">
//                     {formatDate(order.orderDate)}
//                   </td>
//                   <td className="amount-cell">
//                     <div className="order-amount">{formatCurrency(calculateAmountWithoutTax(order))}</div>
//                     <div className="items-count">{order.items?.length} items</div>
//                   </td>
//                   <td className="vendor-cell">
//                     {order.vendor ? (
//                       <div className="vendor-info">
//                         <div className="vendor-name">{order.vendor.name}</div>
//                       </div>
//                     ) : order.assignedVendor ? (
//                       <div className="vendor-info">
//                         <div className="vendor-name">{order.assignedVendor.name}</div>
//                         <div className="vendor-status">
//                           <span className={`status-badge ${order.assignedVendor.status === 'active' ? 'active' : 'inactive'}`}>
//                             {order.assignedVendor.status === 'active' ? 'Active' : 'Inactive'}
//                           </span>
//                           {order.status === 'pending_vendor_confirmation' && (
//                             <>
//                               <AlertTriangle size={14} className="awaiting-icon" />
//                               <span>Awaiting confirmation</span>
//                             </>
//                           )}
//                           {order.status === 'pending_vendor_manual_acceptance' && (
//                             <>
//                               <AlertTriangle size={14} className="awaiting-icon" />
//                               <span>Awaiting manual acceptance</span>
//                             </>
//                           )}
//                         </div>
//                       </div>
//                     ) : (
//                       <button 
//                         className="assign-vendor-button small"
//                         onClick={() => openAssignVendorModal(order.id)}
//                       >
//                         Assign Vendor
//                       </button>
//                     )}
//                   </td>
                  
//                   <td className="actions-cell">
//                     <div className="order-actions-container">
//                       <button 
//                         className="view-details-button1"
//                         onClick={() => setSelectedOrder(order.id)}
//                       >
//                         View Details
//                       </button>
//                       {(order.status === 'pending' || order.status === 'processing' || 
//                         order.status === 'pending_vendor_confirmation' || 
//                         order.status === 'pending_vendor_manual_acceptance') && (
//                         <button 
//                           className="cancel-order-button"
//                           onClick={() => cancelOrder(order.id)}
//                         >
//                           Cancel
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="no-orders-found">
//           <p>{loading ? 'Loading...' : 'No orders found matching your criteria.'}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderManagement;




import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Filter, 
  Search,
  MapPin,
  Star,
  Trash2,
  ChevronRight,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  RefreshCw,
  Utensils,
  Calendar,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Download,
  Send,
  Map,
  Navigation,
  AlertTriangle
} from 'lucide-react';
import { ref, onValue, update, get, remove } from 'firebase/database';
import { db } from '../firebase/config';
import '../styles/OrderManagement.css';
import '../styles/AdminAlerts.css';
import OrderItems from './OrderItems';
import AdminAlerts from './AdminAlerts';
import AssignVendorModal from './AssignVendorModal';
import { createOrderNotification } from './notificationService';
import { cleanupOldNotifications } from './notificationService';
const OrderManagement = () => {
  // Function to calculate amount without tax
  const calculateAmountWithoutTax = (order) => {
    return (order.subtotal || 0) + (order.deliveryCharge || 0);
  };

  // State for active tab
  const [activeTab, setActiveTab] = useState('all');
  
  // State for search term
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for selected order
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // State for orders
  const [orders, setOrders] = useState([]);
  
  // State for loading
  const [loading, setLoading] = useState(true);
  
  // State for error
  const [error, setError] = useState('');

  // Map to store order ID mappings (Firebase ID -> Display ID)
  const [orderIdMap, setOrderIdMap] = useState({});

  // State for sorting
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  // State for date filter
  const [dateFilter, setDateFilter] = useState('all');
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: ''
  });

  // State for area filter
  const [areaFilter, setAreaFilter] = useState('all');
  const [availableAreas, setAvailableAreas] = useState([]);

  // State for admin alerts
  const [adminAlerts, setAdminAlerts] = useState([]);

  // State to track orders we've already notified about
  const [notifiedOrders, setNotifiedOrders] = useState([]);
  
  // State for cleanup in progress
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  
  // State for manual assign vendor modal
  const [isAssignVendorModalOpen, setIsAssignVendorModalOpen] = useState(false);
  const [orderToAssign, setOrderToAssign] = useState(null);
  
  // State to track orders that have been auto-assigned
  const [autoAssignedOrders, setAutoAssignedOrders] = useState([]);

  // Generate simplified order IDs for display
  const generateOrderIdMap = (orders) => {
    const idMap = {};
    orders.forEach((order, index) => {
      idMap[order.id] = `ORD-${index + 1}`;
    });
    setOrderIdMap(idMap);
    return idMap;
  };
useEffect(() => {
  // Run cleanup when component mounts
  cleanupOldNotifications(30); // Keep last 30 days of notifications
  
  // Setup periodic cleanup (every 24 hours)
  const cleanupInterval = setInterval(() => {
    cleanupOldNotifications(30);
  }, 24 * 60 * 60 * 1000);
  
  return () => clearInterval(cleanupInterval);
}, []);
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Validate order function to prevent empty orders
  const validateOrder = (order) => {
    const errors = [];
    
    // Check if order has items
    if (!order.items || order.items.length === 0) {
      errors.push('Order must contain at least one item');
    }
    
    // Check if order has a valid amount
    if ((order.subtotal || 0) <= 0) {
      errors.push('Order must have a valid amount');
    }
    
    // Check if order has customer information
    if (!order.customer || !order.customer.fullName) {
      errors.push('Order must have customer information');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };
  
  // Find nearest vendors based on customer address
  const findNearestVendors = async (customerAddr) => {
    if (!customerAddr) return [];
    
    try {
      // Fetch all active vendors
      const shopsRef = ref(db, 'shops');
      const snapshot = await get(shopsRef);
      
      if (!snapshot.exists()) return [];
      
      const shopsData = snapshot.val();
      const activeVendors = Object.keys(shopsData)
        .map(key => ({
          id: key,
          ...shopsData[key]
        }))
        .filter(shop => shop.status === 'active');
      
      if (activeVendors.length === 0) return [];
      
      // Function to extract area from address string
      const extractArea = (address) => {
        if (!address) return '';
        
        // Simple heuristic - split by commas and look at first parts
        const parts = address.toLowerCase().split(',');
        return parts.slice(0, 2).join(' '); // First two parts of address
      };
      
      const customerArea = extractArea(customerAddr);
      
      // Calculate a simple "distance score" based on string matching
      // In real implementation, use actual geolocation coordinates
      const vendorsWithDistance = activeVendors.map(vendor => {
        const vendorArea = extractArea(vendor.location?.address);
        
        // Simplified distance calculation
        // Higher score = better match (closer)
        let score = 0;
        
        // Exact area match gets highest score
        if (vendorArea.includes(customerArea) || customerArea.includes(vendorArea)) {
          score = 100;
        } else {
          // Check word by word for partial matches
          const customerWords = customerArea.split(/\s+/);
          const vendorWords = vendorArea.split(/\s+/);
          
          customerWords.forEach(cWord => {
            if (vendorWords.some(vWord => vWord.includes(cWord) || cWord.includes(vWord))) {
              score += 20;
            }
          });
        }
        
        // Random factor to simulate real distances
        const randomFactor = Math.floor(Math.random() * 20);
        score += randomFactor;
        
        // For display purposes, convert score to a distance in km
        const distanceKm = score > 90 ? 0.5 + (Math.random() * 1.5) : 
                           score > 70 ? 2 + (Math.random() * 3) :
                           score > 40 ? 5 + (Math.random() * 5) :
                           10 + (Math.random() * 10);
        
        return {
          ...vendor,
          distanceScore: score,
          distance: distanceKm.toFixed(1),
          distanceText: `${distanceKm.toFixed(1)} km away`
        };
      });
      
      // Sort by distance score (higher is better/closer)
      vendorsWithDistance.sort((a, b) => b.distanceScore - a.distanceScore);
      
      // Return the vendors with distance info
      return vendorsWithDistance;
      
    } catch (err) {
      console.error('Error finding nearest vendors:', err);
      return [];
    }
  };
  
  // Auto-assign vendor to order based on location
  const autoAssignVendor = async (orderId) => {
    try {
      // Check if order already has a vendor or is already being processed
      const order = orders.find(o => o.id === orderId);
      
      if (!order) return;
      
      // Don't auto-assign if order already has a vendor or is not in pending status
      if (order.vendor || order.assignedVendor || order.status !== 'pending') return;
      
      // Don't auto-assign if we've already tried to auto-assign this order
      if (autoAssignedOrders.includes(orderId)) return;
      
      // Mark this order as auto-assigned so we don't try again
      setAutoAssignedOrders(prev => [...prev, orderId]);
      
      // Get customer address
      const customerAddress = order.customer?.address;
      if (!customerAddress) return;
      
      // Find nearest vendors
      const nearestVendors = await findNearestVendors(customerAddress);
      
      if (nearestVendors.length === 0) {
        console.log('No active vendors found for auto-assignment');
        return;
      }
      
      // Get the nearest vendor
      const nearestVendor = nearestVendors[0];
      
      // Get the current timeline
      const cleanedTimeline = order.timeline.map(event => ({
        ...event,
        time: event.time || new Date().toISOString()
      }));
      
      // Update order with auto-assigned vendor
      const orderRef = ref(db, `orders/${orderId}`);
      await update(orderRef, {
        assignedVendor: {
          id: nearestVendor.id,
          name: nearestVendor.name,
          rating: nearestVendor.rating || 0,
          reviews: nearestVendor.reviews || 0,
          location: nearestVendor.location || {},
          category: nearestVendor.category || '',
          status: nearestVendor.status || 'active',
          distance: nearestVendor.distance || '',
          distanceText: nearestVendor.distanceText || '',
        },
        status: 'pending_vendor_confirmation',
        assignmentType: 'auto',
        vendorAssignedAt: new Date().toISOString(),
        timeline: [
          ...cleanedTimeline,
          {
            status: 'pending_vendor_confirmation',
            time: new Date().toISOString(),
            note: `Order automatically assigned to nearest vendor: ${nearestVendor.name} (${nearestVendor.distanceText || 'nearby'})`
          }
        ]
      });
      
      // Show success notification
      setAdminAlerts(prev => [
        ...prev, 
        { 
          id: `auto-assign-success-${orderId}`,
          type: 'success',
          message: `Order ${orderIdMap[orderId] || orderId} has been automatically assigned to nearest vendor: ${nearestVendor.name}.`,
          autoClose: true
        }
      ]);
      
      console.log(`Auto-assigned order ${orderId} to vendor ${nearestVendor.name}`);
      
    } catch (err) {
      console.error('Error auto-assigning vendor:', err);
      
      // Add error alert
      setAdminAlerts(prev => [
        ...prev, 
        { 
          id: `auto-assign-error-${orderId}`,
          type: 'error',
          message: `Error auto-assigning vendor: ${err.message}`,
          autoClose: true
        }
      ]);
    }
  };
  
  // Clean up empty orders
  const cleanupEmptyOrders = async () => {
    if (isCleaningUp) return;
    
    try {
      setIsCleaningUp(true);
      
      // Create a temporary alert
      setAdminAlerts(prev => [
        ...prev, 
        { 
          id: 'cleanup-alert',
          type: 'info',
          message: 'Searching for empty orders...',
          icon: <RefreshCw className="spinning" />
        }
      ]);
      
      const ordersRef = ref(db, 'orders');
      const snapshot = await get(ordersRef);
      
      if (!snapshot.exists()) {
        setAdminAlerts(prev => [
          ...prev.filter(a => a.id !== 'cleanup-alert'), 
          { 
            id: 'no-orders',
            type: 'info',
            message: 'No orders found in the database.',
            autoClose: true
          }
        ]);
        setIsCleaningUp(false);
        return;
      }
      
      const emptyOrders = [];
      
      snapshot.forEach((childSnapshot) => {
        const order = childSnapshot.val();
        if (!order.items || order.items.length === 0 || 
            ((order.subtotal || 0) + (order.deliveryCharge || 0) <= 0)) {
          emptyOrders.push({
            id: childSnapshot.key,
            ...order
          });
        }
      });
      
      // Remove the searching alert
      setAdminAlerts(prev => prev.filter(a => a.id !== 'cleanup-alert'));
      
      if (emptyOrders.length === 0) {
        setAdminAlerts(prev => [
          ...prev, 
          { 
            id: 'no-empty-orders',
            type: 'success',
            message: 'No empty orders found in the database.',
            autoClose: true
          }
        ]);
        setIsCleaningUp(false);
        return;
      }
      
      // Prompt to confirm deletion
      const confirmed = window.confirm(
        `Found ${emptyOrders.length} empty orders. Would you like to delete them?\n\n` +
        `Orders IDs: ${emptyOrders.map(o => orderIdMap[o.id] || o.id).join(', ')}`
      );
      
      if (!confirmed) {
        setAdminAlerts(prev => [
          ...prev, 
          { 
            id: 'cleanup-cancelled',
            type: 'info',
            message: 'Cleanup cancelled.',
            autoClose: true
          }
        ]);
        setIsCleaningUp(false);
        return;
      }
      
      // Add a processing alert
      setAdminAlerts(prev => [
        ...prev, 
        { 
          id: 'cleanup-processing',
          type: 'info',
          message: `Deleting ${emptyOrders.length} empty orders...`,
          icon: <RefreshCw className="spinning" />
        }
      ]);
      
      // Delete the empty orders
      for (const order of emptyOrders) {
        const orderRef = ref(db, `orders/${order.id}`);
        await remove(orderRef);
        console.log(`Deleted empty order: ${order.id}`);
      }
      
      // Remove the processing alert
      setAdminAlerts(prev => prev.filter(a => a.id !== 'cleanup-processing'));
      
      // Add success alert
      setAdminAlerts(prev => [
        ...prev, 
        { 
          id: 'cleanup-success',
          type: 'success',
          message: `Successfully deleted ${emptyOrders.length} empty orders.`,
          autoClose: true
        }
      ]);
      
    } catch (error) {
      console.error('Error cleaning up empty orders:', error);
      
      // Remove any processing alerts
      setAdminAlerts(prev => prev.filter(a => a.id !== 'cleanup-alert' && a.id !== 'cleanup-processing'));
      
      // Add error alert
      setAdminAlerts(prev => [
        ...prev, 
        { 
          id: 'cleanup-error',
          type: 'error',
          message: `Error cleaning up empty orders: ${error.message}`,
          autoClose: true
        }
      ]);
    } finally {
      setIsCleaningUp(false);
    }
  };

  // Fetch orders from Realtime Database in real-time
  useEffect(() => {
    const ordersRef = ref(db, 'orders');
    setLoading(true);
    
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      const ordersData = data ? Object.keys(data).map(key => {
        const order = {
          id: key,
          ...data[key],
          timeline: data[key].timeline || [
            { 
              status: 'order_placed', 
              time: data[key].orderDate || new Date().toISOString(),
              note: 'Order placed successfully' 
            }
          ]
        };
        // Validate and clean timeline entries
        order.timeline = order.timeline.map(event => ({
          ...event,
          time: event.time || new Date().toISOString() // Ensure time is always defined
        }));
        return order;
      }) : [];
      
      const idMap = generateOrderIdMap(ordersData);
      setOrders(ordersData);
      
      // Extract and set available areas
      const areas = extractAreas(ordersData);
      setAvailableAreas(areas);
      
      // Check for new orders and status changes
      checkForOrderChanges(ordersData, idMap);
      
      // Auto-assign vendors to pending orders
      ordersData.forEach(order => {
        if (order.status === 'pending' && !order.vendor && !order.assignedVendor) {
          autoAssignVendor(order.id);
        }
      });
      
      setLoading(false);
    }, (err) => {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again later.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [notifiedOrders]);

  // Function to extract unique areas from orders
  const extractAreas = (ordersData) => {
    const areas = new Set();
    ordersData.forEach(order => {
      const address = order.customer?.address || '';
      const city = order.customer?.city || '';
      
      // Extract area from address (simplified version)
      const addressParts = address.split(',');
      if (addressParts.length > 0) {
        const area = addressParts[0].trim();
        if (area) areas.add(area);
      }
      
      // Add city as area if available
      if (city) areas.add(city);
    });
    
    return Array.from(areas).sort();
  };

  // Check for new orders and status changes
// This is just the relevant section to modify in your OrderManagement.js
// Replace the checkForOrderChanges function with this improved version:

// Check for new orders and status changes
const checkForOrderChanges = (ordersData, idMap) => {
  // Skip if no data
  if (!ordersData || !Array.isArray(ordersData) || ordersData.length === 0) {
    return;
  }
  
  // If notifiedOrders isn't initialized yet, initialize it
  if (!notifiedOrders || !Array.isArray(notifiedOrders)) {
    setNotifiedOrders([]);
    return;
  }

  // Get any orders that were created or updated in the last 5 minutes
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  
  ordersData.forEach(order => {
    // Check if this order or a status update is new
    const orderDate = new Date(order.orderDate);
    
    // Check the latest timeline event
    const latestEvent = order.timeline && order.timeline.length > 0 
      ? order.timeline[order.timeline.length - 1] 
      : null;
    
    if (latestEvent) {
      const eventTime = new Date(latestEvent.time);
      const notificationKey = `${order.id}-${latestEvent.status}`;
      
      // If the event happened in the last 5 minutes and we haven't notified about it yet
      if (eventTime > fiveMinutesAgo && !notifiedOrders.includes(notificationKey)) {
        console.log("Checking order event:", notificationKey, latestEvent.status);
        
        // Create notifications based on event type
        switch(latestEvent.status) {
          case 'order_placed':
            console.log("Creating notification for new order:", order.id);
            createOrderNotification(order.id, 'new', {
              ...order,
              displayId: idMap[order.id] || order.id
            });
            break;
            
          case 'cancelled':
            console.log("Creating notification for canceled order:", order.id);
            createOrderNotification(order.id, 'canceled', {
              ...order,
              displayId: idMap[order.id] || order.id
            });
            break;
            
          case 'processing':
            console.log("Creating notification for processing order:", order.id);
            createOrderNotification(order.id, 'processed', {
              ...order,
              displayId: idMap[order.id] || order.id
            });
            break;
            
          case 'delivered':
            console.log("Creating notification for delivered order:", order.id);
            createOrderNotification(order.id, 'delivered', {
              ...order,
              displayId: idMap[order.id] || order.id
            });
            break;
            
          default:
            // No notification for other status changes
            break;
        }
        
        // Mark this order event as notified (do this first to prevent race conditions)
        setNotifiedOrders(prev => [...prev, notificationKey]);
      }
    }
  });
};

// Also add this useEffect to preserve notifiedOrders across renders
useEffect(() => {
  // Load notified orders from localStorage on initial load
  const savedNotifiedOrders = localStorage.getItem('notifiedOrders');
  if (savedNotifiedOrders) {
    setNotifiedOrders(JSON.parse(savedNotifiedOrders));
  }
}, []);

// Save notifiedOrders to localStorage when it changes
useEffect(() => {
  if (notifiedOrders && notifiedOrders.length > 0) {
    localStorage.setItem('notifiedOrders', JSON.stringify(notifiedOrders));
  }
}, [notifiedOrders]);

// Also fix your Firebase dependency for the main useEffect
// Change this line in your existing code:
// }, [notifiedOrders]);
// To this:
// }, []);  // Remove notifiedOrders dependency to prevent re-fetching data when we update notifiedOrders

  // Delete order from Firebase
  const deleteOrder = async (orderId) => {
    const confirmed = window.confirm(`Are you sure you want to delete order ${orderIdMap[orderId] || orderId}? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      const orderRef = ref(db, `orders/${orderId}`);
      await remove(orderRef);
      alert(`Order ${orderIdMap[orderId] || orderId} has been deleted.`);
    } catch (err) {
      console.error('Error deleting order:', err);
      alert('Failed to delete order. Please try again.');
    }
  };

  // Cancel order
  const cancelOrder = async (orderId) => {
    const confirmed = window.confirm(`Are you sure you want to cancel order ${orderIdMap[orderId] || orderId}? This will initiate a refund process.`);
    if (!confirmed) return;

    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) {
        throw new Error('Order not found in state');
      }

      // Validate and clean timeline entries
      const cleanedTimeline = order.timeline.map(event => ({
        ...event,
        time: event.time || new Date().toISOString() // Ensure time is always defined
      }));

      const orderRef = ref(db, `orders/${orderId}`);
      await update(orderRef, {
        status: 'cancelled',
        refundStatus: 'initiated',
        cancellationReason: 'Cancelled by admin',
        timeline: [
          ...cleanedTimeline,
          {
            status: 'cancelled',
            time: new Date().toISOString(),
            note: 'Order cancelled by admin'
          },
          {
            status: 'refund_initiated',
            time: new Date().toISOString(),
            note: 'Refund initiated'
          }
        ]
      });
      
      // Create notification for canceled order
      createOrderNotification(orderId, 'canceled', {
        ...order,
        displayId: orderIdMap[orderId] || orderId,
        cancellationReason: 'Cancelled by admin'
      });
      
      alert(`Order ${orderIdMap[orderId] || orderId} has been cancelled and refund initiated.`);
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert(`Failed to cancel order: ${err.message}`);
    }
  };

  // Open manual assign vendor modal
  const openAssignVendorModal = (orderId) => {
    setOrderToAssign(orderId);
    setIsAssignVendorModalOpen(true);
  };

  // Manually assign order to vendor
  const assignOrderToVendor = async (orderId, vendor, assignmentMode) => {
    try {
      setLoading(true);
      
      const order = orders.find(o => o.id === orderId);
      if (!order) {
        throw new Error('Order not found in state');
      }

      // Get the current timeline
      const cleanedTimeline = order.timeline.map(event => ({
        ...event,
        time: event.time || new Date().toISOString()
      }));

      // Update order with vendor assignment for manual assignment
      const orderRef = ref(db, `orders/${orderId}`);
      await update(orderRef, {
        assignedVendor: {
          id: vendor.id,
          name: vendor.name,
          rating: vendor.rating || 0,
          reviews: vendor.reviews || 0,
          location: vendor.location || {},
          category: vendor.category || '',
          status: vendor.status || 'active',
        },
        status: 'pending_vendor_manual_acceptance',
        assignmentType: 'manual',
        vendorAssignedAt: new Date().toISOString(),
        timeline: [
          ...cleanedTimeline,
          {
            status: 'pending_vendor_manual_acceptance',
            time: new Date().toISOString(),
            note: `Order manually assigned to ${vendor.name}`
          }
        ]
      });

      // Close modal
      setIsAssignVendorModalOpen(false);
      setOrderToAssign(null);
      
      // Show success notification
      setAdminAlerts(prev => [
        ...prev, 
        { 
          id: `assign-success-${orderId}`,
          type: 'success',
          message: `Order ${orderIdMap[orderId] || orderId} has been manually assigned to ${vendor.name}.`,
          autoClose: true
        }
      ]);
      
      setLoading(false);
    } catch (err) {
      console.error('Error assigning order:', err);
      
      // Show error notification
      setAdminAlerts(prev => [
        ...prev, 
        { 
          id: `assign-error-${orderId}`,
          type: 'error',
          message: `Failed to assign order: ${err.message}`,
          autoClose: true
        }
      ]);
      
      setLoading(false);
    }
  };

  // Handle sorting change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  // Handle date filter change
  const handleDateFilterChange = (filter) => {
    setDateFilter(filter);
  };

  // Handle area filter change
  const handleAreaFilterChange = (filter) => {
    setAreaFilter(filter);
  };

  // Apply date filter to orders
  const getDateFilteredOrders = (ordersList) => {
    if (dateFilter === 'all') return ordersList;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    
    const lastMonthStart = new Date(today);
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    
    return ordersList.filter(order => {
      const orderDate = new Date(order.orderDate);
      
      switch (dateFilter) {
        case 'today':
          return orderDate >= today;
        case 'yesterday':
          return orderDate >= yesterday && orderDate < today;
        case 'last7days':
          return orderDate >= lastWeekStart;
        case 'last30days':
          return orderDate >= lastMonthStart;
        case 'custom':
          const startDate = customDateRange.start ? new Date(customDateRange.start) : null;
          const endDate = customDateRange.end ? new Date(customDateRange.end) : null;
          
          if (startDate && endDate) {
            // Set end date to end of day
            endDate.setHours(23, 59, 59, 999);
            return orderDate >= startDate && orderDate <= endDate;
          } else if (startDate) {
            return orderDate >= startDate;
          } else if (endDate) {
            endDate.setHours(23, 59, 59, 999);
            return orderDate <= endDate;
          }
          return true;
        default:
          return true;
      }
    });
  };

  // Apply area filter to orders
  const getAreaFilteredOrders = (ordersList) => {
    if (areaFilter === 'all') return ordersList;
    
    return ordersList.filter(order => {
      const address = `${order.customer?.address || ''}, ${order.customer?.city || ''}, ${order.customer?.pincode || ''}`;
      return address.toLowerCase().includes(areaFilter.toLowerCase());
    });
  };

  // Sort orders based on current sort settings
  const getSortedOrders = (ordersList) => {
    return [...ordersList].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.orderDate) - new Date(b.orderDate);
          break;
        case 'amount':
          comparison = calculateAmountWithoutTax(a) - calculateAmountWithoutTax(b);
          break;
        case 'customer':
          comparison = (a.customer?.fullName || '').localeCompare(b.customer?.fullName || '');
          break;
        case 'status':
          comparison = (a.status || '').localeCompare(b.status || '');
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  // UPDATED: Filter orders based on active tab, search term, and other filters
  // This now includes filtering out empty orders
  const getFilteredOrders = () => {
    let filtered = orders.filter(order => {
      // Skip empty orders (those with no items or zero subtotal)
      if (!order.items || order.items.length === 0 || 
          calculateAmountWithoutTax(order) <= 0) {
        return false;
      }
      
      if (activeTab !== 'all' && order.status !== activeTab) {
        return false;
      }
      if (searchTerm && 
          !(orderIdMap[order.id] || '').toLowerCase().includes(searchTerm.toLowerCase()) && 
          !order.id.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !order.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    });
    
    // Apply date filtering
    filtered = getDateFilteredOrders(filtered);
    
    // Apply area filtering
    filtered = getAreaFilteredOrders(filtered);
    
    // Apply sorting
    return getSortedOrders(filtered);
  };

  // Status icon mapping
  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="status-icon pending" />;
      case 'pending_vendor_confirmation': return <AlertTriangle className="status-icon pending" />;
      case 'pending_vendor_manual_acceptance': return <AlertTriangle className="status-icon pending" />;
      case 'processing': return <RefreshCw className="status-icon processing" />;
      case 'prepared': return <Utensils className="status-icon prepared" />;
      case 'ready_for_pickup': return <Package className="status-icon ready-for-pickup" />;
      case 'delivery_assigned': return <Truck className="status-icon delivery-assigned" />;
      case 'out_for_delivery': return <Navigation className="status-icon out-for-delivery" />;
      case 'delivered': return <CheckCircle className="status-icon delivered" />;
      case 'cancelled': return <XCircle className="status-icon cancelled" />;
      default: return <Clock className="status-icon" />;
    }
  };

  // Status text formatting
  const getStatusText = (status) => {
    if (!status) return 'Unknown'; // Safeguard for undefined status
    switch(status) {
      case 'pending': return 'Pending';
      case 'pending_vendor_confirmation': return 'Awaiting Vendor Confirmation';
      case 'pending_vendor_manual_acceptance': return 'Awaiting Manual Acceptance';
      case 'processing': return 'Processing';
      case 'prepared': return 'Prepared';
      case 'ready_for_pickup': return 'Ready for Pickup';
      case 'delivery_assigned': return 'Delivery Assigned';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      case 'order_placed': return 'Order Placed';
      case 'order_confirmed': return 'Order Confirmed';
      case 'refund_initiated': return 'Refund Initiated';
      case 'refund_processed': return 'Refund Processed';
      default: return status.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
  };

  // Function to dismiss an alert
  const dismissAlert = (index) => {
    setAdminAlerts(prevAlerts => prevAlerts.filter((_, i) => i !== index));
  };

  // Export orders to CSV
  const exportOrdersCSV = () => {
    const filteredOrders = getFilteredOrders();
    
    // Define CSV headers
    const headers = [
      'Order ID',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Address',
      'Date & Time',
      'Amount',
      'Status',
      'Vendor',
      'Delivery Person',
      'Items'
    ];
    
    // Map orders to CSV rows
    const rows = filteredOrders.map(order => {
      const itemsString = order.items ? order.items
        .map(item => `${item.name} x ${item.quantity}`)
        .join('; ') : '';
      
      return [
        orderIdMap[order.id] || order.id,
        order.customer?.fullName || '',
        order.customer?.email || '',
        order.customer?.phone || '',
        `${order.customer?.address || ''}, ${order.customer?.city || ''}, ${order.customer?.pincode || ''}`,
        formatDate(order.orderDate),
        calculateAmountWithoutTax(order),
        getStatusText(order.status),
        order.vendor?.name || (order.assignedVendor?.name ? `${order.assignedVendor.name} (pending)` : ''),
        order.delivery?.partnerName || (order.deliveryPerson?.name || ''),
        itemsString
      ];
    });
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => 
        // Escape special characters in CSV
        typeof cell === 'string' ? `"${cell.replace(/"/g, '""')}"` : cell
      ).join(','))
    ].join('\n');
    
    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = getFilteredOrders();

  // Detail view for selected order
  if (selectedOrder) {
    const order = orders.find(o => o.id === selectedOrder);
    
    if (!order) return <div className="order-management">Order not found</div>;

    return (
      <div className="order-management">
        {/* Add AdminAlerts component */}
        <AdminAlerts alerts={adminAlerts} onDismiss={dismissAlert} />
        
        {/* Manual Assign Vendor Modal */}
        <AssignVendorModal 
          isOpen={isAssignVendorModalOpen}
          onClose={() => setIsAssignVendorModalOpen(false)}
          onAssign={assignOrderToVendor}
          orderId={orderToAssign}
        />
        
        <div className="order-detail-header">
          <button className="back-button" onClick={() => setSelectedOrder(null)}>
            ← Back to Orders
          </button>
          <h1>Order Details: {orderIdMap[order.id] || order.id}</h1>
          <div className="order-status-badge">
            {getStatusIcon(order.status)}
            <span>{getStatusText(order.status)}</span>
          </div>
        </div>

        <div className="order-detail-container">
          <div className="order-detail-card customer-info">
            <h2>Customer Information</h2>
            <p><strong>Name:</strong> {order.customer?.fullName}</p>
            <p><strong>Address:</strong> {`${order.customer?.address}, ${order.customer?.city}, ${order.customer?.pincode}`}</p>
            <p><strong>Email:</strong> {order.customer?.email}</p>
            <p><strong>Phone:</strong> {order.customer?.phone}</p>
            <p><strong>Order Date:</strong> {formatDate(order.orderDate)}</p>
          </div>

          <div className="order-detail-card vendor-info">
            <h2>Vendor Information</h2>
            {order.vendor ? (
              <>
                <p><strong>Name:</strong> {order.vendor.name}</p>
                <p><strong>Rating:</strong> {order.vendor.rating || 'N/A'} <Star size={14} className="star-icon" /></p>
                <p><strong>Address:</strong> {order.vendor.location?.address}</p>
              </>
            ) : order.assignedVendor ? (
              <>
                <p><strong>Name:</strong> {order.assignedVendor.name} 
                  <span className={`pending-badge ${order.status === 'pending_vendor_manual_acceptance' ? 'manual' : ''}`}>
                    ({order.status === 'pending_vendor_manual_acceptance' ? 'Awaiting manual acceptance' : 'Awaiting confirmation'})
                  </span>
                </p>
                <p><strong>Rating:</strong> {order.assignedVendor.rating || 'N/A'} <Star size={14} className="star-icon" /></p>
                <p><strong>Address:</strong> {order.assignedVendor.location?.address}</p>
                {order.assignedVendor.distanceText && (
                  <p><strong>Distance:</strong> {order.assignedVendor.distanceText}</p>
                )}
                <p><strong>Assigned At:</strong> {formatDate(order.vendorAssignedAt)}</p>
                <p><strong>Assignment Type:</strong> {order.assignmentType === 'auto' ? 'Automatic' : 'Manual'}</p>
                <p><strong>Status:</strong> <span className={`status-text ${order.assignedVendor.status === 'active' ? 'active-status' : 'inactive-status'}`}>
                  {order.assignedVendor.status === 'active' ? 'Active' : 'Inactive'}
                </span></p>
                {order.vendorAssignedAt && order.status === 'pending_vendor_confirmation' && (
                  <div className="confirmation-timer">
                    <AlertTriangle size={14} className="timer-icon" />
                    <span>Vendor must confirm within 5 minutes</span>
                  </div>
                )}
              </>
            ) : (
              <div className="no-vendor">
                <p>No vendor assigned yet. Auto-assignment in progress...</p>
                <button className="assign-vendor-button" onClick={() => openAssignVendorModal(order.id)}>
                  Manually Assign Vendor
                </button>
              </div>
            )}
          </div>

          <div className="order-detail-card delivery-info">
            <h2>Delivery Information</h2>
            {(order.delivery || order.deliveryPerson) ? (
              <>
                <p><strong>Delivery Person:</strong> {order.delivery?.partnerName || order.deliveryPerson?.name}</p>
                {(order.delivery?.partnerPhone || order.deliveryPerson?.phone) && (
                  <p><strong>Phone:</strong> {order.delivery?.partnerPhone || order.deliveryPerson?.phone}</p>
                )}
                {(order.delivery?.trackingId || order.deliveryPerson?.bookingId) && (
                  <p><strong>Tracking ID:</strong> {order.delivery?.trackingId || order.deliveryPerson?.bookingId}</p>
                )}
                {(order.delivery?.estimatedPickupTime || order.deliveryPerson?.estimatedPickupTime) && (
                  <p><strong>Est. Pickup:</strong> {formatDate(order.delivery?.estimatedPickupTime || order.deliveryPerson?.estimatedPickupTime)}</p>
                )}
                {(order.delivery?.estimatedDeliveryTime || order.deliveryPerson?.estimatedDeliveryTime) && (
                  <p><strong>Est. Delivery:</strong> {formatDate(order.delivery?.estimatedDeliveryTime || order.deliveryPerson?.estimatedDeliveryTime)}</p>
                )}
                {(order.status === 'out_for_delivery' && (order.delivery?.trackingUrl || order.deliveryPerson?.trackingUrl)) && (
                  <div className="tracking-link">
                    <a 
                      href={order.delivery?.trackingUrl || order.deliveryPerson?.trackingUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="track-button"
                    >
                      Track Live Location
                    </a>
                  </div>
                )}
              </>
            ) : (
              <p>Delivery will be assigned by the vendor when the order is ready for pickup.</p>
            )}
          </div>

          {/* Replace the existing order items table with our new component */}
          <OrderItems 
            items={order.items}
            subtotal={order.subtotal}
            deliveryCharge={order.deliveryCharge}
            // tax={order.tax}
            totalAmount={calculateAmountWithoutTax(order)} // Use amount without tax
            formatCurrency={formatCurrency}
          />

          <div className="order-detail-card order-timeline">
            <h2>Order Timeline</h2>
            <div className="timeline">
              {order.timeline?.map((event, index) => (
                event.status ? (
                  <div className="timeline-item" key={index}>
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h3>{getStatusText(event.status)}</h3>
                      <p className="timeline-time">{formatDate(event.time)}</p>
                      <p className="timeline-note">{event.note}</p>
                    </div>
                  </div>
                ) : (
                  console.warn(`Invalid timeline event at index ${index} for order ${order.id}:`, event) || null
                )
              ))}
            </div>
          </div>

          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <div className="order-actions">
              <button className="cancel-order-button" onClick={() => cancelOrder(order.id)}>
                Cancel Order & Initiate Refund
              </button>
            </div>
          )}

          {order.status === 'cancelled' && (
            <div className="refund-info order-detail-card">
              <h2>Refund Information</h2>
              <p><strong>Cancellation Reason:</strong> {order.cancellationReason || 'Not specified'}</p>
              <p><strong>Refund Status:</strong> {order.refundStatus === 'processed' ? 'Refund Processed' : 'Refund Pending'}</p>
              {order.timeline
                .filter(event => event.status && event.status.includes('refund'))
                .map((event, index) => (
                  <p key={index}><strong>{getStatusText(event.status)}:</strong> {formatDate(event.time)}</p>
                ))
              }
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main orders table view
  return (
    <div className="order-management">
      {/* Add AdminAlerts component */}
      <AdminAlerts alerts={adminAlerts} onDismiss={dismissAlert} />
      
      {/* Manual Assign Vendor Modal */}
      <AssignVendorModal 
        isOpen={isAssignVendorModalOpen}
        onClose={() => setIsAssignVendorModalOpen(false)}
        onAssign={assignOrderToVendor}
        orderId={orderToAssign}
      />
      
      <h1>Order Management</h1>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Loading orders...</div>}

      <div className="order-filters">
        <div className="search-container">
          <Search className="search-icon" />
          <input 
            type="text"
            placeholder="Search orders by ID or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-tabs">
          <button 
            className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Orders
          </button>
          <button 
            className={`filter-tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-tab ${activeTab === 'pending_vendor_confirmation' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending_vendor_confirmation')}
          >
            Awaiting Vendor
          </button>
          <button 
            className={`filter-tab ${activeTab === 'pending_vendor_manual_acceptance' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending_vendor_manual_acceptance')}
          >
            Manual Acceptance
          </button>
          <button 
            className={`filter-tab ${activeTab === 'processing' ? 'active' : ''}`}
            onClick={() => setActiveTab('processing')}
          >
            Processing
          </button>
          <button 
            className={`filter-tab ${activeTab === 'ready_for_pickup' ? 'active' : ''}`}
            onClick={() => setActiveTab('ready_for_pickup')}
          >
            Ready for Pickup
          </button>
          <button 
            className={`filter-tab ${activeTab === 'out_for_delivery' ? 'active' : ''}`}
            onClick={() => setActiveTab('out_for_delivery')}
          >
            Out for Delivery
          </button>
          <button 
            className={`filter-tab ${activeTab === 'delivered' ? 'active' : ''}`}
            onClick={() => setActiveTab('delivered')}
          >
            Delivered
          </button>
          <button 
            className={`filter-tab ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Advanced filters */}
      <div className="advanced-filters">
        <div className="filters-container">
          <div className="date-filters">
            <div className="date-filter-label">
              <Calendar size={16} />
              <span>Date Filter:</span>
            </div>
            <select 
              value={dateFilter} 
              onChange={(e) => handleDateFilterChange(e.target.value)}
              className="date-filter-select"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
            
            {dateFilter === 'custom' && (
              <div className="custom-date-range">
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) => setCustomDateRange({...customDateRange, start: e.target.value})}
                  className="date-input"
                  placeholder="Start Date"
                />
                <span>to</span>
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) => setCustomDateRange({...customDateRange, end: e.target.value})}
                  className="date-input"
                  placeholder="End Date"
                />
              </div>
            )}
          </div>
          
          <div className="area-filters">
            <div className="area-filter-label">
              <Map size={16} />
              <span>Area Filter:</span>
            </div>
            <select 
              value={areaFilter} 
              onChange={(e) => handleAreaFilterChange(e.target.value)}
              className="area-filter-select"
            >
              <option value="all">All Areas</option>
              {availableAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
          
          <div className="export-container">
            <button className="export-button" onClick={exportOrdersCSV}>
              <Download size={16} />
              Export Orders
            </button>
            
            {/* New button for cleaning up empty orders */}
            <button 
              className="cleanup-button"
              onClick={cleanupEmptyOrders}
              disabled={isCleaningUp}
              title="Find and remove empty orders"
              style={{
                marginLeft: '8px', 
                display: 'flex', 
                alignItems: 'center',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '6px 12px',
                cursor: isCleaningUp ? 'not-allowed' : 'pointer',
                opacity: isCleaningUp ? 0.7 : 1
              }}
            >
              {isCleaningUp ? (
                <RefreshCw size={16} className="spinning" style={{ marginRight: '6px' }} />
              ) : (
                <Trash2 size={16} style={{ marginRight: '6px' }} />
              )}
              Clean Up Empty Orders
            </button>
          </div>
        </div>
        
        <div className="sort-filters">
          <div className="sort-filter-label">
            <Filter size={16} />
            <span>Sort By:</span>
          </div>
          <div className="sort-options">
            <button 
              className={`sort-option ${sortBy === 'date' ? 'active' : ''}`}
              onClick={() => handleSortChange('date')}
            >
              Date
              {sortBy === 'date' && (
                sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
              )}
            </button>
            <button 
              className={`sort-option ${sortBy === 'amount' ? 'active' : ''}`}
              onClick={() => handleSortChange('amount')}
            >
              Amount
              {sortBy === 'amount' && (
                sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
              )}
            </button>
            <button 
              className={`sort-option ${sortBy === 'customer' ? 'active' : ''}`}
              onClick={() => handleSortChange('customer')}
            >
              Customer
              {sortBy === 'customer' && (
                sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
              )}
            </button>
            <button 
              className={`sort-option ${sortBy === 'status' ? 'active' : ''}`}
              onClick={() => handleSortChange('status')}
            >
              Status
              {sortBy === 'status' && (
                sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
              )}
            </button>
          </div>
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date & Time</th>
                <th>Amount</th>
                <th style={{textAlign:'center', position:'relative'}}>Vendor</th>
                <th style={{textAlign:'center', position:'relative'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className={`order-row ${order.status}`}>
                  <td className="order-id-cell">
                    <div className="order-id-with-status">
                      <Package className="order-icon" />
                      <span className="order-id-text">{orderIdMap[order.id] || order.id}</span>
                      <div className={`order-status-indicator ${order.status}`}>
                        {getStatusIcon(order.status)}
                        <span className="status-text">{getStatusText(order.status)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="customer-cell">
                    <div className="customer-name">{order.customer?.fullName}</div>
                  </td>
                  <td className="date-cell">
                    {formatDate(order.orderDate)}
                  </td>
                  <td className="amount-cell">
                    <div className="order-amount">{formatCurrency(calculateAmountWithoutTax(order))}</div>
                    <div className="items-count">{order.items?.length} items</div>
                  </td>
                  <td className="vendor-cell">
                    {order.vendor ? (
                      <div className="vendor-info">
                        <div className="vendor-name">{order.vendor.name}</div>
                      </div>
                    ) : order.assignedVendor ? (
                      <div className="vendor-info">
                        <div className="vendor-name">{order.assignedVendor.name}</div>
                        <div className="vendor-status">
                          <span className={`status-badge ${order.assignedVendor.status === 'active' ? 'active' : 'inactive'}`}>
                            {order.assignedVendor.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                          {order.status === 'pending_vendor_confirmation' && (
                            <>
                              <AlertTriangle size={14} className="awaiting-icon" />
                              <span>Awaiting confirmation</span>
                            </>
                          )}
                          {order.status === 'pending_vendor_manual_acceptance' && (
                            <>
                              <AlertTriangle size={14} className="awaiting-icon" />
                              <span>Awaiting manual acceptance</span>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <button 
                        className="assign-vendor-button small"
                        onClick={() => openAssignVendorModal(order.id)}
                      >
                        Assign Vendor
                      </button>
                    )}
                  </td>
                  
                  <td className="actions-cell">
                    <div className="order-actions-container">
                      <button 
                        className="view-details-button1"
                        onClick={() => setSelectedOrder(order.id)}
                      >
                        View Details
                      </button>
                      {(order.status === 'pending' || order.status === 'processing' || 
                        order.status === 'pending_vendor_confirmation' || 
                        order.status === 'pending_vendor_manual_acceptance') && (
                        <button 
                          className="cancel-order-button"
                          onClick={() => cancelOrder(order.id)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-orders-found">
          <p>{loading ? 'Loading...' : 'No orders found matching your criteria.'}</p>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;

  