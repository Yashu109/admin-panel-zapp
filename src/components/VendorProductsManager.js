





// import React, { useState, useEffect } from 'react';
// import { getDatabase, ref, get, set, update, onValue } from 'firebase/database';
// import { Package, Grid, CheckCircle, Search, Filter } from 'lucide-react';
// import '../styles/VendorProductsManager.css';

// const VendorProductsManager = ({ shopId, shopName }) => {
//   const [activeTab, setActiveTab] = useState('categories');
//   const [loading, setLoading] = useState(true);
//   const [categories, setCategories] = useState([]);
//   const [selectedCategories, setSelectedCategories] = useState({});
//   const [items, setItems] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [itemsStock, setItemsStock] = useState({});
//   const [searchTerm, setSearchTerm] = useState('');
//   const [categoryFilter, setCategoryFilter] = useState('all');
//   const [stockFilter, setStockFilter] = useState('all');
//   const [isSaving, setIsSaving] = useState(false);
//   const [saveMessage, setSaveMessage] = useState('');
//   const [basePrices, setBasePrices] = useState({});
//   const [vendorPrices, setVendorPrices] = useState({});
//   const [sellingPrices, setSellingPrices] = useState({});
//   const [basePriceInputs, setBasePriceInputs] = useState({});
//   const [vendorPriceInputs, setVendorPriceInputs] = useState({});
//   const [sellingPriceInputs, setSellingPriceInputs] = useState({});
//   const [savingPrices, setSavingPrices] = useState({});
//   const [priceMessages, setPriceMessages] = useState({});

//   const categoryDisplayNames = {
//     'chicken': 'Chicken',
//     'mutton': 'Mutton',
//     'liver-more': 'Liver & More',
//     'fish-seafood': 'Fish & Seafood',
//     'combos': 'Combos',
//     'eggs': 'Eggs',
//     'goat': 'Goat',
//     'prawns-crabs': 'Prawns & Crabs'
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!shopId) return;
//       const db = getDatabase();
//       setLoading(true);

//       try {
//         const categoriesRef = ref(db, 'categories');
//         const categoriesSnapshot = await get(categoriesRef);
//         let formattedCategories = [];
//         if (categoriesSnapshot.exists()) {
//           const categoriesData = categoriesSnapshot.val();
//           formattedCategories = Object.entries(categoriesData).map(([id, category]) => ({
//             id,
//             ...category
//           }));
//           setCategories(formattedCategories);
//         }

//         const shopRef = ref(db, `shops/${shopId}`);
//         const shopSnapshot = await get(shopRef);
//         if (shopSnapshot.exists()) {
//           const shopData = shopSnapshot.val();
//           let categoriesState = {};
//           formattedCategories.forEach(category => {
//             categoriesState[category.id] = false;
//           });
//           if (shopData.selectedCategories) {
//             categoriesState = { ...categoriesState, ...shopData.selectedCategories };
//           }
//           setSelectedCategories(categoriesState);
//           if (shopData.itemsStock) {
//             setItemsStock(shopData.itemsStock);
//           }
//           if (shopData.basePrices) {
//             setBasePrices(shopData.basePrices);
//           }
//           if (shopData.vendorPrices) {
//             setVendorPrices(shopData.vendorPrices);
//           }
//           if (shopData.sellingPrices) {
//             setSellingPrices(shopData.sellingPrices);
//           }
//         }

//         const itemsRef = ref(db, 'items');
//         onValue(itemsRef, (snapshot) => {
//           if (snapshot.exists()) {
//             const itemsData = [];
//             const processedIds = new Set();
//             snapshot.forEach((childSnapshot) => {
//               const item = {
//                 id: childSnapshot.key,
//                 ...childSnapshot.val(),
//                 inStock: true
//               };
//               if (!processedIds.has(item.id)) {
//                 itemsData.push(item);
//                 processedIds.add(item.id);
//               }
//             });
//             setItems(itemsData);
            
//             // Initialize input states with existing values from items and custom prices
//             const initialBasePriceInputs = {};
//             const initialVendorPriceInputs = {};
//             const initialSellingPriceInputs = {};
            
//             itemsData.forEach(item => {
//               // Base price defaults to item's originalPrice
//               const basePrice = basePrices[item.id]?.price || item.originalPrice || 0;
//               initialBasePriceInputs[item.id] = basePrice.toString();
              
//               // Vendor price defaults to vendorPrice from shop data or item.vendorPrice
//               const vendorPrice = vendorPrices[item.id]?.price || item.vendorPrice || 0;
//               initialVendorPriceInputs[item.id] = vendorPrice.toString();
              
//               // Selling price defaults to sellingPrice from shop data or item.price
//               const sellPrice = sellingPrices[item.id]?.price || item.price || 0;
//               initialSellingPriceInputs[item.id] = sellPrice.toString();
//             });
            
//             setBasePriceInputs(initialBasePriceInputs);
//             setVendorPriceInputs(initialVendorPriceInputs);
//             setSellingPriceInputs(initialSellingPriceInputs);
//           } else {
//             setItems([]);
//           }
//           setLoading(false);
//         });
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [shopId]);

//   useEffect(() => {
//     if (items.length === 0 || Object.keys(selectedCategories).length === 0) {
//       setFilteredItems([]);
//       return;
//     }

//     const selectedCategoryKeys = Object.entries(selectedCategories)
//       .filter(([_, isSelected]) => isSelected === true)
//       .map(([key]) => key);

//     const filteredItemsMap = new Map();
//     items.forEach(item => {
//       if (filteredItemsMap.has(item.id)) return;
//       if (itemsStock[item.id]) {
//         item.inStock = itemsStock[item.id].inStock;
//       }

//       let belongsToSelectedCategory = false;
//       if (item.displayCategory) {
//         belongsToSelectedCategory = selectedCategoryKeys.includes(item.displayCategory);
//       }

//       if (!belongsToSelectedCategory && item.category) {
//         for (const catKey of selectedCategoryKeys) {
//           const expectedCategoryName = categoryDisplayNames[catKey];
//           if (item.category === expectedCategoryName) {
//             belongsToSelectedCategory = true;
//             break;
//           }
//           if (catKey === 'fish-seafood' && (item.category === "Premium fish & seafood selection" || item.category.toLowerCase().includes('fish') || item.category.toLowerCase().includes('seafood'))) {
//             belongsToSelectedCategory = true;
//             break;
//           }
//           if (catKey === 'liver-more' && (item.category === "Liver & More" || item.category.toLowerCase().includes('liver'))) {
//             belongsToSelectedCategory = true;
//             break;
//           }
//           if (catKey === 'chicken' && (item.category.toLowerCase().includes('chicken') || (item.category === "Bestsellers" && item.name && item.name.toLowerCase().includes('chicken')))) {
//             belongsToSelectedCategory = true;
//             break;
//           }
//           if (catKey === 'mutton' && (item.category.toLowerCase().includes('mutton') || (item.category === "Bestsellers" && item.name && item.name.toLowerCase().includes('mutton')))) {
//             belongsToSelectedCategory = true;
//             break;
//           }
//           if (catKey === 'goat' && (item.category.toLowerCase().includes('goat') || (item.category === "Bestsellers" && item.name && item.name.toLowerCase().includes('goat')))) {
//             belongsToSelectedCategory = true;
//             break;
//           }
//           if (catKey === 'eggs' && (item.category.toLowerCase().includes('egg') || (item.category === "Bestsellers" && item.name && item.name.toLowerCase().includes('egg')))) {
//             belongsToSelectedCategory = true;
//             break;
//           }
//           if (catKey === 'combos' && (item.category.toLowerCase().includes('combo') || item.category === "Match Day Essentials")) {
//             belongsToSelectedCategory = true;
//             break;
//           }
//           if (catKey === 'prawns-crabs' && (item.category.toLowerCase().includes('prawn') || item.category.toLowerCase().includes('crab') || item.category === "Premium fish & seafood selection")) {
//             belongsToSelectedCategory = true;
//             break;
//           }
//         }
//       }

//       if (!belongsToSelectedCategory) {
//         for (const catKey of selectedCategoryKeys) {
//           const categoryName = categoryDisplayNames[catKey];
//           if (categoryName && item.name) {
//             const itemNameLower = item.name.toLowerCase();
//             const categoryLower = categoryName.toLowerCase();
//             if (itemNameLower.includes(categoryLower.split(' ')[0]) ||
//                 (catKey === 'fish-seafood' && (itemNameLower.includes('fish') || itemNameLower.includes('seafood'))) ||
//                 (catKey === 'prawns-crabs' && (itemNameLower.includes('prawn') || itemNameLower.includes('crab'))) ||
//                 (catKey === 'liver-more' && itemNameLower.includes('liver'))) {
//               belongsToSelectedCategory = true;
//               break;
//             }
//           }
//         }
//       }

//       if (!belongsToSelectedCategory) return;
//       if (categoryFilter !== 'all') {
//         const matchesFilter = (
//           item.displayCategory === categoryFilter ||
//           item.category === categoryDisplayNames[categoryFilter] ||
//           (categoryFilter === 'fish-seafood' && item.category === "Premium fish & seafood selection") ||
//           (categoryFilter === 'combos' && item.category === "Match Day Essentials")
//         );
//         if (!matchesFilter) return;
//       }

//       if (stockFilter === 'in-stock' && !item.inStock) return;
//       if (stockFilter === 'out-of-stock' && item.inStock) return;

//       if (searchTerm) {
//         const searchLower = searchTerm.toLowerCase();
//         const nameMatch = item.name && item.name.toLowerCase().includes(searchLower);
//         const descMatch = item.description && item.description.toLowerCase().includes(searchLower);
//         if (!nameMatch && !descMatch) return;
//       }

//       filteredItemsMap.set(item.id, item);
//     });

//     setFilteredItems(Array.from(filteredItemsMap.values()));
//   }, [selectedCategories, items, searchTerm, categoryFilter, stockFilter, itemsStock]);

//   const handleCategoryChange = (categoryId) => {
//     setSelectedCategories({
//       ...selectedCategories,
//       [categoryId]: !selectedCategories[categoryId]
//     });
//   };

//   const saveCategories = async () => {
//     if (!shopId) return;
//     setIsSaving(true);
//     setSaveMessage('');
//     const db = getDatabase();
//     const selectedCategoriesRef = ref(db, `shops/${shopId}/selectedCategories`);
//     try {
//       await set(selectedCategoriesRef, selectedCategories);
//       setSaveMessage('Category selections saved successfully!');
//       setTimeout(() => setSaveMessage(''), 3000);
//     } catch (error) {
//       console.error("Error saving category selections:", error);
//       setSaveMessage('Failed to save. Please try again.');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const toggleItemAvailability = async (itemId) => {
//     const currentStock = filteredItems.find(item => item.id === itemId)?.inStock;
//     const newStock = !currentStock;
//     setFilteredItems(prevItems =>
//       prevItems.map(item =>
//         item.id === itemId ? { ...item, inStock: newStock } : item
//       )
//     );
//     setItemsStock(prev => ({
//       ...prev,
//       [itemId]: { inStock: newStock }
//     }));
//     if (shopId) {
//       const db = getDatabase();
//       const stockRef = ref(db, `shops/${shopId}/itemsStock/${itemId}`);
//       try {
//         await update(stockRef, { inStock: newStock });
//       } catch (error) {
//         console.error("Error updating stock:", error);
//         setFilteredItems(prevItems =>
//           prevItems.map(item =>
//             item.id === itemId ? { ...item, inStock: currentStock } : item
//           )
//         );
//       }
//     }
//   };

//   const getSelectedCategoriesForFilter = () => {
//     return Object.entries(selectedCategories)
//       .filter(([_, isSelected]) => isSelected === true)
//       .map(([key]) => ({ id: key, name: categoryDisplayNames[key] }))
//       .filter(cat => cat.name);
//   };

//   const formatWeight = (weight) => {
//     if (!weight) return '';
//     if (weight.toString().toLowerCase().includes('g') || weight.toString().toLowerCase().includes('kg') || weight.toString().toLowerCase().includes('ml') || weight.toString().toLowerCase().includes('l')) {
//       return weight;
//     }
//     const numericWeight = parseFloat(weight);
//     if (!isNaN(numericWeight)) {
//       return `${numericWeight}g`;
//     }
//     return `${weight}g`;
//   };

//   const handleBasePriceChange = (itemId, value) => {
//     setBasePriceInputs(prev => ({
//       ...prev,
//       [itemId]: value
//     }));
//   };

//   const handleVendorPriceChange = (itemId, value) => {
//     setVendorPriceInputs(prev => ({
//       ...prev,
//       [itemId]: value
//     }));
//   };

//   const handleSellingPriceChange = (itemId, value) => {
//     setSellingPriceInputs(prev => ({
//       ...prev,
//       [itemId]: value
//     }));
//   };

//   const savePrices = async (itemId) => {
//     if (!shopId) return;
//     const inputBasePrice = parseFloat(basePriceInputs[itemId]) || 0;
//     const inputVendorPrice = parseFloat(vendorPriceInputs[itemId]) || 0;
//     const inputSellingPrice = parseFloat(sellingPriceInputs[itemId]) || 0;

//     // Validation: Base Price must be greater than 0
//     if (inputBasePrice <= 0) {
//       setPriceMessages(prev => ({
//         ...prev,
//         [itemId]: 'Base price must be greater than ₹0'
//       }));
//       setTimeout(() => setPriceMessages(prev => ({ ...prev, [itemId]: '' })), 3000);
//       return;
//     }

//     // Validation: Vendor Price must be greater than Base Price
//     if (inputVendorPrice <= inputBasePrice) {
//       setPriceMessages(prev => ({
//         ...prev,
//         [itemId]: `Vendor price must be greater than base price of ₹${inputBasePrice}`
//       }));
//       setTimeout(() => setPriceMessages(prev => ({ ...prev, [itemId]: '' })), 3000);
//       return;
//     }

//     // Validation: Selling Price must be greater than or equal to Vendor Price and greater than Base Price
//     if (inputSellingPrice < inputVendorPrice || inputSellingPrice <= inputBasePrice) {
//       setPriceMessages(prev => ({
//         ...prev,
//         [itemId]: `Selling price must be greater than or equal to vendor price of ₹${inputVendorPrice} and greater than base price of ₹${inputBasePrice}`
//       }));
//       setTimeout(() => setPriceMessages(prev => ({ ...prev, [itemId]: '' })), 3000);
//       return;
//     }

//     setSavingPrices(prev => ({ ...prev, [itemId]: true }));
//     const db = getDatabase();

//     try {
//       // Update Base Price
//       const basePriceRef = ref(db, `shops/${shopId}/basePrices/${itemId}`);
//       await update(basePriceRef, { price: inputBasePrice });

//       // Update Vendor Price
//       const vendorPriceRef = ref(db, `shops/${shopId}/vendorPrices/${itemId}`);
//       await update(vendorPriceRef, { price: inputVendorPrice });

//       // Update Selling Price
//       const sellingPriceRef = ref(db, `shops/${shopId}/sellingPrices/${itemId}`);
//       await update(sellingPriceRef, { price: inputSellingPrice });

//       // Update local state
//       setBasePrices(prev => ({
//         ...prev,
//         [itemId]: { price: inputBasePrice }
//       }));
//       setVendorPrices(prev => ({
//         ...prev,
//         [itemId]: { price: inputVendorPrice }
//       }));
//       setSellingPrices(prev => ({
//         ...prev,
//         [itemId]: { price: inputSellingPrice }
//       }));

//       setPriceMessages(prev => ({
//         ...prev,
//         [itemId]: 'Prices updated successfully!'
//       }));
//       setTimeout(() => setPriceMessages(prev => ({ ...prev, [itemId]: '' })), 2000);
//     } catch (error) {
//       console.error("Error saving prices:", error);
//       setPriceMessages(prev => ({
//         ...prev,
//         [itemId]: 'Failed to save prices. Please try again.'
//       }));
//       setTimeout(() => setPriceMessages(prev => ({ ...prev, [itemId]: '' })), 3000);
//     } finally {
//       setSavingPrices(prev => ({ ...prev, [itemId]: false }));
//     }
//   };

//   // Get base price (either from shop custom setting or from item.originalPrice)
//   const getBaseCost = (itemId) => {
//     const customBasePrice = basePrices[itemId]?.price;
//     if (customBasePrice !== undefined) return customBasePrice;
    
//     const item = items.find(item => item.id === itemId);
//     return item?.originalPrice || 0;
//   };

//   // Get vendor price (either from shop custom setting or from item.vendorPrice)
//   const getVendorPrice = (itemId) => {
//     const customVendorPrice = vendorPrices[itemId]?.price;
//     if (customVendorPrice !== undefined) return customVendorPrice;
    
//     const item = items.find(item => item.id === itemId);
//     return item?.vendorPrice || getBaseCost(itemId);
//   };

//   // Get selling price (either from shop custom setting or from item.price)
//   const getSellingPrice = (itemId) => {
//     const customSellingPrice = sellingPrices[itemId]?.price;
//     if (customSellingPrice !== undefined) return customSellingPrice;
    
//     const item = items.find(item => item.id === itemId);
//     return item?.price || getVendorPrice(itemId);
//   };

//   // Get the price to display on the product card
//   const getDisplayPrice = (item) => {
//     return getSellingPrice(item.id);
//   };

//   if (loading) {
//     return (
//       <div className="vendor-products-manager">
//         <div className="loading-container">
//           <div className="loading-spinner"></div>
//           <p>Loading vendor products...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="vendor-products-manager">
//       <div className="products-manager-header">
//         <h2>Product Management - {shopName}</h2>
//         <div className="tab-navigation">
//           <button
//             className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
//             onClick={() => setActiveTab('categories')}
//           >
//             <Grid size={16} />
//             Assign Categories
//           </button>
//           <button
//             className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
//             onClick={() => setActiveTab('products')}
//           >
//             <Package size={16} />
//             Manage Products
//           </button>
//         </div>
//       </div>

//       {activeTab === 'categories' && (
//         <div className="categories-section">
//           <div className="section-header">
//             <h3>Available Product Categories</h3>
//             <p className="section-description">
//               Select the categories this vendor wants to offer to customers
//             </p>
//           </div>
//           <div className="category-selection">
//             {categories.length > 0 ? (
//               <div className="categories-grid">
//                 {categories.map(category => (
//                   <div key={category.id} className="category-card">
//                     <div className="category-content">
//                       <input
//                         type="checkbox"
//                         id={`category-${category.id}`}
//                         checked={selectedCategories[category.id] || false}
//                         onChange={() => handleCategoryChange(category.id)}
//                         className="category-checkbox"
//                       />
//                       <label htmlFor={`category-${category.id}`} className="category-label">
//                         <div className="category-info">
//                           <span className="category-name">{category.name}</span>
//                           <span className="category-description">{category.description}</span>
//                         </div>
//                         <div className="checkbox-indicator">
//                           {selectedCategories[category.id] && <CheckCircle size={20} />}
//                         </div>
//                       </label>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="no-categories">
//                 <p>No categories available</p>
//               </div>
//             )}
//           </div>
//           <div className="save-section">
//             <button
//               className="save-categories-btn"
//               onClick={saveCategories}
//               disabled={isSaving}
//             >
//               {isSaving ? 'Saving...' : 'Save Category Selections'}
//             </button>
//             {saveMessage && (
//               <div className={`save-message ${saveMessage.includes('success') ? 'success' : 'error'}`}>
//                 {saveMessage}
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {activeTab === 'products' && (
//         <div className="products-section">
//           <div className="products-controls">
//             <div className="search-filters">
//               <div className="search-container">
//                 <Search className="search-icon" />
//                 <input
//                   type="text"
//                   placeholder="Search products..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="search-input"
//                 />
//               </div>
//               <div className="filter-group">
//                 <select
//                   value={categoryFilter}
//                   onChange={(e) => setCategoryFilter(e.target.value)}
//                   className="filter-select"
//                 >
//                   <option value="all">All Categories</option>
//                   {getSelectedCategoriesForFilter().map(cat => (
//                     <option key={cat.id} value={cat.id}>{cat.name}</option>
//                   ))}
//                 </select>
//                 <select
//                   value={stockFilter}
//                   onChange={(e) => setStockFilter(e.target.value)}
//                   className="filter-select"
//                 >
//                   <option value="all">All Stock Status</option>
//                   <option value="in-stock">In Stock</option>
//                   <option value="out-of-stock">Out of Stock</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {filteredItems.length === 0 ? (
//             <div className="no-products">
//               <div className="empty-icon">📦</div>
//               <h3>No Products Available</h3>
//               <p>This vendor hasn't selected any categories or there are no products in the selected categories.</p>
//               <button
//                 className="assign-categories-btn"
//                 onClick={() => setActiveTab('categories')}
//               >
//                 Assign Categories
//               </button>
//             </div>
//           ) : (
//             <div className="products-grid">
//               {filteredItems.map(item => {
//                 // Get current values for display and placeholders
//                 const currentBasePrice = getBaseCost(item.id);
//                 const currentVendorPrice = getVendorPrice(item.id);
//                 const currentSellingPrice = getSellingPrice(item.id);
                
//                 return (
//                 <div key={item.id} className={`product-card ${!item.inStock ? 'out-of-stock' : ''}`}>
//                   <div className="product-image">
//                     {item.image ? (
//                       <img
//                         src={item.image}
//                         alt={item.name}
//                         onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'}
//                       />
//                     ) : (
//                       <div className="no-image">
//                         <Package size={40} />
//                         <span>No Image</span>
//                       </div>
//                     )}
                   
//                     <div className="selling-price-overlay">
//                       ₹{currentSellingPrice || 'N/A'}
//                     </div>
//                   </div>
//                   <div className="product-details">
//                     <h4 className="product-name">{item.name}</h4>
//                     <p className="product-category">{item.category}</p>
//                     <div className="price-management">
//                       <div className="price-row">
//                         <div className="price-inputs-container">
//                           <div className="price-input-wrapper base-price">
//                             <label className="price-label">Daily Base Price:</label>
//                             <input
//                               type="number"
//                               min="1"
//                               step="1"
//                               value={basePriceInputs[item.id]}
//                               onChange={(e) => handleBasePriceChange(item.id, e.target.value)}
//                               className="price-input"
//                               placeholder={`Current: ₹${currentBasePrice}`}
//                             />
//                           </div>
//                           <div className="price-input-wrapper vendor-price">
//                             <label className="price-label">Vendor Price:</label>
//                             <input
//                               type="number"
//                               step="1"
//                               value={vendorPriceInputs[item.id]}
//                               onChange={(e) => handleVendorPriceChange(item.id, e.target.value)}
//                               className="price-input"
//                               placeholder={`Current: ₹${currentVendorPrice}`}
//                             />
//                           </div>
//                           <div className="price-input-wrapper selling-price">
//                             <label className="price-label">Selling Price:</label>
//                             <input
//                               type="number"
//                               step="1"
//                               value={sellingPriceInputs[item.id]}
//                               onChange={(e) => handleSellingPriceChange(item.id, e.target.value)}
//                               className="price-input"
//                               placeholder={`Current: ₹${currentSellingPrice}`}
//                             />
//                           </div>
//                           <button
//                             className="save-both-prices-btn"
//                             onClick={() => savePrices(item.id)}
//                             disabled={savingPrices[item.id]}
//                           >
//                             {savingPrices[item.id] ? 'Saving...' : 'Save Prices'}
//                           </button>
//                         </div>
//                         {priceMessages[item.id] && (
//                           <div className={`price-message ${priceMessages[item.id].includes('success') ? 'success' : 'error'}`}>
//                             {priceMessages[item.id]}
//                           </div>
//                         )}
//                       </div>
//                       <div className="product-details-row">
//                         <div className="profit-margin-info">
//                           <span className="profit-label">Profit Margin:</span>
//                           <span className="profit-amount">
//                             ₹{Math.max(0, currentSellingPrice - currentVendorPrice)}
//                           </span>
//                         </div>
//                         {item.weight && (
//                           <div className="product-weight-info">
//                             <span className="weight-label">Weight:</span>
//                             <span className="product-weight">{formatWeight(item.weight)}</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
                 
//                 </div>
//               )})}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default VendorProductsManager;





import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, set, update, onValue } from 'firebase/database';
import { Package, Grid, CheckCircle, Search, Filter } from 'lucide-react';
import '../styles/VendorProductsManager.css';

const VendorProductsManager = ({ shopId, shopName }) => {
  const [activeTab, setActiveTab] = useState('categories');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState({});
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [itemsStock, setItemsStock] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [basePrices, setBasePrices] = useState({});
  const [vendorPrices, setVendorPrices] = useState({});
  const [sellingPrices, setSellingPrices] = useState({});
  const [basePriceInputs, setBasePriceInputs] = useState({});
  const [vendorPriceInputs, setVendorPriceInputs] = useState({});
  const [sellingPriceInputs, setSellingPriceInputs] = useState({});
  const [savingPrices, setSavingPrices] = useState({});
  const [priceMessages, setPriceMessages] = useState({});
  const [stockUpdateLoading, setStockUpdateLoading] = useState({});

  const categoryDisplayNames = {
    'chicken': 'Chicken',
    'mutton': 'Mutton',
    'liver-more': 'Liver & More',
    'fish-seafood': 'Fish & Seafood',
    'combos': 'Combos',
    'eggs': 'Eggs',
    'goat': 'Goat',
    'prawns-crabs': 'Prawns & Crabs'
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!shopId) return;
      const db = getDatabase();
      setLoading(true);

      try {
        const categoriesRef = ref(db, 'categories');
        const categoriesSnapshot = await get(categoriesRef);
        let formattedCategories = [];
        if (categoriesSnapshot.exists()) {
          const categoriesData = categoriesSnapshot.val();
          formattedCategories = Object.entries(categoriesData).map(([id, category]) => ({
            id,
            ...category
          }));
          setCategories(formattedCategories);
        }

        const shopRef = ref(db, `shops/${shopId}`);
        const shopSnapshot = await get(shopRef);
        if (shopSnapshot.exists()) {
          const shopData = shopSnapshot.val();
          let categoriesState = {};
          formattedCategories.forEach(category => {
            categoriesState[category.id] = false;
          });
          if (shopData.selectedCategories) {
            categoriesState = { ...categoriesState, ...shopData.selectedCategories };
          }
          setSelectedCategories(categoriesState);
          if (shopData.itemsStock) {
            setItemsStock(shopData.itemsStock);
          }
          if (shopData.basePrices) {
            setBasePrices(shopData.basePrices);
          }
          if (shopData.vendorPrices) {
            setVendorPrices(shopData.vendorPrices);
          }
          if (shopData.sellingPrices) {
            setSellingPrices(shopData.sellingPrices);
          }
        }

        const itemsRef = ref(db, 'items');
        onValue(itemsRef, (snapshot) => {
          if (snapshot.exists()) {
            const itemsData = [];
            const processedIds = new Set();
            snapshot.forEach((childSnapshot) => {
              const item = {
                id: childSnapshot.key,
                ...childSnapshot.val(),
                inStock: true
              };
              if (!processedIds.has(item.id)) {
                itemsData.push(item);
                processedIds.add(item.id);
              }
            });
            
            // Apply stock status from itemsStock
            const updatedItemsData = itemsData.map(item => {
              if (itemsStock[item.id]) {
                return {
                  ...item,
                  inStock: itemsStock[item.id].inStock
                };
              }
              return item;
            });
            
            setItems(updatedItemsData);
            
            // Initialize input states with existing values from items and custom prices
            const initialBasePriceInputs = {};
            const initialVendorPriceInputs = {};
            const initialSellingPriceInputs = {};
            
            itemsData.forEach(item => {
              // Base price defaults to item's originalPrice
              const basePrice = basePrices[item.id]?.price || item.originalPrice || 0;
              initialBasePriceInputs[item.id] = basePrice.toString();
              
              // Vendor price defaults to vendorPrice from shop data or item.vendorPrice
              const vendorPrice = vendorPrices[item.id]?.price || item.vendorPrice || 0;
              initialVendorPriceInputs[item.id] = vendorPrice.toString();
              
              // Selling price defaults to sellingPrice from shop data or item.price
              const sellPrice = sellingPrices[item.id]?.price || item.price || 0;
              initialSellingPriceInputs[item.id] = sellPrice.toString();
            });
            
            setBasePriceInputs(initialBasePriceInputs);
            setVendorPriceInputs(initialVendorPriceInputs);
            setSellingPriceInputs(initialSellingPriceInputs);
          } else {
            setItems([]);
          }
          setLoading(false);
        });
        
        // Listen for real-time stock updates
        const itemsStockRef = ref(db, `shops/${shopId}/itemsStock`);
        onValue(itemsStockRef, (snapshot) => {
          if (snapshot.exists()) {
            const stockData = snapshot.val();
            setItemsStock(stockData);
            
            // Update items with the latest stock status
            setItems(prevItems => prevItems.map(item => {
              if (stockData[item.id]) {
                return {
                  ...item,
                  inStock: stockData[item.id].inStock
                };
              }
              return item;
            }));
          }
        });
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [shopId]);

  useEffect(() => {
    if (items.length === 0 || Object.keys(selectedCategories).length === 0) {
      setFilteredItems([]);
      return;
    }

    const selectedCategoryKeys = Object.entries(selectedCategories)
      .filter(([_, isSelected]) => isSelected === true)
      .map(([key]) => key);

    const filteredItemsMap = new Map();
    items.forEach(item => {
      if (filteredItemsMap.has(item.id)) return;
      
      let belongsToSelectedCategory = false;
      if (item.displayCategory) {
        belongsToSelectedCategory = selectedCategoryKeys.includes(item.displayCategory);
      }

      if (!belongsToSelectedCategory && item.category) {
        for (const catKey of selectedCategoryKeys) {
          const expectedCategoryName = categoryDisplayNames[catKey];
          if (item.category === expectedCategoryName) {
            belongsToSelectedCategory = true;
            break;
          }
          if (catKey === 'fish-seafood' && (item.category === "Premium fish & seafood selection" || item.category.toLowerCase().includes('fish') || item.category.toLowerCase().includes('seafood'))) {
            belongsToSelectedCategory = true;
            break;
          }
          if (catKey === 'liver-more' && (item.category === "Liver & More" || item.category.toLowerCase().includes('liver'))) {
            belongsToSelectedCategory = true;
            break;
          }
          if (catKey === 'chicken' && (item.category.toLowerCase().includes('chicken') || (item.category === "Bestsellers" && item.name && item.name.toLowerCase().includes('chicken')))) {
            belongsToSelectedCategory = true;
            break;
          }
          if (catKey === 'mutton' && (item.category.toLowerCase().includes('mutton') || (item.category === "Bestsellers" && item.name && item.name.toLowerCase().includes('mutton')))) {
            belongsToSelectedCategory = true;
            break;
          }
          if (catKey === 'goat' && (item.category.toLowerCase().includes('goat') || (item.category === "Bestsellers" && item.name && item.name.toLowerCase().includes('goat')))) {
            belongsToSelectedCategory = true;
            break;
          }
          if (catKey === 'eggs' && (item.category.toLowerCase().includes('egg') || (item.category === "Bestsellers" && item.name && item.name.toLowerCase().includes('egg')))) {
            belongsToSelectedCategory = true;
            break;
          }
          if (catKey === 'combos' && (item.category.toLowerCase().includes('combo') || item.category === "Match Day Essentials")) {
            belongsToSelectedCategory = true;
            break;
          }
          if (catKey === 'prawns-crabs' && (item.category.toLowerCase().includes('prawn') || item.category.toLowerCase().includes('crab') || item.category === "Premium fish & seafood selection")) {
            belongsToSelectedCategory = true;
            break;
          }
        }
      }

      if (!belongsToSelectedCategory) {
        for (const catKey of selectedCategoryKeys) {
          const categoryName = categoryDisplayNames[catKey];
          if (categoryName && item.name) {
            const itemNameLower = item.name.toLowerCase();
            const categoryLower = categoryName.toLowerCase();
            if (itemNameLower.includes(categoryLower.split(' ')[0]) ||
                (catKey === 'fish-seafood' && (itemNameLower.includes('fish') || itemNameLower.includes('seafood'))) ||
                (catKey === 'prawns-crabs' && (itemNameLower.includes('prawn') || itemNameLower.includes('crab'))) ||
                (catKey === 'liver-more' && itemNameLower.includes('liver'))) {
              belongsToSelectedCategory = true;
              break;
            }
          }
        }
      }

      if (!belongsToSelectedCategory) return;
      if (categoryFilter !== 'all') {
        const matchesFilter = (
          item.displayCategory === categoryFilter ||
          item.category === categoryDisplayNames[categoryFilter] ||
          (categoryFilter === 'fish-seafood' && item.category === "Premium fish & seafood selection") ||
          (categoryFilter === 'combos' && item.category === "Match Day Essentials")
        );
        if (!matchesFilter) return;
      }

      if (stockFilter === 'in-stock' && !item.inStock) return;
      if (stockFilter === 'out-of-stock' && item.inStock) return;

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const nameMatch = item.name && item.name.toLowerCase().includes(searchLower);
        const descMatch = item.description && item.description.toLowerCase().includes(searchLower);
        if (!nameMatch && !descMatch) return;
      }

      filteredItemsMap.set(item.id, item);
    });

    setFilteredItems(Array.from(filteredItemsMap.values()));
  }, [selectedCategories, items, searchTerm, categoryFilter, stockFilter]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories({
      ...selectedCategories,
      [categoryId]: !selectedCategories[categoryId]
    });
  };

  const saveCategories = async () => {
    if (!shopId) return;
    setIsSaving(true);
    setSaveMessage('');
    const db = getDatabase();
    const selectedCategoriesRef = ref(db, `shops/${shopId}/selectedCategories`);
    try {
      await set(selectedCategoriesRef, selectedCategories);
      setSaveMessage('Category selections saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error("Error saving category selections:", error);
      setSaveMessage('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleItemAvailability = async (itemId) => {
    const currentItem = filteredItems.find(item => item.id === itemId);
    if (!currentItem) return;
    
    const currentStock = currentItem.inStock;
    const newStockStatus = !currentStock;
    
    // Set loading state for this specific item
    setStockUpdateLoading(prev => ({
      ...prev,
      [itemId]: true
    }));
    
    try {
      const db = getDatabase();
      const stockRef = ref(db, `shops/${shopId}/itemsStock/${itemId}`);
      
      // Update the database first
      await update(stockRef, { inStock: newStockStatus });
      console.log(`Item ${itemId} stock updated to ${newStockStatus ? 'in stock' : 'out of stock'}`);
      
      // Update local state after successful database update
      setFilteredItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, inStock: newStockStatus } : item
        )
      );
      
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, inStock: newStockStatus } : item
        )
      );
      
      setItemsStock(prev => ({
        ...prev,
        [itemId]: { inStock: newStockStatus }
      }));
      
    } catch (error) {
      console.error("Error updating stock:", error);
      // No need to revert UI state since we're using real-time database listeners
    } finally {
      setStockUpdateLoading(prev => ({
        ...prev,
        [itemId]: false
      }));
    }
  };

  const getSelectedCategoriesForFilter = () => {
    return Object.entries(selectedCategories)
      .filter(([_, isSelected]) => isSelected === true)
      .map(([key]) => ({ id: key, name: categoryDisplayNames[key] }))
      .filter(cat => cat.name);
  };

  const formatWeight = (weight) => {
    if (!weight) return '';
    if (weight.toString().toLowerCase().includes('g') || weight.toString().toLowerCase().includes('kg') || weight.toString().toLowerCase().includes('ml') || weight.toString().toLowerCase().includes('l')) {
      return weight;
    }
    const numericWeight = parseFloat(weight);
    if (!isNaN(numericWeight)) {
      return `${numericWeight}g`;
    }
    return `${weight}g`;
  };

  const handleBasePriceChange = (itemId, value) => {
    setBasePriceInputs(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  const handleVendorPriceChange = (itemId, value) => {
    setVendorPriceInputs(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  const handleSellingPriceChange = (itemId, value) => {
    setSellingPriceInputs(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  const savePrices = async (itemId) => {
    if (!shopId) return;
    const inputBasePrice = parseFloat(basePriceInputs[itemId]) || 0;
    const inputVendorPrice = parseFloat(vendorPriceInputs[itemId]) || 0;
    const inputSellingPrice = parseFloat(sellingPriceInputs[itemId]) || 0;

    // Validation: Base Price must be greater than 0
    if (inputBasePrice <= 0) {
      setPriceMessages(prev => ({
        ...prev,
        [itemId]: 'Base price must be greater than ₹0'
      }));
      setTimeout(() => setPriceMessages(prev => ({ ...prev, [itemId]: '' })), 3000);
      return;
    }

    // Validation: Vendor Price must be greater than Base Price
    if (inputVendorPrice <= inputBasePrice) {
      setPriceMessages(prev => ({
        ...prev,
        [itemId]: `Vendor price must be greater than base price of ₹${inputBasePrice}`
      }));
      setTimeout(() => setPriceMessages(prev => ({ ...prev, [itemId]: '' })), 3000);
      return;
    }

    // Validation: Selling Price must be greater than or equal to Vendor Price and greater than Base Price
    if (inputSellingPrice < inputVendorPrice || inputSellingPrice <= inputBasePrice) {
      setPriceMessages(prev => ({
        ...prev,
        [itemId]: `Selling price must be greater than or equal to vendor price of ₹${inputVendorPrice} and greater than base price of ₹${inputBasePrice}`
      }));
      setTimeout(() => setPriceMessages(prev => ({ ...prev, [itemId]: '' })), 3000);
      return;
    }

    setSavingPrices(prev => ({ ...prev, [itemId]: true }));
    const db = getDatabase();

    try {
      // Update Base Price
      const basePriceRef = ref(db, `shops/${shopId}/basePrices/${itemId}`);
      await update(basePriceRef, { price: inputBasePrice });

      // Update Vendor Price
      const vendorPriceRef = ref(db, `shops/${shopId}/vendorPrices/${itemId}`);
      await update(vendorPriceRef, { price: inputVendorPrice });

      // Update Selling Price
      const sellingPriceRef = ref(db, `shops/${shopId}/sellingPrices/${itemId}`);
      await update(sellingPriceRef, { price: inputSellingPrice });

      // Update local state
      setBasePrices(prev => ({
        ...prev,
        [itemId]: { price: inputBasePrice }
      }));
      setVendorPrices(prev => ({
        ...prev,
        [itemId]: { price: inputVendorPrice }
      }));
      setSellingPrices(prev => ({
        ...prev,
        [itemId]: { price: inputSellingPrice }
      }));

      setPriceMessages(prev => ({
        ...prev,
        [itemId]: 'Prices updated successfully!'
      }));
      setTimeout(() => setPriceMessages(prev => ({ ...prev, [itemId]: '' })), 2000);
    } catch (error) {
      console.error("Error saving prices:", error);
      setPriceMessages(prev => ({
        ...prev,
        [itemId]: 'Failed to save prices. Please try again.'
      }));
      setTimeout(() => setPriceMessages(prev => ({ ...prev, [itemId]: '' })), 3000);
    } finally {
      setSavingPrices(prev => ({ ...prev, [itemId]: false }));
    }
  };

  // Get base price (either from shop custom setting or from item.originalPrice)
  const getBaseCost = (itemId) => {
    const customBasePrice = basePrices[itemId]?.price;
    if (customBasePrice !== undefined) return customBasePrice;
    
    const item = items.find(item => item.id === itemId);
    return item?.originalPrice || 0;
  };

  // Get vendor price (either from shop custom setting or from item.vendorPrice)
  const getVendorPrice = (itemId) => {
    const customVendorPrice = vendorPrices[itemId]?.price;
    if (customVendorPrice !== undefined) return customVendorPrice;
    
    const item = items.find(item => item.id === itemId);
    return item?.vendorPrice || getBaseCost(itemId);
  };

  // Get selling price (either from shop custom setting or from item.price)
  const getSellingPrice = (itemId) => {
    const customSellingPrice = sellingPrices[itemId]?.price;
    if (customSellingPrice !== undefined) return customSellingPrice;
    
    const item = items.find(item => item.id === itemId);
    return item?.price || getVendorPrice(itemId);
  };

  // Get the price to display on the product card
  const getDisplayPrice = (item) => {
    return getSellingPrice(item.id);
  };

  // Initialize stock status for all items
  const initializeAllStockStatus = async () => {
    if (!shopId || items.length === 0) return;
    
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      const db = getDatabase();
      const updatedStockStatus = {};
      
      // Create an object with all items having inStock status
      items.forEach(item => {
        const currentStatus = itemsStock[item.id]?.inStock;
        updatedStockStatus[item.id] = { 
          inStock: currentStatus !== undefined ? currentStatus : true 
        };
      });
      
      // Update Firebase with complete stock status for all items
      const stockRef = ref(db, `shops/${shopId}/itemsStock`);
      await update(stockRef, updatedStockStatus);
      
      // Update local state
      setItemsStock(updatedStockStatus);
      
      setSaveMessage('All items stock status initialized successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error("Error initializing stock status:", error);
      setSaveMessage('Failed to initialize stock status. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="vendor-products-manager">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading vendor products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-products-manager">
      <div className="products-manager-header">
        <h2>Product Management - {shopName}</h2>
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <Grid size={16} />
            Assign Categories
          </button>
          <button
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={16} />
            Manage Products
          </button>
        </div>
      </div>

      {activeTab === 'categories' && (
        <div className="categories-section">
          <div className="section-header">
            <h3>Available Product Categories</h3>
            <p className="section-description">
              Select the categories this vendor wants to offer to customers
            </p>
          </div>
          <div className="category-selection">
            {categories.length > 0 ? (
              <div className="categories-grid">
                {categories.map(category => (
                  <div key={category.id} className="category-card">
                    <div className="category-content">
                      <input
                        type="checkbox"
                        id={`category-${category.id}`}
                        checked={selectedCategories[category.id] || false}
                        onChange={() => handleCategoryChange(category.id)}
                        className="category-checkbox"
                      />
                      <label htmlFor={`category-${category.id}`} className="category-label">
                        <div className="category-info">
                          <span className="category-name">{category.name}</span>
                          <span className="category-description">{category.description}</span>
                        </div>
                        <div className="checkbox-indicator">
                          {selectedCategories[category.id] && <CheckCircle size={20} />}
                        </div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-categories">
                <p>No categories available</p>
              </div>
            )}
          </div>
          <div className="save-section">
            <button
              className="save-categories-btn"
              onClick={saveCategories}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Category Selections'}
            </button>
            <button
              className="initialize-stock-btn"
              onClick={initializeAllStockStatus}
              disabled={isSaving}
            >
              Initialize All Stock Status
            </button>
            {saveMessage && (
              <div className={`save-message ${saveMessage.includes('success') ? 'success' : 'error'}`}>
                {saveMessage}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="products-section">
          <div className="products-controls">
            <div className="search-filters">
              <div className="search-container">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="filter-group">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Categories</option>
                  {getSelectedCategoriesForFilter().map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Stock Status</option>
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="no-products">
              <div className="empty-icon">📦</div>
              <h3>No Products Available</h3>
              <p>This vendor hasn't selected any categories or there are no products in the selected categories.</p>
              <button
                className="assign-categories-btn"
                onClick={() => setActiveTab('categories')}
              >
                Assign Categories
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredItems.map(item => {
                // Get current values for display and placeholders
                const currentBasePrice = getBaseCost(item.id);
                const currentVendorPrice = getVendorPrice(item.id);
                const currentSellingPrice = getSellingPrice(item.id);
                
                return (
                <div key={item.id} className={`product-card ${!item.inStock ? 'out-of-stock' : ''}`}>
                  <div className="product-image">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'}
                      />
                    ) : (
                      <div className="no-image">
                        <Package size={40} />
                        <span>No Image</span>
                      </div>
                    )}
                    <div className={`stock-indicator ${item.inStock ? 'in-stock' : 'out-of-stock'}`}>
                      {item.inStock ? 'In Stock' : 'Out of Stock'}
                    </div>
                    <div className="selling-price-overlay">
                      ₹{currentSellingPrice || 'N/A'}
                    </div>
                  </div>
                  <div className="product-details">
                    <h4 className="product-name">{item.name}</h4>
                    <p className="product-category">{item.category}</p>
                    <div className="price-management">
                      <div className="price-row">
                        <div className="price-inputs-container">
                          <div className="price-input-wrapper base-price">
                            <label className="price-label">Daily Base Price:</label>
                            <input
                              type="number"
                              min="1"
                              step="1"
                              value={basePriceInputs[item.id]}
                              onChange={(e) => handleBasePriceChange(item.id, e.target.value)}
                              className="price-input"
                              placeholder={`Current: ₹${currentBasePrice}`}
                            />
                          </div>
                          <div className="price-input-wrapper vendor-price">
                            <label className="price-label">Vendor Price:</label>
                            <input
                              type="number"
                              step="1"
                              value={vendorPriceInputs[item.id]}
                              onChange={(e) => handleVendorPriceChange(item.id, e.target.value)}
                              className="price-input"
                              placeholder={`Current: ₹${currentVendorPrice}`}
                            />
                          </div>
                          <div className="price-input-wrapper selling-price">
                            <label className="price-label">Selling Price:</label>
                            <input
                              type="number"
                              step="1"
                              value={sellingPriceInputs[item.id]}
                              onChange={(e) => handleSellingPriceChange(item.id, e.target.value)}
                              className="price-input"
                              placeholder={`Current: ₹${currentSellingPrice}`}
                            />
                          </div>
                          <button
                            className="save-both-prices-btn"
                            onClick={() => savePrices(item.id)}
                            disabled={savingPrices[item.id]}
                          >
                            {savingPrices[item.id] ? 'Saving...' : 'Save Prices'}
                          </button>
                        </div>
                        {priceMessages[item.id] && (
                          <div className={`price-message ${priceMessages[item.id].includes('success') ? 'success' : 'error'}`}>
                            {priceMessages[item.id]}
                          </div>
                        )}
                      </div>
                      <div className="product-details-row">
                        <div className="profit-margin-info">
                          <span className="profit-label">Profit Margin:</span>
                          <span className="profit-amount">
                            ₹{Math.max(0, currentSellingPrice - currentVendorPrice)}
                          </span>
                        </div>
                        {item.weight && (
                          <div className="product-weight-info">
                            <span className="weight-label">Weight:</span>
                            <span className="product-weight">{formatWeight(item.weight)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="product-actions">
                    <button
                      className={`stock-toggle-btn ${item.inStock ? 'mark-unavailable' : 'mark-available'}`}
                      onClick={() => toggleItemAvailability(item.id)}
                      disabled={stockUpdateLoading[item.id]}
                    >
                      {stockUpdateLoading[item.id] ? 'Updating...' : item.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                    </button>
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VendorProductsManager;