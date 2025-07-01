



// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase/config';
// import { ref, onValue, update, get, child } from 'firebase/database';
// import '../styles/CustomerSupport.css';
// import VendorRequests from './VendorRequests';
// import { createSupportTicketNotification } from './notificationService';
// import { 
//   FaSpinner, FaInbox, FaRegCheckCircle, FaRegClock, 
//   FaExclamationTriangle, FaSearch, FaFilter, FaReply, 
//   FaTimes, FaUser, FaCalendarAlt, FaTag, FaEllipsisH,
//   FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaShoppingBag,
//   FaSortAmountDown, FaSortAmountUp, FaEye, FaTicketAlt,
//   FaUsers, FaSort, FaStore
// } from 'react-icons/fa';
// import { useLocation, useNavigate } from 'react-router-dom';

// const CustomerSupport = () => {
//   // Get query parameters
//   const location = useLocation();
//   const navigate = useNavigate();
//   const searchParams = new URLSearchParams(location.search);
//   const tabParam = searchParams.get('tab');
//   const idParam = searchParams.get('id');

//   // Tab state
//   const [activeTab, setActiveTab] = useState(tabParam || 'tickets');

//   // Support ticket states
//   const [helpRequests, setHelpRequests] = useState([]);
//   const [filteredRequests, setFilteredRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [responseText, setResponseText] = useState('');
//   const [submittingResponse, setSubmittingResponse] = useState(false);
//   const [stats, setStats] = useState({
//     total: 0,
//     open: 0,
//     inProgress: 0,
//     resolved: 0
//   });

//   // Customer list states
//   const [customers, setCustomers] = useState([]);
//   const [filteredCustomers, setFilteredCustomers] = useState([]);
//   const [customerLoading, setCustomerLoading] = useState(true);
//   const [customerError, setCustomerError] = useState('');
//   const [customerSearchTerm, setCustomerSearchTerm] = useState('');
//   const [sortBy, setSortBy] = useState('date');
//   const [sortDirection, setSortDirection] = useState('desc');
//   const [areaFilter, setAreaFilter] = useState('all');
//   const [areas, setAreas] = useState(['all']);
//   const [expandedCustomerId, setExpandedCustomerId] = useState(null);

//   // Vendor requests states
//   const [vendorRequestsLoading, setVendorRequestsLoading] = useState(true);

//   // State to track tickets we've already notified about
//   const [notifiedTickets, setNotifiedTickets] = useState([]);

//   // Extract area from address
//   const extractArea = (address) => {
//     if (!address) return 'Unknown';

//     const parts = address.split(',');
//     if (parts.length >= 2) {
//       return parts[1].trim();
//     } else if (parts.length === 1) {
//       return parts[0].trim();
//     }
//     return 'Unknown';
//   };

//   // Update URL when tab changes
//   useEffect(() => {
//     // Update URL without refreshing the page
//     const params = new URLSearchParams(location.search);
//     params.set('tab', activeTab);
//     navigate(`${location.pathname}?${params.toString()}`, { replace: true });
//   }, [activeTab, navigate, location.pathname]);

//   // Set selected request from URL when component loads
//   useEffect(() => {
//     if (idParam && activeTab === 'tickets') {
//       setSelectedRequest(idParam);
//     }
//   }, [idParam, activeTab]);

//   // Fetch help requests from Firebase
//   useEffect(() => {
//     const helpRef = ref(db, 'help');

//     const unsubscribe = onValue(helpRef, (snapshot) => {
//       setLoading(true);
//       if (snapshot.exists()) {
//         const helpData = [];
//         snapshot.forEach((childSnapshot) => {
//           const helpId = childSnapshot.key;
//           const helpDetails = childSnapshot.val();
//           helpData.push({ id: helpId, ...helpDetails });
//         });

//         // Sort by submission date (newest first)
//         helpData.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

//         // Check for new tickets and create notifications
//         checkForNewTickets(helpData);

//         setHelpRequests(helpData);
//         setFilteredRequests(helpData);

//         // Calculate stats
//         const statsData = {
//           total: helpData.length,
//           open: helpData.filter(item => item.status === 'open').length,
//           inProgress: helpData.filter(item => item.status === 'in-progress').length,
//           resolved: helpData.filter(item => item.status === 'resolved').length
//         };
//         setStats(statsData);

//         // Select specific request if ID is in URL
//         if (idParam && activeTab === 'tickets') {
//           const request = helpData.find(req => req.id === idParam);
//           if (request) {
//             setSelectedRequest(request);
//           }
//         }
//       } else {
//         setHelpRequests([]);
//         setFilteredRequests([]);
//         setStats({
//           total: 0,
//           open: 0,
//           inProgress: 0,
//           resolved: 0
//         });
//       }
//       setLoading(false);
//     }, (error) => {
//       console.error('Error fetching help requests:', error);
//       setLoading(false);
//     });

//     // Cleanup function
//     return () => unsubscribe();
//   }, [idParam, activeTab, notifiedTickets]);

//   // Check for new tickets and create notifications
//   const checkForNewTickets = (ticketsData) => {
//     // Get requests that we haven't notified about yet
//     const newTickets = ticketsData.filter(ticket => 
//       !notifiedTickets.includes(ticket.id) && 
//       ticket.status === 'open'
//     );

//     if (newTickets.length > 0) {
//       // Create notifications for new tickets
//       newTickets.forEach(ticket => {
//         console.log("Creating notification for new support ticket:", ticket.id);

//         // Get priority level based on issue type and time elapsed
//         const priority = getPriorityLevel(ticket);

//         createSupportTicketNotification(ticket.id, {
//           customerName: ticket.customerName || 'Customer',
//           issueType: ticket.issueType || 'General Issue',
//           customerNote: ticket.customerNote || '',
//           priority: priority.level
//         });
//       });

//       // Update the list of notified tickets
//       setNotifiedTickets(prev => [
//         ...prev, 
//         ...newTickets.map(ticket => ticket.id)
//       ]);
//     }
//   };

//   // Fetch customers from Firebase
//   useEffect(() => {
//     const ordersRef = ref(db, 'orders');

//     const unsubscribe = onValue(ordersRef, (snapshot) => {
//       setCustomerLoading(true);
//       try {
//         if (snapshot.exists()) {
//           const ordersData = snapshot.val();
//           const customersData = {};
//           const uniqueAreas = new Set(['all']);

//           // Process orders to extract customer information
//           Object.keys(ordersData).forEach(key => {
//             const order = ordersData[key];

//             if (order.customer && order.customer.fullName) {
//               const customerEmail = order.customer.email || 'unknown';
//               const area = extractArea(order.customer.address);
//               uniqueAreas.add(area);

//               // If customer already exists, add this order to their orders array
//               if (customersData[customerEmail]) {
//                 customersData[customerEmail].orders.push({
//                   id: key,
//                   date: order.orderDate,
//                   items: order.items || [],
//                   totalAmount: order.totalAmount || 0,
//                   status: order.status
//                 });
//               } else {
//                 // Create new customer entry
//                 customersData[customerEmail] = {
//                   id: customerEmail,
//                   name: order.customer.fullName,
//                   email: customerEmail,
//                   phone: order.customer.phone || 'Not provided',
//                   address: order.customer.address || 'N/A',
//                   area: area,
//                   pincode: order.customer.pincode || 'N/A',
//                   orders: [{
//                     id: key,
//                     date: order.orderDate,
//                     items: order.items || [],
//                     totalAmount: order.totalAmount || 0,
//                     status: order.status
//                   }]
//                 };
//               }
//             }
//           });

//           // Convert customers object to array and sort by most recent order
//           const customersArray = Object.values(customersData).map(customer => {
//             // Sort customer's orders by date (newest first)
//             const sortedOrders = [...customer.orders].sort((a, b) => 
//               new Date(b.date) - new Date(a.date)
//             );

//             // Calculate total spent
//             const totalSpent = customer.orders.reduce((sum, order) => 
//               sum + (order.totalAmount || 0), 0
//             );

//             // Calculate total orders
//             const totalOrders = customer.orders.length;

//             // Get last order date
//             const lastOrderDate = sortedOrders[0]?.date || '';

//             return {
//               ...customer,
//               orders: sortedOrders,
//               totalSpent,
//               totalOrders,
//               lastOrderDate
//             };
//           });

//           setCustomers(customersArray);
//           setFilteredCustomers(customersArray);
//           setAreas(Array.from(uniqueAreas));
//         } else {
//           setCustomers([]);
//           setFilteredCustomers([]);
//         }
//       } catch (err) {
//         console.error('Error fetching customers:', err);
//         setCustomerError('Failed to load customers data.');
//         setCustomers([]);
//         setFilteredCustomers([]);
//       } finally {
//         setCustomerLoading(false);
//       }
//     }, (err) => {
//       console.error('Error fetching customers:', err);
//       setCustomerError('Failed to load customers data.');
//       setCustomerLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Apply filters for support tickets
//   useEffect(() => {
//     let filtered = [...helpRequests];

//     // Apply status filter
//     if (statusFilter !== 'all') {
//       filtered = filtered.filter(request => request.status === statusFilter);
//     }

//     // Apply search filter
//     if (searchTerm.trim() !== '') {
//       const searchLower = searchTerm.toLowerCase();
//       filtered = filtered.filter(request => 
//         (request.customerNote && request.customerNote.toLowerCase().includes(searchLower)) ||
//         (request.orderId && request.orderId.toLowerCase().includes(searchLower)) ||
//         (request.issueType && request.issueType.toLowerCase().includes(searchLower))
//       );
//     }

//     setFilteredRequests(filtered);
//   }, [searchTerm, statusFilter, helpRequests]);

//   // Apply filters and sorting for customers
//   useEffect(() => {
//     let filtered = [...customers];

//     // Apply area filter
//     if (areaFilter !== 'all') {
//       filtered = filtered.filter(customer => customer.area === areaFilter);
//     }

//     // Apply search filter
//     if (customerSearchTerm.trim() !== '') {
//       const searchLower = customerSearchTerm.toLowerCase();
//       filtered = filtered.filter(customer => 
//         (customer.name && customer.name.toLowerCase().includes(searchLower)) ||
//         (customer.email && customer.email.toLowerCase().includes(searchLower)) ||
//         (customer.phone && customer.phone.toLowerCase().includes(searchLower)) ||
//         (customer.address && customer.address.toLowerCase().includes(searchLower))
//       );
//     }

//     // Apply sorting
//     filtered.sort((a, b) => {
//       let comparison = 0;

//       switch (sortBy) {
//         case 'date':
//           comparison = new Date(b.lastOrderDate) - new Date(a.lastOrderDate);
//           break;
//         case 'area':
//           comparison = a.area.localeCompare(b.area);
//           break;
//         case 'customer':
//           comparison = a.name.localeCompare(b.name);
//           break;
//         case 'amount':
//           comparison = b.totalSpent - a.totalSpent;
//           break;
//         case 'orders':
//           comparison = b.totalOrders - a.totalOrders;
//           break;
//         default:
//           comparison = 0;
//       }

//       return sortDirection === 'asc' ? -comparison : comparison;
//     });

//     setFilteredCustomers(filtered);
//   }, [customers, customerSearchTerm, areaFilter, sortBy, sortDirection]);

//   // Handle search input change for tickets
//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   // Handle search input change for customers
//   const handleCustomerSearchChange = (e) => {
//     setCustomerSearchTerm(e.target.value);
//   };

//   // Handle status filter change
//   const handleStatusFilterChange = (status) => {
//     setStatusFilter(status);
//   };

//   // Handle tab change
//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     // Clear selected request when changing tabs
//     setSelectedRequest(null);
//   };

//   // Handle sort change
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

//   // View request details
//   const viewRequestDetails = (request) => {
//     setSelectedRequest(request);
//     setResponseText('');

//     // Update URL
//     const params = new URLSearchParams(location.search);
//     params.set('tab', 'tickets');
//     params.set('id', request.id);
//     navigate(`${location.pathname}?${params.toString()}`, { replace: true });
//   };

//   // Close request details
//   const closeRequestDetails = () => {
//     setSelectedRequest(null);
//     setResponseText('');

//     // Update URL
//     const params = new URLSearchParams(location.search);
//     params.delete('id');
//     navigate(`${location.pathname}?${params.toString()}`, { replace: true });
//   };

//   // Update request status
//   const updateRequestStatus = async (requestId, newStatus) => {
//     try {
//       const requestRef = ref(db, `help/${requestId}`);
//       await update(requestRef, {
//         status: newStatus,
//         lastUpdated: new Date().toISOString()
//       });

//       // Update local state
//       if (selectedRequest && selectedRequest.id === requestId) {
//         setSelectedRequest(prev => ({
//           ...prev,
//           status: newStatus,
//           lastUpdated: new Date().toISOString()
//         }));
//       }
//     } catch (error) {
//       console.error('Error updating status:', error);
//       alert('Failed to update status. Please try again.');
//     }
//   };

//   // Submit admin response
//   const submitResponse = async () => {
//     if (!responseText.trim() || !selectedRequest) return;

//     setSubmittingResponse(true);

//     try {
//       const requestRef = ref(db, `help/${selectedRequest.id}`);

//       // Get current responses or initialize empty array
//       const requestSnapshot = await get(child(ref(db), `help/${selectedRequest.id}`));
//       const currentData = requestSnapshot.val() || {};
//       const currentResponses = currentData.adminResponses || [];

//       // Add new response
//       const newResponse = {
//         text: responseText.trim(),
//         timestamp: new Date().toISOString(),
//         adminName: 'Admin' // You can replace with actual admin name if you have authentication
//       };

//       const updatedResponses = [...currentResponses, newResponse];

//       // Update in Firebase
//       await update(requestRef, {
//         adminResponses: updatedResponses,
//         status: 'in-progress',
//         lastUpdated: new Date().toISOString()
//       });

//       // Update local state
//       setSelectedRequest(prev => ({
//         ...prev,
//         adminResponses: updatedResponses,
//         status: 'in-progress',
//         lastUpdated: new Date().toISOString()
//       }));

//       setResponseText('');
//     } catch (error) {
//       console.error('Error submitting response:', error);
//       alert('Failed to submit response. Please try again.');
//     } finally {
//       setSubmittingResponse(false);
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleString('en-IN', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Format short date (without time)
//   const formatShortDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // Format currency
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0
//     }).format(amount);
//   };

//   // Get status badge class
//   const getStatusBadgeClass = (status) => {
//     switch (status) {
//       case 'open':
//         return 'status-badge status-open';
//       case 'in-progress':
//         return 'status-badge status-progress';
//       case 'resolved':
//         return 'status-badge status-resolved';
//       default:
//         return 'status-badge';
//     }
//   };

//   // Get priority level based on issue type and time elapsed
//   const getPriorityLevel = (request) => {
//     // Define high priority issues
//     const highPriorityIssues = [
//       'Quality Issues with Meat',
//       'Order Delayed'
//     ];

//     // Check if it's a high priority issue type
//     const isHighPriorityIssue = highPriorityIssues.includes(request.issueType);

//     // Calculate hours elapsed since submission
//     const submittedDate = new Date(request.submittedAt);
//     const currentDate = new Date();
//     const hoursElapsed = (currentDate - submittedDate) / (1000 * 60 * 60);

//     // Determine priority based on criteria
//     if (isHighPriorityIssue || hoursElapsed > 24) {
//       return { level: 'high', class: 'priority-high' };
//     } else if (hoursElapsed > 12) {
//       return { level: 'medium', class: 'priority-medium' };
//     } else {
//       return { level: 'normal', class: 'priority-normal' };
//     }
//   };

//   // Get request age in hours
//   const getRequestAge = (dateString) => {
//     const submittedDate = new Date(dateString);
//     const currentDate = new Date();
//     const hoursElapsed = (currentDate - submittedDate) / (1000 * 60 * 60);

//     if (hoursElapsed < 1) {
//       return 'Just now';
//     } else if (hoursElapsed < 24) {
//       return `${Math.floor(hoursElapsed)}h ago`;
//     } else {
//       return `${Math.floor(hoursElapsed / 24)}d ago`;
//     }
//   };

//   // Toggle expanded customer details
//   const toggleExpandCustomer = (customerId) => {
//     if (expandedCustomerId === customerId) {
//       setExpandedCustomerId(null);
//     } else {
//       setExpandedCustomerId(customerId);
//     }
//   };

//   // Render loading state for support tickets
//   if (loading && helpRequests.length === 0 && activeTab === 'tickets') {
//     return (
//       <div className="customer-support-loading">
//         <FaSpinner className="loading-spinner" />
//         <p>Loading support requests...</p>
//       </div>
//     );
//   }

//   // Render loading state for customers
//   if (customerLoading && customers.length === 0 && activeTab === 'customers') {
//     return (
//       <div className="customer-support-loading">
//         <FaSpinner className="loading-spinner" />
//         <p>Loading customers data...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="customer-support-page">
//       <div className="customer-support-container">
//         <div className="support-header">
//           <h1>Customer Support Dashboard</h1>
//           <div style={{top:'5px', position:'relative'}} className="gradient-line">
//             <div className="gradient-segment segment-3"></div>
//           </div>
//         </div>

//         {/* Tab Navigation */}
//         <div className="tabs-header">
//           <button 
//             className={`tab-button ${activeTab === 'tickets' ? 'active' : ''}`}
//             onClick={() => handleTabChange('tickets')}
//           >
//             <FaTicketAlt /> Support Tickets
//           </button>
//           <button 
//             className={`tab-button ${activeTab === 'customers' ? 'active' : ''}`}
//             onClick={() => handleTabChange('customers')}
//           >
//             <FaUsers /> Customer List
//           </button>
//           <button 
//             className={`tab-button ${activeTab === 'vendor_requests' ? 'active' : ''}`}
//             onClick={() => handleTabChange('vendor_requests')}
//           >
//             <FaStore /> Vendor Requests
//           </button>
//         </div>

//         {/* Support Tickets Tab */}
//         {activeTab === 'tickets' && (
//           <>
//             {/* Stats Cards */}
//             <div className="support-stats">
//               <div className="stat-card">
//                 <div className="stat-icon total-icon">
//                   <FaInbox />
//                 </div>
//                 <div className="stat-info">
//                   <h3>{stats.total}</h3>
//                   <p>Total Tickets</p>
//                 </div>
//               </div>

//               <div className="stat-card">
//                 <div className="stat-icon open-icon">
//                   <FaExclamationTriangle />
//                 </div>
//                 <div className="stat-info">
//                   <h3>{stats.open}</h3>
//                   <p>Open Tickets</p>
//                 </div>
//               </div>

//               <div className="stat-card">
//                 <div className="stat-icon progress-icon">
//                   <FaRegClock />
//                 </div>
//                 <div className="stat-info">
//                   <h3>{stats.inProgress}</h3>
//                   <p>In Progress</p>
//                 </div>
//               </div>

//               <div className="stat-card">
//                 <div className="stat-icon resolved-icon">
//                   <FaRegCheckCircle />
//                 </div>
//                 <div className="stat-info">
//                   <h3>{stats.resolved}</h3>
//                   <p>Resolved</p>
//                 </div>
//               </div>
//             </div>

//             {/* Search and Filters */}
//             <div className="support-filters">
//               <div className="search-container">
//                 <FaSearch className="search-icon" />
//                 <input
//                   type="text"
//                   placeholder="Search by order ID, issue type or keywords..."
//                   value={searchTerm}
//                   onChange={handleSearchChange}
//                   className="search-input"
//                 />
//               </div>

//               <div className="status-filters">
//                 <button
//                   className={`filter-button ${statusFilter === 'all' ? 'active' : ''}`}
//                   onClick={() => handleStatusFilterChange('all')}
//                 >
//                   All
//                 </button>
//                 <button
//                   className={`filter-button ${statusFilter === 'open' ? 'active' : ''}`}
//                   onClick={() => handleStatusFilterChange('open')}
//                 >
//                   Open
//                 </button>
//                 <button
//                   className={`filter-button ${statusFilter === 'in-progress' ? 'active' : ''}`}
//                   onClick={() => handleStatusFilterChange('in-progress')}
//                 >
//                   In Progress
//                 </button>
//                 <button
//                   className={`filter-button ${statusFilter === 'resolved' ? 'active' : ''}`}
//                   onClick={() => handleStatusFilterChange('resolved')}
//                 >
//                   Resolved
//                 </button>
//               </div>
//             </div>

//             {/* Support Tickets List */}
//             <div className="support-tickets-container">
//               <div className="tickets-header">
//                 <h2>Support Tickets ({filteredRequests.length})</h2>
//               </div>

//               {filteredRequests.length === 0 ? (
//                 <div className="no-tickets">
//                   <p>No support tickets match your criteria.</p>
//                 </div>
//               ) : (
//                 <div className="tickets-list">
//                   {filteredRequests.map(request => {
//                     const priority = getPriorityLevel(request);
//                     return (
//                       <div 
//                         key={request.id} 
//                         className={`ticket-item ${priority.class}`}
//                         onClick={() => viewRequestDetails(request)}
//                       >
//                         <div className="ticket-priority-indicator"></div>

//                         <div className="ticket-main-info">
//                           <div className="ticket-header">
//                             <h3>Order #{request.orderId}</h3>
//                             <span className={getStatusBadgeClass(request.status)}>
//                               {request.status === 'open' ? 'Open' : 
//                                request.status === 'in-progress' ? 'In Progress' : 'Resolved'}
//                             </span>
//                           </div>

//                           <div className="ticket-issue">
//                             <span className="issue-type">{request.issueType}</span>
//                             <span className="ticket-time">{getRequestAge(request.submittedAt)}</span>
//                           </div>

//                           {request.customerNote && (
//                             <p className="ticket-note">
//                               {request.customerNote.length > 100 
//                                 ? `${request.customerNote.substring(0, 100)}...` 
//                                 : request.customerNote}
//                             </p>
//                           )}
//                         </div>

//                         <div className="ticket-responses">
//                           <span className="response-count">
//                             {request.adminResponses ? request.adminResponses.length : 0} responses
//                           </span>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </>
//         )}

//         {/* Customers Tab */}
//         {activeTab === 'customers' && (
//           <div className="customer-list-wrapper">
//             {customerError && <div className="error-message">{customerError}</div>}

//             <div className="customer-filters">
//               <div className="search-container">
//                 <FaSearch className="search-icon" />
//                 <input
//                   type="text"
//                   placeholder="Search by name, email, phone or address..."
//                   value={customerSearchTerm}
//                   onChange={handleCustomerSearchChange}
//                   className="search-input"
//                 />
//               </div>

//               <div className="area-filter">
//                 <label><FaMapMarkerAlt /> Area:</label>
//                 <select 
//                   value={areaFilter} 
//                   onChange={(e) => setAreaFilter(e.target.value)}
//                   className="area-select"
//                 >
//                   {areas.map((area, index) => (
//                     <option key={index} value={area}>
//                       {area === 'all' ? 'All Areas' : area}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="sort-controls">
//               <span>Sort by:</span>
//               <button 
//                 className={`sort-button ${sortBy === 'date' ? 'active' : ''}`}
//                 onClick={() => handleSortChange('date')}
//               >
//                 Last Order Date {sortBy === 'date' && (
//                   sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
//                 )}
//               </button>
//               <button 
//                 className={`sort-button ${sortBy === 'area' ? 'active' : ''}`}
//                 onClick={() => handleSortChange('area')}
//               >
//                 Area {sortBy === 'area' && (
//                   sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
//                 )}
//               </button>

//               <button 
//                 className={`sort-button ${sortBy === 'amount' ? 'active' : ''}`}
//                 onClick={() => handleSortChange('amount')}
//               >
//                 Total Spent {sortBy === 'amount' && (
//                   sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
//                 )}
//               </button>
//               <button 
//                 className={`sort-button ${sortBy === 'orders' ? 'active' : ''}`}
//                 onClick={() => handleSortChange('orders')}
//               >
//                 Orders Count {sortBy === 'orders' && (
//                   sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
//                 )}
//               </button>
//             </div>

//             <div className="customers-header">
//               <h2>Customer List ({filteredCustomers.length})</h2>
//             </div>

//             {filteredCustomers.length === 0 ? (
//               <div className="no-customers">
//                 <p>No customers found matching your criteria.</p>
//               </div>
//             ) : (
//               <div className="customers-list">
//                 {filteredCustomers.map(customer => (
//                   <div key={customer.id} className="customer-card">
//                     <div className="customer-card-header">
//                       <div className="customer-name-container">
//                         <FaUser className="customer-icon" />
//                         <h3>{customer.name}</h3>
//                       </div>
//                       <button 
//                         className="view-details-button"
//                         onClick={() => toggleExpandCustomer(customer.id)}
//                       >
//                         <FaEye /> {expandedCustomerId === customer.id ? 'Hide Details' : 'View Details'}
//                       </button>
//                     </div>

//                     <div className="customer-info-grid">
//                       <div className="customer-info-item">
//                         <FaPhoneAlt className="info-icon" />
//                         <span>{customer.phone}</span>
//                       </div>

//                       <div className="customer-info-item">
//                         <FaEnvelope className="info-icon" />
//                         <span>{customer.email}</span>
//                       </div>

//                       <div className="customer-info-item">
//                         <FaMapMarkerAlt className="info-icon" />
//                         <span>{customer.area}</span>
//                       </div>

//                       <div className="customer-info-item">
//                         <FaShoppingBag className="info-icon" />
//                         <span>{customer.totalOrders} orders</span>
//                       </div>

//                       <div className="customer-info-item">
//                         <strong>Total Spent:</strong>
//                         <span>{formatCurrency(customer.totalSpent)}</span>
//                       </div>

//                       <div className="customer-info-item">
//                         <FaCalendarAlt className="info-icon" />
//                         <span>Last order: {formatShortDate(customer.lastOrderDate)}</span>
//                       </div>
//                     </div>

//                     <div className="customer-address">
//                       <FaMapMarkerAlt className="address-icon" />
//                       <span>{customer.address}</span>
//                     </div>

//                     {expandedCustomerId === customer.id && (
//                       <div className="customer-orders">
//                         <h4>Order History ({customer.orders.length})</h4>

//                         <div className="orders-list">
//                           {customer.orders.map((order, index) => (
//                             <div key={index} className="order-item">
//                               <div className="order-header">
//                                 <div className="order-id">Order #{order.id.substring(0, 8)}</div>
//                                 <div className="order-date">{formatShortDate(order.date)}</div>
//                                 <div className="order-amount">{formatCurrency(order.totalAmount)}</div>
//                                 <div className={`order-status status-${order.status}`}>
//                                   {order.status}
//                                 </div>
//                               </div>

//                               <div className="order-items">
//                                 {order.items && order.items.length > 0 ? (
//                                   <table className="items-table">
//                                     <thead>
//                                       <tr>
//                                         <th>Item</th>
//                                         <th>Quantity</th>
//                                         <th>Price</th>
//                                       </tr>
//                                     </thead>
//                                     <tbody>
//                                       {order.items.map((item, itemIndex) => (
//                                         <tr key={itemIndex}>
//                                           <td>{item.name}</td>
//                                           <td>{item.quantity}</td>
//                                           <td>{formatCurrency(item.price * item.quantity)}</td>
//                                         </tr>
//                                       ))}
//                                     </tbody>
//                                   </table>
//                                 ) : (
//                                   <p className="no-items">No items information available</p>
//                                 )}
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Vendor Requests Tab */}
//         {activeTab === 'vendor_requests' && (
//           <VendorRequests />
//         )}
//       </div>

//       {/* Request Details Modal */}
//       {selectedRequest && activeTab === 'tickets' && (
//         <div className="request-details-modal">
//           <div className="request-details-container">
//             <div className="request-details-header">
//               <div>
//                 <h2>Support Ticket #{selectedRequest.id.substring(0, 8)}</h2>
//                 <p>Order #{selectedRequest.orderId}</p>
//               </div>
//               <button className="close-details-button" onClick={closeRequestDetails}>
//                 <FaTimes />
//               </button>
//             </div>

//             <div className="request-details-content">
//               <div className="request-info-section">
//                 <div className="request-info-item">
//                   <span className="info-label"><FaUser /> Customer:</span>
//                   <span className="info-value">
//                     {selectedRequest.customerName || 'Anonymous Customer'}
//                   </span>
//                 </div>

//                 <div className="request-info-item">
//                   <span className="info-label"><FaCalendarAlt /> Submitted:</span>
//                   <span className="info-value">
//                     {formatDate(selectedRequest.submittedAt)}
//                   </span>
//                 </div>

//                 <div className="request-info-item">
//                   <span className="info-label"><FaTag /> Issue Type:</span>
//                   <span className="info-value">
//                     {selectedRequest.issueType}
//                   </span>
//                 </div>

//                 <div className="request-info-item">
//                   <span className="info-label">Status:</span>
//                   <span className={getStatusBadgeClass(selectedRequest.status)}>
//                     {selectedRequest.status === 'open' ? 'Open' : 
//                      selectedRequest.status === 'in-progress' ? 'In Progress' : 'Resolved'}
//                   </span>
//                 </div>
//               </div>

//               {selectedRequest.customerNote && (
//                 <div className="customer-note-section">
//                   <h3>Customer Note:</h3>
//                   <p className="customer-note">{selectedRequest.customerNote}</p>
//                 </div>
//               )}

//               <div className="request-items-section">
//                 <h3>Order Items:</h3>
//                 {selectedRequest.items && selectedRequest.items.length > 0 ? (
//                   <div className="order-items-list">
//                     {selectedRequest.items.map((item, index) => (
//                       <div key={index} className="order-item">
//                         <span className="item-name">{item.name}</span>
//                         <span className="item-quantity">x{item.quantity}</span>
//                         <span className="item-price">₹{item.price * item.quantity}</span>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="no-items">No items information available</p>
//                 )}
//               </div>

//               <div className="conversation-section">
//                 <h3>Conversation:</h3>

//                 {/* Initial request */}
//                 <div className="conversation-item customer">
//                   <div className="message-header">
//                     <span className="sender">Customer</span>
//                     <span className="timestamp">{formatDate(selectedRequest.submittedAt)}</span>
//                   </div>
//                   <div className="message-content">
//                     <p>
//                       {selectedRequest.customerNote || `Issue reported: ${selectedRequest.issueType}`}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Admin responses */}
//                 {selectedRequest.adminResponses && selectedRequest.adminResponses.map((response, index) => (
//                   <div key={index} className="conversation-item admin">
//                     <div className="message-header">
//                       <span className="sender">{response.adminName || 'Admin'}</span>
//                       <span className="timestamp">{formatDate(response.timestamp)}</span>
//                     </div>
//                     <div className="message-content">
//                       <p>{response.text}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Response Form */}
//               <div className="response-form">
//                 <h3>Add Response:</h3>
//                 <textarea
//                   className="response-textarea"
//                   placeholder="Type your response to the customer..."
//                   value={responseText}
//                   onChange={(e) => setResponseText(e.target.value)}
//                   rows={4}
//                 ></textarea>

//                 <div className="response-actions">
//                   <div className="status-update-buttons">
//                     <button 
//                       className="status-button open"
//                       onClick={() => updateRequestStatus(selectedRequest.id, 'open')}
//                       disabled={selectedRequest.status === 'open'}
//                     >
//                       Mark as Open
//                     </button>
//                     <button 
//                       className="status-button progress"
//                       onClick={() => updateRequestStatus(selectedRequest.id, 'in-progress')}
//                       disabled={selectedRequest.status === 'in-progress'}
//                     >
//                       Mark In Progress
//                     </button>
//                     <button 
//                       className="status-button resolved"
//                       onClick={() => updateRequestStatus(selectedRequest.id, 'resolved')}
//                       disabled={selectedRequest.status === 'resolved'}
//                     >
//                       Mark Resolved
//                     </button>
//                   </div>

//                   <button 
//                     className="send-response-button"
//                     onClick={submitResponse}
//                     disabled={!responseText.trim() || submittingResponse}
//                   >
//                     <FaReply /> {submittingResponse ? 'Sending...' : 'Send Response'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomerSupport;


import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { ref, onValue, update, get, child } from 'firebase/database';
import '../styles/CustomerSupport.css';
import VendorRequests from './VendorRequests';
import { createSupportTicketNotification } from './notificationService';
import {
  FaSpinner, FaInbox, FaRegCheckCircle, FaRegClock,
  FaExclamationTriangle, FaSearch, FaFilter, FaReply,
  FaTimes, FaUser, FaCalendarAlt, FaTag, FaEllipsisH,
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaShoppingBag,
  FaSortAmountDown, FaSortAmountUp, FaEye, FaTicketAlt,
  FaUsers, FaSort, FaStore, FaHandshake
} from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import MerchantCollaboration from './MerchantCollaboration';

const CustomerSupport = () => {
  // Get query parameters
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab');
  const idParam = searchParams.get('id');

  // Tab state
  const [activeTab, setActiveTab] = useState(tabParam || 'tickets');

  // Support ticket states
  const [helpRequests, setHelpRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [responseText, setResponseText] = useState('');
  const [submittingResponse, setSubmittingResponse] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0
  });

  // Customer list states
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [customerLoading, setCustomerLoading] = useState(true);
  const [customerError, setCustomerError] = useState('');
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [areaFilter, setAreaFilter] = useState('all');
  const [areas, setAreas] = useState(['all']);
  const [expandedCustomerId, setExpandedCustomerId] = useState(null);

  // Vendor requests states
  const [vendorRequestsLoading, setVendorRequestsLoading] = useState(true);

  // State to track tickets we've already notified about
  const [notifiedTickets, setNotifiedTickets] = useState([]);

  // Extract area from address
  const extractArea = (address) => {
    if (!address) return 'Unknown';

    const parts = address.split(',');
    if (parts.length >= 2) {
      return parts[1].trim();
    } else if (parts.length === 1) {
      return parts[0].trim();
    }
    return 'Unknown';
  };

  // Update URL when tab changes
  useEffect(() => {
    // Update URL without refreshing the page
    const params = new URLSearchParams(location.search);
    params.set('tab', activeTab);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [activeTab, navigate, location.pathname]);

  // Set selected request from URL when component loads
  useEffect(() => {
    if (idParam && activeTab === 'tickets') {
      setSelectedRequest(idParam);
    }
  }, [idParam, activeTab]);

  // Fetch help requests from Firebase
  useEffect(() => {
    const helpRef = ref(db, 'help');

    const unsubscribe = onValue(helpRef, (snapshot) => {
      setLoading(true);
      if (snapshot.exists()) {
        const helpData = [];
        snapshot.forEach((childSnapshot) => {
          const helpId = childSnapshot.key;
          const helpDetails = childSnapshot.val();
          helpData.push({ id: helpId, ...helpDetails });
        });

        // Sort by submission date (newest first)
        helpData.sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));

        // Check for new tickets and create notifications
        checkForNewTickets(helpData);

        setHelpRequests(helpData);
        setFilteredRequests(helpData);

        // Calculate stats
        const statsData = {
          total: helpData.length,
          open: helpData.filter(item => item.status === 'open').length,
          inProgress: helpData.filter(item => item.status === 'in-progress').length,
          resolved: helpData.filter(item => item.status === 'resolved').length
        };
        setStats(statsData);

        // Select specific request if ID is in URL
        if (idParam && activeTab === 'tickets') {
          const request = helpData.find(req => req.id === idParam);
          if (request) {
            setSelectedRequest(request);
          }
        }
      } else {
        setHelpRequests([]);
        setFilteredRequests([]);
        setStats({
          total: 0,
          open: 0,
          inProgress: 0,
          resolved: 0
        });
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching help requests:', error);
      setLoading(false);
    });

    // Cleanup function
    return () => unsubscribe();
  }, [idParam, activeTab, notifiedTickets]);

 // This is just the relevant section to modify in your CustomerSupport.js
// Replace the checkForNewTickets function with this improved version:

// Check for new tickets and create notifications
const checkForNewTickets = (ticketsData) => {
  // Skip if there's no data
  if (!ticketsData || !Array.isArray(ticketsData) || ticketsData.length === 0) {
    return;
  }

  // If notifiedTickets isn't initialized yet, initialize it
  if (!notifiedTickets || !Array.isArray(notifiedTickets)) {
    setNotifiedTickets([]);
    return;
  }

  // Get requests that we haven't notified about yet
  const newTickets = ticketsData.filter(ticket =>
    // Only create notifications for open tickets we haven't notified about yet
    !notifiedTickets.includes(ticket.id) &&
    ticket.status === 'open'
  );

  // Debug
  if (newTickets.length > 0) {
    console.log(`Found ${newTickets.length} new tickets to notify about`);
  }

  // Create notifications for new tickets (only if there are new ones)
  if (newTickets.length > 0) {
    // Batch updates to avoid React state update issues
    const ticketIds = newTickets.map(ticket => ticket.id);
    
    // Process tickets one by one to avoid race conditions
    newTickets.forEach(ticket => {
      console.log("Creating notification for new support ticket:", ticket.id);

      // Get priority level based on issue type and time elapsed
      const priority = getPriorityLevel(ticket);

      // Create the notification
      createSupportTicketNotification(ticket.id, {
        customerName: ticket.customerName || ticket.customer?.fullName || 'Customer',
        issueType: ticket.issueType || 'General Issue',
        customerNote: ticket.customerNote || '',
        priority: priority.level
      });
    });

    // Update the list of notified tickets (after a slight delay to ensure Firebase operations complete)
    setTimeout(() => {
      setNotifiedTickets(prev => [...prev, ...ticketIds]);
    }, 500);
  }
};

// Also add this useEffect to preserve notifiedTickets across renders
useEffect(() => {
  // Load notified tickets from localStorage on initial load
  const savedNotifiedTickets = localStorage.getItem('notifiedTickets');
  if (savedNotifiedTickets) {
    setNotifiedTickets(JSON.parse(savedNotifiedTickets));
  }
}, []);

// Save notifiedTickets to localStorage when it changes
useEffect(() => {
  if (notifiedTickets && notifiedTickets.length > 0) {
    localStorage.setItem('notifiedTickets', JSON.stringify(notifiedTickets));
  }
}, [notifiedTickets]);

  // Fetch customers from Firebase
  useEffect(() => {
    const ordersRef = ref(db, 'orders');

    const unsubscribe = onValue(ordersRef, (snapshot) => {
      setCustomerLoading(true);
      try {
        if (snapshot.exists()) {
          const ordersData = snapshot.val();
          const customersData = {};
          const uniqueAreas = new Set(['all']);

          // Process orders to extract customer information
          Object.keys(ordersData).forEach(key => {
            const order = ordersData[key];

            if (order.customer && order.customer.fullName) {
              const customerEmail = order.customer.email || 'unknown';
              const area = extractArea(order.customer.address);
              uniqueAreas.add(area);

              // If customer already exists, add this order to their orders array
              if (customersData[customerEmail]) {
                customersData[customerEmail].orders.push({
                  id: key,
                  date: order.orderDate,
                  items: order.items || [],
                  totalAmount: order.totalAmount || 0,
                  status: order.status
                });
              } else {
                // Create new customer entry
                customersData[customerEmail] = {
                  id: customerEmail,
                  name: order.customer.fullName,
                  email: customerEmail,
                  phone: order.customer.phone || 'Not provided',
                  address: order.customer.address || 'N/A',
                  area: area,
                  pincode: order.customer.pincode || 'N/A',
                  orders: [{
                    id: key,
                    date: order.orderDate,
                    items: order.items || [],
                    totalAmount: order.totalAmount || 0,
                    status: order.status
                  }]
                };
              }
            }
          });

          // Convert customers object to array and sort by most recent order
          const customersArray = Object.values(customersData).map(customer => {
            // Sort customer's orders by date (newest first)
            const sortedOrders = [...customer.orders].sort((a, b) =>
              new Date(b.date || 0) - new Date(a.date || 0)
            );

            // Calculate total spent
            const totalSpent = customer.orders.reduce((sum, order) =>
              sum + (order.totalAmount || 0), 0
            );

            // Calculate total orders
            const totalOrders = customer.orders.length;

            // Get last order date
            const lastOrderDate = sortedOrders[0]?.date || '';

            return {
              ...customer,
              orders: sortedOrders,
              totalSpent,
              totalOrders,
              lastOrderDate
            };
          });

          setCustomers(customersArray);
          setFilteredCustomers(customersArray);
          setAreas(Array.from(uniqueAreas));
        } else {
          setCustomers([]);
          setFilteredCustomers([]);
        }
      } catch (err) {
        console.error('Error fetching customers:', err);
        setCustomerError('Failed to load customers data.');
        setCustomers([]);
        setFilteredCustomers([]);
      } finally {
        setCustomerLoading(false);
      }
    }, (err) => {
      console.error('Error fetching customers:', err);
      setCustomerError('Failed to load customers data.');
      setCustomerLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Apply filters for support tickets
  useEffect(() => {
    let filtered = [...helpRequests];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(request =>
        (request.customerNote && request.customerNote.toLowerCase().includes(searchLower)) ||
        (request.orderId && request.orderId.toLowerCase().includes(searchLower)) ||
        (request.issueType && request.issueType.toLowerCase().includes(searchLower))
      );
    }

    setFilteredRequests(filtered);
  }, [searchTerm, statusFilter, helpRequests]);

  // Apply filters and sorting for customers
  useEffect(() => {
    let filtered = [...customers];

    // Apply area filter
    if (areaFilter !== 'all') {
      filtered = filtered.filter(customer => customer.area === areaFilter);
    }

    // Apply search filter
    if (customerSearchTerm.trim() !== '') {
      const searchLower = customerSearchTerm.toLowerCase();
      filtered = filtered.filter(customer =>
        (customer.name && customer.name.toLowerCase().includes(searchLower)) ||
        (customer.email && customer.email.toLowerCase().includes(searchLower)) ||
        (customer.phone && customer.phone.toLowerCase().includes(searchLower)) ||
        (customer.address && customer.address.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(b.lastOrderDate || 0) - new Date(a.lastOrderDate || 0);
          break;
        case 'area':
          comparison = (a.area || '').localeCompare(b.area || '');
          break;
        case 'customer':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'amount':
          comparison = (b.totalSpent || 0) - (a.totalSpent || 0);
          break;
        case 'orders':
          comparison = (b.totalOrders || 0) - (a.totalOrders || 0);
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'asc' ? -comparison : comparison;
    });

    setFilteredCustomers(filtered);
  }, [customers, customerSearchTerm, areaFilter, sortBy, sortDirection]);

  // Handle search input change for tickets
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search input change for customers
  const handleCustomerSearchChange = (e) => {
    setCustomerSearchTerm(e.target.value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Clear selected request when changing tabs
    setSelectedRequest(null);
  };

  // Handle sort change
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

  // View request details
  const viewRequestDetails = (request) => {
    setSelectedRequest(request);
    setResponseText('');

    // Update URL
    const params = new URLSearchParams(location.search);
    params.set('tab', 'tickets');
    params.set('id', request.id);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  // Close request details
  const closeRequestDetails = () => {
    setSelectedRequest(null);
    setResponseText('');

    // Update URL
    const params = new URLSearchParams(location.search);
    params.delete('id');
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  // Update request status
  const updateRequestStatus = async (requestId, newStatus) => {
    try {
      const requestRef = ref(db, `help/${requestId}`);
      await update(requestRef, {
        status: newStatus,
        lastUpdated: new Date().toISOString()
      });

      // Update local state
      if (selectedRequest && selectedRequest.id === requestId) {
        setSelectedRequest(prev => ({
          ...prev,
          status: newStatus,
          lastUpdated: new Date().toISOString()
        }));
      }

      // Update the helpRequests array to reflect the change
      setHelpRequests(prev =>
        prev.map(request =>
          request.id === requestId
            ? { ...request, status: newStatus, lastUpdated: new Date().toISOString() }
            : request
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  // Submit admin response
  const submitResponse = async () => {
    if (!responseText.trim() || !selectedRequest) return;

    setSubmittingResponse(true);

    try {
      const requestRef = ref(db, `help/${selectedRequest.id}`);

      // Get current responses or initialize empty array
      const requestSnapshot = await get(child(ref(db), `help/${selectedRequest.id}`));
      const currentData = requestSnapshot.val() || {};
      const currentResponses = currentData.adminResponses || [];

      // Add new response
      const newResponse = {
        text: responseText.trim(),
        timestamp: new Date().toISOString(),
        adminName: 'Admin' // You can replace with actual admin name if you have authentication
      };

      const updatedResponses = [...currentResponses, newResponse];

      // Update in Firebase
      await update(requestRef, {
        adminResponses: updatedResponses,
        status: 'in-progress',
        lastUpdated: new Date().toISOString()
      });

      // Update local state for selected request
      setSelectedRequest(prev => ({
        ...prev,
        adminResponses: updatedResponses,
        status: 'in-progress',
        lastUpdated: new Date().toISOString()
      }));

      // Update the helpRequests array to reflect the change
      setHelpRequests(prev =>
        prev.map(request =>
          request.id === selectedRequest.id
            ? {
              ...request,
              adminResponses: updatedResponses,
              status: 'in-progress',
              lastUpdated: new Date().toISOString()
            }
            : request
        )
      );

      setResponseText('');
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('Failed to submit response. Please try again.');
    } finally {
      setSubmittingResponse(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format short date (without time)
  const formatShortDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'open':
        return 'status-badge status-open';
      case 'in-progress':
        return 'status-badge status-progress';
      case 'resolved':
        return 'status-badge status-resolved';
      default:
        return 'status-badge';
    }
  };

  // Get priority level based on issue type and time elapsed
  const getPriorityLevel = (request) => {
    if (!request || !request.submittedAt) {
      return { level: 'normal', class: 'priority-normal' };
    }

    // Define high priority issues
    const highPriorityIssues = [
      'Quality Issues with Meat',
      'Order Delayed'
    ];

    // Check if it's a high priority issue type
    const isHighPriorityIssue = highPriorityIssues.includes(request.issueType);

    // Calculate hours elapsed since submission
    const submittedDate = new Date(request.submittedAt);
    const currentDate = new Date();
    const hoursElapsed = (currentDate - submittedDate) / (1000 * 60 * 60);

    // Determine priority based on criteria
    if (isHighPriorityIssue || hoursElapsed > 24) {
      return { level: 'high', class: 'priority-high' };
    } else if (hoursElapsed > 12) {
      return { level: 'medium', class: 'priority-medium' };
    } else {
      return { level: 'normal', class: 'priority-normal' };
    }
  };

  // Get request age in hours
  const getRequestAge = (dateString) => {
    if (!dateString) return 'N/A';

    const submittedDate = new Date(dateString);
    const currentDate = new Date();
    const hoursElapsed = (currentDate - submittedDate) / (1000 * 60 * 60);

    if (hoursElapsed < 1) {
      return 'Just now';
    } else if (hoursElapsed < 24) {
      return `${Math.floor(hoursElapsed)}h ago`;
    } else {
      return `${Math.floor(hoursElapsed / 24)}d ago`;
    }
  };

  // Safely get ticket ID substring for display
  const getTicketDisplayId = (ticketId) => {
    if (!ticketId) return 'Unknown';
    if (typeof ticketId !== 'string') return String(ticketId).substring(0, 8);
    return ticketId.substring(0, 8);
  };

  // Toggle expanded customer details
  const toggleExpandCustomer = (customerId) => {
    if (expandedCustomerId === customerId) {
      setExpandedCustomerId(null);
    } else {
      setExpandedCustomerId(customerId);
    }
  };

  // Render loading state for support tickets
  if (loading && helpRequests.length === 0 && activeTab === 'tickets') {
    return (
      <div className="customer-support-loading">
        <FaSpinner className="loading-spinner" />
        <p>Loading support requests...</p>
      </div>
    );
  }

  // Render loading state for customers
  if (customerLoading && customers.length === 0 && activeTab === 'customers') {
    return (
      <div className="customer-support-loading">
        <FaSpinner className="loading-spinner" />
        <p>Loading customers data...</p>
      </div>
    );
  }

  return (
    <div className="customer-support-page">
      <div className="customer-support-container">
        <div className="support-header">
          <h1>Customer Support Dashboard</h1>
          <div style={{ top: '5px', position: 'relative' }} className="gradient-line">
            <div className="gradient-segment segment-3"></div>
          </div>
        </div>

        {/* Tab Navigation */}
        {/* <div className="tabs-header">
          <button 
            className={`tab-button ${activeTab === 'tickets' ? 'active' : ''}`}
            onClick={() => handleTabChange('tickets')}
          >
            <FaTicketAlt /> Support Tickets
          </button>
          <button 
            className={`tab-button ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => handleTabChange('customers')}
          >
            <FaUsers /> Customer List
          </button>
          <button 
            className={`tab-button ${activeTab === 'vendor_requests' ? 'active' : ''}`}
            onClick={() => handleTabChange('vendor_requests')}
          >
            <FaStore /> Vendor Requests
          </button>
        </div> */}
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === 'tickets' ? 'active' : ''}`}
            onClick={() => handleTabChange('tickets')}
          >
            <FaTicketAlt /> Support Tickets
          </button>
          <button
            className={`tab-button ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => handleTabChange('customers')}
          >
            <FaUsers /> Customer List
          </button>
          <button
            className={`tab-button ${activeTab === 'vendor_requests' ? 'active' : ''}`}
            onClick={() => handleTabChange('vendor_requests')}
          >
            <FaStore /> Vendor Requests
          </button>
          <button
            className={`tab-button ${activeTab === 'merchant_collaboration' ? 'active' : ''}`}
            onClick={() => handleTabChange('merchant_collaboration')}
          >
            <FaHandshake /> Merchant Collaboration
          </button>
        </div>

        {/* Support Tickets Tab */}
        {activeTab === 'tickets' && (
          <>
            {/* Stats Cards */}
            <div className="support-stats">
              <div className="stat-card">
                <div className="stat-icon total-icon">
                  <FaInbox />
                </div>
                <div className="stat-info">
                  <h3>{stats.total}</h3>
                  <p>Total Tickets</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon open-icon">
                  <FaExclamationTriangle />
                </div>
                <div className="stat-info">
                  <h3>{stats.open}</h3>
                  <p>Open Tickets</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon progress-icon">
                  <FaRegClock />
                </div>
                <div className="stat-info">
                  <h3>{stats.inProgress}</h3>
                  <p>In Progress</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon resolved-icon">
                  <FaRegCheckCircle />
                </div>
                <div className="stat-info">
                  <h3>{stats.resolved}</h3>
                  <p>Resolved</p>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="support-filters">
              <div className="search-container">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by order ID, issue type or keywords..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                />
              </div>

              <div className="status-filters">
                <button
                  className={`filter-button ${statusFilter === 'all' ? 'active' : ''}`}
                  onClick={() => handleStatusFilterChange('all')}
                >
                  All
                </button>
                <button
                  className={`filter-button ${statusFilter === 'open' ? 'active' : ''}`}
                  onClick={() => handleStatusFilterChange('open')}
                >
                  Open
                </button>
                <button
                  className={`filter-button ${statusFilter === 'in-progress' ? 'active' : ''}`}
                  onClick={() => handleStatusFilterChange('in-progress')}
                >
                  In Progress
                </button>
                <button
                  className={`filter-button ${statusFilter === 'resolved' ? 'active' : ''}`}
                  onClick={() => handleStatusFilterChange('resolved')}
                >
                  Resolved
                </button>
              </div>
            </div>

            {/* Support Tickets List */}
            <div className="support-tickets-container">
              <div className="tickets-header">
                <h2>Support Tickets ({filteredRequests.length})</h2>
              </div>

              {filteredRequests.length === 0 ? (
                <div className="no-tickets">
                  <p>No support tickets match your criteria.</p>
                </div>
              ) : (
                <div className="tickets-list">
                  {filteredRequests.map(request => {
                    const priority = getPriorityLevel(request);
                    return (
                      <div
                        key={request.id}
                        className={`ticket-item ${priority.class}`}
                        onClick={() => viewRequestDetails(request)}
                      >
                        <div className="ticket-priority-indicator"></div>

                        <div className="ticket-main-info">
                          <div className="ticket-header">
                            <h3>Order #{request.orderId || 'N/A'}</h3>
                            <span className={getStatusBadgeClass(request.status)}>
                              {request.status === 'open' ? 'Open' :
                                request.status === 'in-progress' ? 'In Progress' : 'Resolved'}
                            </span>
                          </div>

                          <div className="ticket-issue">
                            <span className="issue-type">{request.issueType || 'General Issue'}</span>
                            <span className="ticket-time">{getRequestAge(request.submittedAt)}</span>
                          </div>

                          {request.customerNote && (
                            <p className="ticket-note">
                              {request.customerNote.length > 100
                                ? `${request.customerNote.substring(0, 100)}...`
                                : request.customerNote}
                            </p>
                          )}
                        </div>

                        <div className="ticket-responses">
                          <span className="response-count">
                            {request.adminResponses ? request.adminResponses.length : 0} responses
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="customer-list-wrapper">
            {customerError && <div className="error-message">{customerError}</div>}

            <div className="customer-filters">
              <div className="search-container">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone or address..."
                  value={customerSearchTerm}
                  onChange={handleCustomerSearchChange}
                  className="search-input"
                />
              </div>

              <div className="area-filter">
                <label><FaMapMarkerAlt /> Area:</label>
                <select
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                  className="area-select"
                >
                  {areas.map((area, index) => (
                    <option key={index} value={area}>
                      {area === 'all' ? 'All Areas' : area}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sort-controls">
              <span>Sort by:</span>
              <button
                className={`sort-button ${sortBy === 'date' ? 'active' : ''}`}
                onClick={() => handleSortChange('date')}
              >
                Last Order Date {sortBy === 'date' && (
                  sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
                )}
              </button>
              <button
                className={`sort-button ${sortBy === 'area' ? 'active' : ''}`}
                onClick={() => handleSortChange('area')}
              >
                Area {sortBy === 'area' && (
                  sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
                )}
              </button>

              <button
                className={`sort-button ${sortBy === 'amount' ? 'active' : ''}`}
                onClick={() => handleSortChange('amount')}
              >
                Total Spent {sortBy === 'amount' && (
                  sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
                )}
              </button>
              <button
                className={`sort-button ${sortBy === 'orders' ? 'active' : ''}`}
                onClick={() => handleSortChange('orders')}
              >
                Orders Count {sortBy === 'orders' && (
                  sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
                )}
              </button>
            </div>

            <div className="customers-header">
              <h2>Customer List ({filteredCustomers.length})</h2>
            </div>

            {filteredCustomers.length === 0 ? (
              <div className="no-customers">
                <p>No customers found matching your criteria.</p>
              </div>
            ) : (
              <div className="customers-list">
                {filteredCustomers.map(customer => (
                  <div key={customer.id} className="customer-card">
                    <div className="customer-card-header">
                      <div className="customer-name-container">
                        <FaUser className="customer-icon" />
                        <h3>{customer.name || 'Unknown Customer'}</h3>
                      </div>
                      <button
                        className="view-details-button"
                        onClick={() => toggleExpandCustomer(customer.id)}
                      >
                        <FaEye /> {expandedCustomerId === customer.id ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>

                    <div className="customer-info-grid">
                      <div className="customer-info-item">
                        <FaPhoneAlt className="info-icon" />
                        <span>{customer.phone || 'N/A'}</span>
                      </div>

                      <div className="customer-info-item">
                        <FaEnvelope className="info-icon" />
                        <span>{customer.email || 'N/A'}</span>
                      </div>

                      <div className="customer-info-item">
                        <FaMapMarkerAlt className="info-icon" />
                        <span>{customer.area || 'Unknown Area'}</span>
                      </div>

                      <div className="customer-info-item">
                        <FaShoppingBag className="info-icon" />
                        <span>{customer.totalOrders || 0} orders</span>
                      </div>

                      <div className="customer-info-item">
                        <strong>Total Spent:</strong>
                        <span>{formatCurrency(customer.totalSpent)}</span>
                      </div>

                      <div className="customer-info-item">
                        <FaCalendarAlt className="info-icon" />
                        <span>Last order: {formatShortDate(customer.lastOrderDate)}</span>
                      </div>
                    </div>

                    <div className="customer-address">
                      <FaMapMarkerAlt className="address-icon" />
                      <span>{customer.address || 'Address not available'}</span>
                    </div>

                    {expandedCustomerId === customer.id && (
                      <div className="customer-orders">
                        <h4>Order History ({customer.orders ? customer.orders.length : 0})</h4>

                        <div className="orders-list">
                          {customer.orders && customer.orders.map((order, index) => (
                            <div key={index} className="order-item">
                              <div className="order-header">
                                <div className="order-id">
                                  Order #{order.id ? (typeof order.id === 'string' ? order.id.substring(0, 8) : order.id) : 'N/A'}
                                </div>
                                <div className="order-date">{formatShortDate(order.date)}</div>
                                <div className="order-amount">{formatCurrency(order.totalAmount)}</div>
                                <div className={`order-status status-${order.status || 'unknown'}`}>
                                  {order.status || 'Unknown Status'}
                                </div>
                              </div>

                              <div className="order-items">
                                {order.items && order.items.length > 0 ? (
                                  <table className="items-table">
                                    <thead>
                                      <tr>
                                        <th>Item</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {order.items.map((item, itemIndex) => (
                                        <tr key={itemIndex}>
                                          <td>{item.name || 'Unknown Item'}</td>
                                          <td>{item.quantity || 1}</td>
                                          <td>{formatCurrency((item.price || 0) * (item.quantity || 1))}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                ) : (
                                  <p className="no-items">No items information available</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Vendor Requests Tab */}
        {activeTab === 'vendor_requests' && (
          <VendorRequests />
        )}
        {activeTab === 'merchant_collaboration' && (
          <MerchantCollaboration />
        )}
      </div>

      {/* Request Details Modal */}
      {selectedRequest && activeTab === 'tickets' && (
        <div className="request-details-modal">
          <div className="request-details-container">
            <div className="request-details-header">
              <div>
                <h2>Support Ticket #{getTicketDisplayId(selectedRequest.id)}</h2>
                <p>Order #{selectedRequest.orderId || 'N/A'}</p>
              </div>
              <button className="close-details-button" onClick={closeRequestDetails}>
                <FaTimes />
              </button>
            </div>

            <div className="request-details-content">
              <div className="request-info-section">
                <div className="request-info-item">
                  <span className="info-label"><FaUser /> Customer:</span>
                  <span className="info-value">
                    {selectedRequest.customerName || selectedRequest.customer?.fullName || 'Anonymous Customer'}
                  </span>
                </div>

                <div className="request-info-item">
                  <span className="info-label"><FaCalendarAlt /> Submitted:</span>
                  <span className="info-value">
                    {formatDate(selectedRequest.submittedAt)}
                  </span>
                </div>

                <div className="request-info-item">
                  <span className="info-label"><FaTag /> Issue Type:</span>
                  <span className="info-value">
                    {selectedRequest.issueType || 'General Issue'}
                  </span>
                </div>

                <div className="request-info-item">
                  <span className="info-label">Status:</span>
                  <span className={getStatusBadgeClass(selectedRequest.status)}>
                    {selectedRequest.status === 'open' ? 'Open' :
                      selectedRequest.status === 'in-progress' ? 'In Progress' : 'Resolved'}
                  </span>
                </div>
              </div>

              {selectedRequest.customerNote && (
                <div className="customer-note-section">
                  <h3>Customer Note:</h3>
                  <p className="customer-note">{selectedRequest.customerNote}</p>
                </div>
              )}

              <div className="request-items-section">
                <h3>Order Items:</h3>
                {selectedRequest.items && selectedRequest.items.length > 0 ? (
                  <div className="order-items-list">
                    {selectedRequest.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <span className="item-name">{item.name || 'Unknown Item'}</span>
                        <span className="item-quantity">x{item.quantity || 1}</span>
                        <span className="item-price">₹{(item.price || 0) * (item.quantity || 1)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-items">No items information available</p>
                )}
              </div>

              <div className="conversation-section">
                <h3>Conversation:</h3>

                {/* Initial request */}
                <div className="conversation-item customer">
                  <div className="message-header">
                    <span className="sender">Customer</span>
                    <span className="timestamp">{formatDate(selectedRequest.submittedAt)}</span>
                  </div>
                  <div className="message-content">
                    <p>
                      {selectedRequest.customerNote || `Issue reported: ${selectedRequest.issueType || 'General Issue'}`}
                    </p>
                  </div>
                </div>

                {/* Admin responses */}
                {selectedRequest.adminResponses && selectedRequest.adminResponses.map((response, index) => (
                  <div key={index} className="conversation-item admin">
                    <div className="message-header">
                      <span className="sender">{response.adminName || 'Admin'}</span>
                      <span className="timestamp">{formatDate(response.timestamp)}</span>
                    </div>
                    <div className="message-content">
                      <p>{response.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Response Form */}
              <div className="response-form">
                <h3>Add Response:</h3>
                <textarea
                  className="response-textarea"
                  placeholder="Type your response to the customer..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={4}
                ></textarea>

                <div className="response-actions">
                  <div className="status-update-buttons">
                    <button
                      className="status-button open"
                      onClick={() => updateRequestStatus(selectedRequest.id, 'open')}
                      disabled={selectedRequest.status === 'open'}
                    >
                      Mark as Open
                    </button>
                    <button
                      className="status-button progress"
                      onClick={() => updateRequestStatus(selectedRequest.id, 'in-progress')}
                      disabled={selectedRequest.status === 'in-progress'}
                    >
                      Mark In Progress
                    </button>
                    <button
                      className="status-button resolved"
                      onClick={() => updateRequestStatus(selectedRequest.id, 'resolved')}
                      disabled={selectedRequest.status === 'resolved'}
                    >
                      Mark Resolved
                    </button>
                  </div>

                  <button
                    className="send-response-button"
                    onClick={submitResponse}
                    disabled={!responseText.trim() || submittingResponse}
                  >
                    <FaReply /> {submittingResponse ? 'Sending...' : 'Send Response'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSupport;