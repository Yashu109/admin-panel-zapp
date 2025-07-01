// import React, { useState, useEffect } from 'react';
// import {
//   DollarSign,
//   CreditCard,
//   Calendar,
//   ChevronDown,
//   Download,
//   Filter,
//   Search,
//   RefreshCw,
//   CheckCircle,
//   XCircle,
//   FileText,
//   BarChart,
//   Wallet,
//   ArrowUp,
//   ArrowDown,
//   Store,
//   Settings,
//   ChevronRight,
//   ChevronLeft,
//   Edit,
//   Trash,
//   Plus,
//   Percent,
//   Eye,
//   Map,
//   Phone,
//   Mail,
//   Package,
//   TrendingUp,
//   AlertTriangle,
//   SortAsc,
//   SortDesc,
//   Coins
// } from 'lucide-react';
// import { ref, onValue, update, remove, push, set, get } from 'firebase/database';
// import { db } from '../firebase/config';
// import '../styles/PaymentCommission.css';
// import { X } from 'lucide-react';
// const PaymentCommission = () => {
//   // Function to calculate amount without tax
//   const calculateAmountWithoutTax = (order) => {
//     return (order.subtotal || 0) + (order.deliveryCharge || 0);
//   };

//   const [activeTab, setActiveTab] = useState('transactions');
//   const [dateRange, setDateRange] = useState('this-month');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [transactions, setTransactions] = useState([]);
//   const [vendors, setVendors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [orderIdMap, setOrderIdMap] = useState({});
//   const [expandedRows, setExpandedRows] = useState({});
//   const [editingVendor, setEditingVendor] = useState(null);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [editCommissionRate, setEditCommissionRate] = useState(10);
//   const [notification, setNotification] = useState(null);
//   // States for vendor details view
//   const [selectedVendor, setSelectedVendor] = useState(null);
//   const [vendorItems, setVendorItems] = useState([]);
//   const [vendorOrders, setVendorOrders] = useState([]);
//   const [vendorDetailsLoading, setVendorDetailsLoading] = useState(false);
//   const [processingPayments, setProcessingPayments] = useState({});
//   const [paidItems, setPaidItems] = useState({});


//   // States for filtering and sorting
//   const [itemsSortBy, setItemsSortBy] = useState('quantity'); // 'quantity', 'profit', 'name'
//   const [itemsSortOrder, setItemsSortOrder] = useState('desc'); // 'asc', 'desc'
//   const [ordersSortBy, setOrdersSortBy] = useState('date'); // 'date', 'amount', 'customer'
//   const [ordersSortOrder, setOrdersSortOrder] = useState('desc'); // 'asc', 'desc'
//   const [ordersDateFilter, setOrdersDateFilter] = useState('all'); // 'all', 'today', 'week', 'month'

//   // Export utility functions
//   const convertToCSV = (data, headers) => {
//     if (!data || data.length === 0) return '';

//     const csvHeaders = headers.join(',');
//     const csvRows = data.map(row => {
//       return headers.map(header => {
//         let value = row[header];
//         if (value === null || value === undefined) value = '';
//         if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
//           value = `"${value.replace(/"/g, '""')}"`;
//         }
//         return value;
//       });
//     });

//     return [csvHeaders, ...csvRows.map(row => row.join(','))].join('\n');
//   };

//   const downloadCSV = (csvContent, filename) => {
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
//     link.setAttribute('href', url);
//     link.setAttribute('download', filename);
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Export transactions data
//   const exportTransactions = () => {
//     try {
//       if (!filteredTransactions || filteredTransactions.length === 0) {
//         alert('No transactions to export');
//         return;
//       }

//       const exportData = filteredTransactions.map(transaction => ({
//         'Transaction ID': transaction.id,
//         'Order ID': transaction.order?.displayId || 'N/A',
//         'Date': formatDate(transaction.date),
//         'Amount': transaction.amount || 0,
//         'Commission': transaction.commission || 0,
//         'Vendor Payout': transaction.vendorPayout || 0,
//         'Customer': transaction.customer?.name || 'N/A',
//         'Vendor': transaction.vendor?.name || 'N/A',
//         'Status': transaction.status,
//         'Payment Method': transaction.paymentMethod?.type || 'N/A',
//         'Payment Details': transaction.paymentMethod?.details || 'N/A',
//         'Failure Reason': transaction.failureReason || 'N/A'
//       }));

//       const headers = [
//         'Transaction ID', 'Order ID', 'Date', 'Amount', 'Commission',
//         'Vendor Payout', 'Customer', 'Vendor', 'Status', 'Payment Method',
//         'Payment Details', 'Failure Reason'
//       ];

//       const csvContent = convertToCSV(exportData, headers);
//       const filename = `transactions_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`;
//       downloadCSV(csvContent, filename);
//     } catch (error) {
//       console.error('Error exporting transactions:', error);
//       alert('Error exporting transactions. Please try again.');
//     }
//   };

//   // Export vendors data
//   const exportVendors = () => {
//     try {
//       if (!filteredVendors || filteredVendors.length === 0) {
//         alert('No vendors to export');
//         return;
//       }

//       const exportData = filteredVendors.map(vendor => ({
//         'Vendor ID': vendor.id,
//         'Vendor Name': vendor.name,
//         'Category': vendor.category,
//         'Address': vendor.address,
//         'Phone': vendor.phone || 'N/A',
//         'Email': vendor.email || 'N/A',
//         'Commission Rate (%)': vendor.commissionRate,
//         'Total Revenue': vendor.totalRevenue || 0,
//         'Total Orders': vendor.totalOrders || 0,
//         'Total Commission': vendor.totalCommission || 0,
//         'Total Profit': vendor.totalProfit || 0,
//         'Last Order Date': vendor.lastOrderDate ? formatDate(vendor.lastOrderDate) : 'N/A'
//       }));

//       const headers = [
//         'Vendor ID', 'Vendor Name', 'Category', 'Address', 'Phone', 'Email',
//         'Commission Rate (%)', 'Total Revenue', 'Total Orders', 'Total Commission',
//         'Total Profit', 'Last Order Date'
//       ];

//       const csvContent = convertToCSV(exportData, headers);
//       const filename = `vendors_${new Date().toISOString().split('T')[0]}.csv`;
//       downloadCSV(csvContent, filename);
//     } catch (error) {
//       console.error('Error exporting vendors:', error);
//       alert('Error exporting vendors. Please try again.');
//     }
//   };

//   // Export vendor details (items and orders)
//   const exportVendorDetails = () => {
//     try {
//       if (!selectedVendor) {
//         alert('No vendor selected');
//         return;
//       }

//       // Export vendor items
//       if (displayedVendorItems && displayedVendorItems.length > 0) {
//         const itemsData = displayedVendorItems.map(item => ({
//           'Item Name': item.name,
//           'Quantity Sold': item.quantity,
//           'Base Price': item.basePrice || 0,
//           'Vendor Price': item.vendorPrice || 0,
//           'Total Vendor Price': (item.vendorPrice || 0) * (item.quantity || 0),
//           'Selling Price': item.sellingPrice || 0,
//           'Total Profit': item.totalProfit || 0
//         }));

//         const itemsHeaders = [
//           'Item Name', 'Quantity Sold', 'Base Price', 'Vendor Price',
//           'Total Vendor Price', 'Selling Price', 'Total Profit'
//         ];

//         const itemsCsvContent = convertToCSV(itemsData, itemsHeaders);
//         const itemsFilename = `${selectedVendor.name.replace(/\s+/g, '_')}_items_${new Date().toISOString().split('T')[0]}.csv`;
//         downloadCSV(itemsCsvContent, itemsFilename);
//       }

//       // Export vendor orders
//       if (displayedVendorOrders && displayedVendorOrders.length > 0) {
//         const ordersData = displayedVendorOrders.map(order => ({
//           'Order ID': order.displayId,
//           'Date': formatDate(order.orderDate),
//           'Customer': order.customer?.fullName || 'Unknown',
//           'Items Count': order.items ? order.items.length : 0,
//           'Total Amount': calculateAmountWithoutTax(order), // Changed to use amount without tax
//           'Status': order.status || 'N/A'
//         }));

//         const ordersHeaders = [
//           'Order ID', 'Date', 'Customer', 'Items Count', 'Total Amount', 'Status'
//         ];

//         const ordersCsvContent = convertToCSV(ordersData, ordersHeaders);
//         const ordersFilename = `${selectedVendor.name.replace(/\s+/g, '_')}_orders_${new Date().toISOString().split('T')[0]}.csv`;

//         setTimeout(() => {
//           downloadCSV(ordersCsvContent, ordersFilename);
//         }, 500);
//       }

//       if ((!displayedVendorItems || displayedVendorItems.length === 0) &&
//         (!displayedVendorOrders || displayedVendorOrders.length === 0)) {
//         alert('No data to export for this vendor');
//       }
//     } catch (error) {
//       console.error('Error exporting vendor details:', error);
//       alert('Error exporting vendor details. Please try again.');
//     }
//   };

//   // Function to generate simplified order IDs for display
//   const generateOrderIdMap = (orders) => {
//     const idMap = {};
//     orders.forEach((order, index) => {
//       idMap[order.id] = `ORD-${index + 1}`;
//     });
//     setOrderIdMap(idMap);
//   };

//   // Toggle expanded row
//   const toggleRow = (transactionId) => {
//     setExpandedRows(prev => ({
//       ...prev,
//       [transactionId]: !prev[transactionId]
//     }));
//   };

//   // Sort items based on selected criteria
//   const sortItems = (items) => {
//     const sortedItems = [...items].sort((a, b) => {
//       let aValue, bValue;

//       switch (itemsSortBy) {
//         case 'quantity':
//           aValue = a.quantity;
//           bValue = b.quantity;
//           break;
//         case 'profit':
//           aValue = a.totalProfit || 0;
//           bValue = b.totalProfit || 0;
//           break;
//         case 'name':
//           aValue = a.name.toLowerCase();
//           bValue = b.name.toLowerCase();
//           break;
//         default:
//           return 0;
//       }

//       if (itemsSortOrder === 'asc') {
//         return aValue > bValue ? 1 : -1;
//       } else {
//         return aValue < bValue ? 1 : -1;
//       }
//     });

//     return sortedItems;
//   };

//   // Sort orders based on selected criteria
//   const sortOrders = (orders) => {
//     const sortedOrders = [...orders].sort((a, b) => {
//       let aValue, bValue;

//       switch (ordersSortBy) {
//         case 'date':
//           aValue = new Date(a.orderDate);
//           bValue = new Date(b.orderDate);
//           break;
//         case 'amount':
//           aValue = calculateAmountWithoutTax(a); // Changed to use amount without tax
//           bValue = calculateAmountWithoutTax(b); // Changed to use amount without tax
//           break;
//         case 'customer':
//           aValue = (a.customer?.fullName || '').toLowerCase();
//           bValue = (b.customer?.fullName || '').toLowerCase();
//           break;
//         default:
//           return 0;
//       }

//       if (ordersSortOrder === 'asc') {
//         return aValue > bValue ? 1 : -1;
//       } else {
//         return aValue < bValue ? 1 : -1;
//       }
//     });

//     return sortedOrders;
//   };

//   // Filter orders by date
//   const filterOrdersByDate = (orders) => {
//     if (ordersDateFilter === 'all') return orders;

//     const now = new Date();
//     const filteredOrders = orders.filter(order => {
//       const orderDate = new Date(order.orderDate);

//       switch (ordersDateFilter) {
//         case 'today':
//           const today = new Date();
//           today.setHours(0, 0, 0, 0);
//           const tomorrow = new Date(today);
//           tomorrow.setDate(tomorrow.getDate() + 1);
//           return orderDate >= today && orderDate < tomorrow;
//         case 'week':
//           const weekAgo = new Date();
//           weekAgo.setDate(weekAgo.getDate() - 7);
//           return orderDate >= weekAgo;
//         case 'month':
//           const monthAgo = new Date();
//           monthAgo.setMonth(monthAgo.getMonth() - 1);
//           return orderDate >= monthAgo;
//         default:
//           return true;
//       }
//     });

//     return filteredOrders;
//   };

//   // Get base price (from custom setting or item originalPrice)
//   const getBaseCost = (itemId, basePrices, item) => {
//     const customBasePrice = basePrices[itemId]?.price;
//     if (customBasePrice !== undefined) return parseFloat(customBasePrice);
//     return parseFloat(item.originalPrice || 0);
//   };

//   // Get vendor price (from custom setting or item vendorPrice)
//   const getVendorPrice = (itemId, vendorPrices, item, basePrice) => {
//     const customVendorPrice = vendorPrices[itemId]?.price;
//     if (customVendorPrice !== undefined) return parseFloat(customVendorPrice);
//     return parseFloat(item.vendorPrice || basePrice || 0);
//   };

//   // Get selling price (from custom setting or item price)
//   const getSellingPrice = (itemId, sellingPrices, item, vendorPrice) => {
//     const customSellingPrice = sellingPrices[itemId]?.price;
//     if (customSellingPrice !== undefined) return parseFloat(customSellingPrice);
//     return parseFloat(item.price || vendorPrice || 0);
//   };

//   useEffect(() => {
//     const ordersRef = ref(db, 'orders');
//     const shopsRef = ref(db, 'shops');
//     const itemsRef = ref(db, 'items');

//     let ordersData = [];
//     let shopsData = [];
//     let itemsData = [];

//     const itemsUnsubscribe = onValue(itemsRef, (snapshot) => {
//       try {
//         const data = snapshot.val();
//         if (data) {
//           itemsData = Object.entries(data).map(([key, value]) => ({
//             id: key,
//             ...value
//           }));
//         }
//         processData(ordersData, shopsData, itemsData);
//       } catch (err) {
//         console.error('Error fetching items:', err);
//       }
//     });

//     const ordersUnsubscribe = onValue(ordersRef, (snapshot) => {
//       try {
//         const data = snapshot.val();
//         ordersData = data ? Object.keys(data).map(key => ({
//           id: key,
//           ...data[key],
//           timeline: data[key].timeline || [
//             { status: 'order_placed', time: data[key].orderDate, note: 'Order placed successfully' }
//           ]
//         })) : [];
//         processData(ordersData, shopsData, itemsData);
//       } catch (err) {
//         console.error('Error fetching orders:', err);
//         setError('Failed to load transactions.');
//         setLoading(false);
//       }
//     });

//     const shopsUnsubscribe = onValue(shopsRef, (snapshot) => {
//       try {
//         const data = snapshot.val();
//         shopsData = data ? Object.keys(data).map(key => ({
//           id: key,
//           ...data[key]
//         })) : [];
//         processData(ordersData, shopsData, itemsData);
//       } catch (err) {
//         console.error('Error fetching shops:', err);
//         setError('Failed to load transactions.');
//         setLoading(false);
//       }
//     });

//     const processData = async (orders, shops, items) => {
//       try {
//         generateOrderIdMap(orders);

//         const newTransactions = orders.flatMap(order => {
//           const shop = shops.find(s => s.id === order.vendor?.id);
//           const commissionRate = shop?.commissionRate || 10;
//           const orderAmount = calculateAmountWithoutTax(order); // Changed to use amount without tax
//           const commission = orderAmount ? (orderAmount * commissionRate / 100) : 0;
//           const vendorPayout = orderAmount ? (orderAmount - commission) : 0;

//           if (order.status === 'pending') return [];

//           return [{
//             id: `TRX-${order.id}`,
//             type: 'order_payment',
//             amount: orderAmount, // Changed to use amount without tax
//             commission,
//             vendorPayout,
//             date: order.orderDate,
//             status: order.status === 'delivered' ? 'completed' : order.status === 'cancelled' ? 'failed' : 'processing',
//             customer: {
//               id: order.customer?.id || 'CUST-' + order.id,
//               name: order.customer?.fullName || 'Unknown'
//             },
//             vendor: {
//               id: order.vendor?.id || 'VEND-' + order.id,
//               name: shop?.name || order.vendor?.name || 'Unknown'
//             },
//             order: {
//               id: order.id,
//               displayId: orderIdMap[order.id] || `ORD-${orders.findIndex(o => o.id === order.id) + 1}`,
//               items: order.items || [],
//               totalAmount: orderAmount, // Changed to use amount without tax
//               subtotal: order.subtotal || 0,
//               deliveryCharge: order.deliveryCharge || 0
//             },
//             paymentMethod: {
//               type: order.payment?.method || 'credit_card',
//               details: order.payment?.cardLastFour ? `**** ${order.payment.cardLastFour}` : order.payment?.email || 'Unknown'
//             },
//             failureReason: order.status === 'cancelled' ? (order.cancellationReason || 'Order cancelled') : null
//           }];
//         });

//         setTransactions(newTransactions);

//         const vendorList = await Promise.all(shops.map(async (shop) => {
//           const shopOrders = orders.filter(o => o.vendor?.id === shop.id && o.status === 'delivered');

//           // Calculate total revenue without tax
//           const totalRevenue = shopOrders.reduce((sum, o) => sum + calculateAmountWithoutTax(o), 0);
//           const totalOrders = shopOrders.length;
//           const commissionRate = shop.commissionRate || 10;
//           const totalCommission = shopOrders.reduce((sum, o) => {
//             const orderAmount = calculateAmountWithoutTax(o);
//             return sum + ((orderAmount * commissionRate / 100) || 0);
//           }, 0);

//           const soldItems = [];
//           shopOrders.forEach(order => {
//             if (order.items && order.items.length > 0) {
//               order.items.forEach(item => {
//                 const existingItem = soldItems.find(i => (i.id === item.id) || (i.id === item.firebaseKey));
//                 let originalItem = items.find(i => i.id === item.id);
//                 if (!originalItem && item.firebaseKey) {
//                   originalItem = items.find(i => i.id === item.firebaseKey);
//                 }
//                 if (!originalItem && item.name) {
//                   originalItem = items.find(i => i.name === item.name);
//                 }

//                 if (existingItem) {
//                   existingItem.quantity += item.quantity || 1;
//                   existingItem.totalSales += (item.price * (item.quantity || 1)) || 0;
//                   if (new Date(order.orderDate) > new Date(existingItem.lastOrderDate || 0)) {
//                     existingItem.lastOrderDate = order.orderDate;
//                   }
//                 } else {
//                   soldItems.push({
//                     ...item,
//                     originalPrice: originalItem?.originalPrice || 0,
//                     vendorPrice: originalItem?.vendorPrice || 0,
//                     quantity: item.quantity || 1,
//                     totalSales: (item.price * (item.quantity || 1)) || 0,
//                     lastOrderDate: order.orderDate
//                   });
//                 }
//               });
//             }
//           });

//           // Fetch prices for profit calculation
//           const basePricesRef = ref(db, `shops/${shop.id}/basePrices`);
//           const vendorPricesRef = ref(db, `shops/${shop.id}/vendorPrices`);
//           const [basePricesSnapshot, vendorPricesSnapshot] = await Promise.all([
//             get(basePricesRef),
//             get(vendorPricesRef)
//           ]);

//           const basePrices = basePricesSnapshot.exists() ? basePricesSnapshot.val() : {};
//           const vendorPrices = vendorPricesSnapshot.exists() ? vendorPricesSnapshot.val() : {};

//           const totalProfit = soldItems.reduce((sum, item) => {
//             const itemId = item.id || item.firebaseKey;
//             const basePrice = getBaseCost(itemId, basePrices, item);
//             const vendorPrice = getVendorPrice(itemId, vendorPrices, item, basePrice);
//             const profitPerUnit = vendorPrice - basePrice;
//             return sum + (profitPerUnit * item.quantity);
//           }, 0);

//           return {
//             id: shop.id,
//             name: shop.name || 'Unknown Vendor',
//             category: shop.category || 'Uncategorized',
//             address: shop.location?.address || 'No address available',
//             phone: shop.phone || 'No phone available',
//             email: shop.email || 'No email available',
//             commissionRate,
//             totalRevenue,
//             totalOrders,
//             totalCommission,
//             totalProfit,
//             soldItems,
//             lastOrderDate: shopOrders.length > 0
//               ? shopOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))[0].orderDate
//               : null
//           };
//         }));

//         setVendors(vendorList);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error processing data:', err);
//         setError('Failed to process transactions.');
//         setLoading(false);
//       }
//     };

//     return () => {
//       ordersUnsubscribe();
//       shopsUnsubscribe();
//       itemsUnsubscribe();
//     };
//   }, []);

//   useEffect(() => {
//     if (!selectedVendor) return;

//     setVendorDetailsLoading(true);

//     const fetchVendorDetails = async () => {
//       try {
//         const ordersRef = ref(db, 'orders');
//         const ordersSnapshot = await get(ordersRef);

//         const itemsRef = ref(db, 'items');
//         const itemsSnapshot = await get(itemsRef);
//         let itemsData = {};

//         if (itemsSnapshot.exists()) {
//           itemsData = itemsSnapshot.val();
//         }

//         // Fetch prices from shops/${vendorId}/[basePrices, vendorPrices, sellingPrices]
//         const basePricesRef = ref(db, `shops/${selectedVendor.id}/basePrices`);
//         const vendorPricesRef = ref(db, `shops/${selectedVendor.id}/vendorPrices`);
//         const sellingPricesRef = ref(db, `shops/${selectedVendor.id}/sellingPrices`);

//         const [basePricesSnapshot, vendorPricesSnapshot, sellingPricesSnapshot] = await Promise.all([
//           get(basePricesRef),
//           get(vendorPricesRef),
//           get(sellingPricesRef)
//         ]);

//         const basePrices = basePricesSnapshot.exists() ? basePricesSnapshot.val() : {};
//         const vendorPrices = vendorPricesSnapshot.exists() ? vendorPricesSnapshot.val() : {};
//         const sellingPrices = sellingPricesSnapshot.exists() ? sellingPricesSnapshot.val() : {};

//         if (ordersSnapshot.exists()) {
//           const ordersData = ordersSnapshot.val();

//           const vendorOrdersData = Object.entries(ordersData)
//             .filter(([_, order]) => order.vendor?.id === selectedVendor.id && order.status === 'delivered')
//             .map(([key, order]) => ({
//               id: key,
//               ...order,
//               displayId: orderIdMap[key] || `ORD-${Math.floor(Math.random() * 1000)}`
//             }))
//             .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

//           setVendorOrders(vendorOrdersData);

//           const allItems = [];
//           vendorOrdersData.forEach(order => {
//             if (order.items && order.items.length > 0) {
//               order.items.forEach(item => {
//                 const existingItem = allItems.find(i => (i.id === item.id) || (i.id === item.firebaseKey));

//                 let itemId = item.id;
//                 if (!itemId && item.firebaseKey) {
//                   itemId = item.firebaseKey;
//                 }

//                 // Get the original item to access its properties
//                 let originalItem = null;
//                 if (itemId && itemsData[itemId]) {
//                   originalItem = itemsData[itemId];
//                 } else if (item.name) {
//                   // Try to find by name if ID doesn't work
//                   const foundItem = Object.values(itemsData).find(i => i.name === item.name);
//                   if (foundItem) originalItem = foundItem;
//                 }

//                 // Calculate prices with proper fallbacks
//                 const basePrice = getBaseCost(
//                   itemId,
//                   basePrices,
//                   { originalPrice: originalItem?.originalPrice || item.originalPrice }
//                 );

//                 const vendorPrice = getVendorPrice(
//                   itemId,
//                   vendorPrices,
//                   { vendorPrice: originalItem?.vendorPrice || item.vendorPrice },
//                   basePrice
//                 );

//                 const sellingPrice = getSellingPrice(
//                   itemId,
//                   sellingPrices,
//                   { price: originalItem?.price || item.price },
//                   vendorPrice
//                 );

//                 if (existingItem) {
//                   existingItem.quantity += item.quantity || 1;
//                   existingItem.totalSales += (sellingPrice * (item.quantity || 1));
//                   existingItem.orders.push(order.displayId);
//                   if (new Date(order.orderDate) > new Date(existingItem.lastOrderDate || 0)) {
//                     existingItem.lastOrderDate = order.orderDate;
//                   }
//                 } else {
//                   allItems.push({
//                     ...item,
//                     id: itemId,
//                     quantity: item.quantity || 1,
//                     basePrice: basePrice,
//                     vendorPrice: vendorPrice,
//                     sellingPrice: sellingPrice,
//                     totalSales: (sellingPrice * (item.quantity || 1)),
//                     orders: [order.displayId],
//                     lastOrderDate: order.orderDate
//                   });
//                 }
//               });
//             }
//           });

//           const itemsWithProfit = allItems.map(item => {
//             // Profit calculation: Vendor Price - Base Price
//             const profitPerUnit = item.vendorPrice - item.basePrice;
//             const totalProfit = profitPerUnit * item.quantity;

//             return {
//               ...item,
//               totalProfit
//             };
//           });

//           setVendorItems(itemsWithProfit);
//         } else {
//           setVendorOrders([]);
//           setVendorItems([]);
//         }
//       } catch (error) {
//         console.error('Error fetching vendor details:', error);
//         setError('Failed to load vendor details');
//       } finally {
//         setVendorDetailsLoading(false);
//       }
//     };

//     fetchVendorDetails();
//   }, [selectedVendor, orderIdMap]);

//   const filteredTransactions = transactions.filter(transaction => {
//     const transactionDate = new Date(transaction.date);
//     const now = new Date();

//     if (dateRange === 'today') {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       if (transactionDate < today) {
//         return false;
//       }
//     } else if (dateRange === 'this-week') {
//       const startOfWeek = new Date();
//       startOfWeek.setDate(now.getDate() - now.getDay());
//       startOfWeek.setHours(0, 0, 0, 0);
//       if (transactionDate < startOfWeek) {
//         return false;
//       }
//     } else if (dateRange === 'this-month') {
//       const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//       if (transactionDate < startOfMonth) {
//         return false;
//       }
//     }

//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();

//       if (transaction.id.toLowerCase().includes(searchLower)) {
//         return true;
//       }

//       if (transaction.customer && transaction.customer.name.toLowerCase().includes(searchLower)) {
//         return true;
//       }

//       if (transaction.vendor && transaction.vendor.name.toLowerCase().includes(searchLower)) {
//         return true;
//       }

//       if (transaction.order && transaction.order.displayId.toLowerCase().includes(searchLower)) {
//         return true;
//       }

//       return false;
//     }

//     return true;
//   });

//   const filteredVendors = vendors.filter(vendor => {
//     if (!searchTerm) return true;

//     const searchLower = searchTerm.toLowerCase();
//     return (
//       vendor.name.toLowerCase().includes(searchLower) ||
//       vendor.category.toLowerCase().includes(searchLower) ||
//       vendor.address.toLowerCase().includes(searchLower)
//     );
//   });

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 2
//     }).format(amount || 0);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';

//     const options = {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const getTransactionStatus = (status) => {
//     switch (status) {
//       case 'completed':
//         return (
//           <span className="status-badge completed">
//             <CheckCircle size={14} />
//             Completed
//           </span>
//         );
//       case 'processing':
//         return (
//           <span className="status-badge processing">
//             <RefreshCw size={14} />
//             Processing
//           </span>
//         );
//       case 'failed':
//         return (
//           <span className="status-badge failed">
//             <XCircle size={14} />
//             Failed
//           </span>
//         );
//       default:
//         return (
//           <span className="status-badge">{status}</span>
//         );
//     }
//   };

//   const handleEditVendor = (vendor) => {
//     setEditingVendor(vendor);
//     setEditCommissionRate(vendor.commissionRate);
//     setIsEditModalOpen(true);
//   };

//   const handleUpdateCommission = async () => {
//     if (!editingVendor) return;

//     try {
//       const vendorRef = ref(db, `shops/${editingVendor.id}`);
//       await update(vendorRef, {
//         commissionRate: parseFloat(editCommissionRate)
//       });

//       setVendors(vendors.map(v =>
//         v.id === editingVendor.id
//           ? { ...v, commissionRate: parseFloat(editCommissionRate) }
//           : v
//       ));

//       setIsEditModalOpen(false);
//       setEditingVendor(null);
//     } catch (error) {
//       console.error('Error updating commission rate:', error);
//       setError(`Failed to update commission rate: ${error.message}`);
//     }
//   };

//   const handleViewVendor = (vendor) => {
//     setSelectedVendor(vendor);
//   };

//   const handleBackToVendorList = () => {
//     setSelectedVendor(null);
//     setVendorItems([]);
//     setVendorOrders([]);
//   };

//   // Get sorted and filtered data for display
//   // const displayedVendorItems = sortItems(vendorItems);
//   const displayedVendorItems = sortItems(vendorItems.map(item => ({
//     ...item,
//     totalVendorPrice: (item.vendorPrice || 0) * (item.quantity || 0)
//   })));
//   const displayedVendorOrders = sortOrders(filterOrdersByDate(vendorOrders));

//   // For a real API call
//   const handlePayment = async (itemId, vendorId, amount) => {
//     // Update UI to show processing state
//     setProcessingPayments(prev => ({
//       ...prev,
//       [itemId]: true
//     }));

//     try {
//       // Step 1: Fetch vendor payment details from Firebase
//       const vendorRef = ref(db, `shops/${vendorId}`);
//       const vendorSnapshot = await get(vendorRef);

//       if (!vendorSnapshot.exists()) {
//         throw new Error("Vendor information not found");
//       }

//       const vendorData = vendorSnapshot.val();
//       const paymentDetails = vendorData.paymentDetails || {};

//       // Step 2: Verify payment details exist and are complete
//       if (!paymentDetails.preferredPaymentMode) {
//         throw new Error("Vendor payment mode not set");
//       }

//       // Verify based on payment mode
//       if (paymentDetails.preferredPaymentMode === 'BANK') {
//         const bankDetails = paymentDetails.bankDetails || {};
//         if (!bankDetails.accountHolderName || !bankDetails.accountNumber ||
//           !bankDetails.ifscCode || !bankDetails.bankName) {
//           throw new Error("Incomplete bank account details");
//         }
//       } else if (paymentDetails.preferredPaymentMode === 'UPI') {
//         const upiDetails = paymentDetails.upiDetails || {};
//         if (!upiDetails.upiId || !upiDetails.upiMobileNumber) {
//           throw new Error("Incomplete UPI details");
//         }
//       } else {
//         throw new Error("Invalid payment mode");
//       }

//       // Step 3: Verify payment contact info
//       if (!paymentDetails.paymentContactName || !paymentDetails.paymentContactPhone) {
//         throw new Error("Payment contact information not available");
//       }

//       // Step 4: Show payment confirmation dialog with payment details
//       const confirmPayment = window.confirm(
//         `Process payment of ${formatCurrency(amount)} to ${vendorData.name} via ${paymentDetails.preferredPaymentMode === 'BANK' ? 'Bank Transfer' : 'UPI Payment'
//         }?`
//       );

//       if (!confirmPayment) {
//         throw new Error("Payment cancelled by user");
//       }

//       // Step 5: Process the payment (placeholder for actual payment API)
//       // This would be replaced with actual payment processing API
//       console.log("Processing payment", {
//         vendor: vendorData.name,
//         vendorId,
//         itemId,
//         amount,
//         paymentMode: paymentDetails.preferredPaymentMode,
//         paymentDetails
//       });

//       // Simulate API delay
//       await new Promise(resolve => setTimeout(resolve, 1500));

//       // Step 6: Update payment status in local state
//       setPaidItems(prev => ({
//         ...prev,
//         [itemId]: true
//       }));

//       // Step 7: Update payment status in database (optional - for permanent record)
//       // Placeholder for database update logic

//       // Show success notification
//       setNotification({
//         message: `Payment of ${formatCurrency(amount)} to ${vendorData.name} successful!`,
//         type: 'success'
//       });

//       setTimeout(() => setNotification(null), 3000);

//     } catch (error) {
//       console.error("Payment failed:", error);

//       // Show error notification
//       setNotification({
//         message: `Payment failed: ${error.message}`,
//         type: 'error'
//       });

//       setTimeout(() => setNotification(null), 3000);

//     } finally {
//       // Clear processing state regardless of outcome
//       setProcessingPayments(prev => ({
//         ...prev,
//         [itemId]: false
//       }));
//     }
//   };

//   return (
//     <div className="payment-commission">
//       {notification && (
//         <div className={`notification notification-${notification.type}`}>
//           <span>{notification.message}</span>
//           <button className="notification-close" onClick={() => setNotification(null)}>
//             <X size={16} />
//           </button>
//         </div>
//       )}
//       <div className="payment-commission-header">
//         <h1>Payment & Commission</h1>
//         <div className="gradient-line">
//           <div className="gradient-segment segment-5"></div>
//         </div>
//       </div>

//       {error && <div className="error-message">{error}</div>}
//       {loading && <div className="loading-message">Loading data...</div>}

//       <div className="payment-tabs">
//         <button
//           className={`payment-tab ${activeTab === 'transactions' ? 'active' : ''}`}
//           onClick={() => {
//             setActiveTab('transactions');
//             setSelectedVendor(null);
//           }}
//         >
//           <CreditCard size={18} />
//           Customer Transactions
//         </button>
//         <button
//           className={`payment-tab ${activeTab === 'vendorCommission' ? 'active' : ''}`}
//           onClick={() => setActiveTab('vendorCommission')}
//         >
//           <Store size={18} />
//           Vendor Commission Management
//         </button>
//       </div>

//       {activeTab === 'transactions' && (
//         <div className="transactions-section">
//           <div className="transactions-header">
//             <div className="search-filter-container">
//               <div className="search-container">
//                 <Search className="search-icon1" />
//                 <input
//                   type="text"
//                   placeholder="Search transactions..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="search-input1"
//                 />
//               </div>

//               <div className="filter-container">
//                 <div className="filter-group">
//                   <label>Date Range</label>
//                   <select
//                     value={dateRange}
//                     onChange={(e) => setDateRange(e.target.value)}
//                     className="filter-select"
//                   >
//                     <option value="today">Today</option>
//                     <option value="this-week">This Week</option>
//                     <option value="this-month">This Month</option>
//                     <option value="all-time">All Time</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             <button className="download-button" onClick={exportTransactions}>
//               <Download size={16} />
//               Export Transactions
//             </button>
//           </div>

//           <div className="transactions-table-container">
//             <table className="transactions-table">
//               <thead>
//                 <tr>
//                   <th>Transaction ID</th>
//                   <th>Date</th>
//                   <th>Amount</th>
//                   <th>Customer</th>
//                   <th>Vendor</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredTransactions.length > 0 ? (
//                   filteredTransactions.map(transaction => (
//                     <React.Fragment key={transaction.id}>
//                       <tr
//                         className={`transaction-row ${transaction.type}`}
//                         onClick={() => toggleRow(transaction.id)}
//                         style={{ cursor: 'pointer' }}
//                       >
//                         <td className="transaction-id">
//                           <span>{transaction.id}</span>
//                           {transaction.order && (
//                             <span className="order-id">{transaction.order.displayId}</span>
//                           )}
//                         </td>
//                         <td>{formatDate(transaction.date)}</td>
//                         <td className="amount-cell">
//                           {formatCurrency(transaction.amount)}
//                         </td>
//                         <td>
//                           <div className="party-info">
//                             <div className="party-name">
//                               {transaction.customer ? transaction.customer.name : 'N/A'}
//                             </div>
//                           </div>
//                         </td>
//                         <td>
//                           <div className="party-info">
//                             <div className="party-name">
//                               {transaction.vendor ? transaction.vendor.name : 'N/A'}
//                             </div>
//                           </div>
//                         </td>
//                         <td>
//                           {getTransactionStatus(transaction.status)}
//                           {transaction.status === 'failed' && transaction.failureReason && (
//                             <div className="failure-reason">
//                               {transaction.failureReason}
//                             </div>
//                           )}
//                         </td>
//                       </tr>
//                       {expandedRows[transaction.id] && transaction.order && (
//                         <tr className="expanded-row">
//                           <td colSpan="8">
//                             <div className="expanded-content">
//                               <h4>Order Details: {transaction.order.displayId}</h4>
//                               <p><strong>Total Amount:</strong> {formatCurrency(transaction.order.totalAmount)}</p>
//                               <p><strong>Items:</strong></p>
//                               <ul>
//                                 {transaction.order.items.length > 0 ? (
//                                   transaction.order.items.map((item, index) => (
//                                     <li key={index}>
//                                       {item.name || 'Item'} (Qty: {item.quantity || 1}) - {formatCurrency(item.price || 0)}
//                                     </li>
//                                   ))
//                                 ) : (
//                                   <li>No items available</li>
//                                 )}
//                               </ul>
//                             </div>
//                           </td>
//                         </tr>
//                       )}
//                     </React.Fragment>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8" className="no-results">
//                       {loading ? 'Loading...' : 'No transactions found matching your criteria.'}
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {activeTab === 'vendorCommission' && !selectedVendor && (
//         <div className="vendor-commission-section">
//           <div className="commission-header">
//             <div className="search-container">
//               <Search className="search-icon" />
//               <input
//                 type="text"
//                 placeholder="Search vendors by name or address..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="search-input1"
//               />
//             </div>

//             <button className="download-button" onClick={exportVendors}>
//               <Download size={16} />
//               Export Vendor Data
//             </button>
//           </div>

//           <div className="vendor-cards-container">
//             {filteredVendors.length > 0 ? (
//               filteredVendors.map(vendor => (
//                 <div key={vendor.id} className="vendor-card">
//                   <div className="vendor-card-header">
//                     <div className="vendor-icon">
//                       <Store size={24} />
//                     </div>
//                     <h3>{vendor.name}</h3>
//                     <div className="vendor-category">{vendor.category}</div>
//                   </div>

//                   <div className="vendor-card-body">
//                     <div className="vendor-contact">
//                       <div className="vendor-address">
//                         <Map size={16} />
//                         <span>{vendor.address}</span>
//                       </div>
//                       {vendor.phone && (
//                         <div className="vendor-phone">
//                           <Phone size={16} />
//                           <span>{vendor.phone}</span>
//                         </div>
//                       )}
//                       {vendor.email && (
//                         <div className="vendor-email">
//                           <Mail size={16} />
//                           <span>{vendor.email}</span>
//                         </div>
//                       )}
//                     </div>

//                     <div className="vendor-stats">
//                       <div className="stat">
//                         <span className="stat-label">Commission Rate</span>
//                         <span className="stat-value">{vendor.commissionRate}%</span>
//                       </div>
//                       <div className="stat">
//                         <span className="stat-label">Total Orders</span>
//                         <span className="stat-value">{vendor.totalOrders}</span>
//                       </div>
//                       <div className="stat">
//                         <span className="stat-label">Total Revenue</span>
//                         <span className="stat-value">{formatCurrency(vendor.totalRevenue)}</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="vendor-card-footer">
//                     <button
//                       className="view-vendor-button"
//                       onClick={() => handleViewVendor(vendor)}
//                     >
//                       <Eye size={16} />
//                       View Details
//                     </button>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="no-vendors">
//                 <p>{loading ? 'Loading vendors...' : 'No vendors found matching your criteria.'}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Vendor Detail View */}
//       {activeTab === 'vendorCommission' && selectedVendor && (
//         <div className="vendor-detail-section">
//           <div className="vendor-detail-header">
//             <button className="back-button" onClick={handleBackToVendorList}>
//               <ChevronLeft size={16} />
//               Back to Vendors
//             </button>
//             <h2>{selectedVendor.name}</h2>
//             <button className="download-button" onClick={exportVendorDetails}>
//               <Download size={16} />
//               Export Details
//             </button>
//           </div>

//           {vendorDetailsLoading ? (
//             <div className="loading-container">
//               <div className="spinner"></div>
//               <p>Loading vendor details...</p>
//             </div>
//           ) : (
//             <>
//               <div className="vendor-detail-overview">
//                 <div className="vendor-profile">
//                   <div className="vendor-profile-header">
//                     <Store size={24} className="vendor-icon" />
//                     <div className="vendor-info">
//                       <h3>{selectedVendor.name}</h3>
//                       <div className="vendor-category">{selectedVendor.category}</div>
//                     </div>
//                   </div>

//                   <div className="vendor-contact-details">
//                     <div className="detail-item">
//                       <Map size={16} />
//                       <span>{selectedVendor.address}</span>
//                     </div>
//                     {selectedVendor.phone && (
//                       <div className="detail-item">
//                         <Phone size={16} />
//                         <span>{selectedVendor.phone}</span>
//                       </div>
//                     )}
//                     {selectedVendor.email && (
//                       <div className="detail-item">
//                         <Mail size={16} />
//                         <span>{selectedVendor.email}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="vendor-stats-cards">
//                   <div className="stat-card orders">
//                     <div className="stat-icon">
//                       <Package size={24} />
//                     </div>
//                     <div className="stat-content">
//                       <span className="stat-value">{selectedVendor.totalOrders}</span>
//                       <span className="stat-label">Total Orders</span>
//                     </div>
//                   </div>

//                   <div className="stat-card revenue">
//                     <div className="stat-icon">
//                       <span style={{ fontSize: '24px', fontWeight: 'bold' }}>₹</span>
//                     </div>
//                     <div className="stat-content">
//                       <span className="stat-value">{formatCurrency(selectedVendor.totalRevenue)}</span>
//                       <span className="stat-label">Total Revenue</span>
//                     </div>
//                   </div>

//                   <div className="stat-card commission">
//                     <div className="stat-icon">
//                       <Percent size={24} />
//                     </div>
//                     <div className="stat-content">
//                       <span className="stat-value">{selectedVendor.commissionRate}%</span>
//                       <span className="stat-label">Commission Rate</span>
//                     </div>
//                   </div>

//                   <div className="stat-card profit">
//                     <div className="stat-icon">
//                       <TrendingUp size={24} />
//                     </div>
//                     <div className="stat-content">
//                       <span className="stat-value">{formatCurrency(selectedVendor.totalProfit || 0)}</span>
//                       <span className="stat-label">Total Profit</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="vendor-items-section">
//                 <div className="section-header-with-filters">
//                   <h3>Items Sold</h3>
//                   <div className="items-filters">
//                     <div className="filter-group">
//                       <label>Sort by:</label>
//                       <select
//                         value={itemsSortBy}
//                         onChange={(e) => setItemsSortBy(e.target.value)}
//                         className="filter-select"
//                       >
//                         <option value="quantity">Quantity Sold</option>
//                         <option value="profit">Total Profit</option>
//                         <option value="name">Item Name</option>
//                       </select>
//                     </div>
//                     <button
//                       className={`sort-order-btn ${itemsSortOrder}`}
//                       onClick={() => setItemsSortOrder(itemsSortOrder === 'asc' ? 'desc' : 'asc')}
//                       title={itemsSortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
//                     >
//                       {itemsSortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
//                     </button>
//                   </div>
//                 </div>

//                 {displayedVendorItems.length > 0 ? (
//                   <div className="vendor-items-table-container">
//                     {/* <table className="vendor-items-table">
//                       <thead>
//                         <tr>
//                           <th>Item Name</th>
//                           <th>Quantity Sold</th>
//                           <th>Base Price</th>
//                           <th>Vendor Price</th>
//                           <th>Selling Price</th>
//                           <th>Total Profit</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {displayedVendorItems.map((item, index) => (
//                           <tr key={index} className="item-row">
//                             <td className="item-name">{item.name}</td>
//                             <td>
//                               <span className="quantity-badge">{item.quantity}</span>
//                             </td>
//                             <td>{formatCurrency(item.basePrice)}</td>
//                             <td>{formatCurrency(item.vendorPrice)}</td>
//                             <td>{formatCurrency(item.sellingPrice)}</td>
//                             <td className="profit-cell">
//                               <span className={`profit-amount ${item.totalProfit >= 0 ? 'positive' : 'negative'}`}>
//                                 {formatCurrency(item.totalProfit)}
//                               </span>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                       <tfoot>
//                         <tr>
//                           <td colSpan="5" className="total-label">Total Profit</td>
//                           <td className="total-value">
//                             <span className={`profit-amount ${displayedVendorItems.reduce((sum, item) => sum + (item.totalProfit || 0), 0) >= 0 ? 'positive' : 'negative'}`}>
//                               {formatCurrency(displayedVendorItems.reduce((sum, item) => sum + (item.totalProfit || 0), 0))}
//                             </span>
//                           </td>
//                         </tr>
//                       </tfoot>
//                     </table> */}
//                     <table className="vendor-items-table">
//                       <thead>
//                         <tr>
//                           <th>Item Name</th>
//                           <th>Quantity Sold</th>
//                           <th>Base Price</th>
//                           <th>Vendor Price</th>
//                           <th>Selling Price</th>
//                           <th>Total Vendor Price</th>
//                           <th>Total Profit</th>
//                           <th>Amount</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {displayedVendorItems.map((item, index) => (
//                           <tr key={index} className="item-row">
//                             <td className="item-name">{item.name}</td>
//                             <td>
//                               <span className="quantity-badge">{item.quantity}</span>
//                             </td>
//                             <td>{formatCurrency(item.basePrice)}</td>
//                             <td>{formatCurrency(item.vendorPrice)}</td>
//                             <td>{formatCurrency(item.sellingPrice)}</td>
//                             <td>{formatCurrency(item.totalVendorPrice)}</td>
//                             <td className="profit-cell">
//                               <span className={`profit-amount ${item.totalProfit >= 0 ? 'positive' : 'negative'}`}>
//                                 {formatCurrency(item.totalProfit)}
//                               </span>
//                             </td>
//                             <td>
//                               {/* <button className="pay-button">Pay</button> */}
//                               {/* <button className="pay-button" onClick={() => handlePayment(item.id)}>Pay</button> */}

//                               {/* In your table row */}
//                               <td>
//                                 <button
//                                   className={`pay-button ${paidItems[item.id] ? 'paid' : ''}`}
//                                   onClick={() => !paidItems[item.id] && handlePayment(item.id, selectedVendor.id, item.totalVendorPrice)}
//                                   disabled={processingPayments[item.id]}
//                                 >
//                                   {processingPayments[item.id] ? 'Processing...' :
//                                     (paidItems[item.id] ? 'Paid' : 'Pay')}
//                                 </button>

//                               </td>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                       <tfoot>
//                         <tr>
//                           <td colSpan="5" className="total-label">Total </td>
//                           <td className="total-value">
//                             {formatCurrency(displayedVendorItems.reduce((sum, item) => sum + (item.totalVendorPrice || 0), 0))}
//                           </td>
//                           <td className="total-value">
//                             <span className={`profit-amount ${displayedVendorItems.reduce((sum, item) => sum + (item.totalProfit || 0), 0) >= 0 ? 'positive' : 'negative'}`}>
//                               {formatCurrency(displayedVendorItems.reduce((sum, item) => sum + (item.totalProfit || 0), 0))}
//                             </span>
//                           </td>
//                           <td className="total-value">
//                             {/* <button className="pay-all-button">Pay All</button> */}
//                           </td>
//                         </tr>
//                       </tfoot>
//                     </table>
//                   </div>
//                 ) : (
//                   <div className="no-items-message">
//                     <p>No items have been sold by this vendor yet.</p>
//                   </div>
//                 )}
//               </div>

//               <div className="vendor-orders-section">
//                 <div className="section-header-with-filters">
//                   <h3>Recent Orders</h3>
//                   <div className="orders-filters">
//                     <div className="filter-group">
//                       <label>Filter by date:</label>
//                       <select
//                         value={ordersDateFilter}
//                         onChange={(e) => setOrdersDateFilter(e.target.value)}
//                         className="filter-select"
//                       >
//                         <option value="all">All Time</option>
//                         <option value="today">Today</option>
//                         <option value="week">Last 7 Days</option>
//                         <option value="month">Last 30 Days</option>
//                       </select>
//                     </div>
//                     <div className="filter-group">
//                       <label>Sort by:</label>
//                       <select
//                         value={ordersSortBy}
//                         onChange={(e) => setOrdersSortBy(e.target.value)}
//                         className="filter-select"
//                       >
//                         <option value="date">Date</option>
//                         <option value="amount">Amount</option>
//                         <option value="customer">Customer</option>
//                       </select>
//                     </div>
//                     <button
//                       className={`sort-order-btn ${ordersSortOrder}`}
//                       onClick={() => setOrdersSortOrder(ordersSortOrder === 'asc' ? 'desc' : 'asc')}
//                       title={ordersSortOrder === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
//                     >
//                       {ordersSortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
//                     </button>
//                   </div>
//                 </div>

//                 {displayedVendorOrders.length > 0 ? (
//                   <div className="vendor-orders-table-container">
//                     <table className="vendor-orders-table">
//                       <thead>
//                         <tr>
//                           <th>Order ID</th>
//                           <th>Date</th>
//                           <th>Customer</th>
//                           <th>Items</th>
//                           <th>Total Amount</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {displayedVendorOrders.slice(0, 10).map((order) => (
//                           <tr key={order.id} className="order-row">
//                             <td><span className="order-id-badge">{order.displayId}</span></td>
//                             <td>{formatDate(order.orderDate)}</td>
//                             <td>{order.customer?.fullName || 'Unknown'}</td>
//                             <td>
//                               <span className="items-count">{order.items ? `${order.items.length} items` : 'No items'}</span>
//                             </td>
//                             <td className="amount-cell">{formatCurrency(calculateAmountWithoutTax(order))}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>

//                     {displayedVendorOrders.length > 10 && (
//                       <div className="view-more-orders">
//                         <p>Showing 10 of {displayedVendorOrders.length} orders</p>
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="no-orders-message">
//                     <p>No orders found for the selected criteria.</p>
//                   </div>
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       )}

//       {/* Edit Commission Modal */}
//       {isEditModalOpen && editingVendor && (
//         <div className="modal-overlay">
//           <div className="modal-container">
//             <div className="modal-header">
//               <h3>Edit Commission Rate</h3>
//               <button
//                 className="close-button"
//                 onClick={() => setIsEditModalOpen(false)}
//               >
//                 <XCircle size={20} />
//               </button>
//             </div>
//             <div className="modal-body">
//               <p><strong>Vendor:</strong> {editingVendor.name}</p>
//               <p><strong>Category:</strong> {editingVendor.category}</p>
//               <p><strong>Current Commission Rate:</strong> {editingVendor.commissionRate}%</p>

//               <div className="commission-input">
//                 <label htmlFor="commission-rate">New Commission Rate (%)</label>
//                 <div className="rate-input-container">
//                   <input
//                     id="commission-rate"
//                     type="number"
//                     min="0"
//                     max="100"
//                     step="0.1"
//                     value={editCommissionRate}
//                     onChange={(e) => setEditCommissionRate(e.target.value)}
//                   />
//                   <span className="percent-symbol">%</span>
//                 </div>
//               </div>
//             </div>
//             <div className="modal-footer">
//               <button
//                 className="cancel-button"
//                 onClick={() => setIsEditModalOpen(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="save-button"
//                 onClick={handleUpdateCommission}
//               >
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaymentCommission;




// import React, { useState, useEffect } from 'react';
// import {
//   DollarSign,
//   CreditCard,
//   Calendar,
//   ChevronDown,
//   Download,
//   Filter,
//   Search,
//   RefreshCw,
//   CheckCircle,
//   XCircle,
//   FileText,
//   BarChart,
//   Wallet,
//   ArrowUp,
//   ArrowDown,
//   Store,
//   Settings,
//   ChevronRight,
//   ChevronLeft,
//   Edit,
//   Trash,
//   Plus,
//   Percent,
//   Eye,
//   Map,
//   Phone,
//   Mail,
//   Package,
//   TrendingUp,
//   AlertTriangle,
//   SortAsc,
//   SortDesc,
//   Coins,
//   X,
//   Shield,
//   Send
// } from 'lucide-react';
// import { ref, onValue, update, remove, push, set, get } from 'firebase/database';
// import { db } from '../firebase/config';
// import '../styles/PaymentCommission.css';
// import PaymentVerificationDialog from './PaymentVerificationDialog'; // Import the verification dialog

// const PaymentCommission = () => {
//   // Function to calculate amount without tax
//   const calculateAmountWithoutTax = (order) => {
//     return (order.subtotal || 0) + (order.deliveryCharge || 0);
//   };

//   const [activeTab, setActiveTab] = useState('transactions');
//   const [dateRange, setDateRange] = useState('this-month');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [transactions, setTransactions] = useState([]);
//   const [vendors, setVendors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [orderIdMap, setOrderIdMap] = useState({});
//   const [expandedRows, setExpandedRows] = useState({});
//   const [editingVendor, setEditingVendor] = useState(null);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [editCommissionRate, setEditCommissionRate] = useState(10);

//   // States for vendor details view
//   const [selectedVendor, setSelectedVendor] = useState(null);
//   const [vendorItems, setVendorItems] = useState([]);
//   const [vendorOrders, setVendorOrders] = useState([]);
//   const [vendorDetailsLoading, setVendorDetailsLoading] = useState(false);
//   const [processingPayments, setProcessingPayments] = useState({});
//   const [paidItems, setPaidItems] = useState({});

//   // New states for payment verification
//   const [notification, setNotification] = useState(null);
//   const [isPaymentVerificationOpen, setIsPaymentVerificationOpen] = useState(false);
//   const [currentPaymentItem, setCurrentPaymentItem] = useState(null);

//   // States for filtering and sorting
//   const [itemsSortBy, setItemsSortBy] = useState('quantity'); // 'quantity', 'profit', 'name'
//   const [itemsSortOrder, setItemsSortOrder] = useState('desc'); // 'asc', 'desc'
//   const [ordersSortBy, setOrdersSortBy] = useState('date'); // 'date', 'amount', 'customer'
//   const [ordersSortOrder, setOrdersSortOrder] = useState('desc'); // 'asc', 'desc'
//   const [ordersDateFilter, setOrdersDateFilter] = useState('all'); // 'all', 'today', 'week', 'month'

//   // Export utility functions
//   const convertToCSV = (data, headers) => {
//     if (!data || data.length === 0) return '';

//     const csvHeaders = headers.join(',');
//     const csvRows = data.map(row => {
//       return headers.map(header => {
//         let value = row[header];
//         if (value === null || value === undefined) value = '';
//         if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
//           value = `"${value.replace(/"/g, '""')}"`;
//         }
//         return value;
//       });
//     });

//     return [csvHeaders, ...csvRows.map(row => row.join(','))].join('\n');
//   };

//   const downloadCSV = (csvContent, filename) => {
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
//     link.setAttribute('href', url);
//     link.setAttribute('download', filename);
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Export transactions data
//   const exportTransactions = () => {
//     try {
//       if (!filteredTransactions || filteredTransactions.length === 0) {
//         alert('No transactions to export');
//         return;
//       }

//       const exportData = filteredTransactions.map(transaction => ({
//         'Transaction ID': transaction.id,
//         'Order ID': transaction.order?.displayId || 'N/A',
//         'Date': formatDate(transaction.date),
//         'Amount': transaction.amount || 0,
//         'Commission': transaction.commission || 0,
//         'Vendor Payout': transaction.vendorPayout || 0,
//         'Customer': transaction.customer?.name || 'N/A',
//         'Vendor': transaction.vendor?.name || 'N/A',
//         'Status': transaction.status,
//         'Payment Method': transaction.paymentMethod?.type || 'N/A',
//         'Payment Details': transaction.paymentMethod?.details || 'N/A',
//         'Failure Reason': transaction.failureReason || 'N/A'
//       }));

//       const headers = [
//         'Transaction ID', 'Order ID', 'Date', 'Amount', 'Commission',
//         'Vendor Payout', 'Customer', 'Vendor', 'Status', 'Payment Method',
//         'Payment Details', 'Failure Reason'
//       ];

//       const csvContent = convertToCSV(exportData, headers);
//       const filename = `transactions_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`;
//       downloadCSV(csvContent, filename);
//     } catch (error) {
//       console.error('Error exporting transactions:', error);
//       alert('Error exporting transactions. Please try again.');
//     }
//   };

//   // Export vendors data
//   const exportVendors = () => {
//     try {
//       if (!filteredVendors || filteredVendors.length === 0) {
//         alert('No vendors to export');
//         return;
//       }

//       const exportData = filteredVendors.map(vendor => ({
//         'Vendor ID': vendor.id,
//         'Vendor Name': vendor.name,
//         'Category': vendor.category,
//         'Address': vendor.address,
//         'Phone': vendor.phone || 'N/A',
//         'Email': vendor.email || 'N/A',
//         'Commission Rate (%)': vendor.commissionRate,
//         'Total Revenue': vendor.totalRevenue || 0,
//         'Total Orders': vendor.totalOrders || 0,
//         'Total Commission': vendor.totalCommission || 0,
//         'Total Profit': vendor.totalProfit || 0,
//         'Last Order Date': vendor.lastOrderDate ? formatDate(vendor.lastOrderDate) : 'N/A'
//       }));

//       const headers = [
//         'Vendor ID', 'Vendor Name', 'Category', 'Address', 'Phone', 'Email',
//         'Commission Rate (%)', 'Total Revenue', 'Total Orders', 'Total Commission',
//         'Total Profit', 'Last Order Date'
//       ];

//       const csvContent = convertToCSV(exportData, headers);
//       const filename = `vendors_${new Date().toISOString().split('T')[0]}.csv`;
//       downloadCSV(csvContent, filename);
//     } catch (error) {
//       console.error('Error exporting vendors:', error);
//       alert('Error exporting vendors. Please try again.');
//     }
//   };

//   // Export vendor details (items and orders)
//   const exportVendorDetails = () => {
//     try {
//       if (!selectedVendor) {
//         alert('No vendor selected');
//         return;
//       }

//       // Export vendor items
//       if (displayedVendorItems && displayedVendorItems.length > 0) {
//         const itemsData = displayedVendorItems.map(item => ({
//           'Item Name': item.name,
//           'Quantity Sold': item.quantity,
//           'Base Price': item.basePrice || 0,
//           'Vendor Price': item.vendorPrice || 0,
//           'Total Vendor Price': (item.vendorPrice || 0) * (item.quantity || 0),
//           'Selling Price': item.sellingPrice || 0,
//           'Total Profit': item.totalProfit || 0
//         }));

//         const itemsHeaders = [
//           'Item Name', 'Quantity Sold', 'Base Price', 'Vendor Price',
//           'Total Vendor Price', 'Selling Price', 'Total Profit'
//         ];

//         const itemsCsvContent = convertToCSV(itemsData, itemsHeaders);
//         const itemsFilename = `${selectedVendor.name.replace(/\s+/g, '_')}_items_${new Date().toISOString().split('T')[0]}.csv`;
//         downloadCSV(itemsCsvContent, itemsFilename);
//       }

//       // Export vendor orders
//       if (displayedVendorOrders && displayedVendorOrders.length > 0) {
//         const ordersData = displayedVendorOrders.map(order => ({
//           'Order ID': order.displayId,
//           'Date': formatDate(order.orderDate),
//           'Customer': order.customer?.fullName || 'Unknown',
//           'Items Count': order.items ? order.items.length : 0,
//           'Total Amount': calculateAmountWithoutTax(order), // Changed to use amount without tax
//           'Status': order.status || 'N/A'
//         }));

//         const ordersHeaders = [
//           'Order ID', 'Date', 'Customer', 'Items Count', 'Total Amount', 'Status'
//         ];

//         const ordersCsvContent = convertToCSV(ordersData, ordersHeaders);
//         const ordersFilename = `${selectedVendor.name.replace(/\s+/g, '_')}_orders_${new Date().toISOString().split('T')[0]}.csv`;

//         setTimeout(() => {
//           downloadCSV(ordersCsvContent, ordersFilename);
//         }, 500);
//       }

//       if ((!displayedVendorItems || displayedVendorItems.length === 0) &&
//         (!displayedVendorOrders || displayedVendorOrders.length === 0)) {
//         alert('No data to export for this vendor');
//       }
//     } catch (error) {
//       console.error('Error exporting vendor details:', error);
//       alert('Error exporting vendor details. Please try again.');
//     }
//   };

//   // Function to generate simplified order IDs for display
//   const generateOrderIdMap = (orders) => {
//     const idMap = {};
//     orders.forEach((order, index) => {
//       idMap[order.id] = `ORD-${index + 1}`;
//     });
//     setOrderIdMap(idMap);
//   };

//   // Toggle expanded row
//   const toggleRow = (transactionId) => {
//     setExpandedRows(prev => ({
//       ...prev,
//       [transactionId]: !prev[transactionId]
//     }));
//   };

//   // Sort items based on selected criteria
//   const sortItems = (items) => {
//     const sortedItems = [...items].sort((a, b) => {
//       let aValue, bValue;

//       switch (itemsSortBy) {
//         case 'quantity':
//           aValue = a.quantity;
//           bValue = b.quantity;
//           break;
//         case 'profit':
//           aValue = a.totalProfit || 0;
//           bValue = b.totalProfit || 0;
//           break;
//         case 'name':
//           aValue = a.name.toLowerCase();
//           bValue = b.name.toLowerCase();
//           break;
//         default:
//           return 0;
//       }

//       if (itemsSortOrder === 'asc') {
//         return aValue > bValue ? 1 : -1;
//       } else {
//         return aValue < bValue ? 1 : -1;
//       }
//     });

//     return sortedItems;
//   };

//   // Sort orders based on selected criteria
//   const sortOrders = (orders) => {
//     const sortedOrders = [...orders].sort((a, b) => {
//       let aValue, bValue;

//       switch (ordersSortBy) {
//         case 'date':
//           aValue = new Date(a.orderDate);
//           bValue = new Date(b.orderDate);
//           break;
//         case 'amount':
//           aValue = calculateAmountWithoutTax(a); // Changed to use amount without tax
//           bValue = calculateAmountWithoutTax(b); // Changed to use amount without tax
//           break;
//         case 'customer':
//           aValue = (a.customer?.fullName || '').toLowerCase();
//           bValue = (b.customer?.fullName || '').toLowerCase();
//           break;
//         default:
//           return 0;
//       }

//       if (ordersSortOrder === 'asc') {
//         return aValue > bValue ? 1 : -1;
//       } else {
//         return aValue < bValue ? 1 : -1;
//       }
//     });

//     return sortedOrders;
//   };

//   // Filter orders by date
//   const filterOrdersByDate = (orders) => {
//     if (ordersDateFilter === 'all') return orders;

//     const now = new Date();
//     const filteredOrders = orders.filter(order => {
//       const orderDate = new Date(order.orderDate);

//       switch (ordersDateFilter) {
//         case 'today':
//           const today = new Date();
//           today.setHours(0, 0, 0, 0);
//           const tomorrow = new Date(today);
//           tomorrow.setDate(tomorrow.getDate() + 1);
//           return orderDate >= today && orderDate < tomorrow;
//         case 'week':
//           const weekAgo = new Date();
//           weekAgo.setDate(weekAgo.getDate() - 7);
//           return orderDate >= weekAgo;
//         case 'month':
//           const monthAgo = new Date();
//           monthAgo.setMonth(monthAgo.getMonth() - 1);
//           return orderDate >= monthAgo;
//         default:
//           return true;
//       }
//     });

//     return filteredOrders;
//   };

//   // Get base price (from custom setting or item originalPrice)
//   const getBaseCost = (itemId, basePrices, item) => {
//     const customBasePrice = basePrices[itemId]?.price;
//     if (customBasePrice !== undefined) return parseFloat(customBasePrice);
//     return parseFloat(item.originalPrice || 0);
//   };

//   // Get vendor price (from custom setting or item vendorPrice)
//   const getVendorPrice = (itemId, vendorPrices, item, basePrice) => {
//     const customVendorPrice = vendorPrices[itemId]?.price;
//     if (customVendorPrice !== undefined) return parseFloat(customVendorPrice);
//     return parseFloat(item.vendorPrice || basePrice || 0);
//   };

//   // Get selling price (from custom setting or item price)
//   const getSellingPrice = (itemId, sellingPrices, item, vendorPrice) => {
//     const customSellingPrice = sellingPrices[itemId]?.price;
//     if (customSellingPrice !== undefined) return parseFloat(customSellingPrice);
//     return parseFloat(item.price || vendorPrice || 0);
//   };

//   useEffect(() => {
//     const ordersRef = ref(db, 'orders');
//     const shopsRef = ref(db, 'shops');
//     const itemsRef = ref(db, 'items');

//     let ordersData = [];
//     let shopsData = [];
//     let itemsData = [];

//     const itemsUnsubscribe = onValue(itemsRef, (snapshot) => {
//       try {
//         const data = snapshot.val();
//         if (data) {
//           itemsData = Object.entries(data).map(([key, value]) => ({
//             id: key,
//             ...value
//           }));
//         }
//         processData(ordersData, shopsData, itemsData);
//       } catch (err) {
//         console.error('Error fetching items:', err);
//       }
//     });

//     const ordersUnsubscribe = onValue(ordersRef, (snapshot) => {
//       try {
//         const data = snapshot.val();
//         ordersData = data ? Object.keys(data).map(key => ({
//           id: key,
//           ...data[key],
//           timeline: data[key].timeline || [
//             { status: 'order_placed', time: data[key].orderDate, note: 'Order placed successfully' }
//           ]
//         })) : [];
//         processData(ordersData, shopsData, itemsData);
//       } catch (err) {
//         console.error('Error fetching orders:', err);
//         setError('Failed to load transactions.');
//         setLoading(false);
//       }
//     });

//     const shopsUnsubscribe = onValue(shopsRef, (snapshot) => {
//       try {
//         const data = snapshot.val();
//         shopsData = data ? Object.keys(data).map(key => ({
//           id: key,
//           ...data[key]
//         })) : [];
//         processData(ordersData, shopsData, itemsData);
//       } catch (err) {
//         console.error('Error fetching shops:', err);
//         setError('Failed to load transactions.');
//         setLoading(false);
//       }
//     });

//     const processData = async (orders, shops, items) => {
//       try {
//         generateOrderIdMap(orders);

//         const newTransactions = orders.flatMap(order => {
//           const shop = shops.find(s => s.id === order.vendor?.id);
//           const commissionRate = shop?.commissionRate || 10;
//           const orderAmount = calculateAmountWithoutTax(order); // Changed to use amount without tax
//           const commission = orderAmount ? (orderAmount * commissionRate / 100) : 0;
//           const vendorPayout = orderAmount ? (orderAmount - commission) : 0;

//           if (order.status === 'pending') return [];

//           return [{
//             id: `TRX-${order.id}`,
//             type: 'order_payment',
//             amount: orderAmount, // Changed to use amount without tax
//             commission,
//             vendorPayout,
//             date: order.orderDate,
//             status: order.status === 'delivered' ? 'completed' : order.status === 'cancelled' ? 'failed' : 'processing',
//             customer: {
//               id: order.customer?.id || 'CUST-' + order.id,
//               name: order.customer?.fullName || 'Unknown'
//             },
//             vendor: {
//               id: order.vendor?.id || 'VEND-' + order.id,
//               name: shop?.name || order.vendor?.name || 'Unknown'
//             },
//             order: {
//               id: order.id,
//               displayId: orderIdMap[order.id] || `ORD-${orders.findIndex(o => o.id === order.id) + 1}`,
//               items: order.items || [],
//               totalAmount: orderAmount, // Changed to use amount without tax
//               subtotal: order.subtotal || 0,
//               deliveryCharge: order.deliveryCharge || 0
//             },
//             paymentMethod: {
//               type: order.payment?.method || 'credit_card',
//               details: order.payment?.cardLastFour ? `**** ${order.payment.cardLastFour}` : order.payment?.email || 'Unknown'
//             },
//             failureReason: order.status === 'cancelled' ? (order.cancellationReason || 'Order cancelled') : null
//           }];
//         });

//         setTransactions(newTransactions);

//         const vendorList = await Promise.all(shops.map(async (shop) => {
//           const shopOrders = orders.filter(o => o.vendor?.id === shop.id && o.status === 'delivered');

//           // Calculate total revenue without tax
//           const totalRevenue = shopOrders.reduce((sum, o) => sum + calculateAmountWithoutTax(o), 0);
//           const totalOrders = shopOrders.length;
//           const commissionRate = shop.commissionRate || 10;
//           const totalCommission = shopOrders.reduce((sum, o) => {
//             const orderAmount = calculateAmountWithoutTax(o);
//             return sum + ((orderAmount * commissionRate / 100) || 0);
//           }, 0);

//           const soldItems = [];
//           shopOrders.forEach(order => {
//             if (order.items && order.items.length > 0) {
//               order.items.forEach(item => {
//                 const existingItem = soldItems.find(i => (i.id === item.id) || (i.id === item.firebaseKey));
//                 let originalItem = items.find(i => i.id === item.id);
//                 if (!originalItem && item.firebaseKey) {
//                   originalItem = items.find(i => i.id === item.firebaseKey);
//                 }
//                 if (!originalItem && item.name) {
//                   originalItem = items.find(i => i.name === item.name);
//                 }

//                 if (existingItem) {
//                   existingItem.quantity += item.quantity || 1;
//                   existingItem.totalSales += (item.price * (item.quantity || 1)) || 0;
//                   if (new Date(order.orderDate) > new Date(existingItem.lastOrderDate || 0)) {
//                     existingItem.lastOrderDate = order.orderDate;
//                   }
//                 } else {
//                   soldItems.push({
//                     ...item,
//                     originalPrice: originalItem?.originalPrice || 0,
//                     vendorPrice: originalItem?.vendorPrice || 0,
//                     quantity: item.quantity || 1,
//                     totalSales: (item.price * (item.quantity || 1)) || 0,
//                     lastOrderDate: order.orderDate
//                   });
//                 }
//               });
//             }
//           });

//           // Fetch prices for profit calculation
//           const basePricesRef = ref(db, `shops/${shop.id}/basePrices`);
//           const vendorPricesRef = ref(db, `shops/${shop.id}/vendorPrices`);
//           const [basePricesSnapshot, vendorPricesSnapshot] = await Promise.all([
//             get(basePricesRef),
//             get(vendorPricesRef)
//           ]);

//           const basePrices = basePricesSnapshot.exists() ? basePricesSnapshot.val() : {};
//           const vendorPrices = vendorPricesSnapshot.exists() ? vendorPricesSnapshot.val() : {};

//           const totalProfit = soldItems.reduce((sum, item) => {
//             const itemId = item.id || item.firebaseKey;
//             const basePrice = getBaseCost(itemId, basePrices, item);
//             const vendorPrice = getVendorPrice(itemId, vendorPrices, item, basePrice);
//             const profitPerUnit = vendorPrice - basePrice;
//             return sum + (profitPerUnit * item.quantity);
//           }, 0);

//           return {
//             id: shop.id,
//             name: shop.name || 'Unknown Vendor',
//             category: shop.category || 'Uncategorized',
//             address: shop.location?.address || 'No address available',
//             phone: shop.phone || 'No phone available',
//             email: shop.email || 'No email available',
//             commissionRate,
//             totalRevenue,
//             totalOrders,
//             totalCommission,
//             totalProfit,
//             soldItems,
//             lastOrderDate: shopOrders.length > 0
//               ? shopOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))[0].orderDate
//               : null
//           };
//         }));

//         setVendors(vendorList);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error processing data:', err);
//         setError('Failed to process transactions.');
//         setLoading(false);
//       }
//     };

//     return () => {
//       ordersUnsubscribe();
//       shopsUnsubscribe();
//       itemsUnsubscribe();
//     };
//   }, []);

//   useEffect(() => {
//     if (!selectedVendor) return;

//     setVendorDetailsLoading(true);

//     const fetchVendorDetails = async () => {
//       try {
//         const ordersRef = ref(db, 'orders');
//         const ordersSnapshot = await get(ordersRef);

//         const itemsRef = ref(db, 'items');
//         const itemsSnapshot = await get(itemsRef);
//         let itemsData = {};

//         if (itemsSnapshot.exists()) {
//           itemsData = itemsSnapshot.val();
//         }

//         // Fetch prices from shops/${vendorId}/[basePrices, vendorPrices, sellingPrices]
//         const basePricesRef = ref(db, `shops/${selectedVendor.id}/basePrices`);
//         const vendorPricesRef = ref(db, `shops/${selectedVendor.id}/vendorPrices`);
//         const sellingPricesRef = ref(db, `shops/${selectedVendor.id}/sellingPrices`);

//         const [basePricesSnapshot, vendorPricesSnapshot, sellingPricesSnapshot] = await Promise.all([
//           get(basePricesRef),
//           get(vendorPricesRef),
//           get(sellingPricesRef)
//         ]);

//         const basePrices = basePricesSnapshot.exists() ? basePricesSnapshot.val() : {};
//         const vendorPrices = vendorPricesSnapshot.exists() ? vendorPricesSnapshot.val() : {};
//         const sellingPrices = sellingPricesSnapshot.exists() ? sellingPricesSnapshot.val() : {};

//         if (ordersSnapshot.exists()) {
//           const ordersData = ordersSnapshot.val();

//           const vendorOrdersData = Object.entries(ordersData)
//             .filter(([_, order]) => order.vendor?.id === selectedVendor.id && order.status === 'delivered')
//             .map(([key, order]) => ({
//               id: key,
//               ...order,
//               displayId: orderIdMap[key] || `ORD-${Math.floor(Math.random() * 1000)}`
//             }))
//             .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

//           setVendorOrders(vendorOrdersData);

//           const allItems = [];
//           vendorOrdersData.forEach(order => {
//             if (order.items && order.items.length > 0) {
//               order.items.forEach(item => {
//                 const existingItem = allItems.find(i => (i.id === item.id) || (i.id === item.firebaseKey));

//                 let itemId = item.id;
//                 if (!itemId && item.firebaseKey) {
//                   itemId = item.firebaseKey;
//                 }

//                 // Get the original item to access its properties
//                 let originalItem = null;
//                 if (itemId && itemsData[itemId]) {
//                   originalItem = itemsData[itemId];
//                 } else if (item.name) {
//                   // Try to find by name if ID doesn't work
//                   const foundItem = Object.values(itemsData).find(i => i.name === item.name);
//                   if (foundItem) originalItem = foundItem;
//                 }

//                 // Calculate prices with proper fallbacks
//                 const basePrice = getBaseCost(
//                   itemId,
//                   basePrices,
//                   { originalPrice: originalItem?.originalPrice || item.originalPrice }
//                 );

//                 const vendorPrice = getVendorPrice(
//                   itemId,
//                   vendorPrices,
//                   { vendorPrice: originalItem?.vendorPrice || item.vendorPrice },
//                   basePrice
//                 );

//                 const sellingPrice = getSellingPrice(
//                   itemId,
//                   sellingPrices,
//                   { price: originalItem?.price || item.price },
//                   vendorPrice
//                 );

//                 if (existingItem) {
//                   existingItem.quantity += item.quantity || 1;
//                   existingItem.totalSales += (sellingPrice * (item.quantity || 1));
//                   existingItem.orders.push(order.displayId);
//                   if (new Date(order.orderDate) > new Date(existingItem.lastOrderDate || 0)) {
//                     existingItem.lastOrderDate = order.orderDate;
//                   }
//                 } else {
//                   allItems.push({
//                     ...item,
//                     id: itemId,
//                     quantity: item.quantity || 1,
//                     basePrice: basePrice,
//                     vendorPrice: vendorPrice,
//                     sellingPrice: sellingPrice,
//                     totalSales: (sellingPrice * (item.quantity || 1)),
//                     orders: [order.displayId],
//                     lastOrderDate: order.orderDate
//                   });
//                 }
//               });
//             }
//           });

//           const itemsWithProfit = allItems.map(item => {
//             // Profit calculation: Vendor Price - Base Price
//             const profitPerUnit = item.vendorPrice - item.basePrice;
//             const totalProfit = profitPerUnit * item.quantity;

//             return {
//               ...item,
//               totalProfit
//             };
//           });

//           setVendorItems(itemsWithProfit);
//         } else {
//           setVendorOrders([]);
//           setVendorItems([]);
//         }
//       } catch (error) {
//         console.error('Error fetching vendor details:', error);
//         setError('Failed to load vendor details');
//       } finally {
//         setVendorDetailsLoading(false);
//       }
//     };

//     fetchVendorDetails();
//   }, [selectedVendor, orderIdMap]);

//   const filteredTransactions = transactions.filter(transaction => {
//     const transactionDate = new Date(transaction.date);
//     const now = new Date();

//     if (dateRange === 'today') {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       if (transactionDate < today) {
//         return false;
//       }
//     } else if (dateRange === 'this-week') {
//       const startOfWeek = new Date();
//       startOfWeek.setDate(now.getDate() - now.getDay());
//       startOfWeek.setHours(0, 0, 0, 0);
//       if (transactionDate < startOfWeek) {
//         return false;
//       }
//     } else if (dateRange === 'this-month') {
//       const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//       if (transactionDate < startOfMonth) {
//         return false;
//       }
//     }

//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();

//       if (transaction.id.toLowerCase().includes(searchLower)) {
//         return true;
//       }

//       if (transaction.customer && transaction.customer.name.toLowerCase().includes(searchLower)) {
//         return true;
//       }

//       if (transaction.vendor && transaction.vendor.name.toLowerCase().includes(searchLower)) {
//         return true;
//       }

//       if (transaction.order && transaction.order.displayId.toLowerCase().includes(searchLower)) {
//         return true;
//       }

//       return false;
//     }

//     return true;
//   });

//   const filteredVendors = vendors.filter(vendor => {
//     if (!searchTerm) return true;

//     const searchLower = searchTerm.toLowerCase();
//     return (
//       vendor.name.toLowerCase().includes(searchLower) ||
//       vendor.category.toLowerCase().includes(searchLower) ||
//       vendor.address.toLowerCase().includes(searchLower)
//     );
//   });

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 2
//     }).format(amount || 0);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';

//     const options = {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const getTransactionStatus = (status) => {
//     switch (status) {
//       case 'completed':
//         return (
//           <span className="status-badge completed">
//             <CheckCircle size={14} />
//             Completed
//           </span>
//         );
//       case 'processing':
//         return (
//           <span className="status-badge processing">
//             <RefreshCw size={14} />
//             Processing
//           </span>
//         );
//       case 'failed':
//         return (
//           <span className="status-badge failed">
//             <XCircle size={14} />
//             Failed
//           </span>
//         );
//       default:
//         return (
//           <span className="status-badge">{status}</span>
//         );
//     }
//   };

//   const handleEditVendor = (vendor) => {
//     setEditingVendor(vendor);
//     setEditCommissionRate(vendor.commissionRate);
//     setIsEditModalOpen(true);
//   };

//   const handleUpdateCommission = async () => {
//     if (!editingVendor) return;

//     try {
//       const vendorRef = ref(db, `shops/${editingVendor.id}`);
//       await update(vendorRef, {
//         commissionRate: parseFloat(editCommissionRate)
//       });

//       setVendors(vendors.map(v =>
//         v.id === editingVendor.id
//           ? { ...v, commissionRate: parseFloat(editCommissionRate) }
//           : v
//       ));

//       setIsEditModalOpen(false);
//       setEditingVendor(null);
//     } catch (error) {
//       console.error('Error updating commission rate:', error);
//       setError(`Failed to update commission rate: ${error.message}`);
//     }
//   };

//   const handleViewVendor = (vendor) => {
//     setSelectedVendor(vendor);
//   };

//   const handleBackToVendorList = () => {
//     setSelectedVendor(null);
//     setVendorItems([]);
//     setVendorOrders([]);
//   };

//   // Get sorted and filtered data for display
//   const displayedVendorItems = sortItems(vendorItems.map(item => ({
//     ...item,
//     totalVendorPrice: (item.vendorPrice || 0) * (item.quantity || 0)
//   })));
//   const displayedVendorOrders = sortOrders(filterOrdersByDate(vendorOrders));

//   // Enhanced handlePayment function to open verification dialog
//   const handlePayment = (item) => {
//     // Set the current item being paid
//     setCurrentPaymentItem(item);
//     // Open the payment verification dialog
//     setIsPaymentVerificationOpen(true);
//   };

//   // Function to process payment after verification
//   const processPayment = async (vendorDetails, paymentDetails) => {
//     if (!currentPaymentItem) return false;

//     const itemId = currentPaymentItem.id;

//     // Set processing state
//     setProcessingPayments(prev => ({
//       ...prev,
//       [itemId]: true
//     }));

//     try {
//       // In a real implementation, this would make an API call to your payment processor
//       // with the verified payment details
//       console.log("Processing payment", {
//         vendor: vendorDetails.name,
//         vendorId: selectedVendor.id,
//         itemId,
//         amount: currentPaymentItem.totalVendorPrice,
//         paymentMode: paymentDetails.preferredPaymentMode,
//         paymentDetails
//       });

//       // Simulate API delay for demonstration
//       await new Promise(resolve => setTimeout(resolve, 1500));

//       // Update paid items state
//       setPaidItems(prev => ({
//         ...prev,
//         [itemId]: true
//       }));

//       // Close the verification dialog
//       setIsPaymentVerificationOpen(false);

//       // Show success notification
//       setNotification({
//         message: `Payment of ${formatCurrency(currentPaymentItem.totalVendorPrice)} to ${vendorDetails.name} successful!`,
//         type: 'success'
//       });

//       setTimeout(() => setNotification(null), 3000);

//       // Optional: Update payment status in Firebase
//       // This would record the payment in your database
//       const paymentRef = ref(db, `payments/${Date.now()}`);
//       await set(paymentRef, {
//         vendorId: selectedVendor.id,
//         vendorName: vendorDetails.name,
//         itemId: itemId,
//         itemName: currentPaymentItem.name,
//         amount: currentPaymentItem.totalVendorPrice,
//         paymentMethod: paymentDetails.preferredPaymentMode,
//         status: 'completed',
//         timestamp: new Date().toISOString()
//       });

//       return true;

//     } catch (error) {
//       console.error("Payment processing failed:", error);

//       // Show error notification
//       setNotification({
//         message: `Payment failed: ${error.message}`,
//         type: 'error'
//       });

//       setTimeout(() => setNotification(null), 3000);

//       return false;

//     } finally {
//       // Clear processing state
//       setProcessingPayments(prev => ({
//         ...prev,
//         [itemId]: false
//       }));
//     }
//   };

//   return (
//     <div className="payment-commission">
//       {/* Notification Component */}
//       {notification && (
//         <div className={`notification notification-${notification.type}`}>
//           <span>{notification.message}</span>
//           <button className="notification-close" onClick={() => setNotification(null)}>
//             <X size={16} />
//           </button>
//         </div>
//       )}

//       {/* Payment Verification Dialog */}
//       <PaymentVerificationDialog
//         isOpen={isPaymentVerificationOpen}
//         onClose={() => setIsPaymentVerificationOpen(false)}
//         itemId={currentPaymentItem?.id}
//         vendorId={selectedVendor?.id}
//         amount={currentPaymentItem?.totalVendorPrice}
//         onProcessPayment={processPayment}
//       />

//       <div className="payment-commission-header">
//         <h1>Payment & Commission</h1>
//         <div className="gradient-line">
//           <div className="gradient-segment segment-5"></div>
//         </div>
//       </div>

//       {error && <div className="error-message">{error}</div>}
//       {loading && <div className="loading-message">Loading data...</div>}

//       <div className="payment-tabs">
//         <button
//           className={`payment-tab ${activeTab === 'transactions' ? 'active' : ''}`}
//           onClick={() => {
//             setActiveTab('transactions');
//             setSelectedVendor(null);
//           }}
//         >
//           <CreditCard size={18} />
//           Customer Transactions
//         </button>
//         <button
//           className={`payment-tab ${activeTab === 'vendorCommission' ? 'active' : ''}`}
//           onClick={() => setActiveTab('vendorCommission')}
//         >
//           <Store size={18} />
//           Vendor Commission Management
//         </button>
//       </div>

//       {activeTab === 'transactions' && (
//         <div className="transactions-section">
//           <div className="transactions-header">
//             <div className="search-filter-container">
//               <div className="search-container">
//                 <Search className="search-icon1" />
//                 <input
//                   type="text"
//                   placeholder="Search transactions..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="search-input1"
//                 />
//               </div>

//               <div className="filter-container">
//                 <div className="filter-group">
//                   <label>Date Range</label>
//                   <select
//                     value={dateRange}
//                     onChange={(e) => setDateRange(e.target.value)}
//                     className="filter-select"
//                   >
//                     <option value="today">Today</option>
//                     <option value="this-week">This Week</option>
//                     <option value="this-month">This Month</option>
//                     <option value="all-time">All Time</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             <button className="download-button" onClick={exportTransactions}>
//               <Download size={16} />
//               Export Transactions
//             </button>
//           </div>

//           <div className="transactions-table-container">
//             <table className="transactions-table">
//               <thead>
//                 <tr>
//                   <th>Transaction ID</th>
//                   <th>Date</th>
//                   <th>Amount</th>
//                   <th>Customer</th>
//                   <th>Vendor</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredTransactions.length > 0 ? (
//                   filteredTransactions.map(transaction => (
//                     <React.Fragment key={transaction.id}>
//                       <tr
//                         className={`transaction-row ${transaction.type}`}
//                         onClick={() => toggleRow(transaction.id)}
//                         style={{ cursor: 'pointer' }}
//                       >
//                         <td className="transaction-id">
//                           <span>{transaction.id}</span>
//                           {transaction.order && (
//                             <span className="order-id">{transaction.order.displayId}</span>
//                           )}
//                         </td>
//                         <td>{formatDate(transaction.date)}</td>
//                         <td className="amount-cell">
//                           {formatCurrency(transaction.amount)}
//                         </td>
//                         <td>
//                           <div className="party-info">
//                             <div className="party-name">
//                               {transaction.customer ? transaction.customer.name : 'N/A'}
//                             </div>
//                           </div>
//                         </td>
//                         <td>
//                           <div className="party-info">
//                             <div className="party-name">
//                               {transaction.vendor ? transaction.vendor.name : 'N/A'}
//                             </div>
//                           </div>
//                         </td>
//                         <td>
//                           {getTransactionStatus(transaction.status)}
//                           {transaction.status === 'failed' && transaction.failureReason && (
//                             <div className="failure-reason">
//                               {transaction.failureReason}
//                             </div>
//                           )}
//                         </td>
//                       </tr>
//                       {expandedRows[transaction.id] && transaction.order && (
//                         <tr className="expanded-row">
//                           <td colSpan="8">
//                             <div className="expanded-content">
//                               <h4>Order Details: {transaction.order.displayId}</h4>
//                               <p><strong>Total Amount:</strong> {formatCurrency(transaction.order.totalAmount)}</p>
//                               <p><strong>Items:</strong></p>
//                               <ul>
//                                 {transaction.order.items.length > 0 ? (
//                                   transaction.order.items.map((item, index) => (
//                                     <li key={index}>
//                                       {item.name || 'Item'} (Qty: {item.quantity || 1}) - {formatCurrency(item.price || 0)}
//                                     </li>
//                                   ))
//                                 ) : (
//                                   <li>No items available</li>
//                                 )}
//                               </ul>
//                             </div>
//                           </td>
//                         </tr>
//                       )}
//                     </React.Fragment>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8" className="no-results">
//                       {loading ? 'Loading...' : 'No transactions found matching your criteria.'}
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {activeTab === 'vendorCommission' && !selectedVendor && (
//         <div className="vendor-commission-section">
//           <div className="commission-header">
//             <div className="search-container">
//               <Search className="search-icon" />
//               <input
//                 type="text"
//                 placeholder="Search vendors by name or address..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="search-input1"
//               />
//             </div>

//             <button className="download-button" onClick={exportVendors}>
//               <Download size={16} />
//               Export Vendor Data
//             </button>
//           </div>

//           <div className="vendor-cards-container">
//             {filteredVendors.length > 0 ? (
//               filteredVendors.map(vendor => (
//                 <div key={vendor.id} className="vendor-card">
//                   <div className="vendor-card-header">
//                     <div className="vendor-icon">
//                       <Store size={24} />
//                     </div>
//                     <h3>{vendor.name}</h3>
//                     <div className="vendor-category">{vendor.category}</div>
//                   </div>

//                   <div className="vendor-card-body">
//                     <div className="vendor-contact">
//                       <div className="vendor-address">
//                         <Map size={16} />
//                         <span>{vendor.address}</span>
//                       </div>
//                       {vendor.phone && (
//                         <div className="vendor-phone">
//                           <Phone size={16} />
//                           <span>{vendor.phone}</span>
//                         </div>
//                       )}
//                       {vendor.email && (
//                         <div className="vendor-email">
//                           <Mail size={16} />
//                           <span>{vendor.email}</span>
//                         </div>
//                       )}
//                     </div>

//                     <div className="vendor-stats">
//                       <div className="stat">
//                         <span className="stat-label">Commission Rate</span>
//                         <span className="stat-value">{vendor.commissionRate}%</span>
//                       </div>
//                       <div className="stat">
//                         <span className="stat-label">Total Orders</span>
//                         <span className="stat-value">{vendor.totalOrders}</span>
//                       </div>
//                       <div className="stat">
//                         <span className="stat-label">Total Revenue</span>
//                         <span className="stat-value">{formatCurrency(vendor.totalRevenue)}</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="vendor-card-footer">
//                     <button
//                       className="view-vendor-button"
//                       onClick={() => handleViewVendor(vendor)}
//                     >
//                       <Eye size={16} />
//                       View Details
//                     </button>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="no-vendors">
//                 <p>{loading ? 'Loading vendors...' : 'No vendors found matching your criteria.'}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Vendor Detail View */}
//       {activeTab === 'vendorCommission' && selectedVendor && (
//         <div className="vendor-detail-section">
//           <div className="vendor-detail-header">
//             <button className="back-button" onClick={handleBackToVendorList}>
//               <ChevronLeft size={16} />
//               Back to Vendors
//             </button>
//             <h2>{selectedVendor.name}</h2>
//             <button className="download-button" onClick={exportVendorDetails}>
//               <Download size={16} />
//               Export Details
//             </button>
//           </div>

//           {vendorDetailsLoading ? (
//             <div className="loading-container">
//               <div className="spinner"></div>
//               <p>Loading vendor details...</p>
//             </div>
//           ) : (
//             <>
//               <div className="vendor-detail-overview">
//                 <div className="vendor-profile">
//                   <div className="vendor-profile-header">
//                     <Store size={24} className="vendor-icon" />
//                     <div className="vendor-info">
//                       <h3>{selectedVendor.name}</h3>
//                       <div className="vendor-category">{selectedVendor.category}</div>
//                     </div>
//                   </div>

//                   <div className="vendor-contact-details">
//                     <div className="detail-item">
//                       <Map size={16} />
//                       <span>{selectedVendor.address}</span>
//                     </div>
//                     {selectedVendor.phone && (
//                       <div className="detail-item">
//                         <Phone size={16} />
//                         <span>{selectedVendor.phone}</span>
//                       </div>
//                     )}
//                     {selectedVendor.email && (
//                       <div className="detail-item">
//                         <Mail size={16} />
//                         <span>{selectedVendor.email}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="vendor-stats-cards">
//                   <div className="stat-card orders">
//                     <div className="stat-icon">
//                       <Package size={24} />
//                     </div>
//                     <div className="stat-content">
//                       <span className="stat-value">{selectedVendor.totalOrders}</span>
//                       <span className="stat-label">Total Orders</span>
//                     </div>
//                   </div>

//                   <div className="stat-card revenue">
//                     <div className="stat-icon">
//                       <span style={{ fontSize: '24px', fontWeight: 'bold' }}>₹</span>
//                     </div>
//                     <div className="stat-content">
//                       <span className="stat-value">{formatCurrency(selectedVendor.totalRevenue)}</span>
//                       <span className="stat-label">Total Revenue</span>
//                     </div>
//                   </div>

//                   <div className="stat-card commission">
//                     <div className="stat-icon">
//                       <Percent size={24} />
//                     </div>
//                     <div className="stat-content">
//                       <span className="stat-value">{selectedVendor.commissionRate}%</span>
//                       <span className="stat-label">Commission Rate</span>
//                     </div>
//                   </div>

//                   <div className="stat-card profit">
//                     <div className="stat-icon">
//                       <TrendingUp size={24} />
//                     </div>
//                     <div className="stat-content">
//                       <span className="stat-value">{formatCurrency(selectedVendor.totalProfit || 0)}</span>
//                       <span className="stat-label">Total Profit</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="vendor-items-section">
//                 <div className="section-header-with-filters">
//                   <h3>Items Sold</h3>
//                   <div className="items-filters">
//                     <div className="filter-group">
//                       <label>Sort by:</label>
//                       <select
//                         value={itemsSortBy}
//                         onChange={(e) => setItemsSortBy(e.target.value)}
//                         className="filter-select"
//                       >
//                         <option value="quantity">Quantity Sold</option>
//                         <option value="profit">Total Profit</option>
//                         <option value="name">Item Name</option>
//                       </select>
//                     </div>
//                     <button
//                       className={`sort-order-btn ${itemsSortOrder}`}
//                       onClick={() => setItemsSortOrder(itemsSortOrder === 'asc' ? 'desc' : 'asc')}
//                       title={itemsSortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
//                     >
//                       {itemsSortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
//                     </button>
//                   </div>
//                 </div>

//                 {displayedVendorItems.length > 0 ? (
//                   <div className="vendor-items-table-container">
//                     <table className="vendor-items-table">
//                       <thead>
//                         <tr>
//                           <th>Item Name</th>
//                           <th>Quantity Sold</th>
//                           <th>Base Price</th>
//                           <th>Vendor Price</th>
//                           <th>Selling Price</th>
//                           <th>Total Vendor Price</th>
//                           <th>Total Profit</th>
//                           <th>Action</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {displayedVendorItems.map((item, index) => (
//                           <tr key={index} className="item-row">
//                             <td className="item-name">{item.name}</td>
//                             <td>
//                               <span className="quantity-badge">{item.quantity}</span>
//                             </td>
//                             <td>{formatCurrency(item.basePrice)}</td>
//                             <td>{formatCurrency(item.vendorPrice)}</td>
//                             <td>{formatCurrency(item.sellingPrice)}</td>
//                             <td>{formatCurrency(item.totalVendorPrice)}</td>
//                             <td className="profit-cell">
//                               <span className={`profit-amount ${item.totalProfit >= 0 ? 'positive' : 'negative'}`}>
//                                 {formatCurrency(item.totalProfit)}
//                               </span>
//                             </td>
//                             <td>
//                               <button
//                                 className={`pay-button ${paidItems[item.id] ? 'paid' : ''}`}
//                                 onClick={() => !paidItems[item.id] && handlePayment(item)}
//                                 disabled={processingPayments[item.id]}
//                               >
//                                 {processingPayments[item.id] ? 'Processing...' :
//                                   (paidItems[item.id] ? 'Paid' : 'Pay')}
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                       <tfoot>
//                         <tr>
//                           <td colSpan="5" className="total-label">Total </td>
//                           <td className="total-value">
//                             {formatCurrency(displayedVendorItems.reduce((sum, item) => sum + (item.totalVendorPrice || 0), 0))}
//                           </td>
//                           <td className="total-value">
//                             <span className={`profit-amount ${displayedVendorItems.reduce((sum, item) => sum + (item.totalProfit || 0), 0) >= 0 ? 'positive' : 'negative'}`}>
//                               {formatCurrency(displayedVendorItems.reduce((sum, item) => sum + (item.totalProfit || 0), 0))}
//                             </span>
//                           </td>
//                           <td className="total-value">
//                             {/* Pay All button could be implemented here */}
//                           </td>
//                         </tr>
//                       </tfoot>
//                     </table>
//                   </div>
//                 ) : (
//                   <div className="no-items-message">
//                     <p>No items have been sold by this vendor yet.</p>
//                   </div>
//                 )}
//               </div>

//               <div className="vendor-orders-section">
//                 <div className="section-header-with-filters">
//                   <h3>Recent Orders</h3>
//                   <div className="orders-filters">
//                     <div className="filter-group">
//                       <label>Filter by date:</label>
//                       <select
//                         value={ordersDateFilter}
//                         onChange={(e) => setOrdersDateFilter(e.target.value)}
//                         className="filter-select"
//                       >
//                         <option value="all">All Time</option>
//                         <option value="today">Today</option>
//                         <option value="week">Last 7 Days</option>
//                         <option value="month">Last 30 Days</option>
//                       </select>
//                     </div>
//                     <div className="filter-group">
//                       <label>Sort by:</label>
//                       <select
//                         value={ordersSortBy}
//                         onChange={(e) => setOrdersSortBy(e.target.value)}
//                         className="filter-select"
//                       >
//                         <option value="date">Date</option>
//                         <option value="amount">Amount</option>
//                         <option value="customer">Customer</option>
//                       </select>
//                     </div>
//                     <button
//                       className={`sort-order-btn ${ordersSortOrder}`}
//                       onClick={() => setOrdersSortOrder(ordersSortOrder === 'asc' ? 'desc' : 'asc')}
//                       title={ordersSortOrder === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
//                     >
//                       {ordersSortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
//                     </button>
//                   </div>
//                 </div>

//                 {displayedVendorOrders.length > 0 ? (
//                   <div className="vendor-orders-table-container">
//                     <table className="vendor-orders-table">
//                       <thead>
//                         <tr>
//                           <th>Order ID</th>
//                           <th>Date</th>
//                           <th>Customer</th>
//                           <th>Items</th>
//                           <th>Total Amount</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {displayedVendorOrders.slice(0, 10).map((order) => (
//                           <tr key={order.id} className="order-row">
//                             <td><span className="order-id-badge">{order.displayId}</span></td>
//                             <td>{formatDate(order.orderDate)}</td>
//                             <td>{order.customer?.fullName || 'Unknown'}</td>
//                             <td>
//                               <span className="items-count">{order.items ? `${order.items.length} items` : 'No items'}</span>
//                             </td>
//                             <td className="amount-cell">{formatCurrency(calculateAmountWithoutTax(order))}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>

//                     {displayedVendorOrders.length > 10 && (
//                       <div className="view-more-orders">
//                         <p>Showing 10 of {displayedVendorOrders.length} orders</p>
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="no-orders-message">
//                     <p>No orders found for the selected criteria.</p>
//                   </div>
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       )}

//       {/* Edit Commission Modal */}
//       {isEditModalOpen && editingVendor && (
//         <div className="modal-overlay">
//           <div className="modal-container">
//             <div className="modal-header">
//               <h3>Edit Commission Rate</h3>
//               <button
//                 className="close-button"
//                 onClick={() => setIsEditModalOpen(false)}
//               >
//                 <XCircle size={20} />
//               </button>
//             </div>
//             <div className="modal-body">
//               <p><strong>Vendor:</strong> {editingVendor.name}</p>
//               <p><strong>Category:</strong> {editingVendor.category}</p>
//               <p><strong>Current Commission Rate:</strong> {editingVendor.commissionRate}%</p>

//               <div className="commission-input">
//                 <label htmlFor="commission-rate">New Commission Rate (%)</label>
//                 <div className="rate-input-container">
//                   <input
//                     id="commission-rate"
//                     type="number"
//                     min="0"
//                     max="100"
//                     step="0.1"
//                     value={editCommissionRate}
//                     onChange={(e) => setEditCommissionRate(e.target.value)}
//                   />
//                   <span className="percent-symbol">%</span>
//                 </div>
//               </div>
//             </div>
//             <div className="modal-footer">
//               <button
//                 className="cancel-button"
//                 onClick={() => setIsEditModalOpen(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="save-button"
//                 onClick={handleUpdateCommission}
//               >
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaymentCommission;




import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  CreditCard,
  Calendar,
  ChevronDown,
  Download,
  Filter,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  FileText,
  BarChart,
  Wallet,
  ArrowUp,
  ArrowDown,
  Store,
  Settings,
  ChevronRight,
  ChevronLeft,
  Edit,
  Trash,
  Plus,
  Percent,
  Eye,
  Map,
  Phone,
  Mail,
  Package,
  TrendingUp,
  AlertTriangle,
  SortAsc,
  SortDesc,
  Coins,
  X,
  Shield,
  Send,
  Info
} from 'lucide-react';

import { ref, onValue, update, remove, push, set, get } from 'firebase/database';
import { db } from '../firebase/config';
import '../styles/PaymentCommission.css';
import PaymentVerificationDialog from './PaymentVerificationDialog'; // Import the verification dialog

const PaymentCommission = () => {
  // Function to calculate amount without tax
  const calculateAmountWithoutTax = (order) => {
    return (order.subtotal || 0) + (order.deliveryCharge || 0);
  };

  const [activeTab, setActiveTab] = useState('transactions');
  const [dateRange, setDateRange] = useState('this-month');
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderIdMap, setOrderIdMap] = useState({});
  const [expandedRows, setExpandedRows] = useState({});
  const [editingVendor, setEditingVendor] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCommissionRate, setEditCommissionRate] = useState(10);

  // States for vendor details view
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorItems, setVendorItems] = useState([]);
  const [vendorOrders, setVendorOrders] = useState([]);
  const [vendorDetailsLoading, setVendorDetailsLoading] = useState(false);
  const [processingPayments, setProcessingPayments] = useState({});
  const [paidItems, setPaidItems] = useState({});

  // New states for payment verification
  const [notification, setNotification] = useState(null);
  const [isPaymentVerificationOpen, setIsPaymentVerificationOpen] = useState(false);
  const [currentPaymentItem, setCurrentPaymentItem] = useState(null);

  // States for filtering and sorting
  const [itemsSortBy, setItemsSortBy] = useState('quantity'); // 'quantity', 'profit', 'name'
  const [itemsSortOrder, setItemsSortOrder] = useState('desc'); // 'asc', 'desc'
  const [ordersSortBy, setOrdersSortBy] = useState('date'); // 'date', 'amount', 'customer'
  const [ordersSortOrder, setOrdersSortOrder] = useState('desc'); // 'asc', 'desc'
  const [ordersDateFilter, setOrdersDateFilter] = useState('all'); // 'all', 'today', 'week', 'month'

  // Export utility functions
  const convertToCSV = (data, headers) => {
    if (!data || data.length === 0) return '';

    const csvHeaders = headers.join(',');
    const csvRows = data.map(row => {
      return headers.map(header => {
        let value = row[header];
        if (value === null || value === undefined) value = '';
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
    });

    return [csvHeaders, ...csvRows.map(row => row.join(','))].join('\n');
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export transactions data
  const exportTransactions = () => {
    try {
      if (!filteredTransactions || filteredTransactions.length === 0) {
        alert('No transactions to export');
        return;
      }

      const exportData = filteredTransactions.map(transaction => ({
        'Transaction ID': transaction.id,
        'Order ID': transaction.order?.displayId || 'N/A',
        'Date': formatDate(transaction.date),
        'Amount': transaction.amount || 0,
        'Commission': transaction.commission || 0,
        'Vendor Payout': transaction.vendorPayout || 0,
        'Customer': transaction.customer?.name || 'N/A',
        'Vendor': transaction.vendor?.name || 'N/A',
        'Status': transaction.status,
        'Payment Method': transaction.paymentMethod?.type || 'N/A',
        'Payment Details': transaction.paymentMethod?.details || 'N/A',
        'Failure Reason': transaction.failureReason || 'N/A'
      }));

      const headers = [
        'Transaction ID', 'Order ID', 'Date', 'Amount', 'Commission',
        'Vendor Payout', 'Customer', 'Vendor', 'Status', 'Payment Method',
        'Payment Details', 'Failure Reason'
      ];

      const csvContent = convertToCSV(exportData, headers);
      const filename = `transactions_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSV(csvContent, filename);
    } catch (error) {
      console.error('Error exporting transactions:', error);
      alert('Error exporting transactions. Please try again.');
    }
  };

  // Export vendors data
  const exportVendors = () => {
    try {
      if (!filteredVendors || filteredVendors.length === 0) {
        alert('No vendors to export');
        return;
      }

      const exportData = filteredVendors.map(vendor => ({
        'Vendor ID': vendor.id,
        'Vendor Name': vendor.name,
        'Category': vendor.category,
        'Address': vendor.address,
        'Phone': vendor.phone || 'N/A',
        'Email': vendor.email || 'N/A',
        'Commission Rate (%)': vendor.commissionRate,
        'Total Revenue': vendor.totalRevenue || 0,
        'Total Orders': vendor.totalOrders || 0,
        'Total Commission': vendor.totalCommission || 0,
        'Total Profit': vendor.totalProfit || 0,
        'Last Order Date': vendor.lastOrderDate ? formatDate(vendor.lastOrderDate) : 'N/A'
      }));

      const headers = [
        'Vendor ID', 'Vendor Name', 'Category', 'Address', 'Phone', 'Email',
        'Commission Rate (%)', 'Total Revenue', 'Total Orders', 'Total Commission',
        'Total Profit', 'Last Order Date'
      ];

      const csvContent = convertToCSV(exportData, headers);
      const filename = `vendors_${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSV(csvContent, filename);
    } catch (error) {
      console.error('Error exporting vendors:', error);
      alert('Error exporting vendors. Please try again.');
    }
  };

  // Export vendor details (items and orders)
  const exportVendorDetails = () => {
    try {
      if (!selectedVendor) {
        alert('No vendor selected');
        return;
      }

      // Export vendor items
      if (displayedVendorItems && displayedVendorItems.length > 0) {
        const itemsData = displayedVendorItems.map(item => ({
          'Item Name': item.name,
          'Quantity Sold': item.quantity,
          'Base Price': item.basePrice || 0,
          'Vendor Price': item.vendorPrice || 0,
          'Total Vendor Price': (item.vendorPrice || 0) * (item.quantity || 0),
          'Selling Price': item.sellingPrice || 0,
          'Total Profit': item.totalProfit || 0
        }));

        const itemsHeaders = [
          'Item Name', 'Quantity Sold', 'Base Price', 'Vendor Price',
          'Total Vendor Price', 'Selling Price', 'Total Profit'
        ];

        const itemsCsvContent = convertToCSV(itemsData, itemsHeaders);
        const itemsFilename = `${selectedVendor.name.replace(/\s+/g, '_')}_items_${new Date().toISOString().split('T')[0]}.csv`;
        downloadCSV(itemsCsvContent, itemsFilename);
      }

      // Export vendor orders
      if (displayedVendorOrders && displayedVendorOrders.length > 0) {
        const ordersData = displayedVendorOrders.map(order => ({
          'Order ID': order.displayId,
          'Date': formatDate(order.orderDate),
          'Customer': order.customer?.fullName || 'Unknown',
          'Items Count': order.items ? order.items.length : 0,
          'Total Amount': calculateAmountWithoutTax(order), // Changed to use amount without tax
          'Status': order.status || 'N/A'
        }));

        const ordersHeaders = [
          'Order ID', 'Date', 'Customer', 'Items Count', 'Total Amount', 'Status'
        ];

        const ordersCsvContent = convertToCSV(ordersData, ordersHeaders);
        const ordersFilename = `${selectedVendor.name.replace(/\s+/g, '_')}_orders_${new Date().toISOString().split('T')[0]}.csv`;

        setTimeout(() => {
          downloadCSV(ordersCsvContent, ordersFilename);
        }, 500);
      }

      if ((!displayedVendorItems || displayedVendorItems.length === 0) &&
        (!displayedVendorOrders || displayedVendorOrders.length === 0)) {
        alert('No data to export for this vendor');
      }
    } catch (error) {
      console.error('Error exporting vendor details:', error);
      alert('Error exporting vendor details. Please try again.');
    }
  };

  // Function to generate simplified order IDs for display
  const generateOrderIdMap = (orders) => {
    const idMap = {};
    orders.forEach((order, index) => {
      idMap[order.id] = `ORD-${index + 1}`;
    });
    setOrderIdMap(idMap);
  };

  // Toggle expanded row
  const toggleRow = (transactionId) => {
    setExpandedRows(prev => ({
      ...prev,
      [transactionId]: !prev[transactionId]
    }));
  };

  // Sort items based on selected criteria
  const sortItems = (items) => {
    const sortedItems = [...items].sort((a, b) => {
      let aValue, bValue;

      switch (itemsSortBy) {
        case 'quantity':
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case 'profit':
          aValue = a.totalProfit || 0;
          bValue = b.totalProfit || 0;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        default:
          return 0;
      }

      if (itemsSortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return sortedItems;
  };

  // Sort orders based on selected criteria
  const sortOrders = (orders) => {
    const sortedOrders = [...orders].sort((a, b) => {
      let aValue, bValue;

      switch (ordersSortBy) {
        case 'date':
          aValue = new Date(a.orderDate);
          bValue = new Date(b.orderDate);
          break;
        case 'amount':
          aValue = calculateAmountWithoutTax(a); // Changed to use amount without tax
          bValue = calculateAmountWithoutTax(b); // Changed to use amount without tax
          break;
        case 'customer':
          aValue = (a.customer?.fullName || '').toLowerCase();
          bValue = (b.customer?.fullName || '').toLowerCase();
          break;
        default:
          return 0;
      }

      if (ordersSortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return sortedOrders;
  };

  // Filter orders by date
  const filterOrdersByDate = (orders) => {
    if (ordersDateFilter === 'all') return orders;

    const now = new Date();
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate);

      switch (ordersDateFilter) {
        case 'today':
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          return orderDate >= today && orderDate < tomorrow;
        case 'week':
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return orderDate >= weekAgo;
        case 'month':
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return orderDate >= monthAgo;
        default:
          return true;
      }
    });

    return filteredOrders;
  };

  // Get base price (from custom setting or item originalPrice)
  const getBaseCost = (itemId, basePrices, item) => {
    const customBasePrice = basePrices[itemId]?.price;
    if (customBasePrice !== undefined) return parseFloat(customBasePrice);
    return parseFloat(item.originalPrice || 0);
  };

  // Get vendor price (from custom setting or item vendorPrice)
  const getVendorPrice = (itemId, vendorPrices, item, basePrice) => {
    const customVendorPrice = vendorPrices[itemId]?.price;
    if (customVendorPrice !== undefined) return parseFloat(customVendorPrice);
    return parseFloat(item.vendorPrice || basePrice || 0);
  };

  // Get selling price (from custom setting or item price)
  const getSellingPrice = (itemId, sellingPrices, item, vendorPrice) => {
    const customSellingPrice = sellingPrices[itemId]?.price;
    if (customSellingPrice !== undefined) return parseFloat(customSellingPrice);
    return parseFloat(item.price || vendorPrice || 0);
  };

  useEffect(() => {
    const ordersRef = ref(db, 'orders');
    const shopsRef = ref(db, 'shops');
    const itemsRef = ref(db, 'items');

    let ordersData = [];
    let shopsData = [];
    let itemsData = [];

    const itemsUnsubscribe = onValue(itemsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          itemsData = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value
          }));
        }
        processData(ordersData, shopsData, itemsData);
      } catch (err) {
        console.error('Error fetching items:', err);
      }
    });

    const ordersUnsubscribe = onValue(ordersRef, (snapshot) => {
      try {
        const data = snapshot.val();
        ordersData = data ? Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          timeline: data[key].timeline || [
            { status: 'order_placed', time: data[key].orderDate, note: 'Order placed successfully' }
          ]
        })) : [];
        processData(ordersData, shopsData, itemsData);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load transactions.');
        setLoading(false);
      }
    });

    const shopsUnsubscribe = onValue(shopsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        shopsData = data ? Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })) : [];
        processData(ordersData, shopsData, itemsData);
      } catch (err) {
        console.error('Error fetching shops:', err);
        setError('Failed to load transactions.');
        setLoading(false);
      }
    });

    const processData = async (orders, shops, items) => {
      try {
        generateOrderIdMap(orders);

        const newTransactions = orders.flatMap(order => {
          const shop = shops.find(s => s.id === order.vendor?.id);
          const commissionRate = shop?.commissionRate || 10;
          const orderAmount = calculateAmountWithoutTax(order); // Changed to use amount without tax
          const commission = orderAmount ? (orderAmount * commissionRate / 100) : 0;
          const vendorPayout = orderAmount ? (orderAmount - commission) : 0;

          if (order.status === 'pending') return [];

          return [{
            id: `TRX-${order.id}`,
            type: 'order_payment',
            amount: orderAmount, // Changed to use amount without tax
            commission,
            vendorPayout,
            date: order.orderDate,
            status: order.status === 'delivered' ? 'completed' : order.status === 'cancelled' ? 'failed' : 'processing',
            customer: {
              id: order.customer?.id || 'CUST-' + order.id,
              name: order.customer?.fullName || 'Unknown'
            },
            vendor: {
              id: order.vendor?.id || 'VEND-' + order.id,
              name: shop?.name || order.vendor?.name || 'Unknown'
            },
            order: {
              id: order.id,
              displayId: orderIdMap[order.id] || `ORD-${orders.findIndex(o => o.id === order.id) + 1}`,
              items: order.items || [],
              totalAmount: orderAmount, // Changed to use amount without tax
              subtotal: order.subtotal || 0,
              deliveryCharge: order.deliveryCharge || 0
            },
            paymentMethod: {
              type: order.payment?.method || 'credit_card',
              details: order.payment?.cardLastFour ? `**** ${order.payment.cardLastFour}` : order.payment?.email || 'Unknown'
            },
            failureReason: order.status === 'cancelled' ? (order.cancellationReason || 'Order cancelled') : null
          }];
        });

        setTransactions(newTransactions);

        const vendorList = await Promise.all(shops.map(async (shop) => {
          const shopOrders = orders.filter(o => o.vendor?.id === shop.id && o.status === 'delivered');

          // Calculate total revenue without tax
          const totalRevenue = shopOrders.reduce((sum, o) => sum + calculateAmountWithoutTax(o), 0);
          const totalOrders = shopOrders.length;
          const commissionRate = shop.commissionRate || 10;
          const totalCommission = shopOrders.reduce((sum, o) => {
            const orderAmount = calculateAmountWithoutTax(o);
            return sum + ((orderAmount * commissionRate / 100) || 0);
          }, 0);

          const soldItems = [];
          shopOrders.forEach(order => {
            if (order.items && order.items.length > 0) {
              order.items.forEach(item => {
                const existingItem = soldItems.find(i => (i.id === item.id) || (i.id === item.firebaseKey));
                let originalItem = items.find(i => i.id === item.id);
                if (!originalItem && item.firebaseKey) {
                  originalItem = items.find(i => i.id === item.firebaseKey);
                }
                if (!originalItem && item.name) {
                  originalItem = items.find(i => i.name === item.name);
                }

                if (existingItem) {
                  existingItem.quantity += item.quantity || 1;
                  existingItem.totalSales += (item.price * (item.quantity || 1)) || 0;
                  if (new Date(order.orderDate) > new Date(existingItem.lastOrderDate || 0)) {
                    existingItem.lastOrderDate = order.orderDate;
                  }
                } else {
                  soldItems.push({
                    ...item,
                    originalPrice: originalItem?.originalPrice || 0,
                    vendorPrice: originalItem?.vendorPrice || 0,
                    quantity: item.quantity || 1,
                    totalSales: (item.price * (item.quantity || 1)) || 0,
                    lastOrderDate: order.orderDate
                  });
                }
              });
            }
          });

          // Fetch prices for profit calculation
          const basePricesRef = ref(db, `shops/${shop.id}/basePrices`);
          const vendorPricesRef = ref(db, `shops/${shop.id}/vendorPrices`);
          const [basePricesSnapshot, vendorPricesSnapshot] = await Promise.all([
            get(basePricesRef),
            get(vendorPricesRef)
          ]);

          const basePrices = basePricesSnapshot.exists() ? basePricesSnapshot.val() : {};
          const vendorPrices = vendorPricesSnapshot.exists() ? vendorPricesSnapshot.val() : {};

          const totalProfit = soldItems.reduce((sum, item) => {
            const itemId = item.id || item.firebaseKey;
            const basePrice = getBaseCost(itemId, basePrices, item);
            const vendorPrice = getVendorPrice(itemId, vendorPrices, item, basePrice);
            const profitPerUnit = vendorPrice - basePrice;
            return sum + (profitPerUnit * item.quantity);
          }, 0);

          return {
            id: shop.id,
            name: shop.name || 'Unknown Vendor',
            category: shop.category || 'Uncategorized',
            address: shop.location?.address || 'No address available',
            phone: shop.phone || 'No phone available',
            email: shop.email || 'No email available',
            commissionRate,
            totalRevenue,
            totalOrders,
            totalCommission,
            totalProfit,
            soldItems,
            lastOrderDate: shopOrders.length > 0
              ? shopOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))[0].orderDate
              : null
          };
        }));

        setVendors(vendorList);
        setLoading(false);
      } catch (err) {
        console.error('Error processing data:', err);
        setError('Failed to process transactions.');
        setLoading(false);
      }
    };

    return () => {
      ordersUnsubscribe();
      shopsUnsubscribe();
      itemsUnsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!selectedVendor) return;

    setVendorDetailsLoading(true);

    const fetchVendorDetails = async () => {
      try {
        const ordersRef = ref(db, 'orders');
        const ordersSnapshot = await get(ordersRef);

        const itemsRef = ref(db, 'items');
        const itemsSnapshot = await get(itemsRef);
        let itemsData = {};

        if (itemsSnapshot.exists()) {
          itemsData = itemsSnapshot.val();
        }

        // Fetch prices from shops/${vendorId}/[basePrices, vendorPrices, sellingPrices]
        const basePricesRef = ref(db, `shops/${selectedVendor.id}/basePrices`);
        const vendorPricesRef = ref(db, `shops/${selectedVendor.id}/vendorPrices`);
        const sellingPricesRef = ref(db, `shops/${selectedVendor.id}/sellingPrices`);

        const [basePricesSnapshot, vendorPricesSnapshot, sellingPricesSnapshot] = await Promise.all([
          get(basePricesRef),
          get(vendorPricesRef),
          get(sellingPricesRef)
        ]);

        const basePrices = basePricesSnapshot.exists() ? basePricesSnapshot.val() : {};
        const vendorPrices = vendorPricesSnapshot.exists() ? vendorPricesSnapshot.val() : {};
        const sellingPrices = sellingPricesSnapshot.exists() ? sellingPricesSnapshot.val() : {};

        if (ordersSnapshot.exists()) {
          const ordersData = ordersSnapshot.val();

          const vendorOrdersData = Object.entries(ordersData)
            .filter(([_, order]) => order.vendor?.id === selectedVendor.id && order.status === 'delivered')
            .map(([key, order]) => ({
              id: key,
              ...order,
              displayId: orderIdMap[key] || `ORD-${Math.floor(Math.random() * 1000)}`
            }))
            .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

          setVendorOrders(vendorOrdersData);

          const allItems = [];
          vendorOrdersData.forEach(order => {
            if (order.items && order.items.length > 0) {
              order.items.forEach(item => {
                const existingItem = allItems.find(i => (i.id === item.id) || (i.id === item.firebaseKey));

                let itemId = item.id;
                if (!itemId && item.firebaseKey) {
                  itemId = item.firebaseKey;
                }

                // Get the original item to access its properties
                let originalItem = null;
                if (itemId && itemsData[itemId]) {
                  originalItem = itemsData[itemId];
                } else if (item.name) {
                  // Try to find by name if ID doesn't work
                  const foundItem = Object.values(itemsData).find(i => i.name === item.name);
                  if (foundItem) originalItem = foundItem;
                }

                // Calculate prices with proper fallbacks
                const basePrice = getBaseCost(
                  itemId,
                  basePrices,
                  { originalPrice: originalItem?.originalPrice || item.originalPrice }
                );

                const vendorPrice = getVendorPrice(
                  itemId,
                  vendorPrices,
                  { vendorPrice: originalItem?.vendorPrice || item.vendorPrice },
                  basePrice
                );

                const sellingPrice = getSellingPrice(
                  itemId,
                  sellingPrices,
                  { price: originalItem?.price || item.price },
                  vendorPrice
                );

                if (existingItem) {
                  existingItem.quantity += item.quantity || 1;
                  existingItem.totalSales += (sellingPrice * (item.quantity || 1));
                  existingItem.orders.push(order.displayId);
                  if (new Date(order.orderDate) > new Date(existingItem.lastOrderDate || 0)) {
                    existingItem.lastOrderDate = order.orderDate;
                  }
                } else {
                  allItems.push({
                    ...item,
                    id: itemId,
                    quantity: item.quantity || 1,
                    basePrice: basePrice,
                    vendorPrice: vendorPrice,
                    sellingPrice: sellingPrice,
                    totalSales: (sellingPrice * (item.quantity || 1)),
                    orders: [order.displayId],
                    lastOrderDate: order.orderDate
                  });
                }
              });
            }
          });

          const itemsWithProfit = allItems.map(item => {
            // Profit calculation: Vendor Price - Base Price
            const profitPerUnit = item.vendorPrice - item.basePrice;
            const totalProfit = profitPerUnit * item.quantity;

            return {
              ...item,
              totalProfit
            };
          });

          setVendorItems(itemsWithProfit);
        } else {
          setVendorOrders([]);
          setVendorItems([]);
        }
      } catch (error) {
        console.error('Error fetching vendor details:', error);
        setError('Failed to load vendor details');
      } finally {
        setVendorDetailsLoading(false);
      }
    };

    fetchVendorDetails();
  }, [selectedVendor, orderIdMap]);
  useEffect(() => {
    if (!selectedVendor) return;

    const loadPaidItems = async () => {
      try {
        // Clear previous paid items when selecting a new vendor
        setPaidItems({});

        // Get payments for this vendor's items
        const paymentsRef = ref(db, 'payments');
        const paymentsSnapshot = await get(paymentsRef);

        if (paymentsSnapshot.exists()) {
          const payments = paymentsSnapshot.val();
          const newPaidItems = {};

          // Filter payments by vendor and set paid status
          Object.values(payments).forEach(payment => {
            if (payment.vendorId === selectedVendor.id && payment.status !== 'failed') {
              newPaidItems[payment.itemId] = true;
            }
          });

          // Update the paid items state
          setPaidItems(newPaidItems);
        }
      } catch (error) {
        console.error('Error loading payment status:', error);
      }
    };

    loadPaidItems();
  }, [selectedVendor, db]);
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const now = new Date();

    if (dateRange === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (transactionDate < today) {
        return false;
      }
    } else if (dateRange === 'this-week') {
      const startOfWeek = new Date();
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      if (transactionDate < startOfWeek) {
        return false;
      }
    } else if (dateRange === 'this-month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      if (transactionDate < startOfMonth) {
        return false;
      }
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();

      if (transaction.id.toLowerCase().includes(searchLower)) {
        return true;
      }

      if (transaction.customer && transaction.customer.name.toLowerCase().includes(searchLower)) {
        return true;
      }

      if (transaction.vendor && transaction.vendor.name.toLowerCase().includes(searchLower)) {
        return true;
      }

      if (transaction.order && transaction.order.displayId.toLowerCase().includes(searchLower)) {
        return true;
      }

      return false;
    }

    return true;
  });

  const filteredVendors = vendors.filter(vendor => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      vendor.name.toLowerCase().includes(searchLower) ||
      vendor.category.toLowerCase().includes(searchLower) ||
      vendor.address.toLowerCase().includes(searchLower)
    );
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getTransactionStatus = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="status-badge completed">
            <CheckCircle size={14} />
            Completed
          </span>
        );
      case 'processing':
        return (
          <span className="status-badge processing">
            <RefreshCw size={14} />
            Processing
          </span>
        );
      case 'failed':
        return (
          <span className="status-badge failed">
            <XCircle size={14} />
            Failed
          </span>
        );
      default:
        return (
          <span className="status-badge">{status}</span>
        );
    }
  };

  const handleEditVendor = (vendor) => {
    setEditingVendor(vendor);
    setEditCommissionRate(vendor.commissionRate);
    setIsEditModalOpen(true);
  };

  const handleUpdateCommission = async () => {
    if (!editingVendor) return;

    try {
      const vendorRef = ref(db, `shops/${editingVendor.id}`);
      await update(vendorRef, {
        commissionRate: parseFloat(editCommissionRate)
      });

      setVendors(vendors.map(v =>
        v.id === editingVendor.id
          ? { ...v, commissionRate: parseFloat(editCommissionRate) }
          : v
      ));

      setIsEditModalOpen(false);
      setEditingVendor(null);
    } catch (error) {
      console.error('Error updating commission rate:', error);
      setError(`Failed to update commission rate: ${error.message}`);
    }
  };

  const handleViewVendor = (vendor) => {
    setSelectedVendor(vendor);
  };

  const handleBackToVendorList = () => {
    setSelectedVendor(null);
    setVendorItems([]);
    setVendorOrders([]);
  };

  // Get sorted and filtered data for display
  const displayedVendorItems = sortItems(vendorItems.map(item => ({
    ...item,
    totalVendorPrice: (item.vendorPrice || 0) * (item.quantity || 0)
  })));
  const displayedVendorOrders = sortOrders(filterOrdersByDate(vendorOrders));

  // Enhanced handlePayment function to open verification dialog
  const handlePayment = (item) => {
    // Set the current item being paid
    setCurrentPaymentItem(item);
    // Open the payment verification dialog
    setIsPaymentVerificationOpen(true);
  };

  const processPayment = async (vendorDetails, paymentDetails) => {
    if (!currentPaymentItem) return false;

    const itemId = currentPaymentItem.id;

    // Set processing state
    setProcessingPayments(prev => ({
      ...prev,
      [itemId]: true
    }));

    try {
      // Prepare data for payment transfer API
      const paymentApiData = {
        vendor_id: selectedVendor.id,
        amount: currentPaymentItem.totalVendorPrice,
        beneficiary_name: paymentDetails.preferredPaymentMode === 'BANK'
          ? paymentDetails.bankDetails.accountHolderName
          : vendorDetails.name,
        purpose: `Payment for ${currentPaymentItem.name} - ${currentPaymentItem.quantity} units`
      };

      // Add payment method specific details
      if (paymentDetails.preferredPaymentMode === 'BANK') {
        paymentApiData.payment_mode = 'NEFT'; // or 'IMPS'
        paymentApiData.beneficiary_account_number = paymentDetails.bankDetails.accountNumber;
        paymentApiData.beneficiary_ifsc = paymentDetails.bankDetails.ifscCode;
      } else {
        paymentApiData.payment_mode = 'UPI';
        paymentApiData.beneficiary_upi = paymentDetails.upiDetails.upiId;
      }

      console.log("Initiating payment transfer:", paymentApiData);

      // Call payment transfer API
      const paymentResponse = await fetch('http://localhost:5000/api/vendor-transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentApiData),
      });

      const paymentResult = await paymentResponse.json();

      // Check if payment was successful
      if (paymentResult.status === 1) {
        // Update paid items state
        setPaidItems(prev => ({
          ...prev,
          [itemId]: true
        }));

        // Close the verification dialog
        setIsPaymentVerificationOpen(false);

        // Show success notification with more details
        setNotification({
          message: `Payment of ${formatCurrency(currentPaymentItem.totalVendorPrice)} to ${vendorDetails.name} initiated successfully!`,
          details: `Reference ID: ${paymentResult.data.merchant_ref_id}`,
          type: 'success',
          icon: <CheckCircle size={20} />
        });

        // Generate a unique key for this payment
        const paymentKey = `payment_${Date.now()}`;

        // Store payment data in Firebase with complete details
        const paymentRef = ref(db, `payments/${paymentKey}`);
        await set(paymentRef, {
          paymentId: paymentKey,
          vendorId: selectedVendor.id,
          vendorName: vendorDetails.name,
          itemId: itemId,
          itemName: currentPaymentItem.name,
          quantity: currentPaymentItem.quantity,
          amount: currentPaymentItem.totalVendorPrice,
          paymentMethod: paymentDetails.preferredPaymentMode,
          paymentDetails: paymentDetails.preferredPaymentMode === 'BANK' ? {
            accountHolderName: paymentDetails.bankDetails.accountHolderName,
            accountNumber: paymentDetails.bankDetails.accountNumber,
            ifscCode: paymentDetails.bankDetails.ifscCode
          } : {
            upiId: paymentDetails.upiDetails.upiId
          },
          status: 'initiated',
          merchant_ref_id: paymentResult.data.merchant_ref_id,
          payout_id: paymentResult.data.payout_id || '',
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        });

        // Create a lookup by item ID for quick status checks
        await set(ref(db, `itemPayments/${itemId}`), {
          paymentId: paymentKey,
          status: 'initiated',
          merchant_ref_id: paymentResult.data.merchant_ref_id,
          timestamp: new Date().toISOString()
        });

        setTimeout(() => setNotification(null), 5000);
        return true;
      } else {
        // Payment failed with error from API
        throw new Error(paymentResult.msg || 'Payment transfer failed');
      }

    } catch (error) {
      console.error("Payment processing failed:", error);

      // Show detailed error notification
      setNotification({
        message: 'Payment Failed',
        details: error.message || 'An unknown error occurred',
        type: 'error',
        icon: <AlertTriangle size={20} />
      });

      setTimeout(() => setNotification(null), 5000);
      return false;

    } finally {
      // Clear processing state
      setProcessingPayments(prev => ({
        ...prev,
        [itemId]: false
      }));
    }
  };

  return (
    <div className="payment-commission">
      {/* Notification Component */}
      {/* Enhanced Notification Component */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          <div className="notification-icon">
            {notification.icon || (notification.type === 'success' ?
              <CheckCircle size={20} /> :
              notification.type === 'error' ?
                <AlertTriangle size={20} /> :
                <Info size={20} />)
            }
          </div>
          <div className="notification-content">
            <div className="notification-title">{notification.message}</div>
            {notification.details && <div className="notification-details">{notification.details}</div>}
          </div>
          <button className="notification-close" onClick={() => setNotification(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Payment Verification Dialog */}
      <PaymentVerificationDialog
        isOpen={isPaymentVerificationOpen}
        onClose={() => setIsPaymentVerificationOpen(false)}
        itemId={currentPaymentItem?.id}
        vendorId={selectedVendor?.id}
        amount={currentPaymentItem?.totalVendorPrice}
        onProcessPayment={processPayment}
      />

      <div className="payment-commission-header">
        <h1>Payment & Commission</h1>
        <div className="gradient-line">
          <div className="gradient-segment segment-5"></div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Loading data...</div>}

      <div className="payment-tabs">
        <button
          className={`payment-tab ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('transactions');
            setSelectedVendor(null);
          }}
        >
          <CreditCard size={18} />
          Customer Transactions
        </button>
        <button
          className={`payment-tab ${activeTab === 'vendorCommission' ? 'active' : ''}`}
          onClick={() => setActiveTab('vendorCommission')}
        >
          <Store size={18} />
          Vendor Commission Management
        </button>
      </div>

      {activeTab === 'transactions' && (
        <div className="transactions-section">
          <div className="transactions-header">
            <div className="search-filter-container">
              <div className="search-container">
                <Search className="search-icon1" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input1"
                />
              </div>

              <div className="filter-container">
                <div className="filter-group">
                  <label>Date Range</label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="filter-select"
                  >
                    <option value="today">Today</option>
                    <option value="this-week">This Week</option>
                    <option value="this-month">This Month</option>
                    <option value="all-time">All Time</option>
                  </select>
                </div>
              </div>
            </div>

            <button className="download-button" onClick={exportTransactions}>
              <Download size={16} />
              Export Transactions
            </button>
          </div>

          <div className="transactions-table-container">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Customer</th>
                  <th>Vendor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map(transaction => (
                    <React.Fragment key={transaction.id}>
                      <tr
                        className={`transaction-row ${transaction.type}`}
                        onClick={() => toggleRow(transaction.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td className="transaction-id">
                          <span>{transaction.id}</span>
                          {transaction.order && (
                            <span className="order-id">{transaction.order.displayId}</span>
                          )}
                        </td>
                        <td>{formatDate(transaction.date)}</td>
                        <td className="amount-cell">
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td>
                          <div className="party-info">
                            <div className="party-name">
                              {transaction.customer ? transaction.customer.name : 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="party-info">
                            <div className="party-name">
                              {transaction.vendor ? transaction.vendor.name : 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td>
                          {getTransactionStatus(transaction.status)}
                          {transaction.status === 'failed' && transaction.failureReason && (
                            <div className="failure-reason">
                              {transaction.failureReason}
                            </div>
                          )}
                        </td>
                      </tr>
                      {expandedRows[transaction.id] && transaction.order && (
                        <tr className="expanded-row">
                          <td colSpan="8">
                            <div className="expanded-content">
                              <h4>Order Details: {transaction.order.displayId}</h4>
                              <p><strong>Total Amount:</strong> {formatCurrency(transaction.order.totalAmount)}</p>
                              <p><strong>Items:</strong></p>
                              <ul>
                                {transaction.order.items.length > 0 ? (
                                  transaction.order.items.map((item, index) => (
                                    <li key={index}>
                                      {item.name || 'Item'} (Qty: {item.quantity || 1}) - {formatCurrency(item.price || 0)}
                                    </li>
                                  ))
                                ) : (
                                  <li>No items available</li>
                                )}
                              </ul>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-results">
                      {loading ? 'Loading...' : 'No transactions found matching your criteria.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'vendorCommission' && !selectedVendor && (
        <div className="vendor-commission-section">
          <div className="commission-header">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search vendors by name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input1"
              />
            </div>

            <button className="download-button" onClick={exportVendors}>
              <Download size={16} />
              Export Vendor Data
            </button>
          </div>

          <div className="vendor-cards-container">
            {filteredVendors.length > 0 ? (
              filteredVendors.map(vendor => (
                <div key={vendor.id} className="vendor-card">
                  <div className="vendor-card-header">
                    <div className="vendor-icon">
                      <Store size={24} />
                    </div>
                    <h3>{vendor.name}</h3>
                    <div className="vendor-category">{vendor.category}</div>
                  </div>

                  <div className="vendor-card-body">
                    <div className="vendor-contact">
                      <div className="vendor-address">
                        <Map size={16} />
                        <span>{vendor.address}</span>
                      </div>
                      {vendor.phone && (
                        <div className="vendor-phone">
                          <Phone size={16} />
                          <span>{vendor.phone}</span>
                        </div>
                      )}
                      {vendor.email && (
                        <div className="vendor-email">
                          <Mail size={16} />
                          <span>{vendor.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="vendor-stats">
                      <div className="stat">
                        <span className="stat-label">Commission Rate</span>
                        <span className="stat-value">{vendor.commissionRate}%</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Total Orders</span>
                        <span className="stat-value">{vendor.totalOrders}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Total Revenue</span>
                        <span className="stat-value">{formatCurrency(vendor.totalRevenue)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="vendor-card-footer">
                    <button
                      className="view-vendor-button"
                      onClick={() => handleViewVendor(vendor)}
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-vendors">
                <p>{loading ? 'Loading vendors...' : 'No vendors found matching your criteria.'}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vendor Detail View */}
      {activeTab === 'vendorCommission' && selectedVendor && (
        <div className="vendor-detail-section">
          <div className="vendor-detail-header">
            <button className="back-button" onClick={handleBackToVendorList}>
              <ChevronLeft size={16} />
              Back to Vendors
            </button>
            <h2>{selectedVendor.name}</h2>
            <button className="download-button" onClick={exportVendorDetails}>
              <Download size={16} />
              Export Details
            </button>
          </div>

          {vendorDetailsLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading vendor details...</p>
            </div>
          ) : (
            <>
              <div className="vendor-detail-overview">
                <div className="vendor-profile">
                  <div className="vendor-profile-header">
                    <Store size={24} className="vendor-icon" />
                    <div className="vendor-info">
                      <h3>{selectedVendor.name}</h3>
                      <div className="vendor-category">{selectedVendor.category}</div>
                    </div>
                  </div>

                  <div className="vendor-contact-details">
                    <div className="detail-item">
                      <Map size={16} />
                      <span>{selectedVendor.address}</span>
                    </div>
                    {selectedVendor.phone && (
                      <div className="detail-item">
                        <Phone size={16} />
                        <span>{selectedVendor.phone}</span>
                      </div>
                    )}
                    {selectedVendor.email && (
                      <div className="detail-item">
                        <Mail size={16} />
                        <span>{selectedVendor.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="vendor-stats-cards">
                  <div className="stat-card orders">
                    <div className="stat-icon">
                      <Package size={24} />
                    </div>
                    <div className="stat-content">
                      <span className="stat-value">{selectedVendor.totalOrders}</span>
                      <span className="stat-label">Total Orders</span>
                    </div>
                  </div>

                  <div className="stat-card revenue">
                    <div className="stat-icon">
                      <span style={{ fontSize: '24px', fontWeight: 'bold' }}>₹</span>
                    </div>
                    <div className="stat-content">
                      <span className="stat-value">{formatCurrency(selectedVendor.totalRevenue)}</span>
                      <span className="stat-label">Total Revenue</span>
                    </div>
                  </div>

                  <div className="stat-card commission">
                    <div className="stat-icon">
                      <Percent size={24} />
                    </div>
                    <div className="stat-content">
                      <span className="stat-value">{selectedVendor.commissionRate}%</span>
                      <span className="stat-label">Commission Rate</span>
                    </div>
                  </div>

                  <div className="stat-card profit">
                    <div className="stat-icon">
                      <TrendingUp size={24} />
                    </div>
                    <div className="stat-content">
                      <span className="stat-value">{formatCurrency(selectedVendor.totalProfit || 0)}</span>
                      <span className="stat-label">Total Profit</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="vendor-items-section">
                <div className="section-header-with-filters">
                  <h3>Items Sold</h3>
                  <div className="items-filters">
                    <div className="filter-group">
                      <label>Sort by:</label>
                      <select
                        value={itemsSortBy}
                        onChange={(e) => setItemsSortBy(e.target.value)}
                        className="filter-select"
                      >
                        <option value="quantity">Quantity Sold</option>
                        <option value="profit">Total Profit</option>
                        <option value="name">Item Name</option>
                      </select>
                    </div>
                    <button
                      className={`sort-order-btn ${itemsSortOrder}`}
                      onClick={() => setItemsSortOrder(itemsSortOrder === 'asc' ? 'desc' : 'asc')}
                      title={itemsSortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
                    >
                      {itemsSortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
                    </button>
                  </div>
                </div>

                {displayedVendorItems.length > 0 ? (
                  <div className="vendor-items-table-container">
                    <table className="vendor-items-table">
                      <thead>
                        <tr>
                          <th>Item Name</th>
                          <th>Quantity Sold</th>
                          <th>Base Price</th>
                          <th>Vendor Price</th>
                          <th>Selling Price</th>
                          <th>Total Vendor Price</th>
                          <th>Total Profit</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedVendorItems.map((item, index) => (
                          <tr key={index} className="item-row">
                            <td className="item-name">{item.name}</td>
                            <td>
                              <span className="quantity-badge">{item.quantity}</span>
                            </td>
                            <td>{formatCurrency(item.basePrice)}</td>
                            <td>{formatCurrency(item.vendorPrice)}</td>
                            <td>{formatCurrency(item.sellingPrice)}</td>
                            <td>{formatCurrency(item.totalVendorPrice)}</td>
                            <td className="profit-cell">
                              <span className={`profit-amount ${item.totalProfit >= 0 ? 'positive' : 'negative'}`}>
                                {formatCurrency(item.totalProfit)}
                              </span>
                            </td>
                            <td>
                              <button
                                className={`pay-button ${paidItems[item.id] ? 'paid' : ''}`}
                                onClick={() => !paidItems[item.id] && handlePayment(item)}
                                disabled={processingPayments[item.id]}
                              >
                                {processingPayments[item.id] ? (
                                  <span className="processing-indicator">
                                    <RefreshCw size={14} className="spinning" /> Processing...
                                  </span>
                                ) : paidItems[item.id] ? (
                                  <span className="success-indicator">
                                    <CheckCircle size={14} /> Paid
                                  </span>
                                ) : (
                                  <span className="pay-indicator">
                                    <Send size={14} /> Pay
                                  </span>
                                )}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="5" className="total-label">Total </td>
                          <td className="total-value">
                            {formatCurrency(displayedVendorItems.reduce((sum, item) => sum + (item.totalVendorPrice || 0), 0))}
                          </td>
                          <td className="total-value">
                            <span className={`profit-amount ${displayedVendorItems.reduce((sum, item) => sum + (item.totalProfit || 0), 0) >= 0 ? 'positive' : 'negative'}`}>
                              {formatCurrency(displayedVendorItems.reduce((sum, item) => sum + (item.totalProfit || 0), 0))}
                            </span>
                          </td>
                          <td className="total-value">
                            {/* Pay All button could be implemented here */}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <div className="no-items-message">
                    <p>No items have been sold by this vendor yet.</p>
                  </div>
                )}
              </div>

              <div className="vendor-orders-section">
                <div className="section-header-with-filters">
                  <h3>Recent Orders</h3>
                  <div className="orders-filters">
                    <div className="filter-group">
                      <label>Filter by date:</label>
                      <select
                        value={ordersDateFilter}
                        onChange={(e) => setOrdersDateFilter(e.target.value)}
                        className="filter-select"
                      >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">Last 7 Days</option>
                        <option value="month">Last 30 Days</option>
                      </select>
                    </div>
                    <div className="filter-group">
                      <label>Sort by:</label>
                      <select
                        value={ordersSortBy}
                        onChange={(e) => setOrdersSortBy(e.target.value)}
                        className="filter-select"
                      >
                        <option value="date">Date</option>
                        <option value="amount">Amount</option>
                        <option value="customer">Customer</option>
                      </select>
                    </div>
                    <button
                      className={`sort-order-btn ${ordersSortOrder}`}
                      onClick={() => setOrdersSortOrder(ordersSortOrder === 'asc' ? 'desc' : 'asc')}
                      title={ordersSortOrder === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
                    >
                      {ordersSortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
                    </button>
                  </div>
                </div>

                {displayedVendorOrders.length > 0 ? (
                  <div className="vendor-orders-table-container">
                    <table className="vendor-orders-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Date</th>
                          <th>Customer</th>
                          <th>Items</th>
                          <th>Total Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedVendorOrders.slice(0, 10).map((order) => (
                          <tr key={order.id} className="order-row">
                            <td><span className="order-id-badge">{order.displayId}</span></td>
                            <td>{formatDate(order.orderDate)}</td>
                            <td>{order.customer?.fullName || 'Unknown'}</td>
                            <td>
                              <span className="items-count">{order.items ? `${order.items.length} items` : 'No items'}</span>
                            </td>
                            <td className="amount-cell">{formatCurrency(calculateAmountWithoutTax(order))}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {displayedVendorOrders.length > 10 && (
                      <div className="view-more-orders">
                        <p>Showing 10 of {displayedVendorOrders.length} orders</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="no-orders-message">
                    <p>No orders found for the selected criteria.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Edit Commission Modal */}
      {isEditModalOpen && editingVendor && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Edit Commission Rate</h3>
              <button
                className="close-button"
                onClick={() => setIsEditModalOpen(false)}
              >
                <XCircle size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p><strong>Vendor:</strong> {editingVendor.name}</p>
              <p><strong>Category:</strong> {editingVendor.category}</p>
              <p><strong>Current Commission Rate:</strong> {editingVendor.commissionRate}%</p>

              <div className="commission-input">
                <label htmlFor="commission-rate">New Commission Rate (%)</label>
                <div className="rate-input-container">
                  <input
                    id="commission-rate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={editCommissionRate}
                    onChange={(e) => setEditCommissionRate(e.target.value)}
                  />
                  <span className="percent-symbol">%</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="cancel-button"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="save-button"
                onClick={handleUpdateCommission}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentCommission;