// import React, { useState, useEffect } from 'react';
// import { ref, get } from 'firebase/database';
// import { db } from '../firebase/config';
// import { X, Search, RefreshCw, Store, Star, MapPin } from 'lucide-react';
// import '../styles/AssignVendorModal.css';

// const AssignVendorModal = ({ isOpen, onClose, onAssign, orderId }) => {
//   const [vendors, setVendors] = useState([]);
//   const [filteredVendors, setFilteredVendors] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [selectedVendor, setSelectedVendor] = useState(null);
//   const [assignmentType, setAssignmentType] = useState('auto');

//   // Fetch vendors when modal opens
//   useEffect(() => {
//     if (!isOpen) return;
    
//     fetchVendors();
//   }, [isOpen]);

//   // Filter vendors when search term changes
//   useEffect(() => {
//     if (searchTerm.trim() === '') {
//       setFilteredVendors(vendors);
//     } else {
//       const lowercaseSearch = searchTerm.toLowerCase();
//       const filtered = vendors.filter(
//         vendor => 
//           vendor.name.toLowerCase().includes(lowercaseSearch) ||
//           vendor.location?.address?.toLowerCase().includes(lowercaseSearch) ||
//           vendor.category?.toLowerCase().includes(lowercaseSearch)
//       );
//       setFilteredVendors(filtered);
//     }
//   }, [searchTerm, vendors]);

//   // Fetch vendors from Firebase
//   const fetchVendors = async () => {
//     setIsLoading(true);
//     setError('');
    
//     try {
//       const shopsRef = ref(db, 'shops');
//       const snapshot = await get(shopsRef);
      
//       if (snapshot.exists()) {
//         const shopsData = snapshot.val();
//         const shopsArray = Object.keys(shopsData).map(key => ({
//           id: key,
//           ...shopsData[key]
//         }));
        
//         // Only show active vendors
//         const activeVendors = shopsArray.filter(shop => shop.status === 'active');
        
//         // Sort by name
//         activeVendors.sort((a, b) => a.name.localeCompare(b.name));
        
//         setVendors(activeVendors);
//         setFilteredVendors(activeVendors);
//       } else {
//         setVendors([]);
//         setFilteredVendors([]);
//       }
//     } catch (err) {
//       console.error('Error fetching vendors:', err);
//       setError('Failed to load vendors. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle vendor selection
//   const handleSelectVendor = (vendor) => {
//     setSelectedVendor(vendor);
//   };

//   // Handle vendor assignment
//   const handleAssign = () => {
//     if (!selectedVendor) {
//       setError('Please select a vendor first');
//       return;
//     }
    
//     onAssign(orderId, selectedVendor, assignmentType);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="assign-vendor-modal">
//         <div className="modal-header">
//           <h2>Assign Vendor</h2>
//           <button className="modal-close" onClick={onClose}>
//             <X size={24} />
//           </button>
//         </div>

//         <div className="search-container">
//           <Search className="search-icon" />
//           <input
//             type="text"
//             placeholder="Search vendors by name, location, or category..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="search-input"
//           />
//         </div>

//         <div className="assignment-type-container">
//           <span className="assignment-type-label">Assignment Type:</span>
//           {/* <div className="assignment-type-options">
//             <label className="assignment-option">
//               <input
//                 type="radio"
//                 name="assignmentType"
//                 value="auto"
//                 checked={assignmentType === 'auto'}
//                 onChange={() => setAssignmentType('auto')}
//               />
//               <span className="assignment-label">Automatic Acceptance</span>
//             </label>
//             <label className="assignment-option">
//               <input
//                 type="radio"
//                 name="assignmentType"
//                 value="manual_required"
//                 checked={assignmentType === 'manual_required'}
//                 onChange={() => setAssignmentType('manual_required')}
//               />
//               <span className="assignment-label">Manual Acceptance Required</span>
//             </label>
//           </div> */}
//         </div>

//         {error && <div className="error-message">{error}</div>}

//         <div className="vendors-list-container">
//           {isLoading ? (
//             <div className="loading-vendors">
//               <RefreshCw size={24} className="spinning" />
//               <span>Loading vendors...</span>
//             </div>
//           ) : filteredVendors.length > 0 ? (
//             <div className="vendors-list">
//               {filteredVendors.map((vendor) => (
//                 <div
//                   key={vendor.id}
//                   className={`vendor-card ${selectedVendor?.id === vendor.id ? 'selected' : ''}`}
//                   onClick={() => handleSelectVendor(vendor)}
//                 >
//                   <div className="vendor-icon">
//                     <Store size={24} />
//                   </div>
//                   <div className="vendor-details">
//                     <div className="vendor-name">{vendor.name}</div>
//                     <div className="vendor-rating">
//                       {vendor.rating || 0} <Star size={14} className="star-icon" />
//                       <span className="vendor-reviews">({vendor.reviews || 0} reviews)</span>
//                     </div>
//                     <div className="vendor-category">{vendor.category}</div>
//                     {vendor.location && (
//                       <div className="vendor-location">
//                         <MapPin size={14} className="location-icon" />
//                         <span>{vendor.location.address}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="no-vendors-found">
//               <p>No vendors found matching your search criteria.</p>
//             </div>
//           )}
//         </div>

//         <div className="modal-actions">
//           <button className="cancel-button" onClick={onClose}>
//             Cancel
//           </button>
//           <button
//             className="assign-button"
//             onClick={handleAssign}
//             disabled={!selectedVendor}
//           >
//             Assign Order
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AssignVendorModal;




// import React, { useState, useEffect } from 'react';
// import { ref, get } from 'firebase/database';
// import { db } from '../firebase/config';
// import { X, Search, RefreshCw, Store, Star, MapPin } from 'lucide-react';
// import '../styles/AssignVendorModal.css';

// const AssignVendorModal = ({ isOpen, onClose, onAssign, orderId }) => {
//   const [vendors, setVendors] = useState([]);
//   const [filteredVendors, setFilteredVendors] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [selectedVendor, setSelectedVendor] = useState(null);

//   // Fetch vendors when modal opens
//   useEffect(() => {
//     if (!isOpen) return;
    
//     fetchVendors();
//   }, [isOpen]);

//   // Filter vendors when search term changes
//   useEffect(() => {
//     if (searchTerm.trim() === '') {
//       setFilteredVendors(vendors);
//     } else {
//       const lowercaseSearch = searchTerm.toLowerCase();
//       const filtered = vendors.filter(
//         vendor => 
//           vendor.name.toLowerCase().includes(lowercaseSearch) ||
//           vendor.location?.address?.toLowerCase().includes(lowercaseSearch) ||
//           vendor.category?.toLowerCase().includes(lowercaseSearch)
//       );
//       setFilteredVendors(filtered);
//     }
//   }, [searchTerm, vendors]);

//   // Fetch vendors from Firebase
//   const fetchVendors = async () => {
//     setIsLoading(true);
//     setError('');
    
//     try {
//       const shopsRef = ref(db, 'shops');
//       const snapshot = await get(shopsRef);
      
//       if (snapshot.exists()) {
//         const shopsData = snapshot.val();
//         const shopsArray = Object.keys(shopsData).map(key => ({
//           id: key,
//           ...shopsData[key]
//         }));
        
//         // Only show active vendors
//         const activeVendors = shopsArray.filter(shop => shop.status === 'active');
        
//         // Sort by name
//         activeVendors.sort((a, b) => a.name.localeCompare(b.name));
        
//         setVendors(activeVendors);
//         setFilteredVendors(activeVendors);
//       } else {
//         setVendors([]);
//         setFilteredVendors([]);
//       }
//     } catch (err) {
//       console.error('Error fetching vendors:', err);
//       setError('Failed to load vendors. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle vendor selection
//   const handleSelectVendor = (vendor) => {
//     setSelectedVendor(vendor);
//   };

//   // Handle manual vendor assignment
//   const handleAssign = () => {
//     if (!selectedVendor) {
//       setError('Please select a vendor first');
//       return;
//     }
    
//     // Always use manual assignment
//     onAssign(orderId, selectedVendor, 'manual');
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="assign-vendor-modal">
//         <div className="modal-header">
//           <h2>Manually Assign Vendor</h2>
//           <button className="modal-close" onClick={onClose}>
//             <X size={24} />
//           </button>
//         </div>

//         <div className="search-container">
//           <Search className="search-icon" />
//           <input
//             type="text"
//             placeholder="Search vendors by name, location, or category..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="search-input"
//           />
//         </div>

//         {error && <div className="error-message">{error}</div>}

//         <div className="vendors-list-container">
//           {isLoading ? (
//             <div className="loading-vendors">
//               <RefreshCw size={24} className="spinning" />
//               <span>Loading vendors...</span>
//             </div>
//           ) : filteredVendors.length > 0 ? (
//             <div className="vendors-list">
//               {filteredVendors.map((vendor) => (
//                 <div
//                   key={vendor.id}
//                   className={`vendor-card ${selectedVendor?.id === vendor.id ? 'selected' : ''}`}
//                   onClick={() => handleSelectVendor(vendor)}
//                 >
//                   <div className="vendor-icon">
//                     <Store size={24} />
//                   </div>
//                   <div className="vendor-details">
//                     <div className="vendor-name">{vendor.name}</div>
//                     <div className="vendor-rating">
//                       {vendor.rating || 0} <Star size={14} className="star-icon" />
//                       <span className="vendor-reviews">({vendor.reviews || 0} reviews)</span>
//                     </div>
//                     <div className="vendor-category">{vendor.category}</div>
//                     {vendor.location && (
//                       <div className="vendor-location">
//                         <MapPin size={14} className="location-icon" />
//                         <span>{vendor.location.address}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="no-vendors-found">
//               <p>No vendors found matching your search criteria.</p>
//             </div>
//           )}
//         </div>

//         <div className="modal-actions">
//           <button className="cancel-button" onClick={onClose}>
//             Cancel
//           </button>
//           <button
//             className="assign-button"
//             onClick={handleAssign}
//             disabled={!selectedVendor}
//           >
//             Assign Order
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AssignVendorModal;



import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../firebase/config';
import { X, Search, RefreshCw, Store, Star, MapPin } from 'lucide-react';
import '../styles/AssignVendorModal.css';

// This is only for manual assignment now
const AssignVendorModal = ({ isOpen, onClose, onAssign, orderId }) => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Fetch vendors when modal opens
  useEffect(() => {
    if (!isOpen) return;
    
    fetchVendors();
  }, [isOpen]);

  // Filter vendors when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredVendors(vendors);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = vendors.filter(
        vendor => 
          vendor.name.toLowerCase().includes(lowercaseSearch) ||
          vendor.location?.address?.toLowerCase().includes(lowercaseSearch) ||
          vendor.category?.toLowerCase().includes(lowercaseSearch)
      );
      setFilteredVendors(filtered);
    }
  }, [searchTerm, vendors]);

  // Fetch vendors from Firebase
  const fetchVendors = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const shopsRef = ref(db, 'shops');
      const snapshot = await get(shopsRef);
      
      if (snapshot.exists()) {
        const shopsData = snapshot.val();
        const shopsArray = Object.keys(shopsData).map(key => ({
          id: key,
          ...shopsData[key]
        }));
        
        // Only show active vendors
        const activeVendors = shopsArray.filter(shop => shop.status === 'active');
        
        // Sort by name
        activeVendors.sort((a, b) => a.name.localeCompare(b.name));
        
        setVendors(activeVendors);
        setFilteredVendors(activeVendors);
      } else {
        setVendors([]);
        setFilteredVendors([]);
      }
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError('Failed to load vendors. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle vendor selection
  const handleSelectVendor = (vendor) => {
    setSelectedVendor(vendor);
  };

  // Handle manual vendor assignment
  const handleAssign = () => {
    if (!selectedVendor) {
      setError('Please select a vendor first');
      return;
    }
    
    // This is for manual assignment
    onAssign(orderId, selectedVendor, 'manual');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="assign-vendor-modal">
        <div className="modal-header">
          <h2>Manually Assign Vendor</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search vendors by name, location, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="vendors-list-container">
          {isLoading ? (
            <div className="loading-vendors">
              <RefreshCw size={24} className="spinning" />
              <span>Loading vendors...</span>
            </div>
          ) : filteredVendors.length > 0 ? (
            <div className="vendors-list">
              {filteredVendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className={`vendor-card ${selectedVendor?.id === vendor.id ? 'selected' : ''}`}
                  onClick={() => handleSelectVendor(vendor)}
                >
                  <div className="vendor-icon">
                    <Store size={24} />
                  </div>
                  <div className="vendor-details">
                    <div className="vendor-name">{vendor.name}</div>
                    <div className="vendor-rating">
                      {vendor.rating || 0} <Star size={14} className="star-icon" />
                      <span className="vendor-reviews">({vendor.reviews || 0} reviews)</span>
                    </div>
                    <div className="vendor-category">{vendor.category}</div>
                    {vendor.location && (
                      <div className="vendor-location">
                        <MapPin size={14} className="location-icon" />
                        <span>{vendor.location.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-vendors-found">
              <p>No vendors found matching your search criteria.</p>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="assign-button"
            onClick={handleAssign}
            disabled={!selectedVendor}
          >
            Assign Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignVendorModal;