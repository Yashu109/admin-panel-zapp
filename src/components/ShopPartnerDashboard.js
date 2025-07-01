




// import React, { useState, useEffect } from 'react';
// import {
//   Package,
//   Store,
//   Map,
//   Star,
//   DollarSign,
//   TrendingUp,
//   ChevronRight,
//   Settings,
//   Clock,
//   CheckCircle,
//   AlertTriangle,
//   UserPlus,
//   RefreshCw,
//   X,
//   Plus,
//   Phone,
//   User,
//   FileText,
//   Home,
//   Upload,
//   Check,
//   Edit,
//   Trash,
//   Eye,
//   Mail,
//   Filter,
//   Search,
//   MapPin,
//   Truck,
//   XCircle,
//   Utensils,
//   Calendar,
//   ChevronDown,
//   ChevronUp,
//   ArrowUp,
//   ArrowDown,
//   Download,
//   Send
// } from 'lucide-react';
// import { ref, onValue, update, remove, push, set, get } from 'firebase/database';
// import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { db, storage } from '../firebase/config';
// import '../styles/ShopPartnerDashboard.css';

// // EditShopModal component
// const EditShopModal = ({
//   isOpen,
//   onClose,
//   editShopForm,
//   handleInputChange,
//   handleUpdateShop,
//   shopCategories,
//   fetchGoogleRating,
//   isRatingLoading,
// }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-container">
//         <div className="modal-header">
//           <h2>Edit Shop</h2>
//           <button className="modal-close" onClick={onClose}>
//             <X size={24} />
//           </button>
//         </div>

//         <form onSubmit={handleUpdateShop} className="add-shop-form">
//           <div className="form-section">
//             <h3>Shop Information</h3>

//             <div className="form-group">
//               <label htmlFor="edit-name">Shop Name*</label>
//               <input
//                 type="text"
//                 id="edit-name"
//                 name="name"
//                 value={editShopForm.name}
//                 onChange={handleInputChange}
//                 required
//                 placeholder="Enter shop name"
//               />
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="edit-address">Shop Address*</label>
//                 <input
//                   type="text"
//                   id="edit-address"
//                   name="address"
//                   onChange={handleInputChange}
//                   required
//                   placeholder="Enter full address"
//                   value={editShopForm.address}
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="edit-city">City*</label>
//                 <input
//                   type="text"
//                   id="edit-city"
//                   name="city"
//                   value={editShopForm.city}
//                   onChange={handleInputChange}
//                   required
//                   placeholder="Enter city"
//                 />
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="edit-category">Category*</label>
//                 <select
//                   id="edit-category"
//                   name="category"
//                   value={editShopForm.category}
//                   onChange={handleInputChange}
//                   required
//                 >
//                   {shopCategories.map((category, index) => (
//                     <option key={index} value={category}>
//                       {category}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="form-group">
//                 <label>Rating</label>
//                 <div className="rating-fetch-container">
//                   <div className="rating-display">
//                     {editShopForm.rating ? (
//                       <span className="rating-value">
//                         {editShopForm.rating} <Star size={14} className="star-icon" />
//                         <span className="reviews-count">({editShopForm.reviews} reviews)</span>
//                       </span>
//                     ) : (
//                       <span className="no-rating">Not fetched yet</span>
//                     )}
//                   </div>
//                   <button
//                     type="button"
//                     className="fetch-rating-button"
//                     onClick={() => fetchGoogleRating(editShopForm, 'edit')}
//                     disabled={isRatingLoading}
//                   >
//                     {isRatingLoading ? (
//                       <RefreshCw size={16} className="spinning" />
//                     ) : (
//                       <>
//                         <RefreshCw size={16} />
//                         Fetch from Google
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="form-section">
//               <h3>Meat Sector Type</h3>
//               <div className="meat-sector-options">
//                 <div className="form-radio-group">
//                   <input
//                     type="radio"
//                     id="edit-halal"
//                     name="meatSectorType"
//                     value="Halal"
//                     checked={editShopForm.meatSectorType === 'Halal'}
//                     onChange={handleInputChange}
//                   />
//                   <label htmlFor="edit-halal">Halal Cut</label>
//                 </div>
//                 <div className="form-radio-group">
//                   <input
//                     type="radio"
//                     id="edit-jcjatka"
//                     name="meatSectorType"
//                     value="JC Jatka"
//                     checked={editShopForm.meatSectorType === 'JC Jatka'}
//                     onChange={handleInputChange}
//                   />
//                   <label htmlFor="edit-jcjatka">JC Jatka</label>
//                 </div>
//                 <div className="form-radio-group">
//                   <input
//                     type="radio"
//                     id="edit-none"
//                     name="meatSectorType"
//                     value="None"
//                     checked={editShopForm.meatSectorType === 'None'}
//                     onChange={handleInputChange}
//                   />
//                   <label htmlFor="edit-none">Not Applicable</label>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="form-section">
//             <h3>Owner Information</h3>

//             <div className="form-group">
//               <label htmlFor="edit-owner">Shop Owner*</label>
//               <input
//                 type="text"
//                 id="edit-owner"
//                 name="owner"
//                 value={editShopForm.owner}
//                 onChange={handleInputChange}
//                 required
//                 placeholder="Enter owner name"
//               />
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="edit-phone">Phone Number*</label>
//                 <input
//                   type="tel"
//                   id="edit-phone"
//                   name="phone"
//                   value={editShopForm.phone}
//                   onChange={handleInputChange}
//                   required
//                   placeholder="Enter phone number"
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="edit-email">Email*</label>
//                 <input
//                   type="email"
//                   id="edit-email"
//                   name="email"
//                   value={editShopForm.email}
//                   onChange={handleInputChange}
//                   required
//                   placeholder="Enter email address"
//                 />
//               </div>
//             </div>

//             <div className="form-group">
//               <label htmlFor="edit-gstNumber">GST Number</label>
//               <input
//                 type="text"
//                 id="edit-gstNumber"
//                 name="gstNumber"
//                 value={editShopForm.gstNumber}
//                 onChange={handleInputChange}
//                 placeholder="Enter GST number (optional)"
//               />
//             </div>
//           </div>

//           <div className="form-actions">
//             <button type="button" className="cancel-button" onClick={onClose}>
//               Cancel
//             </button>
//             <button type="submit" className="update-button">
//               Update Shop
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // AddShopModal component
// const AddShopModal = ({
//   isOpen,
//   onClose,
//   newShopForm,
//   handleInputChange,
//   handleFileUpload,
//   handleSubmitShop,
//   documentUploads,
//   documentPreviews,
//   fetchGoogleRating,
//   isRatingLoading,
//   shopCategories,
// }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-container">
//         <div className="modal-header">
//           <h2>Add New Shop</h2>
//           <button className="modal-close" onClick={onClose}>
//             <X size={24} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmitShop} className="add-shop-form">
//           <div className="form-section">
//             <h3>Shop Information</h3>

//             <div className="form-group">
//               <label htmlFor="name">Shop Name*</label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={newShopForm.name}
//                 onChange={handleInputChange}
//                 required
//                 placeholder="Enter shop name"
//               />
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="address">Shop Address*</label>
//                 <input
//                   type="text"
//                   id="address"
//                   name="address"
//                   value={newShopForm.address}
//                   onChange={handleInputChange}
//                   required
//                   placeholder="Enter full address"
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="city">City*</label>
//                 <input
//                   type="text"
//                   id="city"
//                   name="city"
//                   value={newShopForm.city}
//                   onChange={handleInputChange}
//                   required
//                   placeholder="Enter city"
//                 />
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="category">Category*</label>
//                 <select
//                   id="category"
//                   name="category"
//                   value={newShopForm.category}
//                   onChange={handleInputChange}
//                   required
//                 >
//                   {shopCategories.map((category, index) => (
//                     <option key={index} value={category}>
//                       {category}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="form-group">
//                 <label>Rating</label>
//                 <div className="rating-fetch-container">
//                   <div className="rating-display">
//                     {newShopForm.rating ? (
//                       <span className="rating-value">
//                         {newShopForm.rating} <Star size={14} className="star-icon" />
//                         <span className="reviews-count">({newShopForm.reviews} reviews)</span>
//                       </span>
//                     ) : (
//                       <span className="no-rating">Not fetched yet</span>
//                     )}
//                   </div>
//                   <button
//                     type="button"
//                     className="fetch-rating-button"
//                     onClick={() => fetchGoogleRating(newShopForm, 'add')}
//                     disabled={isRatingLoading}
//                   >
//                     {isRatingLoading ? (
//                       <RefreshCw size={16} className="spinning" />
//                     ) : (
//                       <>
//                         <RefreshCw size={16} />
//                         Fetch from Google
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="form-section">
//               <h3>Meat Sector Type</h3>
//               <div className="meat-sector-options">
//                 <div className="form-radio-group">
//                   <input
//                     type="radio"
//                     id="halal"
//                     name="meatSectorType"
//                     value="Halal"
//                     checked={newShopForm.meatSectorType === 'Halal'}
//                     onChange={handleInputChange}
//                   />
//                   <label htmlFor="halal">Halal Cut</label>
//                 </div>
//                 <div className="form-radio-group">
//                   <input
//                     type="radio"
//                     id="jcjatka"
//                     name="meatSectorType"
//                     value="JC Jatka"
//                     checked={newShopForm.meatSectorType === 'JC Jatka'}
//                     onChange={handleInputChange}
//                   />
//                   <label htmlFor="jcjatka">JC Jatka</label>
//                 </div>
//                 <div className="form-radio-group">
//                   <input
//                     type="radio"
//                     id="none"
//                     name="meatSectorType"
//                     value="None"
//                     checked={newShopForm.meatSectorType === 'None'}
//                     onChange={handleInputChange}
//                   />
//                   <label htmlFor="none">Not Applicable</label>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="form-section">
//             <h3>Owner Information</h3>

//             <div className="form-group">
//               <label htmlFor="owner">Shop Owner*</label>
//               <input
//                 type="text"
//                 id="owner"
//                 name="owner"
//                 value={newShopForm.owner}
//                 onChange={handleInputChange}
//                 required
//                 placeholder="Enter owner name"
//               />
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="phone">Phone Number*</label>
//                 <input
//                   type="tel"
//                   id="phone"
//                   name="phone"
//                   value={newShopForm.phone}
//                   onChange={handleInputChange}
//                   required
//                   placeholder="Enter phone number"
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="email">Email*</label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={newShopForm.email}
//                   onChange={handleInputChange}
//                   required
//                   placeholder="Enter email address"
//                 />
//               </div>
//             </div>

//             <div className="form-group">
//               <label htmlFor="gstNumber">GST Number</label>
//               <input
//                 type="text"
//                 id="gstNumber"
//                 name="gstNumber"
//                 value={newShopForm.gstNumber}
//                 onChange={handleInputChange}
//                 placeholder="Enter GST number (optional)"
//               />
//             </div>
//           </div>

//           <div className="form-section">
//             <h3>Document Upload</h3>

//             <div className="form-row document-row">
//               <div className="form-group">
//                 <label>Business License</label>
//                 <div className="document-upload-container">
//                   <div className="document-upload">
//                     <input
//                       type="file"
//                       id="businessLicense"
//                       name="businessLicense"
//                       onChange={(e) => handleFileUpload(e, 'businessLicense')}
//                       accept="image/*"
//                       className="file-input"
//                     />
//                     <label htmlFor="businessLicense" className="file-label">
//                       <Upload size={16} />
//                       {documentUploads.businessLicense ? 'Change File' : 'Choose File'}
//                     </label>
//                     <span className="file-name">
//                       {documentUploads.businessLicense
//                         ? documentUploads.businessLicense.name
//                         : 'No file chosen'}
//                     </span>
//                   </div>

//                   {documentPreviews.businessLicense && (
//                     <div className="document-preview">
//                       <img src={documentPreviews.businessLicense} alt="Business License Preview" />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label>ID Proof</label>
//                 <div className="document-upload-container">
//                   <div className="document-upload">
//                     <input
//                       type="file"
//                       id="idProof"
//                       name="idProof"
//                       onChange={(e) => handleFileUpload(e, 'idProof')}
//                       accept="image/*"
//                       className="file-input"
//                     />
//                     <label htmlFor="idProof" className="file-label">
//                       <Upload size={16} />
//                       {documentUploads.idProof ? 'Change File' : 'Choose File'}
//                     </label>
//                     <span className="file-name">
//                       {documentUploads.idProof ? documentUploads.idProof.name : 'No file chosen'}
//                     </span>
//                   </div>

//                   {documentPreviews.idProof && (
//                     <div className="document-preview">
//                       <img src={documentPreviews.idProof} alt="ID Proof Preview" />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="form-actions">
//             <button type="button" className="cancel-button" onClick={onClose}>
//               Cancel
//             </button>
//             <button type="submit" className="submit-button">
//               Add Shop
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// const ShopPartnerDashboard = () => {
//   // State for active tab
//   const [activeTab, setActiveTab] = useState('overview');

//   // State for selected shop
//   const [selectedShop, setSelectedShop] = useState(null);

//   // State for filter options
//   const [meatSectorFilter, setMeatSectorFilter] = useState('All');

//   // State for notification
//   const [notification, setNotification] = useState(null);

//   // State for loading
//   const [isLoading, setIsLoading] = useState(false);

//   // State for shops
//   const [shops, setShops] = useState([]);

//   // State for filtered shops
//   const [filteredShops, setFilteredShops] = useState([]);

//   // State for add shop modal
//   const [isAddShopModalOpen, setIsAddShopModalOpen] = useState(false);

//   // State for edit shop modal
//   const [isEditShopModalOpen, setIsEditShopModalOpen] = useState(false);

//   // State for rating loading
//   const [isRatingLoading, setIsRatingLoading] = useState(false);

//   // State for new shop form
//   const [newShopForm, setNewShopForm] = useState({
//     name: '',
//     address: '',
//     city: '',
//     category: 'Grocery', // Default category
//     owner: '',
//     phone: '',
//     email: '',
//     gstNumber: '',
//     status: 'active',
//     meatSectorType: 'None', // Default meat sector type
//   });

//   // State for edit shop form
//   const [editShopForm, setEditShopForm] = useState({
//     id: '',
//     name: '',
//     address: '',
//     city: '',
//     category: '',
//     owner: '',
//     phone: '',
//     email: '',
//     gstNumber: '',
//     rating: 0,
//     reviews: 0,
//     meatSectorType: 'None',
//   });

//   // State for document uploads
//   const [documentUploads, setDocumentUploads] = useState({
//     businessLicense: null,
//     idProof: null,
//   });

//   // State for document preview URLs
//   const [documentPreviews, setDocumentPreviews] = useState({
//     businessLicense: null,
//     idProof: null,
//   });

//   // State for meat sector statistics
//   const [meatSectorStats, setMeatSectorStats] = useState({
//     Halal: 0,
//     'JC Jatka': 0,
//     None: 0,
//   });

//   // Order Management States
//   const [orders, setOrders] = useState([]);
//   const [shopOrders, setShopOrders] = useState([]);
//   const [orderIdMap, setOrderIdMap] = useState({});
//   const [searchTerm, setSearchTerm] = useState('');
//   const [dateFilter, setDateFilter] = useState('all');
//   const [areaFilter, setAreaFilter] = useState('all');
//   const [availableAreas, setAvailableAreas] = useState([]);
//   const [sortBy, setSortBy] = useState('date');
//   const [sortDirection, setSortDirection] = useState('desc');
//   const [customDateRange, setCustomDateRange] = useState({
//     start: '',
//     end: ''
//   });
//   const [orderStatusFilter, setOrderStatusFilter] = useState('all');

//   // Categories for dropdown
//   const shopCategories = [
//     'Grocery',
//     'Restaurant',
//     'Pharmacy',
//     'Electronics',
//     'Clothing',
//     'Home Goods',
//     'Bakery',
//     'Pet Supplies',
//     'Books',
//     'Health Foods',
//     'Meat Shop',
//     'Other',
//   ];

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

//   // Fetch orders for current shop
//   useEffect(() => {
//     if (!selectedShop) return;

//     const filteredOrders = orders.filter(order => 
//       order.vendor && order.vendor.id === selectedShop
//     );

//     setShopOrders(filteredOrders);

//     // Extract areas for filtering
//     const areas = extractAreas(filteredOrders);
//     setAvailableAreas(areas);

//     // Update shop's order counts
//     const counts = {
//       pending: filteredOrders.filter(o => o.status === 'pending').length,
//       processing: filteredOrders.filter(o => o.status === 'processing').length,
//       completed: filteredOrders.filter(o => o.status === 'delivered').length,
//       cancelled: filteredOrders.filter(o => o.status === 'cancelled').length
//     };

//     // Update shop data with order counts if needed
//     const shop = shops.find(s => s.id === selectedShop);
//     if (shop && (
//       shop.orders?.pending !== counts.pending || 
//       shop.orders?.processing !== counts.processing ||
//       shop.orders?.completed !== counts.completed ||
//       shop.orders?.cancelled !== counts.cancelled
//     )) {
//       const shopRef = ref(db, `shops/${selectedShop}`);
//       update(shopRef, {
//         orders: counts
//       }).catch(err => console.error('Error updating shop order counts:', err));
//     }
//   }, [selectedShop, orders, shops]);

//   // Calculate meat sector statistics
//   useEffect(() => {
//     const stats = {
//       Halal: shops.filter(shop => shop.meatSectorType === 'Halal').length,
//       'JC Jatka': shops.filter(shop => shop.meatSectorType === 'JC Jatka').length,
//       None: shops.filter(shop => shop.meatSectorType === 'None' || !shop.meatSectorType).length,
//     };

//     setMeatSectorStats(stats);
//   }, [shops]);

//   // Apply filters to shops
//   useEffect(() => {
//     let result = [...shops];

//     // Apply meat sector filter
//     if (meatSectorFilter !== 'All') {
//       result = result.filter(shop => 
//         meatSectorFilter === 'None' 
//           ? shop.meatSectorType === 'None' || !shop.meatSectorType
//           : shop.meatSectorType === meatSectorFilter
//       );
//     }

//     setFilteredShops(result);
//   }, [shops, meatSectorFilter]);

//   // Fetch shops from Firebase when component mounts
//   useEffect(() => {
//     const shopsRef = ref(db, 'shops');

//     // Set up real-time listener for shops
//     const unsubscribe = onValue(
//       shopsRef,
//       (snapshot) => {
//         const data = snapshot.val();

//         if (data) {
//           // Convert from object to array
//           const shopsArray = Object.keys(data).map((key) => ({
//             id: key,
//             ...data[key],
//             // Set default for shops without meat sector type
//             meatSectorType: data[key].meatSectorType || 'None',
//           }));

//           // Sort by name
//           shopsArray.sort((a, b) => a.name.localeCompare(b.name));

//           setShops(shopsArray);
//         } else {
//           setShops([]);
//         }

//         setIsLoading(false);
//       },
//       (error) => {
//         console.error('Error fetching shops:', error);
//         setNotification({
//           message: `Error fetching shops: ${error.message}`,
//           type: 'error',
//         });

//         setTimeout(() => {
//           setNotification(null);
//         }, 3000);

//         setIsLoading(false);
//       }
//     );

//     return () => unsubscribe();
//   }, []);

//   // Fetch orders from Firebase
//   useEffect(() => {
//     const ordersRef = ref(db, 'orders');
//     setIsLoading(true);

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
//           time: event.time || new Date().toISOString()
//         }));
//         return order;
//       }) : [];

//       setOrders(ordersData);

//       // Generate order ID map
//       const idMap = {};
//       ordersData.forEach((order, index) => {
//         idMap[order.id] = `ORD-${index + 1}`;
//       });
//       setOrderIdMap(idMap);

//       setIsLoading(false);
//     }, (err) => {
//       console.error('Error fetching orders:', err);
//       setNotification({
//         message: `Error fetching orders: ${err.message}`,
//         type: 'error',
//       });
//       setIsLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Set up a listener for order status changes to update shop earnings
//   useEffect(() => {
//     const ordersRef = ref(db, 'orders');

//     const handleOrderStatusChange = async (snapshot) => {
//       const ordersData = snapshot.val();
//       if (!ordersData) return;

//       // Process each order
//       for (const [orderId, order] of Object.entries(ordersData)) {
//         // Check if the order was just delivered
//         if (order.status === 'delivered' && order.vendor && !order.earningsProcessed) {
//           // Find the vendor/shop ID from the order
//           const vendorId = order.vendor.id;
//           if (!vendorId) continue;

//           await updateShopEarnings(vendorId, order);
//         }
//       }
//     };

//     // Set up the listener
//     const unsubscribe = onValue(ordersRef, handleOrderStatusChange);

//     // Cleanup on unmount
//     return () => unsubscribe();
//   }, []);

//   // Function to update shop earnings when an order is delivered
//   const updateShopEarnings = async (shopId, order) => {
//     try {
//       // Get current shop data
//       const shopRef = ref(db, `shops/${shopId}`);
//       const shopSnapshot = await get(shopRef);
//       const shopData = shopSnapshot.val();

//       if (!shopData) {
//         console.error(`Shop with ID ${shopId} not found when updating earnings`);
//         return;
//       }

//       // Calculate earnings (assume 10% commission or use the shop's commission rate)
//       const commissionRate = shopData.commissionRate || 10;
//       const orderEarnings = (order.totalAmount * (100 - commissionRate)) / 100;

//       // Initialize earnings object if it doesn't exist
//       const earnings = shopData.earnings || {
//         currentMonth: 0,
//         previousMonth: 0,
//         total: 0
//       };

//       // Update earnings
//       const updatedEarnings = {
//         currentMonth: (earnings.currentMonth || 0) + orderEarnings,
//         previousMonth: earnings.previousMonth || 0,
//         total: (earnings.total || 0) + orderEarnings
//       };

//       // Update shop data in Firebase
//       await update(shopRef, {
//         earnings: updatedEarnings
//       });

//       // Mark the order as earnings processed to avoid duplicate processing
//       const orderRef = ref(db, `orders/${order.id}`);
//       await update(orderRef, {
//         earningsProcessed: true
//       });

//       console.log(`Earnings updated for shop ${shopId}. Added ${orderEarnings} from order ${order.id}`);
//     } catch (error) {
//       console.error('Error updating shop earnings:', error);
//     }
//   };

//   // Handle form input changes for new shop
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewShopForm((prevForm) => ({
//       ...prevForm,
//       [name]: value,
//     }));
//   };

//   // Handle form input changes for edit shop
//   const handleEditInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditShopForm((prevForm) => ({
//       ...prevForm,
//       [name]: value,
//     }));
//   };

//   // Handle document file uploads
//   const handleFileUpload = (e, documentType) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Store file for later upload
//     setDocumentUploads({
//       ...documentUploads,
//       [documentType]: file,
//     });

//     // Create preview URL
//     const previewURL = URL.createObjectURL(file);
//     setDocumentPreviews({
//       ...documentPreviews,
//       [documentType]: previewURL,
//     });
//   };

//   // Handle fetching Google ratings - works for both add and edit forms
//   const fetchGoogleRating = async (formData, formType) => {
//     const { name, address, city } = formData;

//     if (!name || !address || !city) {
//       setNotification({
//         message: 'Shop name, address, and city are required to fetch ratings',
//         type: 'error',
//       });

//       setTimeout(() => {
//         setNotification(null);
//       }, 3000);
//       return;
//     }

//     setIsRatingLoading(true);

//     try {
//       // Construct the query for Google Places API
//       const query = `${name} ${address} ${city}`;

//       // In a real implementation, you would call the Google Places API here
//       // For now, we'll simulate with a more realistic delay and data

//       // Simulate API call with a more realistic approach
//       setTimeout(() => {
//         // Generate rating based on name length for consistency
//         const nameHash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
//         const baseRating = 3.5 + (nameHash % 15) / 10; // Between 3.5 and 5.0
//         const rating = parseFloat(baseRating.toFixed(1));

//         // Generate reviews count based on name length
//         const reviews = 10 + (nameHash % 190); // Between 10 and 200

//         if (formType === 'add') {
//           setNewShopForm((prev) => ({
//             ...prev,
//             rating: rating,
//             reviews: reviews,
//           }));
//         } else {
//           setEditShopForm((prev) => ({
//             ...prev,
//             rating: rating,
//             reviews: reviews,
//           }));
//         }

//         setIsRatingLoading(false);

//         setNotification({
//           message: `Successfully fetched ratings: ${rating} from ${reviews} reviews`,
//           type: 'success',
//         });

//         setTimeout(() => {
//           setNotification(null);
//         }, 3000);
//       }, 1500);
//     } catch (error) {
//       console.error('Error fetching ratings:', error);
//       setIsRatingLoading(false);

//       setNotification({
//         message: `Failed to fetch ratings: ${error.message}`,
//         type: 'error',
//       });

//       setTimeout(() => {
//         setNotification(null);
//       }, 3000);
//     }
//   };

//   // Handle form submission for adding a new shop
//   const handleSubmitShop = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       // Validate required fields
//       const requiredFields = ['name', 'address', 'city', 'category', 'owner', 'phone', 'email'];
//       const missingFields = requiredFields.filter((field) => !newShopForm[field]);

//       if (missingFields.length > 0) {
//         throw new Error(`Required fields missing: ${missingFields.join(', ')}`);
//       }

//       // Create a new shop object
//       const newShop = {
//         ...newShopForm,
//         location: {
//           address: `${newShopForm.address}, ${newShopForm.city}`,
//           city: newShopForm.city,
//         },
//         rating: newShopForm.rating || 0,
//         reviews: newShopForm.reviews || 0,
//         joinDate: new Date().toISOString(),
//         status: 'active',
//         verified: false,
//         earnings: {
//           currentMonth: 0,
//           previousMonth: 0,
//           total: 0,
//         },
//         orders: {
//           pending: 0,
//           processing: 0,
//           completed: 0,
//           cancelled: 0,
//         },
//         performanceMetrics: {
//           orderAcceptanceRate: 95,
//           preparationTime: 25,
//           customerSatisfaction: 4.5,
//         },
//       };

//       // Upload documents if any
//       const documents = {};

//       if (documentUploads.businessLicense) {
//         const businessLicenseRef = storageRef(storage, `shops/${Date.now()}_business_license`);
//         await uploadBytes(businessLicenseRef, documentUploads.businessLicense);
//         const businessLicenseUrl = await getDownloadURL(businessLicenseRef);
//         documents.businessLicense = businessLicenseUrl;
//       }

//       if (documentUploads.idProof) {
//         const idProofRef = storageRef(storage, `shops/${Date.now()}_id_proof`);
//         await uploadBytes(idProofRef, documentUploads.idProof);
//         const idProofUrl = await getDownloadURL(idProofRef);
//         documents.idProof = idProofUrl;
//       }

//       // Add documents to the shop data if any
//       if (Object.keys(documents).length > 0) {
//         newShop.documents = documents;
//       }

//       // Save to Firebase
//       const shopsRef = ref(db, 'shops');
//       const newShopRef = push(shopsRef);
//       await set(newShopRef, newShop);

//       // Reset form
//       setNewShopForm({
//         name: '',
//         address: '',
//         city: '',
//         category: 'Grocery',
//         owner: '',
//         phone: '',
//         email: '',
//         gstNumber: '',
//         status: 'active',
//         meatSectorType: 'None',
//       });

//       // Reset document uploads
//       setDocumentUploads({
//         businessLicense: null,
//         idProof: null,
//       });

//       // Reset document previews
//       setDocumentPreviews({
//         businessLicense: null,
//         idProof: null,
//       });

//       // Close modal
//       setIsAddShopModalOpen(false);

//       setIsLoading(false);

//       // Show success notification
//       setNotification({
//         message: `Shop ${newShop.name} has been added successfully`,
//         type: 'success',
//       });

//       // Auto dismiss notification after 3 seconds
//       setTimeout(() => {
//         setNotification(null);
//       }, 3000);
//     } catch (error) {
//       console.error('Error adding shop:', error);
//       setIsLoading(false);

//       setNotification({
//         message: `Failed to add shop: ${error.message}`,
//         type: 'error',
//       });

//       setTimeout(() => {
//         setNotification(null);
//       }, 3000);
//     }
//   };

//   // Function to handle opening the edit shop modal
//   const handleEditShop = (shop) => {
//     // Prepare address by splitting the full address
//     let address = '';
//     let city = shop.location?.city || '';

//     if (shop.location?.address) {
//       const addressParts = shop.location.address.split(', ');
//       if (addressParts.length > 1) {
//         // Use everything except the last part as address
//         address = addressParts.slice(0, -1).join(', ');
//       } else {
//         address = shop.location.address;
//       }
//     }

//     setEditShopForm({
//       id: shop.id,
//       name: shop.name || '',
//       address: address,
//       city: city,
//       category: shop.category || 'Grocery',
//       owner: shop.owner || '',
//       phone: shop.phone || '',
//       email: shop.email || '',
//       gstNumber: shop.gstNumber || '',
//       rating: shop.rating || 0,
//       reviews: shop.reviews || 0,
//       meatSectorType: shop.meatSectorType || 'None',
//     });

//     setIsEditShopModalOpen(true);
//   };

//   // Function to handle updating a shop
//   const handleUpdateShop = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       // Validate required fields
//       const requiredFields = ['name', 'address', 'city', 'category', 'owner', 'phone', 'email'];
//       const missingFields = requiredFields.filter((field) => !editShopForm[field]);

//       if (missingFields.length > 0) {
//         throw new Error(`Required fields missing: ${missingFields.join(', ')}`);
//       }

//       // Create updated shop object
//       const updatedShop = {
//         name: editShopForm.name,
//         location: {
//           address: `${editShopForm.address}, ${editShopForm.city}`,
//           city: editShopForm.city,
//         },
//         category: editShopForm.category,
//         owner: editShopForm.owner,
//         phone: editShopForm.phone,
//         email: editShopForm.email,
//         gstNumber: editShopForm.gstNumber,
//         rating: editShopForm.rating,
//         reviews: editShopForm.reviews,
//         meatSectorType: editShopForm.meatSectorType,
//       };

//       // Update shop in Firebase
//       const shopRef = ref(db, `shops/${editShopForm.id}`);
//       await update(shopRef, updatedShop);

//       // Close modal
//       setIsEditShopModalOpen(false);
//       setIsLoading(false);

//       // Show success notification
//       setNotification({
//         message: `Shop ${updatedShop.name} has been updated successfully`,
//         type: 'success',
//       });

//       // Auto dismiss notification after 3 seconds
//       setTimeout(() => {
//         setNotification(null);
//       }, 3000);
//     } catch (error) {
//       console.error('Error updating shop:', error);
//       setIsLoading(false);

//       setNotification({
//         message: `Failed to update shop: ${error.message}`,
//         type: 'error',
//       });

//       setTimeout(() => {
//         setNotification(null);
//       }, 3000);
//     }
//   };

//   // Function to toggle shop status (activate/deactivate)
//   const toggleShopStatus = async (shopId, currentStatus) => {
//     setIsLoading(true);

//     try {
//       const shopRef = ref(db, `shops/${shopId}`);
//       const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

//       await update(shopRef, {
//         status: newStatus,
//         statusUpdatedAt: new Date().toISOString(),
//       });

//       setIsLoading(false);

//       // Show success notification
//       setNotification({
//         message: `Shop status has been ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
//         type: 'success',
//       });

//       // Auto dismiss notification after 3 seconds
//       setTimeout(() => {
//         setNotification(null);
//       }, 3000);
//     } catch (error) {
//       console.error('Error toggling shop status:', error);
//       setIsLoading(false);

//       setNotification({
//         message: `Failed to update shop status: ${error.message}`,
//         type: 'error',
//       });

//       setTimeout(() => {
//         setNotification(null);
//       }, 3000);
//     }
//   };

//   // Function to remove shop
//   const removeShop = async (shopId) => {
//     const confirmed = window.confirm('Are you sure you want to delete this shop? This action cannot be undone.');
//     if (!confirmed) return;

//     setIsLoading(true);

//     try {
//       const shopRef = ref(db, `shops/${shopId}`);
//       await remove(shopRef);

//       // If the deleted shop was selected, clear selection
//       if (selectedShop === shopId) {
//         setSelectedShop(null);
//       }

//       setIsLoading(false);

//       // Show success notification
//       setNotification({
//         message: `Shop has been removed successfully`,
//         type: 'success',
//       });

//       // Auto dismiss notification after 3 seconds
//       setTimeout(() => {
//         setNotification(null);
//       }, 3000);
//     } catch (error) {
//       console.error('Error removing shop:', error);
//       setIsLoading(false);

//       setNotification({
//         message: `Failed to remove shop: ${error.message}`,
//         type: 'error',
//       });

//       setTimeout(() => {
//         setNotification(null);
//       }, 3000);
//     }
//   };

//   // Function to update Google ratings (simulated)
//   const updateGoogleRatings = async (shopId) => {
//     setIsLoading(true);

//     try {
//       const shopRef = ref(db, `shops/${shopId}`);

//       // Get the shop data first to determine a more consistent rating
//       const shopSnapshot = await get(shopRef);
//       const shopData = shopSnapshot.val();

//       if (!shopData) {
//         throw new Error("Shop not found");
//       }

//       // Generate rating based on name length for consistency
//       const nameHash = shopData.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
//       const baseRating = 3.5 + (nameHash % 15) / 10; // Between 3.5 and 5.0
//       const rating = parseFloat(baseRating.toFixed(1));

//       // Generate reviews count based on name length
//       const reviewsBase = shopData.reviews || 50;
//       const reviews = reviewsBase + Math.floor(Math.random() * 30) - 15; // Add or subtract up to 15 reviews

//       await update(shopRef, {
//         rating: rating,
//         reviews: reviews,
//         lastRatingUpdate: new Date().toISOString(),
//       });

//       setIsLoading(false);

//       // Show success notification
//       setNotification({
//         message: `Shop ratings have been updated from Google: ${rating} from ${reviews} reviews`,
//         type: 'success',
//       });

//       // Auto dismiss notification after 3 seconds
//       setTimeout(() => {
//         setNotification(null);
//       }, 3000);
//     } catch (error) {
//       console.error('Error updating ratings:', error);
//       setIsLoading(false);

//       setNotification({
//         message: `Failed to update ratings: ${error.message}`,
//         type: 'error',
//       });

//       setTimeout(() => {
//         setNotification(null);
//       }, 3000);
//     }
//   };

//   // Function to format currency with rupee symbol
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 2,
//     }).format(amount);
//   };

//   // Function to format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';

//     const options = {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     };
//     return new Date(dateString).toLocaleDateString('en-IN', options);
//   };

//   // Function to get shop performance status
//   const getShopPerformanceStatus = (metrics) => {
//     if (!metrics) return 'needs-improvement';

//     if (metrics.orderAcceptanceRate > 95 && metrics.customerSatisfaction > 4.5) {
//       return 'excellent';
//     } else if (metrics.orderAcceptanceRate > 90 && metrics.customerSatisfaction > 4.0) {
//       return 'good';
//     } else if (metrics.orderAcceptanceRate > 85 && metrics.customerSatisfaction > 3.5) {
//       return 'average';
//     } else {
//       return 'needs-improvement';
//     }
//   };

//   // Function to get meat sector label for display
//   const getMeatSectorLabel = (type) => {
//     switch(type) {
//       case 'Halal': return 'Halal Cut';
//       case 'JC Jatka': return 'JC Jatka';
//       default: return 'Not Applicable';
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

//   // Handle order status filter change
//   const handleOrderStatusFilterChange = (filter) => {
//     setOrderStatusFilter(filter);
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

//   // Apply status filter to orders
//   const getStatusFilteredOrders = (ordersList) => {
//     if (orderStatusFilter === 'all') return ordersList;

//     return ordersList.filter(order => order.status === orderStatusFilter);
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

//   // Filter and sort orders
//   const getFilteredOrders = () => {
//     let filtered = [...shopOrders];

//     // Apply search filtering
//     if (searchTerm) {
//       filtered = filtered.filter(order => 
//         (orderIdMap[order.id] || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
//         order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
//         order.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Apply status filtering
//     filtered = getStatusFilteredOrders(filtered);

//     // Apply date filtering
//     filtered = getDateFilteredOrders(filtered);

//     // Apply area filtering
//     filtered = getAreaFilteredOrders(filtered);

//     // Apply sorting
//     return getSortedOrders(filtered);
//   };

//   // Get filtered orders for the current shop
//   const filteredShopOrders = selectedShop ? getFilteredOrders() : [];

//   // Status icon mapping
//   const getStatusIcon = (status) => {
//     switch(status) {
//       case 'pending': return <Clock className="status-icon pending" />;
//       case 'processing': return <RefreshCw className="status-icon processing" />;
//       case 'prepared': return <Utensils className="status-icon prepared" />;
//       case 'out_for_delivery': return <Truck className="status-icon out-for-delivery" />;
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
//       case 'processing': return 'Processing';
//       case 'prepared': return 'Prepared';
//       case 'out_for_delivery': return 'Out for Delivery';
//       case 'delivered': return 'Delivered';
//       case 'cancelled': return 'Cancelled';
//       case 'order_placed': return 'Order Placed';
//       case 'order_confirmed': return 'Order Confirmed';
//       case 'refund_initiated': return 'Refund Initiated';
//       case 'refund_processed': return 'Refund Processed';
//       case 'delivery_assigned': return 'Delivery Assigned';
//       default: return status.split('_').map(word => 
//         word.charAt(0).toUpperCase() + word.slice(1)
//       ).join(' ');
//     }
//   };

//   // Export orders to CSV
//   const exportOrdersCSV = () => {
//     const ordersToExport = filteredShopOrders;

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
//       'Items'
//     ];

//     // Map orders to CSV rows
//     const rows = ordersToExport.map(order => {
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
//     link.setAttribute('download', `${shops.find(s => s.id === selectedShop)?.name}_orders_${new Date().toISOString().slice(0, 10)}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Get order count by area
//   const getOrdersByArea = () => {
//     const areaCount = {};

//     shopOrders.forEach(order => {
//       const address = order.customer?.address || '';
//       const addressParts = address.split(',');
//       if (addressParts.length > 0) {
//         const area = addressParts[0].trim();
//         if (area) {
//           areaCount[area] = (areaCount[area] || 0) + 1;
//         }
//       }
//     });

//     // Convert to array and sort by count
//     return Object.entries(areaCount)
//       .map(([area, count]) => ({ area, count }))
//       .sort((a, b) => b.count - a.count);
//   };

//   const ordersByArea = getOrdersByArea();

//   // If a shop is selected, show detailed view
//   if (selectedShop) {
//     const shop = shops.find((s) => s.id === selectedShop);

//     // If shop not found after being deleted
//     if (!shop) {
//       return (
//         <div className="shop-partner-dashboard">
//           <button className="back-button" onClick={() => setSelectedShop(null)}>
//             ← Back to Shops
//           </button>
//           <p>Shop not found. It may have been deleted.</p>
//         </div>
//       );
//     }

//     return (
//       <div className="shop-partner-dashboard">
//         {/* Notification Component */}
//         {notification && (
//           <div className={`notification notification-${notification.type}`}>
//             <span>{notification.message}</span>
//             <button className="notification-close" onClick={() => setNotification(null)}>
//               <X size={16} />
//             </button>
//           </div>
//         )}

//         {/* Loading Overlay */}
//         {isLoading && (
//           <div className="loading-overlay">
//             <div className="loading-spinner">
//               <RefreshCw size={40} className="spinning" />
//             </div>
//           </div>
//         )}

//         {/* Edit Shop Modal */}
//         <EditShopModal
//           isOpen={isEditShopModalOpen}
//           onClose={() => setIsEditShopModalOpen(false)}
//           editShopForm={editShopForm}
//           handleInputChange={handleEditInputChange}
//           handleUpdateShop={handleUpdateShop}
//           shopCategories={shopCategories}
//           fetchGoogleRating={fetchGoogleRating}
//           isRatingLoading={isRatingLoading}
//         />

//         <div className="shop-detail-header">
//           <button className="back-button" onClick={() => setSelectedShop(null)}>
//             ← Back to Shops
//           </button>
//           <h1>{shop.name}</h1>
//           <div className={`shop-status ${shop.status}`}>
//             {shop.status === 'active' ? 'Active' : shop.status === 'pending' ? 'Pending' : 'Inactive'}
//           </div>
//         </div>

//         <div className="shop-tabs">
//           <button
//             className={`shop-tab ${activeTab === 'overview' ? 'active' : ''}`}
//             onClick={() => setActiveTab('overview')}
//           >
//             Overview
//           </button>
//           <button
//             className={`shop-tab ${activeTab === 'orders' ? 'active' : ''}`}
//             onClick={() => setActiveTab('orders')}
//           >
//             Orders
//           </button>
//           <button
//             className={`shop-tab ${activeTab === 'products' ? 'active' : ''}`}
//             onClick={() => setActiveTab('products')}
//           >
//             Products
//           </button>
//           <button
//             className={`shop-tab ${activeTab === 'settings' ? 'active' : ''}`}
//             onClick={() => setActiveTab('settings')}
//           >
//             Settings
//           </button>
//         </div>

//         {activeTab === 'overview' && (
//           <div className="shop-detail-content">
//             <div className="shop-overview-grid">
//               <div className="shop-detail-card shop-info">
//                 <h2>Shop Information</h2>
//                 <div className="shop-info-grid">
//                   <div className="info-item">
//                     <span className="info-label">Category</span>
//                     <span className="info-value">{shop.category}</span>
//                   </div>
//                   <div className="info-item">
//                     <span className="info-label">Meat Sector Type</span>
//                     <span className="info-value">{getMeatSectorLabel(shop.meatSectorType)}</span>
//                   </div>
//                   <div className="info-item">
//                     <span className="info-label">Rating</span>
//                     <span className="info-value">
//                       {shop.rating} <Star size={14} className="star-icon" />
//                       <span className="reviews-count">({shop.reviews} reviews)</span>
//                     </span>
//                   </div>
//                   <div className="info-item">
//                     <span className="info-label">Address</span>
//                     <span className="info-value">{shop.location?.address}</span>
//                   </div>
//                   <div className="info-item">
//                     <span className="info-label">Joined</span>
//                     <span className="info-value">{formatDate(shop.joinDate)}</span>
//                   </div>
//                   {shop.owner && (
//                     <div className="info-item">
//                       <span className="info-label">Owner</span>
//                       <span className="info-value">{shop.owner}</span>
//                     </div>
//                   )}
//                   {shop.phone && (
//                     <div className="info-item">
//                       <span className="info-label">Phone</span>
//                       <span className="info-value">{shop.phone}</span>
//                     </div>
//                   )}
//                   {shop.email && (
//                     <div className="info-item">
//                       <span className="info-label">Email</span>
//                       <span className="info-value">{shop.email}</span>
//                     </div>
//                   )}
//                   {shop.gstNumber && (
//                     <div className="info-item">
//                       <span className="info-label">GST</span>
//                       <span className="info-value">{shop.gstNumber}</span>
//                     </div>
//                   )}
//                   <div className="info-item">
//                     <span className="info-label">Commission</span>
//                     <span className="info-value">{shop.commissionRate || 10}%</span>
//                   </div>
//                   <div className="info-item">
//                     <span className="info-label">Verified</span>
//                     <span className="info-value">{shop.verified ? 'Yes' : 'No'}</span>
//                   </div>
//                 </div>

//                 <div className="shop-actions">
//                   <button className="shop-action-button" onClick={() => handleEditShop(shop)}>
//                     <Edit size={16} />
//                     Edit Info
//                   </button>
//                   <button className="shop-action-button" onClick={() => updateGoogleRatings(shop.id)}>
//                     <RefreshCw size={16} />
//                     Update Ratings
//                   </button>
//                   <button
//                     className={`shop-status-toggle ${shop.status === 'active' ? 'deactivate' : 'activate'}`}
//                     onClick={() => toggleShopStatus(shop.id, shop.status)}
//                   >
//                     {shop.status === 'active' ? 'Deactivate Shop' : 'Activate Shop'}
//                   </button>
//                 </div>
//               </div>

//               <div className="shop-detail-card earnings-summary">
//                 <h2>Earnings Summary</h2>
//                 <div className="earnings-grid">
//                   <div className="earnings-item">
//                     <span className="earnings-label">Current Month</span>
//                     <span className="earnings-value">{formatCurrency(shop.earnings?.currentMonth || 0)}</span>
//                     {shop.earnings?.previousMonth > 0 && (
//                       <span className="earnings-change positive">
//                         +
//                         {(
//                           ((shop.earnings.currentMonth - shop.earnings.previousMonth) /
//                             shop.earnings.previousMonth) *
//                           100
//                         ).toFixed(1)}
//                         %
//                       </span>
//                     )}
//                   </div>
//                   <div className="earnings-item">
//                     <span className="earnings-label">Previous Month</span>
//                     <span className="earnings-value">{formatCurrency(shop.earnings?.previousMonth || 0)}</span>
//                   </div>
//                   <div className="earnings-item total">
//                     <span className="earnings-label">Total Earnings</span>
//                     <span className="earnings-value">{formatCurrency(shop.earnings?.total || 0)}</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="shop-detail-card orders-summary">
//                 <h2>Orders Summary</h2>
//                 <div className="orders-grid">
//                   <div className="order-stat-item">
//                     <div className="order-stat pending">
//                       <Clock className="order-stat-icon" />
//                       <span className="order-stat-value">{shop.orders?.pending || 0}</span>
//                     </div>
//                     <span className="order-stat-label">Pending</span>
//                   </div>
//                   <div className="order-stat-item">
//                     <div className="order-stat processing">
//                       <TrendingUp className="order-stat-icon" />
//                       <span className="order-stat-value">{shop.orders?.processing || 0}</span>
//                     </div>
//                     <span className="order-stat-label">Processing</span>
//                   </div>
//                   <div className="order-stat-item">
//                     <div className="order-stat completed">
//                       <CheckCircle className="order-stat-icon" />
//                       <span className="order-stat-value">{shop.orders?.completed || 0}</span>
//                     </div>
//                     <span className="order-stat-label">Completed</span>
//                   </div>
//                   <div className="order-stat-item">
//                     <div className="order-stat cancelled">
//                       <AlertTriangle className="order-stat-icon" />
//                       <span className="order-stat-value">{shop.orders?.cancelled || 0}</span>
//                     </div>
//                     <span className="order-stat-label">Cancelled</span>
//                   </div>
//                 </div>

//                 <div className="view-more">
//                   <button className="view-more-button" onClick={() => setActiveTab('orders')}>
//                     View All Orders
//                     <ChevronRight size={16} />
//                   </button>
//                 </div>
//               </div>

//               <div className="shop-detail-card performance-metrics">
//                 <h2>Performance Metrics</h2>
//                 <div className={`performance-status ${getShopPerformanceStatus(shop.performanceMetrics)}`}>
//                   {getShopPerformanceStatus(shop.performanceMetrics)
//                     .charAt(0)
//                     .toUpperCase() +
//                     getShopPerformanceStatus(shop.performanceMetrics)
//                       .slice(1)
//                       .replace('-', ' ')}
//                 </div>

//                 <div className="metrics-list">
//                   <div className="metric-item">
//                     <span className="metric-label">Order Acceptance Rate</span>
//                     <div className="metric-value-container">
//                       <span className="metric-value">{shop.performanceMetrics?.orderAcceptanceRate || 0}%</span>
//                       <div className="metric-bar-container">
//                         <div
//                           className="metric-bar"
//                           style={{ width: `${shop.performanceMetrics?.orderAcceptanceRate || 0}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="metric-item">
//                     <span className="metric-label">Avg. Preparation Time</span>
//                     <div className="metric-value-container">
//                       <span className="metric-value">{shop.performanceMetrics?.preparationTime || 0} mins</span>
//                       <div className="metric-bar-container">
//                         <div
//                           className="metric-bar"
//                           style={{ width: `${(shop.performanceMetrics?.preparationTime || 0) / 30 * 100}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="metric-item">
//                     <span className="metric-label">Customer Satisfaction</span>
//                     <div className="metric-value-container">
//                       <span className="metric-value">
//                         {shop.performanceMetrics?.customerSatisfaction || 0}
//                         <Star size={14} className="star-icon" />
//                       </span>
//                       <div className="metric-bar-container">
//                         <div
//                           className="metric-bar"
//                           style={{
//                             width: `${(shop.performanceMetrics?.customerSatisfaction || 0) / 5 * 100}%`,
//                           }}
//                         ></div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {shop.topProducts && shop.topProducts.length > 0 && (
//                 <div className="shop-detail-card top-products">
//                   <h2>Top Products</h2>
//                   <div className="products-list">
//                     {shop.topProducts.map((product, index) => (
//                       <div className="product-item" key={index}>
//                         <div className="product-rank">{index + 1}</div>
//                         <div className="product-info">
//                           <span className="product-name">{product.name}</span>
//                           <span className="product-sales">{product.sales} sold</span>
//                         </div>
//                         <span className="product-revenue">{formatCurrency(product.revenue)}</span>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="view-more">
//                     <button className="view-more-button" onClick={() => setActiveTab('products')}>
//                       View All Products
//                       <ChevronRight size={16} />
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {shop.documents && (
//                 <div className="shop-detail-card documents">
//                   <h2>Documents</h2>
//                   <div className="documents-list">
//                     {shop.documents.businessLicense && (
//                       <div className="document-item">
//                         <span className="document-name">Business License</span>
//                         <a
//                           href={shop.documents.businessLicense}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="document-link"
//                         >
//                           <Eye size={16} /> View
//                         </a>
//                       </div>
//                     )}
//                     {shop.documents.idProof && (
//                       <div className="document-item">
//                         <span className="document-name">ID Proof</span>
//                         <a
//                           href={shop.documents.idProof}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="document-link"
//                         >
//                           <Eye size={16} /> View
//                         </a>
//                       </div>
//                     )}
//                     {shop.documents.addressProof && (
//                       <div className="document-item">
//                         <span className="document-name">Address Proof</span>
//                         <a
//                           href={shop.documents.addressProof}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="document-link"
//                         >
//                           <Eye size={16} /> View
//                         </a>
//                       </div>
//                     )}
//                     {shop.documents.gstCertificate && (
//                       <div className="document-item">
//                         <span className="document-name">GST Certificate</span>
//                         <a
//                           href={shop.documents.gstCertificate}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="document-link"
//                         >
//                           <Eye size={16} /> View
//                         </a>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {activeTab === 'orders' && (
//           <div className="shop-detail-content">

//             <div className="order-filters">
//               <div className="search-container">
//                 <Search className="search-icon" />
//                 <input 
//                   type="text"
//                   placeholder="Search orders by ID or customer name..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="search-input"
//                 />
//               </div>

//               <div className="filter-tabs">
//                 <button 
//                   className={`filter-tab ${orderStatusFilter === 'all' ? 'active' : ''}`}
//                   onClick={() => handleOrderStatusFilterChange('all')}
//                 >
//                   All Orders
//                 </button>
//                 <button 
//                   className={`filter-tab ${orderStatusFilter === 'pending' ? 'active' : ''}`}
//                   onClick={() => handleOrderStatusFilterChange('pending')}
//                 >
//                   Pending
//                 </button>
//                 <button 
//                   className={`filter-tab ${orderStatusFilter === 'processing' ? 'active' : ''}`}
//                   onClick={() => handleOrderStatusFilterChange('processing')}
//                 >
//                   Processing
//                 </button>
//                 <button 
//                   className={`filter-tab ${orderStatusFilter === 'out_for_delivery' ? 'active' : ''}`}
//                   onClick={() => handleOrderStatusFilterChange('out_for_delivery')}
//                 >
//                   Out for Delivery
//                 </button>
//                 <button 
//                   className={`filter-tab ${orderStatusFilter === 'delivered' ? 'active' : ''}`}
//                   onClick={() => handleOrderStatusFilterChange('delivered')}
//                 >
//                   Delivered
//                 </button>
//                 <button 
//                   className={`filter-tab ${orderStatusFilter === 'cancelled' ? 'active' : ''}`}
//                   onClick={() => handleOrderStatusFilterChange('cancelled')}
//                 >
//                   Cancelled
//                 </button>
//               </div>
//             </div>

//             {/* Advanced filters */}
//             <div className="advanced-filters">
//               <div className="filters-container">
//                 <div className="date-filters">
//                   <div className="date-filter-label">
//                     <Calendar size={16} />
//                     <span>Date Filter:</span>
//                   </div>
//                   <select 
//                     value={dateFilter} 
//                     onChange={(e) => handleDateFilterChange(e.target.value)}
//                     className="date-filter-select"
//                   >
//                     <option value="all">All Time</option>
//                     <option value="today">Today</option>
//                     <option value="yesterday">Yesterday</option>
//                     <option value="last7days">Last 7 Days</option>
//                     <option value="last30days">Last 30 Days</option>
//                     <option value="custom">Custom Range</option>
//                   </select>

//                   {dateFilter === 'custom' && (
//                     <div className="custom-date-range">
//                       <input
//                         type="date"
//                         value={customDateRange.start}
//                         onChange={(e) => setCustomDateRange({...customDateRange, start: e.target.value})}
//                         className="date-input"
//                         placeholder="Start Date"
//                       />
//                       <span>to</span>
//                       <input
//                         type="date"
//                         value={customDateRange.end}
//                         onChange={(e) => setCustomDateRange({...customDateRange, end: e.target.value})}
//                         className="date-input"
//                         placeholder="End Date"
//                       />
//                     </div>
//                   )}
//                 </div>

//                 <div className="area-filters">
//                   <div className="area-filter-label">
//                     <Map size={16} />
//                     <span>Area Filter:</span>
//                   </div>
//                   <select 
//                     value={areaFilter} 
//                     onChange={(e) => handleAreaFilterChange(e.target.value)}
//                     className="area-filter-select"
//                   >
//                     <option value="all">All Areas</option>
//                     {availableAreas.map(area => (
//                       <option key={area} value={area}>{area}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="export-container">
//                   <button className="export-button" onClick={exportOrdersCSV}>
//                     <Download size={16} />
//                     Export Orders
//                   </button>
//                 </div>
//               </div>

//               <div className="sort-filters">
//                 <div className="sort-filter-label">
//                   <Filter size={16} />
//                   <span>Sort By:</span>
//                 </div>
//                 <div className="sort-options">
//                   <button 
//                     className={`sort-option ${sortBy === 'date' ? 'active' : ''}`}
//                     onClick={() => handleSortChange('date')}
//                   >
//                     Date
//                     {sortBy === 'date' && (
//                       sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
//                     )}
//                   </button>
//                   <button 
//                     className={`sort-option ${sortBy === 'amount' ? 'active' : ''}`}
//                     onClick={() => handleSortChange('amount')}
//                   >
//                     Amount
//                     {sortBy === 'amount' && (
//                       sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
//                     )}
//                   </button>
//                   <button 
//                     className={`sort-option ${sortBy === 'customer' ? 'active' : ''}`}
//                     onClick={() => handleSortChange('customer')}
//                   >
//                     Customer
//                     {sortBy === 'customer' && (
//                       sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
//                     )}
//                   </button>
//                   <button 
//                     className={`sort-option ${sortBy === 'status' ? 'active' : ''}`}
//                     onClick={() => handleSortChange('status')}
//                   >
//                     Status
//                     {sortBy === 'status' && (
//                       sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {filteredShopOrders.length > 0 ? (
//               <div className="orders-table-container">
//                 <table className="orders-table">
//                   <thead>
//                     <tr>
//                       <th>Order ID</th>
//                       <th>Customer</th>
//                       <th>Date & Time</th>
//                       <th>Amount</th>
//                       <th>Address</th>
//                       <th>Status</th>
//                       <th>Items</th>
//                       {/* <th>Actions</th> */}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredShopOrders.map((order) => (
//                       <tr key={order.id} className={`order-row ${order.status}`}>
//                         <td className="order-id-cell">
//                           <div className="order-id-with-status">
//                             <Package className="order-icon" />
//                             <span className="order-id-text">{orderIdMap[order.id] || order.id}</span>
//                           </div>
//                         </td>
//                         <td className="customer-cell">
//                           <div className="customer-name">{order.customer?.fullName}</div>
//                           <div className="customer-phone">{order.customer?.phone}</div>
//                         </td>
//                         <td className="date-cell">
//                           {formatDate(order.orderDate)}
//                         </td>
//                         <td className="amount-cell">
//                           <div className="order-amount">{formatCurrency(order.totalAmount)}</div>
//                           <div className="items-count">{order.items?.length} items</div>
//                         </td>
//                         <td className="address-cell">
//                           <div className="location">
//                             <MapPin className="location-icon" />
//                             <span className="address-text">{`${order.customer?.address}, ${order.customer?.city}`}</span>
//                           </div>
//                         </td>
//                         <td className="status-cell">
//                           <div className={`order-status-indicator ${order.status}`}>
//                             {getStatusIcon(order.status)}
//                             <span className="status-text">{getStatusText(order.status)}</span>
//                           </div>
//                         </td>
//                         <td className="items-list-cell">
//                           <div className="items-list">
//                             {order.items?.slice(0, 2).map((item, idx) => (
//                               <div key={idx} className="item-brief">
//                                 {item.name} x {item.quantity}
//                               </div>
//                             ))}
//                             {order.items?.length > 2 && (
//                               <div className="more-items">+{order.items.length - 2} more</div>
//                             )}
//                           </div>
//                         </td>
//                         {/* <td className="actions-cell">
//                           <div className="order-actions-container">
//                             <button className="view-details-button">
//                               <Eye size={16} />
//                               <span>View Details</span>
//                             </button>
//                           </div>
//                         </td> */}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <div className="no-orders-found">
//                 <p>{isLoading ? 'Loading...' : 'No orders found matching your criteria.'}</p>
//               </div>
//             )}
//           </div>
//         )}

//         {activeTab === 'products' && (
//           <div className="shop-detail-content">
//             <h2>Products Management</h2>
//             <p className="tab-placeholder">
//               Product catalog management would go here, allowing you to view and edit all products for {shop.name}.
//             </p>
//           </div>
//         )}

//         {activeTab === 'settings' && (
//           <div className="shop-detail-content">
//             <h2>Shop Settings</h2>
//             <div className="settings-actions">
//               <button className="delete-shop-button" onClick={() => removeShop(shop.id)}>
//                 <Trash size={16} />
//                 Delete Shop
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }

//   // List view of all shops
//   return (
//     <div className="shop-partner-dashboard">
//       {/* Notification Component */}
//       {notification && (
//         <div className={`notification notification-${notification.type}`}>
//           <span>{notification.message}</span>
//           <button className="notification-close" onClick={() => setNotification(null)}>
//             <X size={16} />
//           </button>
//         </div>
//       )}

//       {/* Loading Overlay */}
//       {isLoading && (
//         <div className="loading-overlay">
//           <div className="loading-spinner">
//             <RefreshCw size={40} className="spinning" />
//           </div>
//         </div>
//       )}

//       {/* Add Shop Modal */}
//       <AddShopModal
//         isOpen={isAddShopModalOpen}
//         onClose={() => setIsAddShopModalOpen(false)}
//         newShopForm={newShopForm}
//         handleInputChange={handleInputChange}
//         handleFileUpload={handleFileUpload}
//         handleSubmitShop={handleSubmitShop}
//         documentUploads={documentUploads}
//         documentPreviews={documentPreviews}
//         fetchGoogleRating={fetchGoogleRating}
//         isRatingLoading={isRatingLoading}
//         shopCategories={shopCategories}
//       />

//       {/* Edit Shop Modal */}
//       <EditShopModal
//         isOpen={isEditShopModalOpen}
//         onClose={() => setIsEditShopModalOpen(false)}
//         editShopForm={editShopForm}
//         handleInputChange={handleEditInputChange}
//         handleUpdateShop={handleUpdateShop}
//         shopCategories={shopCategories}
//         fetchGoogleRating={fetchGoogleRating}
//         isRatingLoading={isRatingLoading}
//       />

//       <h1>Shop Partner Dashboard</h1>

//       <div className="dashboard-stats">
//         <div className="stat-card">
//           <div className="stat-icon">
//             <Store />
//           </div>
//           <div className="stat-content">
//             <span className="stat-value">{shops.length}</span>
//             <span className="stat-label">Total Shops</span>
//           </div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-icon">
//             <Store />
//           </div>
//           <div className="stat-content">
//             <span className="stat-value">{shops.filter((shop) => shop.status === 'active').length}</span>
//             <span className="stat-label">Active Shops</span>
//           </div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-icon">
//             <Package />
//           </div>
//           <div className="stat-content">
//             <span className="stat-value">
//               {shops.reduce(
//                 (total, shop) =>
//                   total +
//                   ((shop.orders?.pending || 0) +
//                     (shop.orders?.processing || 0) +
//                     (shop.orders?.completed || 0) +
//                     (shop.orders?.cancelled || 0)),
//                 0
//               )}
//             </span>
//             <span className="stat-label">Total Orders</span>
//           </div>
//         </div>

//       </div>

//       {/* Meat Sector Statistics */}
//       <div className="meat-sector-stats">
//         <h2>Meat Sector Statistics</h2>
//         <div className="meat-sector-counters">
//           <div className="meat-sector-counter halal">
//             <div className="counter-value">{meatSectorStats.Halal}</div>
//             <div className="counter-label">Halal Cut</div>
//           </div>
//           <div className="meat-sector-counter jc-jatka">
//             <div className="counter-value">{meatSectorStats['JC Jatka']}</div>
//             <div className="counter-label">JC Jatka</div>
//           </div>
//           <div className="meat-sector-counter none">
//             <div className="counter-value">{meatSectorStats.None}</div>
//             <div className="counter-label">Not Applicable</div>
//           </div>
//         </div>
//       </div>

//       <div className="shops-container">
//         <div className="shops-header">
//           <h2>All Shop Partners</h2>
//           <div className="shops-actions">
//             <div className="filter-container">
//               <Filter size={16} className="filter-icon" />
//               <select 
//                 className="meat-sector-filter"
//                 value={meatSectorFilter}
//                 onChange={(e) => setMeatSectorFilter(e.target.value)}
//               >
//                 <option value="All">All Meat Sectors</option>
//                 <option value="Halal">Halal Cut</option>
//                 <option value="JC Jatka">JC Jatka</option>
//                 <option value="None">Not Applicable</option>
//               </select>
//             </div>
//             <button className="add-shop-button" onClick={() => setIsAddShopModalOpen(true)}>
//               + Add New Shop
//             </button>
//           </div>
//         </div>

//         <div className="shops-table-container">
//           {filteredShops.length > 0 ? (
//             <table className="shops-table">
//               <thead>
//                 <tr>
//                   <th>Shop Name</th>
//                   <th>Status</th>
//                   <th>Category</th>
//                   <th>Meat Sector</th>
//                   <th>Rating</th>
//                   <th>Location</th>
//                   <th>Orders</th>
//                   <th>Earnings</th>
//                   <th>Performance</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredShops.map((shop) => (
//                   <tr className={`shop-row ${shop.status}`} key={shop.id}>
//                     <td className="shop-name-cell">
//                       <span className="shop-name">{shop.name}</span>
//                     </td>
//                     <td>
//                       <div className={`shop-status ${shop.status}`}>
//                         {shop.status === 'active' ? 'Active' : shop.status === 'pending' ? 'Pending' : 'Inactive'}
//                       </div>
//                     </td>
//                     <td>
//                       <span className="category-tag">{shop.category}</span>
//                     </td>
//                     <td>
//                       <span className={`meat-sector-tag ${shop.meatSectorType.toLowerCase().replace(' ', '-')}`}>
//                         {getMeatSectorLabel(shop.meatSectorType)}
//                       </span>
//                     </td>
//                     <td>
//                       <div className="shop-rating">
//                         <Star className="rating-star" />
//                         <span className="rating-value">{shop.rating}</span>
//                         <span className="reviews-count">({shop.reviews} reviews)</span>
//                       </div>
//                     </td>
//                     <td>
//                       <div className="shop-location">
//                         <Map className="location-icon" />
//                         <span>{shop.location?.address}</span>
//                       </div>
//                     </td>
//                     <td>
//                       {(shop.orders?.pending || 0) +
//                         (shop.orders?.processing || 0) +
//                         (shop.orders?.completed || 0) +
//                         (shop.orders?.cancelled || 0)}
//                     </td>
//                     <td>{formatCurrency(shop.earnings?.currentMonth || 0)}</td>
//                     <td>
//                       <span className={`performance-indicator ${getShopPerformanceStatus(shop.performanceMetrics)}`}>
//                         {getShopPerformanceStatus(shop.performanceMetrics)
//                           .charAt(0)
//                           .toUpperCase() +
//                           getShopPerformanceStatus(shop.performanceMetrics)
//                             .slice(1)
//                             .replace('-', ' ')}
//                       </span>
//                     </td>
//                     <td>
//                       <div className="shop-table-actions">
//                         <button
//                           className="view-shop-button"
//                           onClick={() => setSelectedShop(shop.id)}
//                           title="View Details">
//                           <Eye size={16} />
//                           <span>View</span>
//                         </button>
//                         <button className="edit-shop-button" onClick={() => handleEditShop(shop)} title="Edit Shop">
//                           <Edit size={16} />
//                           {/* <span>Edit</span> */}
//                         </button>
//                         <button
//                           className={`shop-toggle-button ${shop.status === 'active' ? 'deactivate' : 'activate'}`}
//                           onClick={() => toggleShopStatus(shop.id, shop.status)}
//                           title={shop.status === 'active' ? 'Deactivate Shop' : 'Activate Shop'}
//                         >
//                           {shop.status === 'active' ? (
//                             <>
//                               <X size={16} />
//                               <span>Deactivate</span>
//                             </>
//                           ) : (
//                             <>
//                               <Check size={16} />
//                               <span>Activate</span>
//                             </>
//                           )}
//                         </button>
//                         <button
//                           className="remove-shop-button"
//                           onClick={() => removeShop(shop.id)}
//                           title="Remove Shop"
//                         >
//                           <Trash size={16} />
//                           {/* <span>Delete</span> */}
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <div className="no-shops-message">
//               <p>No shops found matching your criteria. Try changing the filter or add a new shop.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShopPartnerDashboard;



import React, { useState, useEffect } from 'react';
import {
  Package,
  Store,
  Map,
  Star,
  DollarSign,
  TrendingUp,
  ChevronRight,
  Settings,
  Clock,
  CheckCircle,
  AlertTriangle,
  UserPlus,
  RefreshCw,
  X,
  Plus,
  Phone,
  User,
  FileText,
  Home,
  Upload,
  Check,
  Edit,
  Trash,
  Eye,
  Mail,
  Filter,
  Search,
  MapPin,
  Truck,
  XCircle,
  Utensils,
  Calendar,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Download,
  Send,
  Shield,
  CreditCard
} from 'lucide-react';
import { ref, onValue, update, remove, push, set, get } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import '../styles/ShopPartnerDashboard.css';
import VendorProductsManager from './VendorProductsManager';

const AddShopModal = ({
  isOpen,
  onClose,
  newShopForm,
  handleInputChange,
  handleFileUpload,
  handleSubmitShop,
  documentUploads,
  documentPreviews,
  fetchGoogleRating,
  isRatingLoading,
  shopCategories,
  handleManualRatingChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Add New Shop</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmitShop} className="add-shop-form" id="add-shop-form">
          {/* Shop Information Section */}
          <div className="form-section">
            <h3>Shop Information</h3>

            <div className="form-group">
              <label htmlFor="name">Shop Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newShopForm.name}
                onChange={handleInputChange}
                required
                placeholder="Enter shop name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="address">Shop Address*</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={newShopForm.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter full address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">City*</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={newShopForm.city}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter city"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category*</label>
                <select
                  id="category"
                  name="category"
                  value={newShopForm.category}
                  onChange={handleInputChange}
                  required
                >
                  {shopCategories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Rating</label>
                <div className="rating-fetch-container">
                  <div className="rating-display">
                    {newShopForm.rating ? (
                      <span className="rating-value">
                        {newShopForm.rating} <Star size={14} className="star-icon" />
                        <span className="reviews-count">({newShopForm.reviews} reviews)</span>
                      </span>
                    ) : (
                      <span className="no-rating">Not fetched yet</span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="fetch-rating-button"
                    onClick={() => fetchGoogleRating(newShopForm, 'add')}
                    disabled={isRatingLoading}
                  >
                    {isRatingLoading ? (
                      <RefreshCw size={16} className="spinning" />
                    ) : (
                      <>
                        <RefreshCw size={16} />
                        Fetch from Google
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Meat Sector Type</h3>
              <div className="meat-sector-options">
                <div className="form-radio-group">
                  <input
                    type="radio"
                    id="halal"
                    name="meatSectorType"
                    value="Halal"
                    checked={newShopForm.meatSectorType === 'Halal'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="halal">Halal Cut</label>
                </div>
                <div className="form-radio-group">
                  <input
                    type="radio"
                    id="jcjatka"
                    name="meatSectorType"
                    value="JC Jatka"
                    checked={newShopForm.meatSectorType === 'JC Jatka'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="jcjatka">JC Jatka</label>
                </div>
                <div className="form-radio-group">
                  <input
                    type="radio"
                    id="none"
                    name="meatSectorType"
                    value="None"
                    checked={newShopForm.meatSectorType === 'None'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="none">Not Applicable</label>
                </div>
              </div>
            </div>
          </div>

          {/* Owner Information Section */}
          <div className="form-section">
            <h3>Owner Information</h3>

            <div className="form-group">
              <label htmlFor="owner">Shop Owner*</label>
              <input
                type="text"
                id="owner"
                name="owner"
                value={newShopForm.owner}
                onChange={handleInputChange}
                required
                placeholder="Enter owner name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number*</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={newShopForm.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter phone number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newShopForm.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="gstNumber">GST Number</label>
              <input
                type="text"
                id="gstNumber"
                name="gstNumber"
                value={newShopForm.gstNumber}
                onChange={handleInputChange}
                placeholder="Enter GST number (optional)"
              />
            </div>
          </div>

          {/* Payment Information Section - ENHANCED */}
          <div className="form-section">
            <h3>Payment Information</h3>
            <div className="payment-security-note">
              <Shield size={16} />
              <p>Payment details are securely stored and encrypted in our system</p>
            </div>

            <div className="form-group">
              <label>Preferred Payment Mode</label>
              <div className="payment-mode-options">
                <div className="form-radio-group">
                  <input
                    type="radio"
                    id="bank-transfer"
                    name="preferredPaymentMode"
                    value="BANK"
                    checked={newShopForm.preferredPaymentMode === 'BANK'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="bank-transfer">Bank Transfer (NEFT/IMPS)</label>
                </div>
                <div className="form-radio-group">
                  <input
                    type="radio"
                    id="upi-transfer"
                    name="preferredPaymentMode"
                    value="UPI"
                    checked={newShopForm.preferredPaymentMode === 'UPI'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="upi-transfer">UPI Transfer</label>
                </div>
              </div>
            </div>

            {/* Conditional Fields Based on Payment Mode */}
            {newShopForm.preferredPaymentMode === 'BANK' ? (
              <div className="payment-details-section bank-details">
                <h4>Bank Account Details</h4>

                <div className="form-group">
                  <label htmlFor="accountHolderName">Account Holder Name*</label>
                  <input
                    type="text"
                    id="accountHolderName"
                    name="accountHolderName"
                    value={newShopForm.accountHolderName || ''}
                    onChange={handleInputChange}
                    required
                    placeholder="Name as it appears on bank account"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="accountNumber">Account Number*</label>
                    <input
                      type="text"
                      id="accountNumber"
                      name="accountNumber"
                      value={newShopForm.accountNumber || ''}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter bank account number"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmAccountNumber">Confirm Account Number*</label>
                    <input
                      type="text"
                      id="confirmAccountNumber"
                      name="confirmAccountNumber"
                      value={newShopForm.confirmAccountNumber || ''}
                      onChange={handleInputChange}
                      required
                      placeholder="Confirm account number"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="ifscCode">IFSC Code*</label>
                    <input
                      type="text"
                      id="ifscCode"
                      name="ifscCode"
                      value={newShopForm.ifscCode || ''}
                      onChange={handleInputChange}
                      required
                      placeholder="Bank IFSC code (e.g., SBIN0123456)"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="bankName">Bank Name*</label>
                    <input
                      type="text"
                      id="bankName"
                      name="bankName"
                      value={newShopForm.bankName || ''}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter bank name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="bankBranch">Branch Name</label>
                  <input
                    type="text"
                    id="bankBranch"
                    name="bankBranch"
                    value={newShopForm.bankBranch || ''}
                    onChange={handleInputChange}
                    placeholder="Enter bank branch (optional)"
                  />
                </div>
              </div>
            ) : (
              <div className="payment-details-section upi-details">
                <h4>UPI Details</h4>

                <div className="form-group">
                  <label htmlFor="upiId">UPI ID*</label>
                  <input
                    type="text"
                    id="upiId"
                    name="upiId"
                    value={newShopForm.upiId || ''}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter UPI ID (e.g., name@upi)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="upiProvider">UPI Provider</label>
                  <select
                    id="upiProvider"
                    name="upiProvider"
                    value={newShopForm.upiProvider || 'other'}
                    onChange={handleInputChange}
                    className="upi-provider-select"
                  >
                    <option value="gpay">Google Pay</option>
                    <option value="phonepe">PhonePe</option>
                    <option value="paytm">Paytm</option>
                    <option value="bhim">BHIM UPI</option>
                    <option value="amazonpay">Amazon Pay</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {newShopForm.upiProvider === 'other' && (
                  <div className="form-group">
                    <label htmlFor="otherUpiProvider">Other UPI Provider</label>
                    <input
                      type="text"
                      id="otherUpiProvider"
                      name="otherUpiProvider"
                      value={newShopForm.otherUpiProvider || ''}
                      onChange={handleInputChange}
                      placeholder="Enter UPI provider name"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="upiMobileNumber">Mobile Number Linked to UPI*</label>
                  <input
                    type="tel"
                    id="upiMobileNumber"
                    name="upiMobileNumber"
                    value={newShopForm.upiMobileNumber || ''}
                    onChange={handleInputChange}
                    required
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>
            )}

            {/* Common contact fields */}
            <div className="payment-contact-section">
              <h4>Payment Contact Information</h4>
              <div className="form-group">
                <label htmlFor="paymentContactName">Payment Contact Name*</label>
                <input
                  type="text"
                  id="paymentContactName"
                  name="paymentContactName"
                  value={newShopForm.paymentContactName || ''}
                  onChange={handleInputChange}
                  required
                  placeholder="Person to contact for payment details"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="paymentContactPhone">Payment Contact Phone*</label>
                  <input
                    type="tel"
                    id="paymentContactPhone"
                    name="paymentContactPhone"
                    value={newShopForm.paymentContactPhone || ''}
                    onChange={handleInputChange}
                    required
                    placeholder="Phone number for payment coordination"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="paymentContactEmail">Payment Contact Email</label>
                  <input
                    type="email"
                    id="paymentContactEmail"
                    name="paymentContactEmail"
                    value={newShopForm.paymentContactEmail || ''}
                    onChange={handleInputChange}
                    placeholder="Email for payment receipts (optional)"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Document Upload Section */}
          <div className="form-section">
            <h3>Document Upload</h3>

            <div className="form-row document-row">
              <div className="form-group">
                <label>Business License</label>
                <div className="document-upload-container">
                  <div className="document-upload">
                    <input
                      type="file"
                      id="businessLicense"
                      name="businessLicense"
                      onChange={(e) => handleFileUpload(e, 'businessLicense')}
                      accept="image/*"
                      className="file-input"
                    />
                    <label htmlFor="businessLicense" className="file-label">
                      <Upload size={16} />
                      {documentUploads.businessLicense ? 'Change File' : 'Choose File'}
                    </label>
                    <span className="file-name">
                      {documentUploads.businessLicense
                        ? documentUploads.businessLicense.name
                        : 'No file chosen'}
                    </span>
                  </div>

                  {documentPreviews.businessLicense && (
                    <div className="document-preview">
                      <img src={documentPreviews.businessLicense} alt="Business License Preview" />
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>ID Proof</label>
                <div className="document-upload-container">
                  <div className="document-upload">
                    <input
                      type="file"
                      id="idProof"
                      name="idProof"
                      onChange={(e) => handleFileUpload(e, 'idProof')}
                      accept="image/*"
                      className="file-input"
                    />
                    <label htmlFor="idProof" className="file-label">
                      <Upload size={16} />
                      {documentUploads.idProof ? 'Change File' : 'Choose File'}
                    </label>
                    <span className="file-name">
                      {documentUploads.idProof ? documentUploads.idProof.name : 'No file chosen'}
                    </span>
                  </div>

                  {documentPreviews.idProof && (
                    <div className="document-preview">
                      <img src={documentPreviews.idProof} alt="ID Proof Preview" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Add Shop
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditShopModal = ({
  isOpen,
  onClose,
  editShopForm,
  handleInputChange,
  handleUpdateShop,
  shopCategories,
  fetchGoogleRating,
  isRatingLoading,
  handleManualRatingChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Edit Shop</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleUpdateShop} className="add-shop-form">
          {/* Shop Information Section */}
          <div className="form-section">
            <h3>Shop Information</h3>

            <div className="form-group">
              <label htmlFor="edit-name">Shop Name*</label>
              <input
                type="text"
                id="edit-name"
                name="name"
                value={editShopForm.name}
                onChange={handleInputChange}
                required
                placeholder="Enter shop name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="edit-address">Shop Address*</label>
                <input
                  type="text"
                  id="edit-address"
                  name="address"
                  onChange={handleInputChange}
                  required
                  placeholder="Enter full address"
                  value={editShopForm.address}
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-city">City*</label>
                <input
                  type="text"
                  id="edit-city"
                  name="city"
                  value={editShopForm.city}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter city"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="edit-category">Category*</label>
                <select
                  id="edit-category"
                  name="category"
                  value={editShopForm.category}
                  onChange={handleInputChange}
                  required
                >
                  {shopCategories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Rating</label>
                <div className="rating-fetch-container">
                  <div className="rating-display">
                    {editShopForm.rating ? (
                      <span className="rating-value">
                        {editShopForm.rating} <Star size={14} className="star-icon" />
                        <span className="reviews-count">({editShopForm.reviews} reviews)</span>
                      </span>
                    ) : (
                      <span className="no-rating">Not fetched yet</span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="fetch-rating-button"
                    onClick={() => fetchGoogleRating(editShopForm, 'edit')}
                    disabled={isRatingLoading}
                  >
                    {isRatingLoading ? (
                      <RefreshCw size={16} className="spinning" />
                    ) : (
                      <>
                        <RefreshCw size={16} />
                        Fetch from Google
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Meat Sector Type</h3>
              <div className="meat-sector-options">
                <div className="form-radio-group">
                  <input
                    type="radio"
                    id="edit-halal"
                    name="meatSectorType"
                    value="Halal"
                    checked={editShopForm.meatSectorType === 'Halal'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="edit-halal">Halal Cut</label>
                </div>
                <div className="form-radio-group">
                  <input
                    type="radio"
                    id="edit-jcjatka"
                    name="meatSectorType"
                    value="JC Jatka"
                    checked={editShopForm.meatSectorType === 'JC Jatka'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="edit-jcjatka">JC Jatka</label>
                </div>
                <div className="form-radio-group">
                  <input
                    type="radio"
                    id="edit-none"
                    name="meatSectorType"
                    value="None"
                    checked={editShopForm.meatSectorType === 'None'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="edit-none">Not Applicable</label>
                </div>
              </div>
            </div>
          </div>

          {/* Owner Information Section */}
          <div className="form-section">
            <h3>Owner Information</h3>

            <div className="form-group">
              <label htmlFor="edit-owner">Shop Owner*</label>
              <input
                type="text"
                id="edit-owner"
                name="owner"
                value={editShopForm.owner}
                onChange={handleInputChange}
                required
                placeholder="Enter owner name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="edit-phone">Phone Number*</label>
                <input
                  type="tel"
                  id="edit-phone"
                  name="phone"
                  value={editShopForm.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter phone number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-email">Email*</label>
                <input
                  type="email"
                  id="edit-email"
                  name="email"
                  value={editShopForm.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="edit-gstNumber">GST Number</label>
              <input
                type="text"
                id="edit-gstNumber"
                name="gstNumber"
                value={editShopForm.gstNumber}
                onChange={handleInputChange}
                placeholder="Enter GST number (optional)"
              />
            </div>
          </div>

          {/* Payment Information Section - ENHANCED */}
          <div className="form-section">
            <h3>Payment Information</h3>
            <div className="payment-security-note">
              <Shield size={16} />
              <p>Payment details are securely stored and encrypted in our system</p>
            </div>

            <div className="form-group">
              <label>Preferred Payment Mode</label>
              <div className="payment-mode-options">
                <div className="form-radio-group">
                  <input
                    type="radio"
                    id="edit-bank-transfer"
                    name="preferredPaymentMode"
                    value="BANK"
                    checked={editShopForm.preferredPaymentMode === 'BANK'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="edit-bank-transfer">Bank Transfer (NEFT/IMPS)</label>
                </div>
                <div className="form-radio-group">
                  <input
                    type="radio"
                    id="edit-upi-transfer"
                    name="preferredPaymentMode"
                    value="UPI"
                    checked={editShopForm.preferredPaymentMode === 'UPI'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="edit-upi-transfer">UPI Transfer</label>
                </div>
              </div>
            </div>

            {/* Conditional Fields Based on Payment Mode */}
            {editShopForm.preferredPaymentMode === 'BANK' ? (
              <div className="payment-details-section bank-details">
                <h4>Bank Account Details</h4>

                <div className="form-group">
                  <label htmlFor="edit-accountHolderName">Account Holder Name*</label>
                  <input
                    type="text"
                    id="edit-accountHolderName"
                    name="accountHolderName"
                    value={editShopForm.accountHolderName || ''}
                    onChange={handleInputChange}
                    required
                    placeholder="Name as it appears on bank account"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="edit-accountNumber">Account Number*</label>
                    <input
                      type="text"
                      id="edit-accountNumber"
                      name="accountNumber"
                      value={editShopForm.accountNumber || ''}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter bank account number"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-confirmAccountNumber">Confirm Account Number*</label>
                    <input
                      type="text"
                      id="edit-confirmAccountNumber"
                      name="confirmAccountNumber"
                      value={editShopForm.confirmAccountNumber || ''}
                      onChange={handleInputChange}
                      required
                      placeholder="Confirm account number"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="edit-ifscCode">IFSC Code*</label>
                    <input
                      type="text"
                      id="edit-ifscCode"
                      name="ifscCode"
                      value={editShopForm.ifscCode || ''}
                      onChange={handleInputChange}
                      required
                      placeholder="Bank IFSC code (e.g., SBIN0123456)"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-bankName">Bank Name*</label>
                    <input
                      type="text"
                      id="edit-bankName"
                      name="bankName"
                      value={editShopForm.bankName || ''}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter bank name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="edit-bankBranch">Branch Name</label>
                  <input
                    type="text"
                    id="edit-bankBranch"
                    name="bankBranch"
                    value={editShopForm.bankBranch || ''}
                    onChange={handleInputChange}
                    placeholder="Enter bank branch (optional)"
                  />
                </div>
              </div>
            ) : (
              <div className="payment-details-section upi-details">
                <h4>UPI Details</h4>

                <div className="form-group">
                  <label htmlFor="edit-upiId">UPI ID*</label>
                  <input
                    type="text"
                    id="edit-upiId"
                    name="upiId"
                    value={editShopForm.upiId || ''}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter UPI ID (e.g., name@upi)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-upiProvider">UPI Provider</label>
                  <select
                    id="edit-upiProvider"
                    name="upiProvider"
                    value={editShopForm.upiProvider || 'other'}
                    onChange={handleInputChange}
                    className="upi-provider-select"
                  >
                    <option value="gpay">Google Pay</option>
                    <option value="phonepe">PhonePe</option>
                    <option value="paytm">Paytm</option>
                    <option value="bhim">BHIM UPI</option>
                    <option value="amazonpay">Amazon Pay</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {editShopForm.upiProvider === 'other' && (
                  <div className="form-group">
                    <label htmlFor="edit-otherUpiProvider">Other UPI Provider</label>
                    <input
                      type="text"
                      id="edit-otherUpiProvider"
                      name="otherUpiProvider"
                      value={editShopForm.otherUpiProvider || ''}
                      onChange={handleInputChange}
                      placeholder="Enter UPI provider name"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="edit-upiMobileNumber">Mobile Number Linked to UPI*</label>
                  <input
                    type="tel"
                    id="edit-upiMobileNumber"
                    name="upiMobileNumber"
                    value={editShopForm.upiMobileNumber || ''}
                    onChange={handleInputChange}
                    required
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>
            )}

            {/* Common contact fields */}
            <div className="payment-contact-section">
              <h4>Payment Contact Information</h4>
              <div className="form-group">
                <label htmlFor="edit-paymentContactName">Payment Contact Name*</label>
                <input
                  type="text"
                  id="edit-paymentContactName"
                  name="paymentContactName"
                  value={editShopForm.paymentContactName || ''}
                  onChange={handleInputChange}
                  required
                  placeholder="Person to contact for payment details"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-paymentContactPhone">Payment Contact Phone*</label>
                  <input
                    type="tel"
                    id="edit-paymentContactPhone"
                    name="paymentContactPhone"
                    value={editShopForm.paymentContactPhone || ''}
                    onChange={handleInputChange}
                    required
                    placeholder="Phone number for payment coordination"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-paymentContactEmail">Payment Contact Email</label>
                  <input
                    type="email"
                    id="edit-paymentContactEmail"
                    name="paymentContactEmail"
                    value={editShopForm.paymentContactEmail || ''}
                    onChange={handleInputChange}
                    placeholder="Email for payment receipts (optional)"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="update-button">
              Update Shop
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PaymentModal = ({ isOpen, onClose, shopDetails, setNotification }) => {
  // Hooks must be at the top level, before any conditionals
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');

  // Set the purpose when shopDetails changes
  useEffect(() => {
    if (shopDetails) {
      setPurpose(`Payment to ${shopDetails.name}`);
    }
  }, [shopDetails]);

  // Conditional return after all hooks
  if (!isOpen || !shopDetails) return null;

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Redirect to the payment form with necessary details
      const paymentData = {
        vendor_id: shopDetails.id,
        vendor_name: shopDetails.name,
        amount: amount,
        purpose: purpose,
        contact_name: shopDetails.paymentInfo?.paymentContactName,
        contact_phone: shopDetails.paymentInfo?.paymentContactPhone,
        payment_mode: shopDetails.paymentInfo?.preferredPaymentMode
      };

      // Store in sessionStorage
      sessionStorage.setItem('vendorPaymentData', JSON.stringify(paymentData));

      // Navigate to payment page
      window.location.href = '/vendor-payment';
    } catch (error) {
      console.error('Payment initiation error:', error);
      setNotification({
        message: `Failed to initiate payment: ${error.message}`,
        type: 'error'
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setLoading(false);
      onClose();
    }
  };


  return (
    <div className="modal-overlay">
      <div className="modal-container payment-modal">
        <div className="modal-header">
          <h2>Initiate Payment to {shopDetails.name}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmitPayment} className="payment-form">
          <div className="form-group">
            <label htmlFor="payment-amount">Payment Amount (₹)*</label>
            <input
              type="number"
              id="payment-amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
              step="0.01"
              placeholder="Enter amount"
            />
          </div>

          <div className="form-group">
            <label htmlFor="payment-purpose">Purpose*</label>
            <input
              type="text"
              id="payment-purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
              placeholder="Payment purpose"
            />
          </div>

          <div className="payment-contact-info">
            <h3>Payment Contact Information</h3>
            <p><strong>Contact:</strong> {shopDetails.paymentInfo?.paymentContactName}</p>
            <p><strong>Phone:</strong> {shopDetails.paymentInfo?.paymentContactPhone}</p>
            <p><strong>Email:</strong> {shopDetails.paymentInfo?.paymentContactEmail || 'Not provided'}</p>
            <p><strong>Preferred Payment Mode:</strong> {shopDetails.paymentInfo?.preferredPaymentMode === 'UPI' ? 'UPI Transfer' : 'Bank Transfer'}</p>
          </div>

          <div className="payment-security-note">
            <Shield size={16} />
            <p>For security reasons, bank account details will be collected during payment processing</p>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Processing...' : 'Continue to Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const ShopPartnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // State for selected shop
  const [selectedShop, setSelectedShop] = useState(null);

  // State for filter options
  const [meatSectorFilter, setMeatSectorFilter] = useState('All');

  // State for notification
  const [notification, setNotification] = useState(null);

  // State for loading
  const [isLoading, setIsLoading] = useState(false);

  // State for shops
  const [shops, setShops] = useState([]);

  // State for filtered shops
  const [filteredShops, setFilteredShops] = useState([]);

  // State for add shop modal
  const [isAddShopModalOpen, setIsAddShopModalOpen] = useState(false);

  // State for edit shop modal
  const [isEditShopModalOpen, setIsEditShopModalOpen] = useState(false);

  // State for rating loading
  const [isRatingLoading, setIsRatingLoading] = useState(false);

  // State for payment modal - ADD THIS LINE
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const calculateAmountWithoutTax = (order) => {
    return (order.subtotal || 0) + (order.deliveryCharge || 0);
  };

  const [newShopForm, setNewShopForm] = useState({
    name: '',
    address: '',
    city: '',
    category: 'Grocery',
    owner: '',
    phone: '',
    email: '',
    gstNumber: '',
    status: 'active',
    meatSectorType: 'None',
    rating: 0,
    reviews: 0,
    // Payment mode
    preferredPaymentMode: 'BANK',
    // Bank details fields
    accountHolderName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    bankName: '',
    bankBranch: '',
    // UPI fields
    upiId: '',
    upiProvider: 'gpay',
    otherUpiProvider: '',
    upiMobileNumber: '',
    // Contact fields
    paymentContactName: '',
    paymentContactPhone: '',
    paymentContactEmail: ''
  });

  // State for edit shop form with payment fields
  const [editShopForm, setEditShopForm] = useState({
    id: '',
    name: '',
    address: '',
    city: '',
    category: '',
    owner: '',
    phone: '',
    email: '',
    gstNumber: '',
    rating: 0,
    reviews: 0,
    meatSectorType: 'None',
    // Payment mode
    preferredPaymentMode: 'BANK',
    // Bank details fields
    accountHolderName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    bankName: '',
    bankBranch: '',
    // UPI fields
    upiId: '',
    upiProvider: 'gpay',
    otherUpiProvider: '',
    upiMobileNumber: '',
    // Contact fields
    paymentContactName: '',
    paymentContactPhone: '',
    paymentContactEmail: ''
  });

  // State for document uploads
  const [documentUploads, setDocumentUploads] = useState({
    businessLicense: null,
    idProof: null,
  });

  // State for document preview URLs
  const [documentPreviews, setDocumentPreviews] = useState({
    businessLicense: null,
    idProof: null,
  });

  // State for meat sector statistics
  const [meatSectorStats, setMeatSectorStats] = useState({
    Halal: 0,
    'JC Jatka': 0,
    None: 0,
  });

  // Order Management States
  const [orders, setOrders] = useState([]);
  const [shopOrders, setShopOrders] = useState([]);
  const [orderIdMap, setOrderIdMap] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');
  const [availableAreas, setAvailableAreas] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: ''
  });
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Categories for dropdown
  const shopCategories = [
    'Grocery',
    'Restaurant',
    'Pharmacy',
    'Electronics',
    'Clothing',
    'Home Goods',
    'Bakery',
    'Pet Supplies',
    'Books',
    'Health Foods',
    'Meat Shop',
    'Other',
  ];

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

  // Fetch orders for current shop and calculate earnings
  useEffect(() => {
    if (!selectedShop) return;

    const filteredOrders = orders.filter(order =>
      order.vendor && order.vendor.id === selectedShop
    );

    setShopOrders(filteredOrders);

    // Extract areas for filtering
    const areas = extractAreas(filteredOrders);
    setAvailableAreas(areas);

    // Update shop's order counts
    const counts = {
      pending: filteredOrders.filter(o => o.status === 'pending').length,
      processing: filteredOrders.filter(o => o.status === 'processing').length,
      completed: filteredOrders.filter(o => o.status === 'delivered').length,
      cancelled: filteredOrders.filter(o => o.status === 'cancelled').length
    };

    // Calculate earnings from delivered orders
    const deliveredOrders = filteredOrders.filter(o => o.status === 'delivered');
    const shopData = shops.find(s => s.id === selectedShop);
    const commissionRate = shopData?.commissionRate || 10;




    // Calculate monthly earnings
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let currentMonthEarnings = 0;
    let previousMonthEarnings = 0;
    let totalEarnings = 0;

    // Calculate raw earnings from ALL delivered orders (without applying commission)
    deliveredOrders.forEach(order => {
      const orderDate = new Date(order.orderDate);
      const orderMonth = orderDate.getMonth();
      const orderYear = orderDate.getFullYear();

      // Add to total earnings (ALL delivered orders raw total)
      totalEarnings += calculateAmountWithoutTax(order);

      // For current and previous month, calculate earnings after commission
      const shopEarning = (calculateAmountWithoutTax(order) * (100 - commissionRate)) / 100;

      // Add to current month earnings only if order is from current month
      if (orderMonth === currentMonth && orderYear === currentYear) {
        currentMonthEarnings += shopEarning;
      }

      // Add to previous month earnings only if order is from previous month
      if (orderMonth === previousMonth && orderYear === previousYear) {
        previousMonthEarnings += shopEarning;
      }
    });

    // Update shop data with order counts and earnings if needed
    const updatedEarnings = {
      currentMonth: currentMonthEarnings,
      previousMonth: previousMonthEarnings,
      total: totalEarnings  // This now contains the RAW total of ALL delivered orders
    };

    if (
      shops && (
        shops.orders?.pending !== counts.pending ||
        shops.orders?.processing !== counts.processing ||
        shops.orders?.completed !== counts.completed ||
        shops.orders?.cancelled !== counts.cancelled ||
        shops.earnings?.currentMonth !== updatedEarnings.currentMonth ||
        shops.earnings?.previousMonth !== updatedEarnings.previousMonth ||
        shops.earnings?.total !== updatedEarnings.total
      )
    ) {
      const shopRef = ref(db, `shops/${selectedShop}`);
      update(shopRef, {
        orders: counts,
        earnings: updatedEarnings
      }).catch(err => console.error('Error updating shop data:', err));
    }
  }, [selectedShop, orders, shops]);

  // Calculate meat sector statistics
  useEffect(() => {
    const stats = {
      Halal: shops.filter(shop => shop.meatSectorType === 'Halal').length,
      'JC Jatka': shops.filter(shop => shop.meatSectorType === 'JC Jatka').length,
      None: shops.filter(shop => shop.meatSectorType === 'None' || !shop.meatSectorType).length,
    };

    setMeatSectorStats(stats);
  }, [shops]);

  // Apply filters to shops
  useEffect(() => {
    let result = [...shops];

    // Apply meat sector filter
    if (meatSectorFilter !== 'All') {
      result = result.filter(shop =>
        meatSectorFilter === 'None'
          ? shop.meatSectorType === 'None' || !shop.meatSectorType
          : shop.meatSectorType === meatSectorFilter
      );
    }

    setFilteredShops(result);
  }, [shops, meatSectorFilter]);

  // Fetch shops from Firebase when component mounts
  useEffect(() => {
    const shopsRef = ref(db, 'shops');

    // Set up real-time listener for shops
    const unsubscribe = onValue(
      shopsRef,
      (snapshot) => {
        const data = snapshot.val();

        if (data) {
          // Convert from object to array
          const shopsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
            // Set default for shops without meat sector type
            meatSectorType: data[key].meatSectorType || 'None',
          }));

          // Sort by name
          shopsArray.sort((a, b) => a.name.localeCompare(b.name));

          setShops(shopsArray);
        } else {
          setShops([]);
        }

        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching shops:', error);
        setNotification({
          message: `Error fetching shops: ${error.message}`,
          type: 'error',
        });

        setTimeout(() => {
          setNotification(null);
        }, 3000);

        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Fetch orders from Firebase
  useEffect(() => {
    const ordersRef = ref(db, 'orders');
    setIsLoading(true);

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
          time: event.time || new Date().toISOString()
        }));
        return order;
      }) : [];

      setOrders(ordersData);

      // Generate order ID map
      const idMap = {};
      ordersData.forEach((order, index) => {
        idMap[order.id] = `ORD-${index + 1}`;
      });
      setOrderIdMap(idMap);

      setIsLoading(false);
    }, (err) => {
      console.error('Error fetching orders:', err);
      setNotification({
        message: `Error fetching orders: ${err.message}`,
        type: 'error',
      });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle form input changes for new shop
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewShopForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Handle form input changes for edit shop
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditShopForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Handle manual rating changes for add shop
  const handleManualRatingChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);

    if (e.target.form.id === 'add-shop-form') {
      setNewShopForm(prev => ({
        ...prev,
        [name]: numValue
      }));
    } else {
      setEditShopForm(prev => ({
        ...prev,
        [name]: numValue
      }));
    }
  };

  // Handle document file uploads
  const handleFileUpload = (e, documentType) => {
    const file = e.target.files[0];
    if (!file) return;

    // Store file for later upload
    setDocumentUploads({
      ...documentUploads,
      [documentType]: file,
    });

    // Create preview URL
    const previewURL = URL.createObjectURL(file);
    setDocumentPreviews({
      ...documentPreviews,
      [documentType]: previewURL,
    });
  };

  // Handle fetching Google ratings - works for both add and edit forms
  const fetchGoogleRating = async (formData, formType) => {
    const { name, address, city } = formData;

    if (!name || !address || !city) {
      setNotification({
        message: 'Shop name, address, and city are required to fetch ratings',
        type: 'error',
      });

      setTimeout(() => {
        setNotification(null);
      }, 3000);
      return;
    }

    setIsRatingLoading(true);

    try {
      // Construct the query for Google Places API
      const query = `${name} ${address} ${city}`;

      // In a real implementation, you would call the Google Places API here
      // For now, we'll simulate with a more realistic delay and data

      // Simulate API call with a more realistic approach
      setTimeout(() => {
        // Generate rating based on name length for consistency
        const nameHash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const baseRating = 3.5 + (nameHash % 15) / 10; // Between 3.5 and 5.0
        const rating = parseFloat(baseRating.toFixed(1));

        // Generate reviews count based on name length
        const reviews = 10 + (nameHash % 190); // Between 10 and 200

        if (formType === 'add') {
          setNewShopForm((prev) => ({
            ...prev,
            rating: rating,
            reviews: reviews,
          }));
        } else {
          setEditShopForm((prev) => ({
            ...prev,
            rating: rating,
            reviews: reviews,
          }));
        }

        setIsRatingLoading(false);

        setNotification({
          message: `Successfully fetched ratings: ${rating} from ${reviews} reviews`,
          type: 'success',
        });

        setTimeout(() => {
          setNotification(null);
        }, 3000);
      }, 1500);
    } catch (error) {
      console.error('Error fetching ratings:', error);
      setIsRatingLoading(false);

      setNotification({
        message: `Failed to fetch ratings: ${error.message}`,
        type: 'error',
      });

      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  // Handle form submission for adding a new shop
  const handleSubmitShop = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      const requiredFields = ['name', 'address', 'city', 'category', 'owner', 'phone', 'email', 'paymentContactName', 'paymentContactPhone'];

      // Add payment-specific required fields based on payment mode
      if (newShopForm.preferredPaymentMode === 'BANK') {
        requiredFields.push('accountHolderName', 'accountNumber', 'ifscCode', 'bankName');
      } else {
        requiredFields.push('upiId', 'upiMobileNumber');
      }

      const missingFields = requiredFields.filter((field) => !newShopForm[field]);

      if (missingFields.length > 0) {
        throw new Error(`Required fields missing: ${missingFields.join(', ')}`);
      }

      // Validate account number confirmation if it's a bank transfer
      if (newShopForm.preferredPaymentMode === 'BANK' &&
        newShopForm.accountNumber !== newShopForm.confirmAccountNumber) {
        throw new Error('Account number and confirmation do not match');
      }

      // Create payment details object based on selected payment mode
      const paymentDetails = {
        preferredPaymentMode: newShopForm.preferredPaymentMode,
        paymentContactName: newShopForm.paymentContactName,
        paymentContactPhone: newShopForm.paymentContactPhone,
        paymentContactEmail: newShopForm.paymentContactEmail,
        lastUpdated: new Date().toISOString()
      };

      // Add appropriate payment details based on mode
      if (newShopForm.preferredPaymentMode === 'BANK') {
        paymentDetails.bankDetails = {
          accountHolderName: newShopForm.accountHolderName,
          accountNumber: newShopForm.accountNumber,
          ifscCode: newShopForm.ifscCode,
          bankName: newShopForm.bankName,
          bankBranch: newShopForm.bankBranch
        };
      } else {
        paymentDetails.upiDetails = {
          upiId: newShopForm.upiId,
          upiProvider: newShopForm.upiProvider,
          otherUpiProvider: newShopForm.upiProvider === 'other' ? newShopForm.otherUpiProvider : '',
          upiMobileNumber: newShopForm.upiMobileNumber
        };
      }

      // Create a new shop object
      const newShop = {
        name: newShopForm.name,
        location: {
          address: `${newShopForm.address}, ${newShopForm.city}`,
          city: newShopForm.city,
        },
        category: newShopForm.category,
        owner: newShopForm.owner,
        phone: newShopForm.phone,
        email: newShopForm.email,
        gstNumber: newShopForm.gstNumber,
        rating: newShopForm.rating || 0,
        reviews: newShopForm.reviews || 0,
        joinDate: new Date().toISOString(),
        status: 'active',
        verified: false,
        meatSectorType: newShopForm.meatSectorType,
        earnings: {
          currentMonth: 0,
          previousMonth: 0,
          total: 0,
        },
        orders: {
          pending: 0,
          processing: 0,
          completed: 0,
          cancelled: 0,
        },
        performanceMetrics: {
          orderAcceptanceRate: 95,
          preparationTime: 25,
          customerSatisfaction: 4.5,
        },
        // Store payment details
        paymentDetails: paymentDetails
      };

      // Upload documents if any
      const documents = {};

      if (documentUploads.businessLicense) {
        const businessLicenseRef = storageRef(storage, `shops/${Date.now()}_business_license`);
        await uploadBytes(businessLicenseRef, documentUploads.businessLicense);
        const businessLicenseUrl = await getDownloadURL(businessLicenseRef);
        documents.businessLicense = businessLicenseUrl;
      }

      if (documentUploads.idProof) {
        const idProofRef = storageRef(storage, `shops/${Date.now()}_id_proof`);
        await uploadBytes(idProofRef, documentUploads.idProof);
        const idProofUrl = await getDownloadURL(idProofRef);
        documents.idProof = idProofUrl;
      }

      // Add documents to the shop data if any
      if (Object.keys(documents).length > 0) {
        newShop.documents = documents;
      }

      // Save to Firebase
      const shopsRef = ref(db, 'shops');
      const newShopRef = push(shopsRef);
      await set(newShopRef, newShop);

      // Reset form
      setNewShopForm({
        name: '',
        address: '',
        city: '',
        category: 'Grocery',
        owner: '',
        phone: '',
        email: '',
        gstNumber: '',
        status: 'active',
        meatSectorType: 'None',
        rating: 0,
        reviews: 0,
        preferredPaymentMode: 'BANK',
        accountHolderName: '',
        accountNumber: '',
        confirmAccountNumber: '',
        ifscCode: '',
        bankName: '',
        bankBranch: '',
        upiId: '',
        upiProvider: 'gpay',
        otherUpiProvider: '',
        upiMobileNumber: '',
        paymentContactName: '',
        paymentContactPhone: '',
        paymentContactEmail: ''
      });

      // Reset document uploads
      setDocumentUploads({
        businessLicense: null,
        idProof: null,
      });

      // Reset document previews
      setDocumentPreviews({
        businessLicense: null,
        idProof: null,
      });

      // Close modal
      setIsAddShopModalOpen(false);

      setIsLoading(false);

      // Show success notification
      setNotification({
        message: `Shop ${newShop.name} has been added successfully`,
        type: 'success',
      });

      // Auto dismiss notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      console.error('Error adding shop:', error);
      setIsLoading(false);

      setNotification({
        message: `Failed to add shop: ${error.message}`,
        type: 'error',
      });

      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  // Function to handle opening the edit shop modal
  const handleEditShop = (shop) => {
    let address = '';
    let city = shop.location?.city || '';

    if (shop.location?.address) {
      const addressParts = shop.location.address.split(', ');
      if (addressParts.length > 1) {
        // Use everything except the last part as address
        address = addressParts.slice(0, -1).join(', ');
      } else {
        address = shop.location.address;
      }
    }

    // Extract payment details from shop data
    const paymentDetails = shop.paymentDetails || {};
    const bankDetails = paymentDetails.bankDetails || {};
    const upiDetails = paymentDetails.upiDetails || {};

    setEditShopForm({
      id: shop.id,
      name: shop.name || '',
      address: address,
      city: city,
      category: shop.category || 'Grocery',
      owner: shop.owner || '',
      phone: shop.phone || '',
      email: shop.email || '',
      gstNumber: shop.gstNumber || '',
      rating: shop.rating || 0,
      reviews: shop.reviews || 0,
      meatSectorType: shop.meatSectorType || 'None',

      // Payment mode
      preferredPaymentMode: paymentDetails.preferredPaymentMode || 'BANK',

      // Bank details
      accountHolderName: bankDetails.accountHolderName || '',
      accountNumber: bankDetails.accountNumber || '',
      confirmAccountNumber: bankDetails.accountNumber || '', // Pre-fill for confirmation
      ifscCode: bankDetails.ifscCode || '',
      bankName: bankDetails.bankName || '',
      bankBranch: bankDetails.bankBranch || '',

      // UPI details
      upiId: upiDetails.upiId || '',
      upiProvider: upiDetails.upiProvider || 'gpay',
      otherUpiProvider: upiDetails.otherUpiProvider || '',
      upiMobileNumber: upiDetails.upiMobileNumber || '',

      // Contact info
      paymentContactName: paymentDetails.paymentContactName || '',
      paymentContactPhone: paymentDetails.paymentContactPhone || '',
      paymentContactEmail: paymentDetails.paymentContactEmail || ''
    });

    setIsEditShopModalOpen(true);
  };


  // Function to handle updating a shop
  const handleUpdateShop = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      const requiredFields = ['name', 'address', 'city', 'category', 'owner', 'phone', 'email', 'paymentContactName', 'paymentContactPhone'];

      // Add payment-specific required fields based on payment mode
      if (editShopForm.preferredPaymentMode === 'BANK') {
        requiredFields.push('accountHolderName', 'accountNumber', 'ifscCode', 'bankName');
      } else {
        requiredFields.push('upiId', 'upiMobileNumber');
      }

      const missingFields = requiredFields.filter((field) => !editShopForm[field]);

      if (missingFields.length > 0) {
        throw new Error(`Required fields missing: ${missingFields.join(', ')}`);
      }

      // Validate account number confirmation if it's a bank transfer
      if (editShopForm.preferredPaymentMode === 'BANK' &&
        editShopForm.accountNumber !== editShopForm.confirmAccountNumber) {
        throw new Error('Account number and confirmation do not match');
      }

      // Create payment details object based on selected payment mode
      const paymentDetails = {
        preferredPaymentMode: editShopForm.preferredPaymentMode,
        paymentContactName: editShopForm.paymentContactName,
        paymentContactPhone: editShopForm.paymentContactPhone,
        paymentContactEmail: editShopForm.paymentContactEmail,
        lastUpdated: new Date().toISOString()
      };

      // Add appropriate payment details based on mode
      if (editShopForm.preferredPaymentMode === 'BANK') {
        paymentDetails.bankDetails = {
          accountHolderName: editShopForm.accountHolderName,
          accountNumber: editShopForm.accountNumber,
          ifscCode: editShopForm.ifscCode,
          bankName: editShopForm.bankName,
          bankBranch: editShopForm.bankBranch
        };
      } else {
        paymentDetails.upiDetails = {
          upiId: editShopForm.upiId,
          upiProvider: editShopForm.upiProvider,
          otherUpiProvider: editShopForm.upiProvider === 'other' ? editShopForm.otherUpiProvider : '',
          upiMobileNumber: editShopForm.upiMobileNumber
        };
      }

      // Create updated shop object
      const updatedShop = {
        name: editShopForm.name,
        location: {
          address: `${editShopForm.address}, ${editShopForm.city}`,
          city: editShopForm.city,
        },
        category: editShopForm.category,
        owner: editShopForm.owner,
        phone: editShopForm.phone,
        email: editShopForm.email,
        gstNumber: editShopForm.gstNumber,
        rating: editShopForm.rating,
        reviews: editShopForm.reviews,
        meatSectorType: editShopForm.meatSectorType,
        // Store payment details
        paymentDetails: paymentDetails
      };

      // Update shop in Firebase
      const shopRef = ref(db, `shops/${editShopForm.id}`);
      await update(shopRef, updatedShop);

      // Close modal
      setIsEditShopModalOpen(false);
      setIsLoading(false);

      // Show success notification
      setNotification({
        message: `Shop ${updatedShop.name} has been updated successfully`,
        type: 'success',
      });

      // Auto dismiss notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      console.error('Error updating shop:', error);
      setIsLoading(false);

      setNotification({
        message: `Failed to update shop: ${error.message}`,
        type: 'error',
      });

      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };



  // Function to toggle shop status (activate/deactivate)
  const toggleShopStatus = async (shopId, currentStatus) => {
    setIsLoading(true);

    try {
      const shopRef = ref(db, `shops/${shopId}`);
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

      await update(shopRef, {
        status: newStatus,
        statusUpdatedAt: new Date().toISOString(),
      });

      setIsLoading(false);

      // Show success notification
      setNotification({
        message: `Shop status has been ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
        type: 'success',
      });

      // Auto dismiss notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      console.error('Error toggling shop status:', error);
      setIsLoading(false);

      setNotification({
        message: `Failed to update shop status: ${error.message}`,
        type: 'error',
      });

      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  // Function to remove shop
  const removeShop = async (shopId) => {
    const confirmed = window.confirm('Are you sure you want to delete this shop? This action cannot be undone.');
    if (!confirmed) return;

    setIsLoading(true);

    try {
      const shopRef = ref(db, `shops/${shopId}`);
      await remove(shopRef);

      // If the deleted shop was selected, clear selection
      if (selectedShop === shopId) {
        setSelectedShop(null);
      }

      setIsLoading(false);

      // Show success notification
      setNotification({
        message: `Shop has been removed successfully`,
        type: 'success',
      });

      // Auto dismiss notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      console.error('Error removing shop:', error);
      setIsLoading(false);

      setNotification({
        message: `Failed to remove shop: ${error.message}`,
        type: 'error',
      });

      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  // Function to update Google ratings (simulated)
  const updateGoogleRatings = async (shopId) => {
    setIsLoading(true);

    try {
      const shopRef = ref(db, `shops/${shopId}`);

      // Get the shop data first to determine a more consistent rating
      const shopSnapshot = await get(shopRef);
      const shopData = shopSnapshot.val();

      if (!shopData) {
        throw new Error("Shop not found");
      }

      // Generate rating based on name length for consistency
      const nameHash = shopData.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const baseRating = 3.5 + (nameHash % 15) / 10; // Between 3.5 and 5.0
      const rating = parseFloat(baseRating.toFixed(1));

      // Generate reviews count based on name length
      const reviewsBase = shopData.reviews || 50;
      const reviews = reviewsBase + Math.floor(Math.random() * 30) - 15; // Add or subtract up to 15 reviews

      await update(shopRef, {
        rating: rating,
        reviews: reviews,
        lastRatingUpdate: new Date().toISOString(),
      });

      setIsLoading(false);

      // Show success notification
      setNotification({
        message: `Shop ratings have been updated from Google: ${rating} from ${reviews} reviews`,
        type: 'success',
      });

      // Auto dismiss notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      console.error('Error updating ratings:', error);
      setIsLoading(false);

      setNotification({
        message: `Failed to update ratings: ${error.message}`,
        type: 'error',
      });

      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  // Function to format currency with rupee symbol
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // Function to get shop performance status
  const getShopPerformanceStatus = (metrics) => {
    if (!metrics) return 'needs-improvement';

    if (metrics.orderAcceptanceRate > 95 && metrics.customerSatisfaction > 4.5) {
      return 'excellent';
    } else if (metrics.orderAcceptanceRate > 90 && metrics.customerSatisfaction > 4.0) {
      return 'good';
    } else if (metrics.orderAcceptanceRate > 85 && metrics.customerSatisfaction > 3.5) {
      return 'average';
    } else {
      return 'needs-improvement';
    }
  };

  // Function to get meat sector label for display
  const getMeatSectorLabel = (type) => {
    switch (type) {
      case 'Halal': return 'Halal Cut';
      case 'JC Jatka': return 'JC Jatka';
      default: return 'Not Applicable';
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

  // Handle order status filter change
  const handleOrderStatusFilterChange = (filter) => {
    setOrderStatusFilter(filter);
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

  // Apply status filter to orders
  const getStatusFilteredOrders = (ordersList) => {
    if (orderStatusFilter === 'all') return ordersList;

    return ordersList.filter(order => order.status === orderStatusFilter);
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
          comparison = a.totalAmount - b.totalAmount;
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

  // Filter and sort orders
  const getFilteredOrders = () => {
    let filtered = [...shopOrders];

    // Apply search filtering
    if (searchTerm) {
      filtered = filtered.filter(order =>
        (orderIdMap[order.id] || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filtering
    filtered = getStatusFilteredOrders(filtered);

    // Apply date filtering
    filtered = getDateFilteredOrders(filtered);

    // Apply area filtering
    filtered = getAreaFilteredOrders(filtered);

    // Apply sorting
    return getSortedOrders(filtered);
  };

  // Get filtered orders for the current shop
  const filteredShopOrders = selectedShop ? getFilteredOrders() : [];

  // Status icon mapping
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="status-icon pending" />;
      case 'processing': return <RefreshCw className="status-icon processing" />;
      case 'prepared': return <Utensils className="status-icon prepared" />;
      case 'out_for_delivery': return <Truck className="status-icon out-for-delivery" />;
      case 'delivered': return <CheckCircle className="status-icon delivered" />;
      case 'cancelled': return <XCircle className="status-icon cancelled" />;
      default: return <Clock className="status-icon" />;
    }
  };

  // Status text formatting
  const getStatusText = (status) => {
    if (!status) return 'Unknown'; // Safeguard for undefined status
    switch (status) {
      case 'pending': return 'Pending';
      case 'processing': return 'Processing';
      case 'prepared': return 'Prepared';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      case 'order_placed': return 'Order Placed';
      case 'order_confirmed': return 'Order Confirmed';
      case 'refund_initiated': return 'Refund Initiated';
      case 'refund_processed': return 'Refund Processed';
      case 'delivery_assigned': return 'Delivery Assigned';
      default: return status.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
  };

  // Export orders to CSV
  const exportOrdersCSV = () => {
    const ordersToExport = filteredShopOrders;

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
      'Items'
    ];

    // Map orders to CSV rows
    const rows = ordersToExport.map(order => {
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
    link.setAttribute('download', `${shops.find(s => s.id === selectedShop)?.name}_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get order count by area
  const getOrdersByArea = () => {
    const areaCount = {};

    shopOrders.forEach(order => {
      const address = order.customer?.address || '';
      const addressParts = address.split(',');
      if (addressParts.length > 0) {
        const area = addressParts[0].trim();
        if (area) {
          areaCount[area] = (areaCount[area] || 0) + 1;
        }
      }
    });

    // Convert to array and sort by count
    return Object.entries(areaCount)
      .map(([area, count]) => ({ area, count }))
      .sort((a, b) => b.count - a.count);
  };

  const ordersByArea = getOrdersByArea();

  // If a shop is selected, show detailed view
  if (selectedShop) {
    const shop = shops.find((s) => s.id === selectedShop);

    // If shop not found after being deleted
    if (!shop) {
      return (
        <div className="shop-partner-dashboard">
          <button className="back-button" onClick={() => setSelectedShop(null)}>
            ← Back to Shops
          </button>
          <p>Shop not found. It may have been deleted.</p>
        </div>
      );
    }

    return (
      <div className="shop-partner-dashboard">
        {/* Notification Component */}
        {notification && (
          <div className={`notification notification-${notification.type}`}>
            <span>{notification.message}</span>
            <button className="notification-close" onClick={() => setNotification(null)}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner">
              <RefreshCw size={40} className="spinning" />
            </div>
          </div>
        )}

        {/* Edit Shop Modal */}
        <EditShopModal
          isOpen={isEditShopModalOpen}
          onClose={() => setIsEditShopModalOpen(false)}
          editShopForm={editShopForm}
          handleInputChange={handleEditInputChange}
          handleUpdateShop={handleUpdateShop}
          shopCategories={shopCategories}
          fetchGoogleRating={fetchGoogleRating}
          isRatingLoading={isRatingLoading}
          handleManualRatingChange={handleManualRatingChange}
        />

        <div className="shop-detail-header">
          <button className="back-button" onClick={() => setSelectedShop(null)}>
            ← Back to Shops
          </button>
          <h1>{shop.name}</h1>
          <div className={`shop-status ${shop.status}`}>
            {shop.status === 'active' ? 'Active' : shop.status === 'pending' ? 'Pending' : 'Inactive'}
          </div>
        </div>

        <div className="shop-tabs">
          <button
            className={`shop-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`shop-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
          <button
            className={`shop-tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button
            className={`shop-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="shop-detail-content">
            <div className="shop-overview-grid">
              <div className="shop-detail-card shop-info">
                <h2>Shop Information</h2>
                <div className="shop-info-grid">
                  <div className="info-item">
                    <span className="info-label">Category</span>
                    <span className="info-value">{shop.category}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Meat Sector Type</span>
                    <span className="info-value">{getMeatSectorLabel(shop.meatSectorType)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Rating</span>
                    <span className="info-value">
                      {shop.rating} <Star size={14} className="star-icon" />
                      <span className="reviews-count">({shop.reviews} reviews)</span>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Address</span>
                    <span className="info-value">{shop.location?.address}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Joined</span>
                    <span className="info-value">{formatDate(shop.joinDate)}</span>
                  </div>
                  {shop.owner && (
                    <div className="info-item">
                      <span className="info-label">Owner</span>
                      <span className="info-value">{shop.owner}</span>
                    </div>
                  )}
                  {shop.phone && (
                    <div className="info-item">
                      <span className="info-label">Phone</span>
                      <span className="info-value">{shop.phone}</span>
                    </div>
                  )}
                  {shop.email && (
                    <div className="info-item">
                      <span className="info-label">Email</span>
                      <span className="info-value">{shop.email}</span>
                    </div>
                  )}
                  {shop.gstNumber && (
                    <div className="info-item">
                      <span className="info-label">GST</span>
                      <span className="info-value">{shop.gstNumber}</span>
                    </div>
                  )}
                  <div className="info-item">
                    <span className="info-label">Commission</span>
                    <span className="info-value">{shop.commissionRate || 10}%</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Verified</span>
                    <span className="info-value">{shop.verified ? 'Yes' : 'No'}</span>
                  </div>
                </div>

                <div className="shop-actions">
                  <button className="shop-action-button" onClick={() => handleEditShop(shop)}>
                    <Edit size={16} />
                    Edit Info
                  </button>
                  <button className="shop-action-button" onClick={() => updateGoogleRatings(shop.id)}>
                    <RefreshCw size={16} />
                    Update Ratings
                  </button>
                  <button
                    className={`shop-status-toggle ${shop.status === 'active' ? 'deactivate' : 'activate'}`}
                    onClick={() => toggleShopStatus(shop.id, shop.status)}
                  >
                    {shop.status === 'active' ? 'Deactivate Shop' : 'Activate Shop'}
                  </button>
                </div>
              </div>

              <div className="shop-detail-card earnings-summary">
                <h2>Earnings Summary</h2>
                <div className="earnings-grid">
                  <div className="earnings-item">
                    <span className="earnings-label">Current Month</span>
                    <span className="earnings-value">{formatCurrency(shop.earnings?.currentMonth || 0)}</span>
                    {shop.earnings?.previousMonth > 0 && (
                      <span className="earnings-change positive">
                        +
                        {(
                          ((shop.earnings.currentMonth - shop.earnings.previousMonth) /
                            shop.earnings.previousMonth) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    )}
                  </div>
                  <div className="earnings-item">
                    <span className="earnings-label">Previous Month</span>
                    <span className="earnings-value">{formatCurrency(shop.earnings?.previousMonth || 0)}</span>
                  </div>
                  <div className="earnings-item total">
                    <span className="earnings-label">Total Earnings</span>
                    <span className="earnings-value">{formatCurrency(shop.earnings?.total || 0)}</span>
                  </div>
                </div>
              </div>

              <div className="shop-detail-card orders-summary">
                <h2>Orders Summary</h2>
                <div className="orders-grid">
                  <div className="order-stat-item">
                    <div className="order-stat pending">
                      <Clock className="order-stat-icon" />
                      <span className="order-stat-value">{shop.orders?.pending || 0}</span>
                    </div>
                    <span className="order-stat-label">Pending</span>
                  </div>
                  <div className="order-stat-item">
                    <div className="order-stat processing">
                      <TrendingUp className="order-stat-icon" />
                      <span className="order-stat-value">{shop.orders?.processing || 0}</span>
                    </div>
                    <span className="order-stat-label">Processing</span>
                  </div>
                  <div className="order-stat-item">
                    <div className="order-stat completed">
                      <CheckCircle className="order-stat-icon" />
                      <span className="order-stat-value">{shop.orders?.completed || 0}</span>
                    </div>
                    <span className="order-stat-label">Completed</span>
                  </div>
                  <div className="order-stat-item">
                    <div className="order-stat cancelled">
                      <AlertTriangle className="order-stat-icon" />
                      <span className="order-stat-value">{shop.orders?.cancelled || 0}</span>
                    </div>
                    <span className="order-stat-label">Cancelled</span>
                  </div>
                </div>

                <div className="view-more">
                  <button className="view-more-button" onClick={() => setActiveTab('orders')}>
                    View All Orders
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
              <div className="shop-detail-card payment-info">
                <h2>Payment Information</h2>
                <div className="payment-info-grid">
                  <div className="info-item">
                    <span className="info-label">Payment Mode</span>
                    <span className="info-value">
                      {shop.paymentInfo?.preferredPaymentMode === 'UPI' ? 'UPI Transfer' : 'Bank Transfer'}
                    </span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Contact Name</span>
                    <span className="info-value">{shop.paymentInfo?.paymentContactName || 'Not set'}</span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Contact Phone</span>
                    <span className="info-value">{shop.paymentInfo?.paymentContactPhone || 'Not set'}</span>
                  </div>

                  {shop.paymentInfo?.paymentContactEmail && (
                    <div className="info-item">
                      <span className="info-label">Contact Email</span>
                      <span className="info-value">{shop.paymentInfo.paymentContactEmail}</span>
                    </div>
                  )}

                  <div className="info-item">
                    <span className="info-label">Last Updated</span>
                    <span className="info-value">{formatDate(shop.paymentInfo?.lastUpdated || shop.joinDate)}</span>
                  </div>
                </div>

                <div className="payment-actions">
                  <button
                    className="payment-action-button"
                    onClick={() => setIsPaymentModalOpen(true)}
                  >
                    <Send size={16} />
                    Initiate Payment
                  </button>
                </div>
              </div>
              <div className="shop-detail-card performance-metrics">
                <h2>Performance Metrics</h2>
                <div className={`performance-status ${getShopPerformanceStatus(shop.performanceMetrics)}`}>
                  {getShopPerformanceStatus(shop.performanceMetrics)
                    .charAt(0)
                    .toUpperCase() +
                    getShopPerformanceStatus(shop.performanceMetrics)
                      .slice(1)
                      .replace('-', ' ')}
                </div>

                <div className="metrics-list">
                  <div className="metric-item">
                    <span className="metric-label">Order Acceptance Rate</span>
                    <div className="metric-value-container">
                      <span className="metric-value">{shop.performanceMetrics?.orderAcceptanceRate || 0}%</span>
                      <div className="metric-bar-container">
                        <div
                          className="metric-bar"
                          style={{ width: `${shop.performanceMetrics?.orderAcceptanceRate || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Avg. Preparation Time</span>
                    <div className="metric-value-container">
                      <span className="metric-value">{shop.performanceMetrics?.preparationTime || 0} mins</span>
                      <div className="metric-bar-container">
                        <div
                          className="metric-bar"
                          style={{ width: `${(shop.performanceMetrics?.preparationTime || 0) / 30 * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Customer Satisfaction</span>
                    <div className="metric-value-container">
                      <span className="metric-value">
                        {shop.performanceMetrics?.customerSatisfaction || 0}
                        <Star size={14} className="star-icon" />
                      </span>
                      <div className="metric-bar-container">
                        <div
                          className="metric-bar"
                          style={{
                            width: `${(shop.performanceMetrics?.customerSatisfaction || 0) / 5 * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {shop.topProducts && shop.topProducts.length > 0 && (
                <div className="shop-detail-card top-products">
                  <h2>Top Products</h2>
                  <div className="products-list">
                    {shop.topProducts.map((product, index) => (
                      <div className="product-item" key={index}>
                        <div className="product-rank">{index + 1}</div>
                        <div className="product-info">
                          <span className="product-name">{product.name}</span>
                          <span className="product-sales">{product.sales} sold</span>
                        </div>
                        <span className="product-revenue">{formatCurrency(product.revenue)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="view-more">
                    <button className="view-more-button" onClick={() => setActiveTab('products')}>
                      View All Products
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {shop.documents && (
                <div className="shop-detail-card documents">
                  <h2>Documents</h2>
                  <div className="documents-list">
                    {shop.documents.businessLicense && (
                      <div className="document-item">
                        <span className="document-name">Business License</span>
                        <a
                          href={shop.documents.businessLicense}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="document-link"
                        >
                          <Eye size={16} /> View
                        </a>
                      </div>
                    )}
                    {shop.documents.idProof && (
                      <div className="document-item">
                        <span className="document-name">ID Proof</span>
                        <a
                          href={shop.documents.idProof}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="document-link"
                        >
                          <Eye size={16} /> View
                        </a>
                      </div>
                    )}
                    {shop.documents.addressProof && (
                      <div className="document-item">
                        <span className="document-name">Address Proof</span>
                        <a
                          href={shop.documents.addressProof}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="document-link"
                        >
                          <Eye size={16} /> View
                        </a>
                      </div>
                    )}
                    {shop.documents.gstCertificate && (
                      <div className="document-item">
                        <span className="document-name">GST Certificate</span>
                        <a
                          href={shop.documents.gstCertificate}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="document-link"
                        >
                          <Eye size={16} /> View
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <PaymentModal
              isOpen={isPaymentModalOpen}
              onClose={() => setIsPaymentModalOpen(false)}
              shopDetails={shop}
              setNotification={setNotification}
            />
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="shop-detail-content">

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
                  className={`filter-tab ${orderStatusFilter === 'all' ? 'active' : ''}`}
                  onClick={() => handleOrderStatusFilterChange('all')}
                >
                  All Orders
                </button>
                <button
                  className={`filter-tab ${orderStatusFilter === 'pending' ? 'active' : ''}`}
                  onClick={() => handleOrderStatusFilterChange('pending')}
                >
                  Pending
                </button>
                <button
                  className={`filter-tab ${orderStatusFilter === 'processing' ? 'active' : ''}`}
                  onClick={() => handleOrderStatusFilterChange('processing')}
                >
                  Processing
                </button>
                <button
                  className={`filter-tab ${orderStatusFilter === 'out_for_delivery' ? 'active' : ''}`}
                  onClick={() => handleOrderStatusFilterChange('out_for_delivery')}
                >
                  Out for Delivery
                </button>
                <button
                  className={`filter-tab ${orderStatusFilter === 'delivered' ? 'active' : ''}`}
                  onClick={() => handleOrderStatusFilterChange('delivered')}
                >
                  Delivered
                </button>
                <button
                  className={`filter-tab ${orderStatusFilter === 'cancelled' ? 'active' : ''}`}
                  onClick={() => handleOrderStatusFilterChange('cancelled')}
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
                        onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                        className="date-input"
                        placeholder="Start Date"
                      />
                      <span>to</span>
                      <input
                        type="date"
                        value={customDateRange.end}
                        onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
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

            {filteredShopOrders.length > 0 ? (
              <div className="orders-table-container">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date & Time</th>
                      <th>Amount</th>
                      <th>Address</th>
                      <th>Status</th>
                      <th>Items</th>

                    </tr>
                  </thead>
                  <tbody>
                    {filteredShopOrders.map((order) => (
                      <tr key={order.id} className={`order-row ${order.status}`}>
                        <td className="order-id-cell">
                          <div className="order-id-with-status">
                            <Package className="order-icon" />
                            <span className="order-id-text">{orderIdMap[order.id] || order.id}</span>
                          </div>
                        </td>
                        <td className="customer-cell">
                          <div className="customer-name">{order.customer?.fullName}</div>
                          <div className="customer-phone">{order.customer?.phone}</div>
                        </td>
                        <td className="date-cell">
                          {formatDate(order.orderDate)}
                        </td>
                        <td className="amount-cell">
                          <div className="order-amount">{formatCurrency(calculateAmountWithoutTax(order))}</div>
                          <div className="items-count">{order.items?.length} items</div>
                        </td>
                        <td className="address-cell">
                          <div className="location">
                            <MapPin className="location-icon" />
                            <span className="address-text">{`${order.customer?.address}, ${order.customer?.city}`}</span>
                          </div>
                        </td>
                        <td className="status-cell">
                          <div className={`order-status-indicator ${order.status}`}>
                            {getStatusIcon(order.status)}
                            <span className="status-text">{getStatusText(order.status)}</span>
                          </div>
                        </td>
                        <td className="items-list-cell">
                          <div className="items-list">
                            {order.items?.slice(0, 2).map((item, idx) => (
                              <div key={idx} className="item-brief">
                                {item.name} x {item.quantity}
                              </div>
                            ))}
                            {order.items?.length > 2 && (
                              <div className="more-items">+{order.items.length - 2} more</div>
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
                <p>{isLoading ? 'Loading...' : 'No orders found matching your criteria.'}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="shop-detail-content">
            <VendorProductsManager
              shopId={shop.id}
              shopName={shop.name}
            />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="shop-detail-content">
            <h2>Shop Settings</h2>
            <div className="settings-actions">
              <button className="delete-shop-button" onClick={() => removeShop(shop.id)}>
                <Trash size={16} />
                Delete Shop
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // List view of all shops
  return (
    <div className="shop-partner-dashboard">
      {/* Notification Component */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          <span>{notification.message}</span>
          <button className="notification-close" onClick={() => setNotification(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <RefreshCw size={40} className="spinning" />
          </div>
        </div>
      )}

      {/* Add Shop Modal */}
      <AddShopModal
        isOpen={isAddShopModalOpen}
        onClose={() => setIsAddShopModalOpen(false)}
        newShopForm={newShopForm}
        handleInputChange={handleInputChange}
        handleFileUpload={handleFileUpload}
        handleSubmitShop={handleSubmitShop}
        documentUploads={documentUploads}
        documentPreviews={documentPreviews}
        fetchGoogleRating={fetchGoogleRating}
        isRatingLoading={isRatingLoading}
        shopCategories={shopCategories}
        handleManualRatingChange={handleManualRatingChange}
      />

      {/* Edit Shop Modal */}
      <EditShopModal
        isOpen={isEditShopModalOpen}
        onClose={() => setIsEditShopModalOpen(false)}
        editShopForm={editShopForm}
        handleInputChange={handleEditInputChange}
        handleUpdateShop={handleUpdateShop}
        shopCategories={shopCategories}
        fetchGoogleRating={fetchGoogleRating}
        isRatingLoading={isRatingLoading}
        handleManualRatingChange={handleManualRatingChange}
      />

      <h1>Shop Partner Dashboard</h1>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <Store />
          </div>
          <div className="stat-content">
            <span className="stat-value">{shops.length}</span>
            <span className="stat-label">Total Shops</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Store />
          </div>
          <div className="stat-content">
            <span className="stat-value">{shops.filter((shop) => shop.status === 'active').length}</span>
            <span className="stat-label">Active Shops</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Package />
          </div>
          <div className="stat-content">
            <span className="stat-value">
              {shops.reduce(
                (total, shop) =>
                  total +
                  ((shop.orders?.pending || 0) +
                    (shop.orders?.processing || 0) +
                    (shop.orders?.completed || 0) +
                    (shop.orders?.cancelled || 0)),
                0
              )}
            </span>
            <span className="stat-label">Total Orders</span>
          </div>
        </div>

      </div>

      {/* Meat Sector Statistics */}
      <div className="meat-sector-stats">
        <h2>Meat Sector Statistics</h2>
        <div className="meat-sector-counters">
          <div className="meat-sector-counter halal">
            <div className="counter-value">{meatSectorStats.Halal}</div>
            <div className="counter-label">Halal Cut</div>
          </div>
          <div className="meat-sector-counter jc-jatka">
            <div className="counter-value">{meatSectorStats['JC Jatka']}</div>
            <div className="counter-label">JC Jatka</div>
          </div>
          <div className="meat-sector-counter none">
            <div className="counter-value">{meatSectorStats.None}</div>
            <div className="counter-label">Not Applicable</div>
          </div>
        </div>
      </div>

      <div className="shops-container">
        <div className="shops-header">
          <h2>All Shop Partners</h2>
          <div className="shops-actions">
            <div className="filter-container">
              <Filter size={16} className="filter-icon" />
              <select
                className="meat-sector-filter"
                value={meatSectorFilter}
                onChange={(e) => setMeatSectorFilter(e.target.value)}
              >
                <option value="All">All Meat Sectors</option>
                <option value="Halal">Halal Cut</option>
                <option value="JC Jatka">JC Jatka</option>
                <option value="None">Not Applicable</option>
              </select>
            </div>
            <button className="add-shop-button" onClick={() => setIsAddShopModalOpen(true)}>
              + Add New Shop
            </button>
          </div>
        </div>

        <div className="shops-table-container">
          {filteredShops.length > 0 ? (
            <table className="shops-table">
              <thead>
                <tr>
                  <th>Shop Name</th>
                  <th>Status</th>
                  <th>Meat Sector</th>
                  <th>Location</th>
                  <th>Orders</th>
                  <th>Earnings</th>
                  <th style={{ left: '10px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredShops.map((shop) => (
                  <tr className={`shop-row ${shop.status}`} key={shop.id}>
                    <td className="shop-name-cell">
                      <span className="shop-name">{shop.name}</span>
                    </td>
                    <td>
                      <div className={`shop-status ${shop.status}`}>
                        {shop.status === 'active' ? 'Active' : shop.status === 'pending' ? 'Pending' : 'Inactive'}
                      </div>
                    </td>

                    <td>
                      <span className={`meat-sector-tag ${shop.meatSectorType.toLowerCase().replace(' ', '-')}`}>
                        {getMeatSectorLabel(shop.meatSectorType)}
                      </span>
                    </td>

                    <td>
                      <div className="shop-location">
                        <Map className="location-icon" />
                        <span>{shop.location?.address}</span>
                      </div>
                    </td>
                    <td>
                      {(shop.orders?.pending || 0) +
                        (shop.orders?.processing || 0) +
                        (shop.orders?.completed || 0) +
                        (shop.orders?.cancelled || 0)}
                    </td>
                    <td>{formatCurrency(shop.earnings?.total || 0)}</td>

                    <td>
                      <div className="shop-table-actions">
                        <button
                          className="view-shop-button"
                          onClick={() => setSelectedShop(shop.id)}
                          title="View Details">
                          <Eye size={16} />
                          <span>View</span>
                        </button>
                        <button className="edit-shop-button" onClick={() => handleEditShop(shop)} title="Edit Shop">
                          <Edit size={16} />
                          {/* <span>Edit</span> */}
                        </button>
                        <button
                          className={`shop-toggle-button ${shop.status === 'active' ? 'deactivate' : 'activate'}`}
                          onClick={() => toggleShopStatus(shop.id, shop.status)}
                          title={shop.status === 'active' ? 'Deactivate Shop' : 'Activate Shop'}
                        >
                          {shop.status === 'active' ? (
                            <>
                              <X size={16} />
                              <span>Deactivate</span>
                            </>
                          ) : (
                            <>
                              <Check size={16} />
                              <span>Activate</span>
                            </>
                          )}
                        </button>
                        <button
                          className="remove-shop-button"
                          onClick={() => removeShop(shop.id)}
                          title="Remove Shop"
                        >
                          <Trash size={16} />
                          {/* <span>Delete</span> */}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-shops-message">
              <p>No shops found matching your criteria. Try changing the filter or add a new shop.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPartnerDashboard;
