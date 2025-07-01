





// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase/config';
// import { ref, onValue, update, get } from 'firebase/database';
// import { 
//   FaSpinner, FaCalendarAlt, FaStore, FaClock, FaTag,
//   FaSearch, FaFilter, FaTimes, FaCheck, FaExclamationTriangle,
//   FaUser, FaSortAmountDown, FaSortAmountUp, FaEye, FaEnvelope, FaPhone,
//   FaComment
// } from 'react-icons/fa';

// const VendorRequests = () => {
//   // States for vendor requests
//   const [supportRequests, setSupportRequests] = useState([]);
//   const [filteredRequests, setFilteredRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [typeFilter, setTypeFilter] = useState('all');
//   const [sortBy, setSortBy] = useState('date');
//   const [sortDirection, setSortDirection] = useState('desc');
//   const [adminComment, setAdminComment] = useState('');
//   const [updatingStatus, setUpdatingStatus] = useState(false);
//   const [stats, setStats] = useState({
//     total: 0,
//     pending: 0,
//     approved: 0,
//     rejected: 0
//   });
  
//   // State for shop data (fallback for older requests)
//   const [shops, setShops] = useState({});
//   const [shopsLoading, setShopsLoading] = useState(true);

//   // Fetch shop data from Firebase (as fallback)
//   useEffect(() => {
//     const shopsRef = ref(db, 'shops');
    
//     const unsubscribe = onValue(shopsRef, (snapshot) => {
//       setShopsLoading(true);
//       const shopsData = {};
      
//       if (snapshot.exists()) {
//         snapshot.forEach((childSnapshot) => {
//           const shopId = childSnapshot.key;
//           const shopDetails = childSnapshot.val();
//           shopsData[shopId] = {
//             name: shopDetails.name || 'Unknown Shop',
//             owner: shopDetails.owner || 'Unknown Owner',
//             email: shopDetails.email || '',
//             category: shopDetails.category || '',
//             address: shopDetails.address || '',
//             city: shopDetails.city || ''
//           };
//         });
//       }
      
//       setShops(shopsData);
//       setShopsLoading(false);
//     }, (error) => {
//       console.error('Error fetching shop data:', error);
//       setShopsLoading(false);
//     });
    
//     return () => unsubscribe();
//   }, []);

//   // Fetch vendor support requests from Firebase
//   useEffect(() => {
//     const requestsRef = ref(db, 'support_requests');
    
//     const unsubscribe = onValue(requestsRef, (snapshot) => {
//       setLoading(true);
//       if (snapshot.exists()) {
//         const requestsData = [];
//         snapshot.forEach((childSnapshot) => {
//           const requestId = childSnapshot.key;
//           const requestDetails = childSnapshot.val();
//           requestsData.push({ id: requestId, ...requestDetails });
//         });
        
//         // Sort by creation date (newest first)
//         requestsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
//         setSupportRequests(requestsData);
//         setFilteredRequests(requestsData);
        
//         // Calculate stats
//         const statsData = {
//           total: requestsData.length,
//           pending: requestsData.filter(item => item.status === 'pending').length,
//           approved: requestsData.filter(item => item.status === 'approved').length,
//           rejected: requestsData.filter(item => item.status === 'rejected').length
//         };
//         setStats(statsData);
//       } else {
//         setSupportRequests([]);
//         setFilteredRequests([]);
//         setStats({
//           total: 0,
//           pending: 0,
//           approved: 0,
//           rejected: 0
//         });
//       }
//       setLoading(false);
//     }, (error) => {
//       console.error('Error fetching vendor requests:', error);
//       setLoading(false);
//     });
    
//     // Cleanup function
//     return () => unsubscribe();
//   }, []);

//   // Apply filters and sorting
//   useEffect(() => {
//     let filtered = [...supportRequests];
    
//     // Apply status filter
//     if (statusFilter !== 'all') {
//       filtered = filtered.filter(request => request.status === statusFilter);
//     }

//     // Apply type filter
//     if (typeFilter !== 'all') {
//       filtered = filtered.filter(request => request.type === typeFilter);
//     }
    
//     // Apply search filter
//     if (searchTerm.trim() !== '') {
//       const searchLower = searchTerm.toLowerCase();
//       filtered = filtered.filter(request => {
//         // Use direct vendor name and shop name fields if available
//         const vendorName = (request.vendorName || getOwnerName(request.vendorId)).toLowerCase();
//         const shopName = (request.shopName || getShopName(request.vendorId)).toLowerCase();
        
//         return (request.details && request.details.toLowerCase().includes(searchLower)) ||
//           (request.vendorId && request.vendorId.toLowerCase().includes(searchLower)) ||
//           (request.type && request.type.toLowerCase().includes(searchLower)) ||
//           vendorName.includes(searchLower) ||
//           shopName.includes(searchLower);
//       });
//     }
    
//     // Apply sorting
//     filtered.sort((a, b) => {
//       let comparison = 0;
      
//       switch (sortBy) {
//         case 'date':
//           comparison = new Date(b.createdAt) - new Date(a.createdAt);
//           break;
//         case 'type':
//           comparison = a.type.localeCompare(b.type);
//           break;
//         case 'owner':
//           const ownerNameA = a.vendorName || getOwnerName(a.vendorId);
//           const ownerNameB = b.vendorName || getOwnerName(b.vendorId);
//           comparison = ownerNameA.localeCompare(ownerNameB);
//           break;
//         default:
//           comparison = 0;
//       }
      
//       return sortDirection === 'asc' ? -comparison : comparison;
//     });
    
//     setFilteredRequests(filtered);
//   }, [supportRequests, searchTerm, statusFilter, typeFilter, sortBy, sortDirection, shops]);

//   // Get shop name from vendor ID (fallback for older records)
//   const getShopName = (vendorId) => {
//     if (!vendorId) return 'Unknown Shop';
    
//     if (shops[vendorId] && shops[vendorId].name) {
//       return shops[vendorId].name;
//     }
    
//     // Fallback to vendor ID if no name is found
//     return `Shop ${vendorId.substring(0, 8)}`;
//   };
  
//   // Get owner name from vendor ID (fallback for older records)
//   const getOwnerName = (vendorId) => {
//     if (!vendorId) return 'Unknown Owner';
    
//     if (shops[vendorId] && shops[vendorId].owner) {
//       return shops[vendorId].owner;
//     }
    
//     return 'Unknown Owner';
//   };
  
//   // Get shop email from vendor ID (fallback for older records)
//   const getShopEmail = (vendorId) => {
//     if (!vendorId) return '';
    
//     if (shops[vendorId] && shops[vendorId].email) {
//       return shops[vendorId].email;
//     }
    
//     return '';
//   };
  
//   // Get shop category from vendor ID (fallback for older records)
//   const getShopCategory = (vendorId) => {
//     if (!vendorId) return '';
    
//     if (shops[vendorId] && shops[vendorId].category) {
//       return shops[vendorId].category;
//     }
    
//     return '';
//   };
  
//   // Get shop address from vendor ID (fallback for older records)
//   const getShopAddress = (vendorId) => {
//     if (!vendorId) return '';
    
//     if (shops[vendorId] && shops[vendorId].address) {
//       return shops[vendorId].address;
//     }
    
//     return '';
//   };

//   // Handle search input change
//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   // Handle status filter change
//   const handleStatusFilterChange = (status) => {
//     setStatusFilter(status);
//   };

//   // Handle type filter change
//   const handleTypeFilterChange = (type) => {
//     setTypeFilter(type);
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
//     setAdminComment(''); // Reset admin comment when viewing a new request
//   };

//   // Close request details
//   const closeRequestDetails = () => {
//     setSelectedRequest(null);
//     setAdminComment('');
//   };

//   // Handle admin comment change
//   const handleAdminCommentChange = (e) => {
//     setAdminComment(e.target.value);
//   };

//   // Update request status
//   const updateRequestStatus = async (requestId, newStatus) => {
//     // Validate admin comment for approvals and rejections
//     if ((newStatus === 'approved' || newStatus === 'rejected') && !adminComment.trim()) {
//       alert('Please provide a comment before approving or rejecting the request.');
//       return;
//     }
    
//     setUpdatingStatus(true);
    
//     try {
//       const requestRef = ref(db, `support_requests/${requestId}`);
      
//       // Create update object
//       const updateData = {
//         status: newStatus,
//         updatedAt: new Date().toISOString()
//       };
      
//       // Add admin comment if provided
//       if (adminComment.trim()) {
//         updateData.adminComment = adminComment.trim();
//       }
      
//       // Update in Firebase
//       await update(requestRef, updateData);
      
//       // Update local state
//       if (selectedRequest && selectedRequest.id === requestId) {
//         setSelectedRequest(prev => ({
//           ...prev,
//           status: newStatus,
//           updatedAt: new Date().toISOString(),
//           adminComment: adminComment.trim() || prev.adminComment
//         }));
//       }
      
//       // Clear comment after successful update
//       setAdminComment('');
      
//       // Show success message
//       alert(`Request has been ${newStatus === 'approved' ? 'approved' : newStatus === 'rejected' ? 'rejected' : 'updated'} successfully.`);
      
//     } catch (error) {
//       console.error('Error updating status:', error);
//       alert('Failed to update status. Please try again.');
//     } finally {
//       setUpdatingStatus(false);
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

//   // Get status badge class
//   const getStatusBadgeClass = (status) => {
//     switch (status) {
//       case 'pending':
//         return 'status-badge status-pending';
//       case 'approved':
//         return 'status-badge status-approved';
//       case 'rejected':
//         return 'status-badge status-rejected';
//       default:
//         return 'status-badge';
//     }
//   };

//   // Get request type label
//   const getRequestTypeLabel = (type) => {
//     switch (type) {
//       case 'packaging':
//         return 'Request to Zappcart';
//       case 'schedule':
//         return 'Vendor Schedule';
//       case 'payment':
//         return 'Payment Section';
//       case 'payment_query':
//         return 'Payment Query';
//       default:
//         return type;
//     }
//   };

//   // Get request type icon
//   const getRequestTypeIcon = (type) => {
//     switch (type) {
//       case 'packaging':
//         return <FaStore />;
//       case 'schedule':
//         return <FaCalendarAlt />;
//       case 'payment':
//       case 'payment_query':
//         return <FaClock />;
//       default:
//         return <FaTag />;
//     }
//   };

//   // Get available request types
//   const getRequestTypes = () => {
//     const types = new Set(['all']);
//     supportRequests.forEach(request => {
//       if (request.type) types.add(request.type);
//     });
//     return Array.from(types);
//   };

//   // Get age of request in days/hours
//   const getRequestAge = (dateString) => {
//     const createdDate = new Date(dateString);
//     const currentDate = new Date();
//     const hoursElapsed = (currentDate - createdDate) / (1000 * 60 * 60);
    
//     if (hoursElapsed < 1) {
//       return 'Just now';
//     } else if (hoursElapsed < 24) {
//       return `${Math.floor(hoursElapsed)}h ago`;
//     } else {
//       return `${Math.floor(hoursElapsed / 24)}d ago`;
//     }
//   };

//   // Render loading state
//   if (loading && supportRequests.length === 0) {
//     return (
//       <div className="vendor-requests-loading">
//         <FaSpinner className="loading-spinner" />
//         <p>Loading vendor requests...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="vendor-requests-wrapper">
//       {/* Stats Cards */}
//       <div className="support-stats">
//         <div className="stat-card">
//           <div className="stat-icon total-icon">
//             <FaStore />
//           </div>
//           <div className="stat-info">
//             <h3>{stats.total}</h3>
//             <p>Total Requests</p>
//           </div>
//         </div>
        
//         <div className="stat-card">
//           <div className="stat-icon pending-icon">
//             <FaExclamationTriangle />
//           </div>
//           <div className="stat-info">
//             <h3>{stats.pending}</h3>
//             <p>Pending</p>
//           </div>
//         </div>
        
//         <div className="stat-card">
//           <div className="stat-icon approved-icon">
//             <FaCheck />
//           </div>
//           <div className="stat-info">
//             <h3>{stats.approved}</h3>
//             <p>Approved</p>
//           </div>
//         </div>
        
//         <div className="stat-card">
//           <div className="stat-icon rejected-icon">
//             <FaTimes />
//           </div>
//           <div className="stat-info">
//             <h3>{stats.rejected}</h3>
//             <p>Rejected</p>
//           </div>
//         </div>
//       </div>
      
//       {/* Search and Filters */}
//       <div className="support-filters">
//         <div className="search-container">
//           <FaSearch className="search-icon" />
//           <input
//             type="text"
//             placeholder="Search by owner name, shop name, or request details..."
//             value={searchTerm}
//             onChange={handleSearchChange}
//             className="search-input"
//           />
//         </div>
        
//         <div className="status-filters">
//           <button
//             className={`filter-button ${statusFilter === 'all' ? 'active' : ''}`}
//             onClick={() => handleStatusFilterChange('all')}
//           >
//             All
//           </button>
//           <button
//             className={`filter-button ${statusFilter === 'pending' ? 'active' : ''}`}
//             onClick={() => handleStatusFilterChange('pending')}
//           >
//             Pending
//           </button>
//           <button
//             className={`filter-button ${statusFilter === 'approved' ? 'active' : ''}`}
//             onClick={() => handleStatusFilterChange('approved')}
//           >
//             Approved
//           </button>
//           <button
//             className={`filter-button ${statusFilter === 'rejected' ? 'active' : ''}`}
//             onClick={() => handleStatusFilterChange('rejected')}
//           >
//             Rejected
//           </button>
//         </div>
//       </div>
      
//       {/* Type filters */}
//       <div className="type-filters">
//         <span>Filter by type:</span>
//         <div className="type-buttons">
//           {getRequestTypes().map((type, index) => (
//             <button
//               key={index}
//               className={`type-button ${typeFilter === type ? 'active' : ''}`}
//               onClick={() => handleTypeFilterChange(type)}
//             >
//               {type === 'all' ? 'All Types' : getRequestTypeLabel(type)}
//             </button>
//           ))}
//         </div>
//       </div>
      
//       {/* Sort controls */}
//       <div className="sort-controls">
//         <span>Sort by:</span>
//         <button 
//           className={`sort-button ${sortBy === 'date' ? 'active' : ''}`}
//           onClick={() => handleSortChange('date')}
//         >
//           Date {sortBy === 'date' && (
//             sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
//           )}
//         </button>
//         <button 
//           className={`sort-button ${sortBy === 'type' ? 'active' : ''}`}
//           onClick={() => handleSortChange('type')}
//         >
//           Type {sortBy === 'type' && (
//             sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
//           )}
//         </button>
//         <button 
//           className={`sort-button ${sortBy === 'owner' ? 'active' : ''}`}
//           onClick={() => handleSortChange('owner')}
//         >
//           Owner Name {sortBy === 'owner' && (
//             sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
//           )}
//         </button>
//       </div>
      
//       {/* Vendor Requests List */}
//       <div className="vendor-requests-container">
//         <div className="requests-header">
//           <h2>Vendor Requests ({filteredRequests.length})</h2>
//         </div>
        
//         {filteredRequests.length === 0 ? (
//           <div className="no-requests">
//             <p>No vendor requests match your criteria.</p>
//           </div>
//         ) : (
//           <div className="requests-list">
//             {filteredRequests.map(request => (
//               <div 
//                 key={request.id} 
//                 className="request-item"
//                 onClick={() => viewRequestDetails(request)}
//               >
//                 <div className="request-main-info">
//                   <div className="request-header">
//                     <div className="request-type-container">
//                       {getRequestTypeIcon(request.type)}
//                       <h3>{getRequestTypeLabel(request.type)}</h3>
//                     </div>
//                     <span className={getStatusBadgeClass(request.status)}>
//                       {request.status}
//                     </span>
//                   </div>
                  
//                   <div className="vendor-info">
//                     <div className="vendor-name">
//                       <FaUser className="vendor-icon" />
//                       <span className="vendor-owner-name">
//                         {request.vendorName || getOwnerName(request.vendorId)}
//                       </span>
//                       <span className="vendor-shop-name">
//                         ({request.shopName || getShopName(request.vendorId)})
//                       </span>
//                     </div>
//                     <span className="request-time">{getRequestAge(request.createdAt)}</span>
//                   </div>
                  
//                   {request.details && (
//                     <p className="request-details">
//                       {request.details.length > 100 
//                         ? `${request.details.substring(0, 100)}...` 
//                         : request.details}
//                     </p>
//                   )}
                  
//                   {request.adminComment && (
//                     <div className="admin-comment-preview">
//                       <FaComment className="comment-icon" />
//                       <span className="comment-text">
//                         {request.adminComment.length > 60
//                           ? `${request.adminComment.substring(0, 60)}...`
//                           : request.adminComment}
//                       </span>
//                     </div>
//                   )}
                  
//                   {request.type === 'schedule' && (
//                     <div className="schedule-dates">
//                       <span>
//                         <FaCalendarAlt /> {formatShortDate(request.startDate)} - {formatShortDate(request.endDate)}
//                       </span>
//                     </div>
//                   )}
                  
//                   {request.type === 'payment_query' && request.orderNumber && (
//                     <div className="order-number">
//                       <span>Order #: {request.orderNumber}</span>
//                     </div>
//                   )}
//                 </div>
                
//                 <button className="view-details-button">
//                   <FaEye /> View
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
      
//       {/* Request Details Modal */}
//       {selectedRequest && (
//         <div className="request-details-modal">
//           <div className="request-details-container">
//             <div className="request-details-header">
//               <div>
//                 <h2>{getRequestTypeLabel(selectedRequest.type)}</h2>
//                 <p>Request ID: {selectedRequest.id.substring(0, 8)}</p>
//               </div>
//               <button className="close-details-button" onClick={closeRequestDetails}>
//                 <FaTimes />
//               </button>
//             </div>
            
//             <div className="request-details-content">
//               <div className="vendor-details-section">
//                 <h3>Shop Information</h3>
//                 <div className="vendor-detail-card">
//                   <div className="vendor-detail-item">
//                     <span className="detail-label">Owner:</span>
//                     <span className="detail-value">
//                       {selectedRequest.vendorName || getOwnerName(selectedRequest.vendorId)}
//                     </span>
//                   </div>
                  
//                   <div className="vendor-detail-item">
//                     <span className="detail-label">Shop Name:</span>
//                     <span className="detail-value">
//                       {selectedRequest.shopName || getShopName(selectedRequest.vendorId)}
//                     </span>
//                   </div>
                  
//                   {(getShopEmail(selectedRequest.vendorId) || shops[selectedRequest.vendorId]?.email) && (
//                     <div className="vendor-detail-item">
//                       <span className="detail-label">Email:</span>
//                       <span className="detail-value">
//                         {getShopEmail(selectedRequest.vendorId) || shops[selectedRequest.vendorId]?.email}
//                       </span>
//                     </div>
//                   )}
                  
//                   {(getShopCategory(selectedRequest.vendorId) || shops[selectedRequest.vendorId]?.category) && (
//                     <div className="vendor-detail-item">
//                       <span className="detail-label">Category:</span>
//                       <span className="detail-value">
//                         {getShopCategory(selectedRequest.vendorId) || shops[selectedRequest.vendorId]?.category}
//                       </span>
//                     </div>
//                   )}
                  
//                   {(getShopAddress(selectedRequest.vendorId) || shops[selectedRequest.vendorId]?.address) && (
//                     <div className="vendor-detail-item address-item">
//                       <span className="detail-label">Address:</span>
//                       <span className="detail-value">
//                         {getShopAddress(selectedRequest.vendorId) || shops[selectedRequest.vendorId]?.address}
//                       </span>
//                     </div>
//                   )}
                  
//                   <div className="vendor-detail-item">
//                     <span className="detail-label">Vendor ID:</span>
//                     <span className="detail-value">{selectedRequest.vendorId}</span>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="request-info-section">
//                 <div className="request-info-item">
//                   <span className="info-label"><FaCalendarAlt /> Submitted:</span>
//                   <span className="info-value">{formatDate(selectedRequest.createdAt)}</span>
//                 </div>
                
//                 <div className="request-info-item">
//                   <span className="info-label">Status:</span>
//                   <span className={getStatusBadgeClass(selectedRequest.status)}>
//                     {selectedRequest.status}
//                   </span>
//                 </div>
                
//                 {selectedRequest.updatedAt && (
//                   <div className="request-info-item">
//                     <span className="info-label">Updated:</span>
//                     <span className="info-value">{formatDate(selectedRequest.updatedAt)}</span>
//                   </div>
//                 )}
//               </div>
              
//               {selectedRequest.details && (
//                 <div className="request-details-section">
//                   <h3>Request Details:</h3>
//                   <p className="request-details-text">{selectedRequest.details}</p>
//                 </div>
//               )}
              
//               {selectedRequest.adminComment && (
//                 <div className="admin-comment-section">
//                   <h3>Admin Comment:</h3>
//                   <div className="admin-comment-box">
//                     <FaComment className="comment-icon" />
//                     <p className="admin-comment-text">{selectedRequest.adminComment}</p>
//                   </div>
//                 </div>
//               )}
              
//               {selectedRequest.type === 'schedule' && (
//                 <div className="schedule-details-section">
//                   <h3>Schedule Information:</h3>
//                   <div className="schedule-info">
//                     <div className="schedule-info-item">
//                       <span className="info-label">Start Date:</span>
//                       <span className="info-value">{formatShortDate(selectedRequest.startDate)}</span>
//                     </div>
//                     <div className="schedule-info-item">
//                       <span className="info-label">End Date:</span>
//                       <span className="info-value">{formatShortDate(selectedRequest.endDate)}</span>
//                     </div>
//                   </div>
//                 </div>
//               )}
              
//               {selectedRequest.type === 'payment_query' && selectedRequest.orderNumber && (
//                 <div className="payment-details-section">
//                   <h3>Payment Query Information:</h3>
//                   <div className="payment-info">
//                     <div className="payment-info-item">
//                       <span className="info-label">Order Number:</span>
//                       <span className="info-value">{selectedRequest.orderNumber}</span>
//                     </div>
//                   </div>
//                 </div>
//               )}
              
//               <div className="request-actions">
//                 <h3>Admin Response:</h3>
                
//                 <div className="admin-comment-input">
//                   <label htmlFor="adminComment">
//                     {selectedRequest.status === 'pending' 
//                       ? 'Add a comment (required for approval/rejection):'
//                       : 'Update comment:'}
//                   </label>
//                   <textarea
//                     id="adminComment"
//                     className="admin-comment-textarea"
//                     placeholder="Enter your response to the vendor..."
//                     value={adminComment}
//                     onChange={handleAdminCommentChange}
//                     rows={4}
//                   ></textarea>
//                 </div>
                
//                 <div className="status-update-buttons">
//                   <button 
//                     className="status-button pending"
//                     onClick={() => updateRequestStatus(selectedRequest.id, 'pending')}
//                     disabled={selectedRequest.status === 'pending' || updatingStatus}
//                   >
//                     Mark as Pending
//                   </button>
//                   <button 
//                     className="status-button approved"
//                     onClick={() => updateRequestStatus(selectedRequest.id, 'approved')}
//                     disabled={selectedRequest.status === 'approved' || updatingStatus}
//                   >
//                     {updatingStatus ? 'Processing...' : 'Approve Request'}
//                   </button>
//                   <button 
//                     className="status-button rejected"
//                     onClick={() => updateRequestStatus(selectedRequest.id, 'rejected')}
//                     disabled={selectedRequest.status === 'rejected' || updatingStatus}
//                   >
//                     {updatingStatus ? 'Processing...' : 'Reject Request'}
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

// export default VendorRequests;



import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { ref, onValue, update, get } from 'firebase/database';
import { 
  FaSpinner, FaCalendarAlt, FaStore, FaClock, FaTag,
  FaSearch, FaFilter, FaTimes, FaCheck, FaExclamationTriangle,
  FaUser, FaSortAmountDown, FaSortAmountUp, FaEye, FaEnvelope, FaPhone,
  FaComment
} from 'react-icons/fa';
import { createVendorRequestNotification } from './notificationService';

const VendorRequests = () => {
  // States for vendor requests
  const [supportRequests, setSupportRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [adminComment, setAdminComment] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  
  // State for shop data (fallback for older requests)
  const [shops, setShops] = useState({});
  const [shopsLoading, setShopsLoading] = useState(true);
  
  // State to track requests we've already notified about
  const [notifiedRequests, setNotifiedRequests] = useState([]);

  // Fetch shop data from Firebase (as fallback)
  useEffect(() => {
    const shopsRef = ref(db, 'shops');
    
    const unsubscribe = onValue(shopsRef, (snapshot) => {
      setShopsLoading(true);
      const shopsData = {};
      
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const shopId = childSnapshot.key;
          const shopDetails = childSnapshot.val();
          shopsData[shopId] = {
            name: shopDetails.name || 'Unknown Shop',
            owner: shopDetails.owner || 'Unknown Owner',
            email: shopDetails.email || '',
            category: shopDetails.category || '',
            address: shopDetails.address || '',
            city: shopDetails.city || ''
          };
        });
      }
      
      setShops(shopsData);
      setShopsLoading(false);
    }, (error) => {
      console.error('Error fetching shop data:', error);
      setShopsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Fetch vendor support requests from Firebase
  useEffect(() => {
    const requestsRef = ref(db, 'support_requests');
    
    const unsubscribe = onValue(requestsRef, (snapshot) => {
      setLoading(true);
      if (snapshot.exists()) {
        const requestsData = [];
        snapshot.forEach((childSnapshot) => {
          const requestId = childSnapshot.key;
          const requestDetails = childSnapshot.val();
          requestsData.push({ id: requestId, ...requestDetails });
        });
        
        // Sort by creation date (newest first)
        requestsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Check for new requests and create notifications
        checkForNewRequests(requestsData);
        
        setSupportRequests(requestsData);
        setFilteredRequests(requestsData);
        
        // Calculate stats
        const statsData = {
          total: requestsData.length,
          pending: requestsData.filter(item => item.status === 'pending').length,
          approved: requestsData.filter(item => item.status === 'approved').length,
          rejected: requestsData.filter(item => item.status === 'rejected').length
        };
        setStats(statsData);
      } else {
        setSupportRequests([]);
        setFilteredRequests([]);
        setStats({
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0
        });
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching vendor requests:', error);
      setLoading(false);
    });
    
    // Cleanup function
    return () => unsubscribe();
  }, [notifiedRequests]);

  // Check for new requests and create notifications
  const checkForNewRequests = (requestsData) => {
    // Get requests that we haven't notified about yet
    const newRequests = requestsData.filter(request => 
      !notifiedRequests.includes(request.id) && 
      request.status === 'pending'
    );
    
    if (newRequests.length > 0) {
      // Create notifications for new requests
      newRequests.forEach(request => {
        console.log("Creating notification for new vendor request:", request.id);
        createVendorRequestNotification(request.id, {
          vendorName: request.vendorName || getOwnerName(request.vendorId),
          shopName: request.shopName || getShopName(request.vendorId),
          type: request.type || 'General Request',
          details: request.details || ''
        });
      });
      
      // Update the list of notified requests
      setNotifiedRequests(prev => [
        ...prev, 
        ...newRequests.map(request => request.id)
      ]);
    }
  };

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...supportRequests];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(request => request.type === typeFilter);
    }
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(request => {
        // Use direct vendor name and shop name fields if available
        const vendorName = (request.vendorName || getOwnerName(request.vendorId)).toLowerCase();
        const shopName = (request.shopName || getShopName(request.vendorId)).toLowerCase();
        
        return (request.details && request.details.toLowerCase().includes(searchLower)) ||
          (request.vendorId && request.vendorId.toLowerCase().includes(searchLower)) ||
          (request.type && request.type.toLowerCase().includes(searchLower)) ||
          vendorName.includes(searchLower) ||
          shopName.includes(searchLower);
      });
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(b.createdAt) - new Date(a.createdAt);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'owner':
          const ownerNameA = a.vendorName || getOwnerName(a.vendorId);
          const ownerNameB = b.vendorName || getOwnerName(b.vendorId);
          comparison = ownerNameA.localeCompare(ownerNameB);
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? -comparison : comparison;
    });
    
    setFilteredRequests(filtered);
  }, [supportRequests, searchTerm, statusFilter, typeFilter, sortBy, sortDirection, shops]);

  // Get shop name from vendor ID (fallback for older records)
  const getShopName = (vendorId) => {
    if (!vendorId) return 'Unknown Shop';
    
    if (shops[vendorId] && shops[vendorId].name) {
      return shops[vendorId].name;
    }
    
    // Fallback to vendor ID if no name is found
    return `Shop ${vendorId.substring(0, 8)}`;
  };
  
  // Get owner name from vendor ID (fallback for older records)
  const getOwnerName = (vendorId) => {
    if (!vendorId) return 'Unknown Owner';
    
    if (shops[vendorId] && shops[vendorId].owner) {
      return shops[vendorId].owner;
    }
    
    return 'Unknown Owner';
  };
  
  // Get shop email from vendor ID (fallback for older records)
  const getShopEmail = (vendorId) => {
    if (!vendorId) return '';
    
    if (shops[vendorId] && shops[vendorId].email) {
      return shops[vendorId].email;
    }
    
    return '';
  };
  
  // Get shop category from vendor ID (fallback for older records)
  const getShopCategory = (vendorId) => {
    if (!vendorId) return '';
    
    if (shops[vendorId] && shops[vendorId].category) {
      return shops[vendorId].category;
    }
    
    return '';
  };
  
  // Get shop address from vendor ID (fallback for older records)
  const getShopAddress = (vendorId) => {
    if (!vendorId) return '';
    
    if (shops[vendorId] && shops[vendorId].address) {
      return shops[vendorId].address;
    }
    
    return '';
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  // Handle type filter change
  const handleTypeFilterChange = (type) => {
    setTypeFilter(type);
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
    setAdminComment(''); // Reset admin comment when viewing a new request
  };

  // Close request details
  const closeRequestDetails = () => {
    setSelectedRequest(null);
    setAdminComment('');
  };

  // Handle admin comment change
  const handleAdminCommentChange = (e) => {
    setAdminComment(e.target.value);
  };

  // Update request status
  const updateRequestStatus = async (requestId, newStatus) => {
    // Validate admin comment for approvals and rejections
    if ((newStatus === 'approved' || newStatus === 'rejected') && !adminComment.trim()) {
      alert('Please provide a comment before approving or rejecting the request.');
      return;
    }
    
    setUpdatingStatus(true);
    
    try {
      const requestRef = ref(db, `support_requests/${requestId}`);
      
      // Create update object
      const updateData = {
        status: newStatus,
        updatedAt: new Date().toISOString()
      };
      
      // Add admin comment if provided
      if (adminComment.trim()) {
        updateData.adminComment = adminComment.trim();
      }
      
      // Update in Firebase
      await update(requestRef, updateData);
      
      // Update local state
      if (selectedRequest && selectedRequest.id === requestId) {
        setSelectedRequest(prev => ({
          ...prev,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          adminComment: adminComment.trim() || prev.adminComment
        }));
      }
      
      // Clear comment after successful update
      setAdminComment('');
      
      // Show success message
      alert(`Request has been ${newStatus === 'approved' ? 'approved' : newStatus === 'rejected' ? 'rejected' : 'updated'} successfully.`);
      
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingStatus(false);
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

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-badge status-pending';
      case 'approved':
        return 'status-badge status-approved';
      case 'rejected':
        return 'status-badge status-rejected';
      default:
        return 'status-badge';
    }
  };

  // Get request type label
  const getRequestTypeLabel = (type) => {
    switch (type) {
      case 'packaging':
        return 'Request to Zappcart';
      case 'schedule':
        return 'Vendor Schedule';
      case 'payment':
        return 'Payment Section';
      case 'payment_query':
        return 'Payment Query';
      default:
        return type;
    }
  };

  // Get request type icon
  const getRequestTypeIcon = (type) => {
    switch (type) {
      case 'packaging':
        return <FaStore />;
      case 'schedule':
        return <FaCalendarAlt />;
      case 'payment':
      case 'payment_query':
        return <FaClock />;
      default:
        return <FaTag />;
    }
  };

  // Get available request types
  const getRequestTypes = () => {
    const types = new Set(['all']);
    supportRequests.forEach(request => {
      if (request.type) types.add(request.type);
    });
    return Array.from(types);
  };

  // Get age of request in days/hours
  const getRequestAge = (dateString) => {
    const createdDate = new Date(dateString);
    const currentDate = new Date();
    const hoursElapsed = (currentDate - createdDate) / (1000 * 60 * 60);
    
    if (hoursElapsed < 1) {
      return 'Just now';
    } else if (hoursElapsed < 24) {
      return `${Math.floor(hoursElapsed)}h ago`;
    } else {
      return `${Math.floor(hoursElapsed / 24)}d ago`;
    }
  };

  // Render loading state
  if (loading && supportRequests.length === 0) {
    return (
      <div className="vendor-requests-loading">
        <FaSpinner className="loading-spinner" />
        <p>Loading vendor requests...</p>
      </div>
    );
  }

  return (
    <div className="vendor-requests-wrapper">
      {/* Stats Cards */}
      <div className="support-stats">
        <div className="stat-card">
          <div className="stat-icon total-icon">
            <FaStore />
          </div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total Requests</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon pending-icon">
            <FaExclamationTriangle />
          </div>
          <div className="stat-info">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon approved-icon">
            <FaCheck />
          </div>
          <div className="stat-info">
            <h3>{stats.approved}</h3>
            <p>Approved</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon rejected-icon">
            <FaTimes />
          </div>
          <div className="stat-info">
            <h3>{stats.rejected}</h3>
            <p>Rejected</p>
          </div>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="support-filters">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by owner name, shop name, or request details..."
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
            className={`filter-button ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => handleStatusFilterChange('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-button ${statusFilter === 'approved' ? 'active' : ''}`}
            onClick={() => handleStatusFilterChange('approved')}
          >
            Approved
          </button>
          <button
            className={`filter-button ${statusFilter === 'rejected' ? 'active' : ''}`}
            onClick={() => handleStatusFilterChange('rejected')}
          >
            Rejected
          </button>
        </div>
      </div>
      
      {/* Type filters */}
      <div className="type-filters">
        <span>Filter by type:</span>
        <div className="type-buttons">
          {getRequestTypes().map((type, index) => (
            <button
              key={index}
              className={`type-button ${typeFilter === type ? 'active' : ''}`}
              onClick={() => handleTypeFilterChange(type)}
            >
              {type === 'all' ? 'All Types' : getRequestTypeLabel(type)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Sort controls */}
      <div className="sort-controls">
        <span>Sort by:</span>
        <button 
          className={`sort-button ${sortBy === 'date' ? 'active' : ''}`}
          onClick={() => handleSortChange('date')}
        >
          Date {sortBy === 'date' && (
            sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
          )}
        </button>
        <button 
          className={`sort-button ${sortBy === 'type' ? 'active' : ''}`}
          onClick={() => handleSortChange('type')}
        >
          Type {sortBy === 'type' && (
            sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
          )}
        </button>
        <button 
          className={`sort-button ${sortBy === 'owner' ? 'active' : ''}`}
          onClick={() => handleSortChange('owner')}
        >
          Owner Name {sortBy === 'owner' && (
            sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
          )}
        </button>
      </div>
      
      {/* Vendor Requests List */}
      <div className="vendor-requests-container">
        <div className="requests-header">
          <h2>Vendor Requests ({filteredRequests.length})</h2>
        </div>
        
        {filteredRequests.length === 0 ? (
          <div className="no-requests">
            <p>No vendor requests match your criteria.</p>
          </div>
        ) : (
          <div className="requests-list">
            {filteredRequests.map(request => (
              <div 
                key={request.id} 
                className="request-item"
                onClick={() => viewRequestDetails(request)}
              >
                <div className="request-main-info">
                  <div className="request-header">
                    <div className="request-type-container">
                      {getRequestTypeIcon(request.type)}
                      <h3>{getRequestTypeLabel(request.type)}</h3>
                    </div>
                    <span className={getStatusBadgeClass(request.status)}>
                      {request.status}
                    </span>
                  </div>
                  
                  <div className="vendor-info">
                    <div className="vendor-name">
                      <FaUser className="vendor-icon" />
                      <span className="vendor-owner-name">
                        {request.vendorName || getOwnerName(request.vendorId)}
                      </span>
                      <span className="vendor-shop-name">
                        ({request.shopName || getShopName(request.vendorId)})
                      </span>
                    </div>
                    <span className="request-time">{getRequestAge(request.createdAt)}</span>
                  </div>
                  
                  {request.details && (
                    <p className="request-details">
                      {request.details.length > 100 
                        ? `${request.details.substring(0, 100)}...` 
                        : request.details}
                    </p>
                  )}
                  
                  {request.adminComment && (
                    <div className="admin-comment-preview">
                      <FaComment className="comment-icon" />
                      <span className="comment-text">
                        {request.adminComment.length > 60
                          ? `${request.adminComment.substring(0, 60)}...`
                          : request.adminComment}
                      </span>
                    </div>
                  )}
                  
                  {request.type === 'schedule' && (
                    <div className="schedule-dates">
                      <span>
                        <FaCalendarAlt /> {formatShortDate(request.startDate)} - {formatShortDate(request.endDate)}
                      </span>
                    </div>
                  )}
                  
                  {request.type === 'payment_query' && request.orderNumber && (
                    <div className="order-number">
                      <span>Order #: {request.orderNumber}</span>
                    </div>
                  )}
                </div>
                
                <button className="view-details-button">
                  <FaEye /> View
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="request-details-modal">
          <div className="request-details-container">
            <div className="request-details-header">
              <div>
                <h2>{getRequestTypeLabel(selectedRequest.type)}</h2>
                <p>Request ID: {selectedRequest.id.substring(0, 8)}</p>
              </div>
              <button className="close-details-button" onClick={closeRequestDetails}>
                <FaTimes />
              </button>
            </div>
            
            <div className="request-details-content">
              <div className="vendor-details-section">
                <h3>Shop Information</h3>
                <div className="vendor-detail-card">
                  <div className="vendor-detail-item">
                    <span className="detail-label">Owner:</span>
                    <span className="detail-value">
                      {selectedRequest.vendorName || getOwnerName(selectedRequest.vendorId)}
                    </span>
                  </div>
                  
                  <div className="vendor-detail-item">
                    <span className="detail-label">Shop Name:</span>
                    <span className="detail-value">
                      {selectedRequest.shopName || getShopName(selectedRequest.vendorId)}
                    </span>
                  </div>
                  
                  {(getShopEmail(selectedRequest.vendorId) || shops[selectedRequest.vendorId]?.email) && (
                    <div className="vendor-detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">
                        {getShopEmail(selectedRequest.vendorId) || shops[selectedRequest.vendorId]?.email}
                      </span>
                    </div>
                  )}
                  
                  {(getShopCategory(selectedRequest.vendorId) || shops[selectedRequest.vendorId]?.category) && (
                    <div className="vendor-detail-item">
                      <span className="detail-label">Category:</span>
                      <span className="detail-value">
                        {getShopCategory(selectedRequest.vendorId) || shops[selectedRequest.vendorId]?.category}
                      </span>
                    </div>
                  )}
                  
                  {(getShopAddress(selectedRequest.vendorId) || shops[selectedRequest.vendorId]?.address) && (
                    <div className="vendor-detail-item address-item">
                      <span className="detail-label">Address:</span>
                      <span className="detail-value">
                        {getShopAddress(selectedRequest.vendorId) || shops[selectedRequest.vendorId]?.address}
                      </span>
                    </div>
                  )}
                  
                  <div className="vendor-detail-item">
                    <span className="detail-label">Vendor ID:</span>
                    <span className="detail-value">{selectedRequest.vendorId}</span>
                  </div>
                </div>
              </div>
              
              <div className="request-info-section">
                <div className="request-info-item">
                  <span className="info-label"><FaCalendarAlt /> Submitted:</span>
                  <span className="info-value">{formatDate(selectedRequest.createdAt)}</span>
                </div>
                
                <div className="request-info-item">
                  <span className="info-label">Status:</span>
                  <span className={getStatusBadgeClass(selectedRequest.status)}>
                    {selectedRequest.status}
                  </span>
                </div>
                
                {selectedRequest.updatedAt && (
                  <div className="request-info-item">
                    <span className="info-label">Updated:</span>
                    <span className="info-value">{formatDate(selectedRequest.updatedAt)}</span>
                  </div>
                )}
              </div>
              
              {selectedRequest.details && (
                <div className="request-details-section">
                  <h3>Request Details:</h3>
                  <p className="request-details-text">{selectedRequest.details}</p>
                </div>
              )}
              
              {selectedRequest.adminComment && (
                <div className="admin-comment-section">
                  <h3>Admin Comment:</h3>
                  <div className="admin-comment-box">
                    <FaComment className="comment-icon" />
                    <p className="admin-comment-text">{selectedRequest.adminComment}</p>
                  </div>
                </div>
              )}
              
              {selectedRequest.type === 'schedule' && (
                <div className="schedule-details-section">
                  <h3>Schedule Information:</h3>
                  <div className="schedule-info">
                    <div className="schedule-info-item">
                      <span className="info-label">Start Date:</span>
                      <span className="info-value">{formatShortDate(selectedRequest.startDate)}</span>
                    </div>
                    <div className="schedule-info-item">
                      <span className="info-label">End Date:</span>
                      <span className="info-value">{formatShortDate(selectedRequest.endDate)}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedRequest.type === 'payment_query' && selectedRequest.orderNumber && (
                <div className="payment-details-section">
                  <h3>Payment Query Information:</h3>
                  <div className="payment-info">
                    <div className="payment-info-item">
                      <span className="info-label">Order Number:</span>
                      <span className="info-value">{selectedRequest.orderNumber}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="request-actions">
                <h3>Admin Response:</h3>
                
                <div className="admin-comment-input">
                  <label htmlFor="adminComment">
                    {selectedRequest.status === 'pending' 
                      ? 'Add a comment (required for approval/rejection):'
                      : 'Update comment:'}
                  </label>
                  <textarea
                    id="adminComment"
                    className="admin-comment-textarea"
                    placeholder="Enter your response to the vendor..."
                    value={adminComment}
                    onChange={handleAdminCommentChange}
                    rows={4}
                  ></textarea>
                </div>
                
                <div className="status-update-buttons">
                  <button 
                    className="status-button pending"
                    onClick={() => updateRequestStatus(selectedRequest.id, 'pending')}
                    disabled={selectedRequest.status === 'pending' || updatingStatus}
                  >
                    Mark as Pending
                  </button>
                  <button 
                    className="status-button approved"
                    onClick={() => updateRequestStatus(selectedRequest.id, 'approved')}
                    disabled={selectedRequest.status === 'approved' || updatingStatus}
                  >
                    {updatingStatus ? 'Processing...' : 'Approve Request'}
                  </button>
                  <button 
                    className="status-button rejected"
                    onClick={() => updateRequestStatus(selectedRequest.id, 'rejected')}
                    disabled={selectedRequest.status === 'rejected' || updatingStatus}
                  >
                    {updatingStatus ? 'Processing...' : 'Reject Request'}
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

export default VendorRequests;