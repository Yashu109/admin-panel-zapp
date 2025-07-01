



// import React, { useState, useEffect } from 'react';
// import { 
//   Truck, 
//   MapPin, 
//   User, 
//   Clock, 
//   Package,
//   Calendar,
//   Search,
//   Filter,
//   ChevronRight,
//   CheckCircle,
//   AlertTriangle,
//   Phone,
//   ArrowUp,
//   ArrowDown,
//   Star,
//   RefreshCw,
//   XCircle,
//   ChevronDown,
//   Navigation
// } from 'lucide-react';
// import { ref, onValue, update, get } from 'firebase/database';
// import { db } from '../firebase/config';
// import '../styles/DeliveryManagement.css';

// const DeliveryManagement = () => {
//   // State for active tab
//   const [activeTab, setActiveTab] = useState('all');
  
//   // State for search term
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // State for deliveries
//   const [deliveries, setDeliveries] = useState([]);
  
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

//   // Function to generate simplified order IDs for display
//   const generateOrderIdMap = (orders) => {
//     const idMap = {};
//     orders.forEach((order, index) => {
//       idMap[order.id] = `ORD-${index + 1}`; // e.g., ORD-1, ORD-2
//     });
//     setOrderIdMap(idMap);
//   };

//   // Fetch orders from Firebase and transform into deliveries
//   useEffect(() => {
//     const ordersRef = ref(db, 'orders');
//     const unsubscribe = onValue(ordersRef, (snapshot) => {
//       try {
//         const data = snapshot.val();
//         const ordersData = data ? Object.keys(data).map(key => ({
//           id: key,
//           ...data[key],
//           timeline: data[key].timeline || [
//             { status: 'order_placed', time: data[key].orderDate || new Date().toISOString(), note: 'Order placed successfully' }
//           ]
//         })) : [];

//         // Generate order ID mapping
//         generateOrderIdMap(ordersData);

//         // Transform orders into deliveries
//         const transformedDeliveries = ordersData
//           .filter(order => {
//             if (order.status === 'pending') return false;
//             if (!order.customer || !order.customer.fullName) {
//               console.warn(`Skipping order ${order.id}: Missing customer data`, order);
//               return false;
//             }
//             return true;
//           })
//           .map(order => {
//             let deliveryStatus;
//             if (order.status === 'cancelled') {
//               deliveryStatus = 'failed';
//             } else if (order.status === 'delivered') {
//               deliveryStatus = 'delivered';
//             } else if (order.status === 'out_for_delivery') {
//               deliveryStatus = 'in_progress';
//             } else if (order.status === 'processing' || order.status === 'prepared') {
//               deliveryStatus = 'assigned';
//             } else {
//               deliveryStatus = 'pending';
//             }

//             const assignedTime = order.timeline.find(event => event.status === 'order_confirmed')?.time || order.orderDate;
//             const pickedUpTime = order.timeline.find(event => event.status === 'out_for_delivery')?.time;
//             const deliveredTime = order.timeline.find(event => event.status === 'delivered')?.time;

//             const route = order.vendor ? {
//               distance: order.vendor.distance || '1.0 miles',
//               estimatedTime: `${Math.round(parseFloat(order.vendor.distance || 1) * 10)} minutes`
//             } : null;

//             // Integration with Porter delivery API/VendorOrdersPage
//             const deliveryPerson = order.delivery ? {
//               name: order.delivery.partnerName || 'Not Assigned',
//               phone: order.delivery.partnerPhone || 'Not Available',
//               rating: order.delivery.partnerRating || '4.5',
//               trackingId: order.delivery.trackingId || null,
//               estimatedDeliveryTime: order.delivery.estimatedDeliveryTime || null,
//               assignedAt: order.delivery.assignedAt || null
//             } : null;

//             return {
//               id: `DEL-${order.id.substring(0, 8)}`,
//               orderId: order.id,
//               displayOrderId: orderIdMap[order.id] || `ORD-${ordersData.findIndex(o => o.id === order.id) + 1}`, // Fallback in case map isn't ready
//               customerName: order.customer.fullName,
//               customerAddress: `${order.customer.address || 'N/A'}, ${order.customer.city || 'N/A'}, ${order.customer.pincode || 'N/A'}`,
//               customerPhone: order.customer.phone || 'Not provided',
//               customerEmail: order.customer.email || 'Not provided',
//               shopName: order.vendor?.name || null,
//               shopAddress: order.vendor?.location?.address || null,
//               shopPhone: order.vendor?.phone || 'Not provided',
//               items: order.items || [],
//               itemCount: order.items?.length || 0,
//               totalAmount: order.totalAmount || 0,
//               status: deliveryStatus,
//               orderStatus: order.status,
//               deliveryPerson: deliveryPerson || order.deliveryPerson || null,
//               timestamps: {
//                 orderDate: order.orderDate,
//                 assigned: assignedTime,
//                 pickedUp: pickedUpTime,
//                 delivered: deliveredTime,
//                 estimatedPickup: deliveryPerson?.estimatedPickupTime || order.deliveryPerson?.estimatedPickupTime,
//                 estimatedDelivery: deliveryPerson?.estimatedDeliveryTime || order.deliveryPerson?.estimatedDeliveryTime
//               },
//               trackingUrl: order.delivery?.trackingUrl || order.deliveryPerson?.trackingUrl,
//               bookingId: order.delivery?.trackingId || order.deliveryPerson?.bookingId,
//               deliveryNotes: order.specialInstructions || 'Contact customer upon arrival',
//               route: route,
//               failureReason: order.status === 'cancelled' ? order.cancellationReason || 'Order cancelled' : null
//             };
//           });

//         setDeliveries(transformedDeliveries);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching deliveries:', err);
//         setError('Failed to load deliveries.');
//         setDeliveries([]);
//         setLoading(false);
//       }
//     }, (err) => {
//       console.error('Error fetching deliveries:', err);
//       setError('Failed to load deliveries.');
//       setDeliveries([]);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

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

//   // Apply date filter to deliveries
//   const getDateFilteredDeliveries = (deliveriesList) => {
//     if (dateFilter === 'all') return deliveriesList;
    
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     const yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);
    
//     const lastWeekStart = new Date(today);
//     lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    
//     const lastMonthStart = new Date(today);
//     lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    
//     return deliveriesList.filter(delivery => {
//       const orderDate = new Date(delivery.timestamps.orderDate);
      
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

//   // Sort deliveries based on current sort settings
//   const getSortedDeliveries = (deliveriesList) => {
//     return [...deliveriesList].sort((a, b) => {
//       let comparison = 0;
      
//       switch (sortBy) {
//         case 'date':
//           comparison = new Date(a.timestamps.orderDate) - new Date(b.timestamps.orderDate);
//           break;
//         case 'amount':
//           comparison = a.totalAmount - b.totalAmount;
//           break;
//         case 'customer':
//           comparison = a.customerName.localeCompare(b.customerName);
//           break;
//         case 'status':
//           comparison = a.status.localeCompare(b.status);
//           break;
//         case 'shop':
//           comparison = (a.shopName || '').localeCompare(b.shopName || '');
//           break;
//         default:
//           comparison = 0;
//       }
      
//       return sortDirection === 'asc' ? comparison : -comparison;
//     });
//   };

//   // Filter deliveries based on active tab and search term
//   const getFilteredDeliveries = () => {
//     let filtered = deliveries.filter(delivery => {
//       if (activeTab !== 'all' && delivery.status !== activeTab) {
//         return false;
//       }
//       if (searchTerm && 
//           !delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) && 
//           !delivery.displayOrderId.toLowerCase().includes(searchTerm.toLowerCase()) && 
//           !delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) &&
//           !delivery.shopName?.toLowerCase().includes(searchTerm.toLowerCase())) {
//         return false;
//       }
//       return true;
//     });
    
//     // Apply date filtering
//     filtered = getDateFilteredDeliveries(filtered);
    
//     // Apply sorting
//     return getSortedDeliveries(filtered);
//   };

//   const filteredDeliveries = getFilteredDeliveries();

//   // Function to format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'Not yet';
//     const options = { 
//       year: 'numeric', 
//       month: 'short', 
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   // Function to format short date (Jun 4, 2025, 04:34 PM)
//   const formatShortDate = (dateString) => {
//     if (!dateString) return 'Not yet';
//     const options = { 
//       year: 'numeric', 
//       month: 'short', 
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return new Date(dateString).toLocaleDateString('en-US', options);
//   };

//   // Function to format currency
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0
//     }).format(amount);
//   };

//   // Function to get status text
//   const getStatusText = (status) => {
//     switch(status) {
//       case 'pending': return 'Pending';
//       case 'assigned': return 'Assigned';
//       case 'in_progress': return 'In Progress';
//       case 'delivered': return 'Delivered';
//       case 'failed': return 'Failed';
//       default: return status;
//     }
//   };

//   // Function to get status icon
//   const getStatusIcon = (status) => {
//     switch(status) {
//       case 'pending': return <Clock className="status-icon pending" size={16} />;
//       case 'assigned': return <User className="status-icon assigned" size={16} />;
//       case 'in_progress': return <Truck className="status-icon in-progress" size={16} />;
//       case 'delivered': return <CheckCircle className="status-icon delivered" size={16} />;
//       case 'failed': return <AlertTriangle className="status-icon failed" size={16} />;
//       default: return <Clock className="status-icon" size={16} />;
//     }
//   };

//   // Function to assign delivery person (integrated with VendorOrdersPage)
//   const assignDeliveryPerson = async (deliveryId) => {
//     try {
//       // Extract the orderId from deliveryId (removing 'DEL-' prefix)
//       const orderId = deliveryId.replace('DEL-', '');
      
//       // Set the order status to "assigning_delivery" first
//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, {
//         status: 'assigning_delivery'
//       });
      
//       // Simulate API call delay (would be a backend call in production)
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       // Delivery partners (same as in VendorOrdersPage)
//       const deliveryPartners = [
//         { id: 'DP001', name: 'Rahul Kumar', phone: '9876543210', rating: 4.8 },
//         { id: 'DP002', name: 'Priya Singh', phone: '9876543211', rating: 4.7 },
//         { id: 'DP003', name: 'Amit Patel', phone: '9876543212', rating: 4.9 },
//         { id: 'DP004', name: 'Neha Sharma', phone: '9876543213', rating: 4.6 },
//         { id: 'DP005', name: 'Raj Verma', phone: '9876543214', rating: 4.8 }
//       ];
      
//       // Select a random delivery partner
//       const selectedPartner = deliveryPartners[Math.floor(Math.random() * deliveryPartners.length)];
      
//       // Generate a tracking ID
//       const trackingId = 'BOOK' + Math.floor(100000 + Math.random() * 900000);
      
//       // Calculate estimated delivery time (30 min from now)
//       const estimatedDeliveryTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      
//       // Get the order to update timeline
//       const orderSnapshot = await get(orderRef);
//       if (!orderSnapshot.exists()) {
//         throw new Error('Order not found');
//       }
      
//       const orderData = orderSnapshot.val();
      
//       // Update order with delivery information
//       const updatedTimeline = [
//         ...(orderData.timeline || []),
//         {
//           status: 'delivery_assigned',
//           time: new Date().toISOString(),
//           note: `Delivery assigned to ${selectedPartner.name} - Tracking ID: ${trackingId}`
//         }
//       ];
      
//       await update(orderRef, {
//         status: 'delivery_assigned',
//         delivery: {
//           provider: 'Porter',
//           trackingId: trackingId,
//           partnerName: selectedPartner.name,
//           partnerPhone: selectedPartner.phone,
//           partnerRating: selectedPartner.rating,
//           estimatedDeliveryTime: estimatedDeliveryTime,
//           assignedAt: new Date().toISOString(),
//           trackingUrl: `https://tracking.example.com/${trackingId}`
//         },
//         timeline: updatedTimeline
//       });
      
//       // Alert success (in production, this should be a more elegant notification)
//       alert(`Delivery for ${deliveryId} assigned to ${selectedPartner.name}. Tracking ID: ${trackingId}`);
      
//     } catch (error) {
//       console.error('Error assigning delivery:', error);
//       alert(`Failed to assign delivery: ${error.message}`);
      
//       // Revert status if assignment fails
//       try {
//         const orderId = deliveryId.replace('DEL-', '');
//         const orderRef = ref(db, `orders/${orderId}`);
//         await update(orderRef, {
//           status: 'ready_for_pickup'
//         });
//       } catch (revertError) {
//         console.error('Error reverting status:', revertError);
//       }
//     }
//   };

//   // Function to mark order as out for delivery
//   const markOutForDelivery = async (deliveryId) => {
//     try {
//       const orderId = deliveryId.replace('DEL-', '');
//       const orderRef = ref(db, `orders/${orderId}`);
      
//       // Get current order data
//       const snapshot = await get(orderRef);
//       if (!snapshot.exists()) {
//         throw new Error('Order not found');
//       }
      
//       const orderData = snapshot.val();
      
//       // Update timeline
//       const updatedTimeline = [
//         ...(orderData.timeline || []),
//         {
//           status: 'out_for_delivery',
//           time: new Date().toISOString(),
//           note: 'Order is out for delivery'
//         }
//       ];
      
//       // Update order status
//       await update(orderRef, {
//         status: 'out_for_delivery',
//         outForDeliveryAt: new Date().toISOString(),
//         timeline: updatedTimeline
//       });
      
//       alert(`Order ${deliveryId} marked as out for delivery`);
      
//     } catch (error) {
//       console.error('Error updating delivery status:', error);
//       alert(`Failed to update status: ${error.message}`);
//     }
//   };

//   // Function to mark order as delivered
//   const markDelivered = async (deliveryId) => {
//     try {
//       const orderId = deliveryId.replace('DEL-', '');
//       const orderRef = ref(db, `orders/${orderId}`);
      
//       // Get current order data
//       const snapshot = await get(orderRef);
//       if (!snapshot.exists()) {
//         throw new Error('Order not found');
//       }
      
//       const orderData = snapshot.val();
      
//       // Update timeline
//       const updatedTimeline = [
//         ...(orderData.timeline || []),
//         {
//           status: 'delivered',
//           time: new Date().toISOString(),
//           note: 'Order delivered successfully'
//         }
//       ];
      
//       // Update order status
//       await update(orderRef, {
//         status: 'delivered',
//         deliveredAt: new Date().toISOString(),
//         timeline: updatedTimeline
//       });
      
//       alert(`Order ${deliveryId} marked as delivered`);
      
//     } catch (error) {
//       console.error('Error updating delivery status:', error);
//       alert(`Failed to update status: ${error.message}`);
//     }
//   };

//   return (
//     <div className="delivery-management">
//       <h1>Delivery Management</h1>
    
      
//       {error && <div className="error-message">{error}</div>}
      
//       <div className="search-container">
//         <Search className="search-icon" size={18} />
//         <input 
//           type="text"
//           placeholder="Search by delivery ID, order ID..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="search-input"
//         />
//       </div>
      
//       <div className="filter-tabs">
//         <button 
//           className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
//           onClick={() => setActiveTab('all')}
//         >
//           All Deliveries
//         </button>
//         <button 
//           className={`filter-tab ${activeTab === 'pending' ? 'active' : ''}`}
//           onClick={() => setActiveTab('pending')}
//         >
//           Pending
//         </button>
//         <button 
//           className={`filter-tab ${activeTab === 'assigned' ? 'active' : ''}`}
//           onClick={() => setActiveTab('assigned')}
//         >
//           Assigned
//         </button>
//         <button 
//           className={`filter-tab ${activeTab === 'in_progress' ? 'active' : ''}`}
//           onClick={() => setActiveTab('in_progress')}
//         >
//           In Progress
//         </button>
//         <button 
//           className={`filter-tab ${activeTab === 'delivered' ? 'active' : ''}`}
//           onClick={() => setActiveTab('delivered')}
//         >
//           Delivered
//         </button>
//         <button 
//           className={`filter-tab ${activeTab === 'failed' ? 'active' : ''}`}
//           onClick={() => setActiveTab('failed')}
//         >
//           Failed
//         </button>
//       </div>

//       <div className="filter-sort-container">
//         <div className="date-filter">
//           <span className="filter-label">
//             <Calendar size={16} />
//             Date Filter:
//           </span>
//           <select 
//             value={dateFilter} 
//             onChange={(e) => handleDateFilterChange(e.target.value)}
//             className="date-filter-select"
//           >
//             <option value="all">All Time</option>
//             <option value="today">Today</option>
//             <option value="yesterday">Yesterday</option>
//             <option value="last7days">Last 7 Days</option>
//             <option value="last30days">Last 30 Days</option>
//             <option value="custom">Custom Range</option>
//           </select>
//         </div>
        
//         <div className="sort-by">
//           <span className="sort-label">Sort By:</span>
//           <button 
//             className={`sort-button ${sortBy === 'date' ? 'active' : ''}`}
//             onClick={() => handleSortChange('date')}
//           >
//             Date {sortBy === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
//           </button>
//           <button 
//             className={`sort-button ${sortBy === 'amount' ? 'active' : ''}`}
//             onClick={() => handleSortChange('amount')}
//           >
//             Amount {sortBy === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
//           </button>
//         </div>
//       </div>
      
//       {loading ? (
//         <div className="loading-message">Loading deliveries...</div>
//       ) : filteredDeliveries.length > 0 ? (
//         <div className="deliveries-table-wrapper">
//           <table className="deliveries-table">
//             <thead>
//               <tr>
//                 <th>Delivery/Order ID</th>
//                 <th>Customer</th>
//                 <th>Date & Time</th>
//                 <th>Amount</th>
//                 <th>Pickup</th>
//                 <th>Dropoff</th>
//                 <th>Delivery Person</th>
//                 <th>Status</th>
//                 {/* <th>Actions</th> */}
//               </tr>
//             </thead>
//             <tbody>
//               {filteredDeliveries.map((delivery) => (
//                 <tr key={delivery.id} className={delivery.status === 'assigned' ? 'highlight-row' : ''}>
//                   <td className="id-cell">
//                     <div className="delivery-id-wrapper">
//                       <Truck size={16} className="delivery-icon" />
//                       <div className="id-text">
//                         <div>{delivery.id}</div>
//                         <div className="order-id">{delivery.displayOrderId}</div>
//                       </div>
//                     </div>
//                   </td>
                  
//                   <td className="customer-cell">
//                     <div className="customer-name">{delivery.customerName}</div>
//                     <div className="customer-phone">{delivery.customerPhone}</div>
//                   </td>
                  
//                   <td className="date-cell">
//                     {formatShortDate(delivery.timestamps.orderDate)}
//                   </td>
                  
//                   <td className="amount-cell">
//                     <div className="amount-wrapper">
//                       <span className="amount-value">₹{Math.round(delivery.totalAmount)}</span>
//                       <span className="items-count">{delivery.itemCount} items</span>
//                     </div>
//                   </td>
                  
//                   <td className="pickup-cell">
//                     <div className="shop-name-wrapper">
//                       {delivery.shopName ? (
//                         <>
//                           <div className="shop-name">{delivery.shopName}</div>
//                           {delivery.shopAddress && (
//                             <div className="shop-address">
//                               {delivery.shopAddress.split(' - ')[1] || delivery.shopAddress.split(',')[0] || ''}
//                             </div>
//                           )}
//                         </>
//                       ) : (
//                         <span className="no-shop">Not assigned</span>
//                       )}
//                     </div>
//                   </td>
                  
//                   <td className="dropoff-cell">
//                     {/* Modified to avoid showing tooltip on hover */}
//                     <div className="location-wrapper">
//                       <MapPin size={16} className="location-icon" />
//                       <div className="location-text">
//                         {delivery.customerAddress.split(',').slice(0, 2).map((part, index) => (
//                           <div key={index} className={index === 0 ? "address-line" : "city-line"}>
//                             {part.trim()}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </td>
                  
//                   <td className="delivery-person-cell">
//                     {delivery.deliveryPerson ? (
//                       <div className="delivery-person-wrapper">
//                         <div className="person-name">{delivery.deliveryPerson.name}</div>
//                         <div className="person-phone">{delivery.deliveryPerson.phone || '9876543210'}</div>
//                         <div className="person-rating">
//                           <Star size={14} className="star-icon" />
//                           <span>{delivery.deliveryPerson.rating || '4.5'}</span>
//                         </div>
//                         {delivery.bookingId && (
//                           <div className="booking-id">ID: {delivery.bookingId.substring(0, 8)}</div>
//                         )}
//                       </div>
//                     ) : (
//                       <button 
//                         className="assign-button"
//                         onClick={() => assignDeliveryPerson(delivery.id)}
//                       >
//                         Assign
//                       </button>
//                     )}
//                   </td>
                  
//                   <td className="status-cell">
//                     <div className={`status-badge ${delivery.status}`}>
//                       {getStatusIcon(delivery.status)}
//                       <span>{getStatusText(delivery.status)}</span>
//                     </div>
//                   </td>
                  
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="no-deliveries-found">
//           <p>No deliveries found matching your criteria.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DeliveryManagement;




import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  MapPin, 
  User, 
  Clock, 
  Package,
  Calendar,
  Search,
  Filter,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Phone,
  ArrowUp,
  ArrowDown,
  Star,
  RefreshCw,
  XCircle,
  ChevronDown,
  Navigation
} from 'lucide-react';
import { ref, onValue, update, get } from 'firebase/database';
import { db } from '../firebase/config';
import '../styles/DeliveryManagement.css';

const DeliveryManagement = () => {
  // Function to calculate amount without tax
  const calculateAmountWithoutTax = (order) => {
    return (order.subtotal || 0) + (order.deliveryCharge || 0);
  };

  // State for active tab
  const [activeTab, setActiveTab] = useState('all');
  
  // State for search term
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for deliveries
  const [deliveries, setDeliveries] = useState([]);
  
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

  // Function to generate simplified order IDs for display
  const generateOrderIdMap = (orders) => {
    const idMap = {};
    orders.forEach((order, index) => {
      idMap[order.id] = `ORD-${index + 1}`; // e.g., ORD-1, ORD-2
    });
    setOrderIdMap(idMap);
  };

  // Fetch orders from Firebase and transform into deliveries
  useEffect(() => {
    const ordersRef = ref(db, 'orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      try {
        const data = snapshot.val();
        const ordersData = data ? Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          timeline: data[key].timeline || [
            { status: 'order_placed', time: data[key].orderDate || new Date().toISOString(), note: 'Order placed successfully' }
          ]
        })) : [];

        // Generate order ID mapping
        generateOrderIdMap(ordersData);

        // Transform orders into deliveries
        const transformedDeliveries = ordersData
          .filter(order => {
            if (order.status === 'pending') return false;
            if (!order.customer || !order.customer.fullName) {
              console.warn(`Skipping order ${order.id}: Missing customer data`, order);
              return false;
            }
            return true;
          })
          .map(order => {
            let deliveryStatus;
            if (order.status === 'cancelled') {
              deliveryStatus = 'failed';
            } else if (order.status === 'delivered') {
              deliveryStatus = 'delivered';
            } else if (order.status === 'out_for_delivery') {
              deliveryStatus = 'in_progress';
            } else if (order.status === 'processing' || order.status === 'prepared') {
              deliveryStatus = 'assigned';
            } else {
              deliveryStatus = 'pending';
            }

            const assignedTime = order.timeline.find(event => event.status === 'order_confirmed')?.time || order.orderDate;
            const pickedUpTime = order.timeline.find(event => event.status === 'out_for_delivery')?.time;
            const deliveredTime = order.timeline.find(event => event.status === 'delivered')?.time;

            const route = order.vendor ? {
              distance: order.vendor.distance || '1.0 miles',
              estimatedTime: `${Math.round(parseFloat(order.vendor.distance || 1) * 10)} minutes`
            } : null;

            // Integration with Porter delivery API/VendorOrdersPage
            const deliveryPerson = order.delivery ? {
              name: order.delivery.partnerName || 'Not Assigned',
              phone: order.delivery.partnerPhone || 'Not Available',
              rating: order.delivery.partnerRating || '4.5',
              trackingId: order.delivery.trackingId || null,
              estimatedDeliveryTime: order.delivery.estimatedDeliveryTime || null,
              assignedAt: order.delivery.assignedAt || null
            } : null;

            return {
              id: `DEL-${order.id.substring(0, 8)}`,
              orderId: order.id,
              displayOrderId: orderIdMap[order.id] || `ORD-${ordersData.findIndex(o => o.id === order.id) + 1}`, // Fallback in case map isn't ready
              customerName: order.customer.fullName,
              customerAddress: `${order.customer.address || 'N/A'}, ${order.customer.city || 'N/A'}, ${order.customer.pincode || 'N/A'}`,
              customerPhone: order.customer.phone || 'Not provided',
              customerEmail: order.customer.email || 'Not provided',
              shopName: order.vendor?.name || null,
              shopAddress: order.vendor?.location?.address || null,
              shopPhone: order.vendor?.phone || 'Not provided',
              items: order.items || [],
              itemCount: order.items?.length || 0,
              totalAmount: calculateAmountWithoutTax(order), // Changed to use amount without tax
              subtotal: order.subtotal || 0,
              deliveryCharge: order.deliveryCharge || 0,
              status: deliveryStatus,
              orderStatus: order.status,
              deliveryPerson: deliveryPerson || order.deliveryPerson || null,
              timestamps: {
                orderDate: order.orderDate,
                assigned: assignedTime,
                pickedUp: pickedUpTime,
                delivered: deliveredTime,
                estimatedPickup: deliveryPerson?.estimatedPickupTime || order.deliveryPerson?.estimatedPickupTime,
                estimatedDelivery: deliveryPerson?.estimatedDeliveryTime || order.deliveryPerson?.estimatedDeliveryTime
              },
              trackingUrl: order.delivery?.trackingUrl || order.deliveryPerson?.trackingUrl,
              bookingId: order.delivery?.trackingId || order.deliveryPerson?.bookingId,
              deliveryNotes: order.specialInstructions || 'Contact customer upon arrival',
              route: route,
              failureReason: order.status === 'cancelled' ? order.cancellationReason || 'Order cancelled' : null
            };
          });

        setDeliveries(transformedDeliveries);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching deliveries:', err);
        setError('Failed to load deliveries.');
        setDeliveries([]);
        setLoading(false);
      }
    }, (err) => {
      console.error('Error fetching deliveries:', err);
      setError('Failed to load deliveries.');
      setDeliveries([]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  // Apply date filter to deliveries
  const getDateFilteredDeliveries = (deliveriesList) => {
    if (dateFilter === 'all') return deliveriesList;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    
    const lastMonthStart = new Date(today);
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    
    return deliveriesList.filter(delivery => {
      const orderDate = new Date(delivery.timestamps.orderDate);
      
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

  // Sort deliveries based on current sort settings
  const getSortedDeliveries = (deliveriesList) => {
    return [...deliveriesList].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.timestamps.orderDate) - new Date(b.timestamps.orderDate);
          break;
        case 'amount':
          comparison = a.totalAmount - b.totalAmount;
          break;
        case 'customer':
          comparison = a.customerName.localeCompare(b.customerName);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'shop':
          comparison = (a.shopName || '').localeCompare(b.shopName || '');
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  // Filter deliveries based on active tab and search term
  const getFilteredDeliveries = () => {
    let filtered = deliveries.filter(delivery => {
      if (activeTab !== 'all' && delivery.status !== activeTab) {
        return false;
      }
      if (searchTerm && 
          !delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !delivery.displayOrderId.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !delivery.shopName?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    });
    
    // Apply date filtering
    filtered = getDateFilteredDeliveries(filtered);
    
    // Apply sorting
    return getSortedDeliveries(filtered);
  };

  const filteredDeliveries = getFilteredDeliveries();

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not yet';
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to format short date (Jun 4, 2025, 04:34 PM)
  const formatShortDate = (dateString) => {
    if (!dateString) return 'Not yet';
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Function to get status text
  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'assigned': return 'Assigned';
      case 'in_progress': return 'In Progress';
      case 'delivered': return 'Delivered';
      case 'failed': return 'Failed';
      default: return status;
    }
  };

  // Function to get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="status-icon pending" size={16} />;
      case 'assigned': return <User className="status-icon assigned" size={16} />;
      case 'in_progress': return <Truck className="status-icon in-progress" size={16} />;
      case 'delivered': return <CheckCircle className="status-icon delivered" size={16} />;
      case 'failed': return <AlertTriangle className="status-icon failed" size={16} />;
      default: return <Clock className="status-icon" size={16} />;
    }
  };

  // Function to assign delivery person (integrated with VendorOrdersPage)
  const assignDeliveryPerson = async (deliveryId) => {
    try {
      // Extract the orderId from deliveryId (removing 'DEL-' prefix)
      const orderId = deliveryId.replace('DEL-', '');
      
      // Set the order status to "assigning_delivery" first
      const orderRef = ref(db, `orders/${orderId}`);
      await update(orderRef, {
        status: 'assigning_delivery'
      });
      
      // Simulate API call delay (would be a backend call in production)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Delivery partners (same as in VendorOrdersPage)
      const deliveryPartners = [
        { id: 'DP001', name: 'Rahul Kumar', phone: '9876543210', rating: 4.8 },
        { id: 'DP002', name: 'Priya Singh', phone: '9876543211', rating: 4.7 },
        { id: 'DP003', name: 'Amit Patel', phone: '9876543212', rating: 4.9 },
        { id: 'DP004', name: 'Neha Sharma', phone: '9876543213', rating: 4.6 },
        { id: 'DP005', name: 'Raj Verma', phone: '9876543214', rating: 4.8 }
      ];
      
      // Select a random delivery partner
      const selectedPartner = deliveryPartners[Math.floor(Math.random() * deliveryPartners.length)];
      
      // Generate a tracking ID
      const trackingId = 'BOOK' + Math.floor(100000 + Math.random() * 900000);
      
      // Calculate estimated delivery time (30 min from now)
      const estimatedDeliveryTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      
      // Get the order to update timeline
      const orderSnapshot = await get(orderRef);
      if (!orderSnapshot.exists()) {
        throw new Error('Order not found');
      }
      
      const orderData = orderSnapshot.val();
      
      // Update order with delivery information
      const updatedTimeline = [
        ...(orderData.timeline || []),
        {
          status: 'delivery_assigned',
          time: new Date().toISOString(),
          note: `Delivery assigned to ${selectedPartner.name} - Tracking ID: ${trackingId}`
        }
      ];
      
      await update(orderRef, {
        status: 'delivery_assigned',
        delivery: {
          provider: 'Porter',
          trackingId: trackingId,
          partnerName: selectedPartner.name,
          partnerPhone: selectedPartner.phone,
          partnerRating: selectedPartner.rating,
          estimatedDeliveryTime: estimatedDeliveryTime,
          assignedAt: new Date().toISOString(),
          trackingUrl: `https://tracking.example.com/${trackingId}`
        },
        timeline: updatedTimeline
      });
      
      // Alert success (in production, this should be a more elegant notification)
      alert(`Delivery for ${deliveryId} assigned to ${selectedPartner.name}. Tracking ID: ${trackingId}`);
      
    } catch (error) {
      console.error('Error assigning delivery:', error);
      alert(`Failed to assign delivery: ${error.message}`);
      
      // Revert status if assignment fails
      try {
        const orderId = deliveryId.replace('DEL-', '');
        const orderRef = ref(db, `orders/${orderId}`);
        await update(orderRef, {
          status: 'ready_for_pickup'
        });
      } catch (revertError) {
        console.error('Error reverting status:', revertError);
      }
    }
  };

  // Function to mark order as out for delivery
  const markOutForDelivery = async (deliveryId) => {
    try {
      const orderId = deliveryId.replace('DEL-', '');
      const orderRef = ref(db, `orders/${orderId}`);
      
      // Get current order data
      const snapshot = await get(orderRef);
      if (!snapshot.exists()) {
        throw new Error('Order not found');
      }
      
      const orderData = snapshot.val();
      
      // Update timeline
      const updatedTimeline = [
        ...(orderData.timeline || []),
        {
          status: 'out_for_delivery',
          time: new Date().toISOString(),
          note: 'Order is out for delivery'
        }
      ];
      
      // Update order status
      await update(orderRef, {
        status: 'out_for_delivery',
        outForDeliveryAt: new Date().toISOString(),
        timeline: updatedTimeline
      });
      
      alert(`Order ${deliveryId} marked as out for delivery`);
      
    } catch (error) {
      console.error('Error updating delivery status:', error);
      alert(`Failed to update status: ${error.message}`);
    }
  };

  // Function to mark order as delivered
  const markDelivered = async (deliveryId) => {
    try {
      const orderId = deliveryId.replace('DEL-', '');
      const orderRef = ref(db, `orders/${orderId}`);
      
      // Get current order data
      const snapshot = await get(orderRef);
      if (!snapshot.exists()) {
        throw new Error('Order not found');
      }
      
      const orderData = snapshot.val();
      
      // Update timeline
      const updatedTimeline = [
        ...(orderData.timeline || []),
        {
          status: 'delivered',
          time: new Date().toISOString(),
          note: 'Order delivered successfully'
        }
      ];
      
      // Update order status
      await update(orderRef, {
        status: 'delivered',
        deliveredAt: new Date().toISOString(),
        timeline: updatedTimeline
      });
      
      alert(`Order ${deliveryId} marked as delivered`);
      
    } catch (error) {
      console.error('Error updating delivery status:', error);
      alert(`Failed to update status: ${error.message}`);
    }
  };

  return (
    <div className="delivery-management">
      <h1>Delivery Management</h1>
    
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="search-container">
        <Search className="search-icon" size={18} />
        <input 
          type="text"
          placeholder="Search by delivery ID, order ID..."
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
          All Deliveries
        </button>
        <button 
          className={`filter-tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending
        </button>
        <button 
          className={`filter-tab ${activeTab === 'assigned' ? 'active' : ''}`}
          onClick={() => setActiveTab('assigned')}
        >
          Assigned
        </button>
        <button 
          className={`filter-tab ${activeTab === 'in_progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('in_progress')}
        >
          In Progress
        </button>
        <button 
          className={`filter-tab ${activeTab === 'delivered' ? 'active' : ''}`}
          onClick={() => setActiveTab('delivered')}
        >
          Delivered
        </button>
        <button 
          className={`filter-tab ${activeTab === 'failed' ? 'active' : ''}`}
          onClick={() => setActiveTab('failed')}
        >
          Failed
        </button>
      </div>

      <div className="filter-sort-container">
        <div className="date-filter">
          <span className="filter-label">
            <Calendar size={16} />
            Date Filter:
          </span>
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
        </div>
        
        <div className="sort-by">
          <span className="sort-label">Sort By:</span>
          <button 
            className={`sort-button ${sortBy === 'date' ? 'active' : ''}`}
            onClick={() => handleSortChange('date')}
          >
            Date {sortBy === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button 
            className={`sort-button ${sortBy === 'amount' ? 'active' : ''}`}
            onClick={() => handleSortChange('amount')}
          >
            Amount {sortBy === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-message">Loading deliveries...</div>
      ) : filteredDeliveries.length > 0 ? (
        <div className="deliveries-table-wrapper">
          <table className="deliveries-table">
            <thead>
              <tr>
                <th>Delivery/Order ID</th>
                <th>Customer</th>
                <th>Date & Time</th>
                <th>Amount</th>
                <th>Pickup</th>
                <th>Dropoff</th>
                <th>Status</th>
                {/* <th>Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {filteredDeliveries.map((delivery) => (
                <tr key={delivery.id} className={delivery.status === 'assigned' ? 'highlight-row' : ''}>
                  <td className="id-cell">
                    <div className="delivery-id-wrapper">
                      <Truck size={16} className="delivery-icon" />
                      <div className="id-text">
                        <div>{delivery.id}</div>
                        <div className="order-id">{delivery.displayOrderId}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="customer-cell">
                    <div className="customer-name">{delivery.customerName}</div>
                    <div className="customer-phone">{delivery.customerPhone}</div>
                  </td>
                  
                  <td className="date-cell">
                    {formatShortDate(delivery.timestamps.orderDate)}
                  </td>
                  
                  <td className="amount-cell">
                    <div className="amount-wrapper">
                      <span className="amount-value">₹{Math.round(delivery.totalAmount)}</span>
                      <span className="items-count">{delivery.itemCount} items</span>
                    </div>
                  </td>
                  
                  <td className="pickup-cell">
                    <div className="shop-name-wrapper">
                      {delivery.shopName ? (
                        <>
                          <div className="shop-name">{delivery.shopName}</div>
                          {delivery.shopAddress && (
                            <div className="shop-address">
                              {delivery.shopAddress.split(' - ')[1] || delivery.shopAddress.split(',')[0] || ''}
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="no-shop">Not assigned</span>
                      )}
                    </div>
                  </td>
                  
                  <td className="dropoff-cell">
                    {/* Modified to avoid showing tooltip on hover */}
                    <div className="location-wrapper">
                      <MapPin size={16} className="location-icon" />
                      <div className="location-text">
                        {delivery.customerAddress.split(',').slice(0, 2).map((part, index) => (
                          <div key={index} className={index === 0 ? "address-line" : "city-line"}>
                            {part.trim()}
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                  
                  
                  
                  <td className="status-cell">
                    <div className={`status-badge ${delivery.status}`}>
                      {getStatusIcon(delivery.status)}
                      <span>{getStatusText(delivery.status)}</span>
                    </div>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-deliveries-found">
          <p>No deliveries found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default DeliveryManagement;