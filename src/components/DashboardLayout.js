// import React, { useState, useEffect } from 'react';
// import { 
//   Package, 
//   Store, 
//   Truck, 
//   CreditCard, 
//   MessageSquare, 
//   BarChart, 
//   Menu, 
//   X, 
//   LogOut, 
//   User,
//   Bell,
//   Search,
//   Star
// } from 'lucide-react';
// import { ref, onValue } from 'firebase/database';
// import { db } from '../firebase/config';
// import '../styles/DashboardLayout.css';
// import { Link } from 'react-router-dom';

// const DashboardLayout = ({ children, onLogout }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
//   const navItems = [
//     { title: 'Order Management', icon: <Package className="w-5 h-5" />, path: '/orders' },
//     { title: 'Shop Partner Dashboard', icon: <Store className="w-5 h-5" />, path: '/partners' },
//     { title: 'Delivery Management', icon: <Truck className="w-5 h-5" />, path: '/delivery' },
//     { title: 'Payment & Commission', icon: <CreditCard className="w-5 h-5" />, path: '/payments' },
//     { title: 'Customer Support', icon: <MessageSquare className="w-5 h-5" />, path: '/support' },
//     { title: 'Reports & Analytics', icon: <BarChart className="w-5 h-5" />, path: '/analytics' },
//   ];
  
//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };
  
//   const toggleMobileSidebar = () => {
//     setMobileSidebarOpen(!mobileSidebarOpen);
//   };
  
//   // Get current path for highlighting active nav item
//   const currentPath = window.location.pathname;
  
//   return (
//     <div className="dashboard-container">
//       {/* Mobile Sidebar Backdrop */}
//       {mobileSidebarOpen && (
//         <div 
//           className="sidebar-backdrop show" 
//           onClick={() => setMobileSidebarOpen(false)}
//         ></div>
//       )}
      
//       {/* Sidebar */}
//       <div 
//         className={`sidebar ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'} ${mobileSidebarOpen ? 'open' : ''}`}
//       >
//         <div className="sidebar-header">
//           <h1 className={`sidebar-logo ${!sidebarOpen && 'hidden'}`}>Admin Panel</h1>
//           <button 
//             onClick={toggleSidebar} 
//             className="sidebar-toggle"
//           >
//             {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//           </button>
//         </div>
        
//         <div className="sidebar-content">
//           <nav className="sidebar-nav">
//             {navItems.map((item, index) => (
//               <a 
//                 key={index} 
//                 href={item.path}
//                 className={`nav-item ${currentPath === item.path ? 'active' : ''}`}
//               >
//                 <span className="nav-icon">{item.icon}</span>
//                 <span className={`nav-text ${!sidebarOpen && 'hidden'}`}>{item.title}</span>
//               </a>
//             ))}
//           </nav>
//         </div>
        
//         <div className="sidebar-footer">
//           <div className="user-info">
//             <div className="user-avatar">
//               <User className="w-5 h-5" />
//             </div>
//             <div className={`user-details ${!sidebarOpen && 'hidden'}`}>
//               <p className="user-name">Admin User</p>
//               <p className="user-role">Administrator</p>
//             </div>
//           </div>
          
//           <button 
//             onClick={onLogout}
//             className="logout-button"
//           >
//             <LogOut className="logout-icon" />
//             <span className={!sidebarOpen ? 'hidden' : ''}>Logout</span>
//           </button>
//         </div>
//       </div>
      
//       {/* Main Content */}
//       <div className={`main-content ${sidebarOpen ? 'content-expanded' : 'content-collapsed'}`}>
//         {/* Header */}
//         <header className="header">
//           <div className="header-left">
//             <button className="mobile-menu-button" onClick={toggleMobileSidebar}>
//               <Menu className="w-6 h-6" />
//             </button>
            
//             <h1 className="page-title">
//               <a href="/dashboard" className="dashboard-link">Dashboard</a>
//             </h1>
            
//             <div className="breadcrumb">
//               <div className="breadcrumb-item">
//                 <a href="/dashboard" className="breadcrumb-link">Home</a>
//               </div>
//               <span className="breadcrumb-separator">/</span>
//               <div className="breadcrumb-item">
//                 <a href="/dashboard" className="breadcrumb-link">Dashboard</a>
//               </div>
//             </div>
//           </div>
          
//           <div className="header-right">
//             <div className="relative max-w-xs mr-4 hidden md:block">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
//               />
//             </div>
            
//             <button className="header-icon-button">
//               <Bell className="w-5 w-5" />
//               <span className="notification-badge"></span>
//             </button>
            
//             <button className="header-icon-button ml-2">
//               <User className="w-5 h-5" />
//             </button>
//           </div>
//         </header>
        
//         {/* Page Content */}
//         <main className="page-content">
//           {children || <DashboardHome />}
//         </main>
//       </div>
//     </div>
//   );
// };

// const DashboardHome = () => {
//   const [stats, setStats] = useState([
//     { title: 'Total Orders', value: '0', change: '0%', changeType: 'neutral' },
//     { title: 'Active Vendors', value: '0', change: '0%', changeType: 'neutral' },
//     // { title: 'Pending Deliveries', value: '0', change: '0%', changeType: 'neutral' },
//     { title: 'Revenue', value: '₹0', change: '0%', changeType: 'neutral' },
//   ]);
//   const [recentOrders, setRecentOrders] = useState([]);
//   const [topVendors, setTopVendors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [orderIdMap, setOrderIdMap] = useState({});

//   // Fetch orders and shops from Firebase
//   useEffect(() => {
//     const ordersRef = ref(db, 'orders');
//     const shopsRef = ref(db, 'shops');

//     let ordersData = [];
//     let shopsData = [];

//     // Generate order ID mapping
//     const generateOrderIdMap = (orders) => {
//       const idMap = {};
//       orders.forEach((order, index) => {
//         idMap[order.id] = `ORD-${index + 1}`;
//       });
//       return idMap;
//     };

//     // Fetch orders
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
        
//         // Generate and set order ID mapping
//         const idMap = generateOrderIdMap(ordersData);
//         setOrderIdMap(idMap);
        
//         processData(ordersData, shopsData);
//       } catch (err) {
//         console.error('Error fetching orders:', err);
//         setError('Failed to load dashboard data.');
//         setLoading(false);
//       }
//     }, (err) => {
//       console.error('Error fetching orders:', err);
//       setError('Failed to load dashboard data.');
//       setLoading(false);
//     });

//     // Fetch shops
//     const shopsUnsubscribe = onValue(shopsRef, (snapshot) => {
//       try {
//         const data = snapshot.val();
//         shopsData = data ? Object.keys(data).map(key => ({
//           id: key,
//           ...data[key]
//         })) : [];
//         processData(ordersData, shopsData);
//       } catch (err) {
//         console.error('Error fetching shops:', err);
//         setError('Failed to load dashboard data.');
//         setLoading(false);
//       }
//     }, (err) => {
//       console.error('Error fetching shops:', err);
//       setError('Failed to load dashboard data.');
//       setLoading(false);
//     });

//     // Process data to update stats, recent orders, and top vendors
//     const processData = (orders, shops) => {
//       try {
//         // Calculate stats
//         const totalOrders = orders.length;
//         const activeVendors = shops.filter(s => s.status === 'active').length;
//         const pendingDeliveries = orders.filter(o => o.status === 'out_for_delivery' || o.status === 'preparing').length;
//         const revenue = orders
//           .filter(o => o.status === 'delivered')
//           .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

//         // Calculate changes (mock previous month data for simplicity)
//         const currentMonth = new Date().getMonth();
//         const currentYear = new Date().getFullYear();
//         const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
//         const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

//         const currentMonthOrders = orders.filter(o => {
//           const orderDate = new Date(o.orderDate);
//           return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
//         });
//         const lastMonthOrders = orders.filter(o => {
//           const orderDate = new Date(o.orderDate);
//           return orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastMonthYear;
//         });

//         const currentMonthRevenue = currentMonthOrders
//           .filter(o => o.status === 'delivered')
//           .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
//         const lastMonthRevenue = lastMonthOrders
//           .filter(o => o.status === 'delivered')
//           .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

//         const revenueChange = lastMonthRevenue > 0
//           ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
//           : currentMonthRevenue > 0 ? 100 : 0;

//         const currentMonthOrderCount = currentMonthOrders.length;
//         const lastMonthOrderCount = lastMonthOrders.length;
//         const orderChange = lastMonthOrderCount > 0
//           ? ((currentMonthOrderCount - lastMonthOrderCount) / lastMonthOrderCount * 100).toFixed(1)
//           : currentMonthOrderCount > 0 ? 100 : 0;

//         const currentMonthVendors = new Set(currentMonthOrders.map(o => o.vendor?.id)).size;
//         const lastMonthVendors = new Set(lastMonthOrders.map(o => o.vendor?.id)).size;
//         const vendorChange = lastMonthVendors > 0
//           ? ((currentMonthVendors - lastMonthVendors) / lastMonthVendors * 100).toFixed(1)
//           : currentMonthVendors > 0 ? 100 : 0;

//         const currentMonthPending = currentMonthOrders.filter(o => o.status === 'out_for_delivery' || o.status === 'preparing').length;
//         const lastMonthPending = lastMonthOrders.filter(o => o.status === 'out_for_delivery' || o.status === 'preparing').length;
//         const pendingChange = lastMonthPending > 0
//           ? ((currentMonthPending - lastMonthPending) / lastMonthPending * 100).toFixed(1)
//           : currentMonthPending > 0 ? 100 : 0;

//         const formatCurrency = (amount) => {
//           return new Intl.NumberFormat('en-IN', {
//             style: 'currency',
//             currency: 'INR',
//             minimumFractionDigits: 2
//           }).format(amount);
//         };

//         setStats([
//           {
//             title: 'Total Orders',
//             value: totalOrders.toLocaleString(),
//             change: `${orderChange > 0 ? '+' : ''}${orderChange}%`,
//             changeType: orderChange > 0 ? 'positive' : orderChange < 0 ? 'negative' : 'neutral'
//           },
//           {
//             title: 'Active Vendors',
//             value: activeVendors.toLocaleString(),
//             change: `${vendorChange > 0 ? '+' : ''}${vendorChange}%`,
//             changeType: vendorChange > 0 ? 'positive' : vendorChange < 0 ? 'negative' : 'neutral'
//           },
//           // {
//           //   title: 'Pending Deliveries',
//           //   value: pendingDeliveries.toLocaleString(),
//           //   change: `${pendingChange > 0 ? '+' : ''}${pendingChange}%`,
//           //   changeType: pendingChange > 0 ? 'positive' : pendingChange < 0 ? 'negative' : 'neutral'
//           // },
//           {
//             title: 'Revenue',
//             value: formatCurrency(revenue),
//             change: `${revenueChange > 0 ? '+' : ''}${revenueChange}%`,
//             changeType: revenueChange > 0 ? 'positive' : revenueChange < 0 ? 'negative' : 'neutral'
//           }
//         ]);

//         // Get recent orders (last 3, sorted by date descending)
//         const sortedOrders = orders
//           .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
//           .slice(0, 3)
//           .map(order => {
//             const shopInfo = shops.find(s => s.id === order.vendor?.id);
//             return {
//               id: order.id,
//               displayId: orderIdMap[order.id] || `ORD-${orders.indexOf(order) + 1}`,
//               date: order.orderDate,
//               amount: order.totalAmount || 0,
//               status: order.status,
//               shopName: shopInfo?.name || order.vendor?.name || 'Unknown'
//             };
//           });

//         setRecentOrders(sortedOrders);

//         // Calculate top vendors (top 2 by revenue in current month)
//         // Use actual shops from Firebase instead of hardcoded vendors
//         const vendorRevenue = shops
//           .filter(shop => shop.status === 'active') // Only include active shops
//           .map(shop => {
//             const shopOrders = currentMonthOrders
//               .filter(o => o.vendor?.id === shop.id && o.status === 'delivered');
//             const revenue = shopOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
//             const orderCount = shopOrders.length;
//             return {
//               id: shop.id,
//               name: shop.name,
//               orderCount,
//               revenue,
//               rating: shop.rating || 4.0 // Default rating if not available
//             };
//           })
//           .filter(v => v.orderCount > 0)
//           .sort((a, b) => b.revenue - a.revenue)
//           .slice(0, 2);

//         setTopVendors(vendorRevenue);

//         setLoading(false);
//       } catch (err) {
//         console.error('Error processing data:', err);
//         setError('Failed to process dashboard data.');
//         setLoading(false);
//       }
//     };

//     // Cleanup listeners on unmount
//     return () => {
//       ordersUnsubscribe();
//       shopsUnsubscribe();
//     };
//   }, []);

//   // Format date for display
//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
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

//   // Get status class
//   const getStatusClass = (status) => {
//     switch (status) {
//       case 'delivered':
//         return 'completed';
//       case 'out_for_delivery':
//         return 'in-transit';
//       case 'preparing':
//       case 'processing':
//         return 'processing';
//       default:
//         return status;
//     }
//   };

//   // Get status text
//   const getStatusText = (status) => {
//     switch(status) {
//       case 'delivered': return 'Completed';
//       case 'out_for_delivery': return 'In Transit'; 
//       case 'processing': return 'Processing';
//       case 'preparing': return 'Processing';
//       case 'pending': return 'Pending';
//       case 'cancelled': return 'Cancelled';
//       default: return status.charAt(0).toUpperCase() + status.slice(1);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {error && <div className="error-message">{error}</div>}
//       {loading && <div className="loading-message">Loading dashboard...</div>}

//       <div className="overview">
//         <h2>Overview</h2>
      
//         <div className="dashboard-cards">
//           {stats.map((stat, index) => (
//             <div key={index} className="dashboard-card">
//               <h3 className="card-title">{stat.title}</h3>
//               <p className="card-value">{stat.value}</p>
//               <div className={`card-change ${stat.changeType === 'positive' ? 'card-change-positive' : stat.changeType === 'negative' ? 'card-change-negative' : 'card-change-neutral'}`}>
//                 <span>{stat.change} since last month</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
      
//       <div className="dashboard-grid">
//         <div className="grid-col-8">
//           <div className="dashboard-widget">
//             <div className="widget-header">
//               <h3 className="widget-title">Recent Orders</h3>
//               <div className="widget-actions">
//                 <a href="/orders" className="widget-action-button">View All</a>
//               </div>
//             </div>
//             <div className="widget-content">
//               <div className="order-list">
//                 {recentOrders.length > 0 ? (
//                   recentOrders.map((order, index) => (
//                     <div key={index} className={`order-item ${getStatusClass(order.status)}`}>
//                       <div className="order-info">
//                         <div className="order-icon">
//                           <Package className="h-5 w-5" />
//                         </div>
//                         <div className="order-details">
//                           <h3>{order.displayId}</h3>
//                           <div className="order-meta">
//                             {formatDate(order.date)} <span className="order-price">{formatCurrency(order.amount)}</span>
//                           </div>
//                           <div className="order-shop">{order.shopName}</div>
//                         </div>
//                       </div>
//                       <button className={`order-status-button status-${getStatusClass(order.status)}`}>
//                         {getStatusText(order.status)}
//                       </button>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="no-orders">No recent orders found.</div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <div className="grid-col-4">
//           <div className="dashboard-widget">
//             <div className="widget-header">
//               <h3 className="widget-title">Top Vendors</h3>
//               <div className="widget-actions">
//                 <a href="/partners" className="widget-action-button">View All</a>
//               </div>
//             </div>
//             <div className="widget-content">
//               <div className="vendor-list">
//                 {topVendors.length > 0 ? (
//                   topVendors.map((vendor, index) => (
//                     <div key={index} className="vendor-item">
//                       <div className="vendor-info">
                        
//                         <div className="vendor-details">
//                           <h3>{vendor.name}</h3>
//                           <div className="vendor-meta">
//                             {vendor.orderCount} orders this month
//                             <div className="vendor-rating">
//                               <Star className="rating-icon" size={14} />
//                               <span>{vendor.rating.toFixed(1)}</span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="vendor-revenue">{formatCurrency(vendor.revenue)}</div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="no-vendors">No vendors with orders this month.</div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;
// export { DashboardHome };



import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Store, 
  Truck, 
  CreditCard, 
  MessageSquare, 
  BarChart, 
  Menu, 
  X, 
  LogOut, 
  User,
  Bell,
  Search,
  Star
} from 'lucide-react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase/config';
import '../styles/DashboardLayout.css';
import { Link, useLocation } from 'react-router-dom';
import NotificationIcon from './NotificationIcon';

const DashboardLayout = ({ children, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  
  const navItems = [
    { title: 'Order Management', icon: <Package className="w-5 h-5" />, path: '/orders' },
    { title: 'Shop Partner Dashboard', icon: <Store className="w-5 h-5" />, path: '/partners' },
    { title: 'Delivery Management', icon: <Truck className="w-5 h-5" />, path: '/delivery' },
    { title: 'Payment & Commission', icon: <CreditCard className="w-5 h-5" />, path: '/payments' },
    { title: 'Customer Support', icon: <MessageSquare className="w-5 h-5" />, path: '/support' },
    { title: 'Reports & Analytics', icon: <BarChart className="w-5 h-5" />, path: '/analytics' },
    { title: 'Notifications', icon: <Bell className="w-5 h-5" />, path: '/notifications' },
  ];
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };
  
  // Get current path for highlighting active nav item
  const currentPath = location.pathname;
  
  return (
    <div className="dashboard-container">
      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div 
          className="sidebar-backdrop show" 
          onClick={() => setMobileSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`sidebar ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'} ${mobileSidebarOpen ? 'open' : ''}`}
      >
        <div className="sidebar-header">
          <h1 className={`sidebar-logo ${!sidebarOpen && 'hidden'}`}>Admin Panel</h1>
          <button 
            onClick={toggleSidebar} 
            className="sidebar-toggle"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        
        <div className="sidebar-content">
          <nav className="sidebar-nav">
            {navItems.map((item, index) => (
              <Link 
                key={index} 
                to={item.path}
                className={`nav-item ${currentPath === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className={`nav-text ${!sidebarOpen && 'hidden'}`}>{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <User className="w-5 h-5" />
            </div>
            <div className={`user-details ${!sidebarOpen && 'hidden'}`}>
              <p className="user-name">Admin User</p>
              <p className="user-role">Administrator</p>
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            className="logout-button"
          >
            <LogOut className="logout-icon" />
            <span className={!sidebarOpen ? 'hidden' : ''}>Logout</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={`main-content ${sidebarOpen ? 'content-expanded' : 'content-collapsed'}`}>
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button className="mobile-menu-button" onClick={toggleMobileSidebar}>
              <Menu className="w-6 h-6" />
            </button>
            
            <h1 className="page-title">
              <Link to="/dashboard" className="dashboard-link">Dashboard</Link>
            </h1>
            
            <div className="breadcrumb">
              <div className="breadcrumb-item">
                <Link to="/dashboard" className="breadcrumb-link">Home</Link>
              </div>
              <span className="breadcrumb-separator">/</span>
              <div className="breadcrumb-item">
                <span className="breadcrumb-current">
                  {navItems.find(item => item.path === currentPath)?.title || 'Dashboard'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="header-right">
            <div className="relative max-w-xs mr-4 hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            
            {/* Replace the Bell icon with NotificationIcon component */}
            <NotificationIcon />
            
           
          </div>
        </header>
        
        {/* Page Content */}
        <main className="page-content">
          {children || <DashboardHome />}
        </main>
      </div>
    </div>
  );
};

const DashboardHome = () => {
  // Function to calculate amount without tax
  const calculateAmountWithoutTax = (order) => {
    return (order.subtotal || 0) + (order.deliveryCharge || 0);
  };

  const [stats, setStats] = useState([
    { title: 'Total Orders', value: '0', change: '0%', changeType: 'neutral' },
    { title: 'Active Vendors', value: '0', change: '0%', changeType: 'neutral' },
    // { title: 'Pending Deliveries', value: '0', change: '0%', changeType: 'neutral' },
    { title: 'Revenue', value: '₹0', change: '0%', changeType: 'neutral' },
  ]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topVendors, setTopVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderIdMap, setOrderIdMap] = useState({});

  // Fetch orders and shops from Firebase
  useEffect(() => {
    const ordersRef = ref(db, 'orders');
    const shopsRef = ref(db, 'shops');

    let ordersData = [];
    let shopsData = [];

    // Generate order ID mapping
    const generateOrderIdMap = (orders) => {
      const idMap = {};
      orders.forEach((order, index) => {
        idMap[order.id] = `ORD-${index + 1}`;
      });
      return idMap;
    };

    // Fetch orders
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
        
        // Generate and set order ID mapping
        const idMap = generateOrderIdMap(ordersData);
        setOrderIdMap(idMap);
        
        processData(ordersData, shopsData);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load dashboard data.');
        setLoading(false);
      }
    }, (err) => {
      console.error('Error fetching orders:', err);
      setError('Failed to load dashboard data.');
      setLoading(false);
    });

    // Fetch shops
    const shopsUnsubscribe = onValue(shopsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        shopsData = data ? Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })) : [];
        processData(ordersData, shopsData);
      } catch (err) {
        console.error('Error fetching shops:', err);
        setError('Failed to load dashboard data.');
        setLoading(false);
      }
    }, (err) => {
      console.error('Error fetching shops:', err);
      setError('Failed to load dashboard data.');
      setLoading(false);
    });

    // Process data to update stats, recent orders, and top vendors
    const processData = (orders, shops) => {
      try {
        // Calculate stats
        const totalOrders = orders.length;
        const activeVendors = shops.filter(s => s.status === 'active').length;
        const pendingDeliveries = orders.filter(o => o.status === 'out_for_delivery' || o.status === 'preparing').length;
        
        // Calculate revenue without tax
        const revenue = orders
          .filter(o => o.status === 'delivered')
          .reduce((sum, o) => sum + calculateAmountWithoutTax(o), 0);

        // Calculate changes (mock previous month data for simplicity)
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        const currentMonthOrders = orders.filter(o => {
          const orderDate = new Date(o.orderDate);
          return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
        });
        const lastMonthOrders = orders.filter(o => {
          const orderDate = new Date(o.orderDate);
          return orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastMonthYear;
        });

        // Calculate current and last month revenue without tax
        const currentMonthRevenue = currentMonthOrders
          .filter(o => o.status === 'delivered')
          .reduce((sum, o) => sum + calculateAmountWithoutTax(o), 0);
        const lastMonthRevenue = lastMonthOrders
          .filter(o => o.status === 'delivered')
          .reduce((sum, o) => sum + calculateAmountWithoutTax(o), 0);

        const revenueChange = lastMonthRevenue > 0
          ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
          : currentMonthRevenue > 0 ? 100 : 0;

        const currentMonthOrderCount = currentMonthOrders.length;
        const lastMonthOrderCount = lastMonthOrders.length;
        const orderChange = lastMonthOrderCount > 0
          ? ((currentMonthOrderCount - lastMonthOrderCount) / lastMonthOrderCount * 100).toFixed(1)
          : currentMonthOrderCount > 0 ? 100 : 0;

        const currentMonthVendors = new Set(currentMonthOrders.map(o => o.vendor?.id)).size;
        const lastMonthVendors = new Set(lastMonthOrders.map(o => o.vendor?.id)).size;
        const vendorChange = lastMonthVendors > 0
          ? ((currentMonthVendors - lastMonthVendors) / lastMonthVendors * 100).toFixed(1)
          : currentMonthVendors > 0 ? 100 : 0;

        const currentMonthPending = currentMonthOrders.filter(o => o.status === 'out_for_delivery' || o.status === 'preparing').length;
        const lastMonthPending = lastMonthOrders.filter(o => o.status === 'out_for_delivery' || o.status === 'preparing').length;
        const pendingChange = lastMonthPending > 0
          ? ((currentMonthPending - lastMonthPending) / lastMonthPending * 100).toFixed(1)
          : currentMonthPending > 0 ? 100 : 0;

        const formatCurrency = (amount) => {
          return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
          }).format(amount);
        };

        setStats([
          {
            title: 'Total Orders',
            value: totalOrders.toLocaleString(),
            change: `${orderChange > 0 ? '+' : ''}${orderChange}%`,
            changeType: orderChange > 0 ? 'positive' : orderChange < 0 ? 'negative' : 'neutral'
          },
          {
            title: 'Active Vendors',
            value: activeVendors.toLocaleString(),
            change: `${vendorChange > 0 ? '+' : ''}${vendorChange}%`,
            changeType: vendorChange > 0 ? 'positive' : vendorChange < 0 ? 'negative' : 'neutral'
          },
          // {
          //   title: 'Pending Deliveries',
          //   value: pendingDeliveries.toLocaleString(),
          //   change: `${pendingChange > 0 ? '+' : ''}${pendingChange}%`,
          //   changeType: pendingChange > 0 ? 'positive' : pendingChange < 0 ? 'negative' : 'neutral'
          // },
          {
            title: 'Revenue',
            value: formatCurrency(revenue),
            change: `${revenueChange > 0 ? '+' : ''}${revenueChange}%`,
            changeType: revenueChange > 0 ? 'positive' : revenueChange < 0 ? 'negative' : 'neutral'
          }
        ]);

        // Get recent orders (last 3, sorted by date descending)
        const sortedOrders = orders
          .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
          .slice(0, 3)
          .map(order => {
            const shopInfo = shops.find(s => s.id === order.vendor?.id);
            return {
              id: order.id,
              displayId: orderIdMap[order.id] || `ORD-${orders.indexOf(order) + 1}`,
              date: order.orderDate,
              amount: calculateAmountWithoutTax(order), // Changed to amount without tax
              status: order.status,
              shopName: shopInfo?.name || order.vendor?.name || 'Unknown'
            };
          });

        setRecentOrders(sortedOrders);

        // Calculate top vendors (top 2 by revenue in current month)
        // Use actual shops from Firebase instead of hardcoded vendors
        const vendorRevenue = shops
          .filter(shop => shop.status === 'active') // Only include active shops
          .map(shop => {
            const shopOrders = currentMonthOrders
              .filter(o => o.vendor?.id === shop.id && o.status === 'delivered');
            
            // Calculate revenue without tax
            const revenue = shopOrders.reduce((sum, o) => sum + calculateAmountWithoutTax(o), 0);
            const orderCount = shopOrders.length;
            return {
              id: shop.id,
              name: shop.name,
              orderCount,
              revenue,
              rating: shop.rating || 4.0 // Default rating if not available
            };
          })
          .filter(v => v.orderCount > 0)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 2);

        setTopVendors(vendorRevenue);

        setLoading(false);
      } catch (err) {
        console.error('Error processing data:', err);
        setError('Failed to process dashboard data.');
        setLoading(false);
      }
    };

    // Cleanup listeners on unmount
    return () => {
      ordersUnsubscribe();
      shopsUnsubscribe();
    };
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
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

  // Get status class
  const getStatusClass = (status) => {
    switch (status) {
      case 'delivered':
        return 'completed';
      case 'out_for_delivery':
        return 'in-transit';
      case 'preparing':
      case 'processing':
        return 'processing';
      default:
        return status;
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch(status) {
      case 'delivered': return 'Completed';
      case 'out_for_delivery': return 'In Transit'; 
      case 'processing': return 'Processing';
      case 'preparing': return 'Processing';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="space-y-6">
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Loading dashboard...</div>}

      <div className="overview">
        <h2>Overview</h2>
      
        <div className="dashboard-cards">
          {stats.map((stat, index) => (
            <div key={index} className="dashboard-card">
              <h3 className="card-title">{stat.title}</h3>
              <p className="card-value">{stat.value}</p>
              <div className={`card-change ${stat.changeType === 'positive' ? 'card-change-positive' : stat.changeType === 'negative' ? 'card-change-negative' : 'card-change-neutral'}`}>
                <span>{stat.change} since last month</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="dashboard-grid">
        <div className="grid-col-8">
          <div className="dashboard-widget">
            <div className="widget-header">
              <h3 className="widget-title">Recent Orders</h3>
              <div className="widget-actions">
                <Link to="/orders" className="widget-action-button">View All</Link>
              </div>
            </div>
            <div className="widget-content">
              <div className="order-list">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order, index) => (
                    <div key={index} className={`order-item ${getStatusClass(order.status)}`}>
                      <div className="order-info">
                        <div className="order-icon">
                          <Package className="h-5 w-5" />
                        </div>
                        <div className="order-details">
                          <h3>{order.displayId}</h3>
                          <div className="order-meta">
                            {formatDate(order.date)} <span className="order-price">{formatCurrency(order.amount)}</span>
                          </div>
                          <div className="order-shop">{order.shopName}</div>
                        </div>
                      </div>
                      <button className={`order-status-button status-${getStatusClass(order.status)}`}>
                        {getStatusText(order.status)}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="no-orders">No recent orders found.</div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid-col-4">
          <div className="dashboard-widget">
            <div className="widget-header">
              <h3 className="widget-title">Top Vendors</h3>
              <div className="widget-actions">
                <Link to="/partners" className="widget-action-button">View All</Link>
              </div>
            </div>
            <div className="widget-content">
              <div className="vendor-list">
                {topVendors.length > 0 ? (
                  topVendors.map((vendor, index) => (
                    <div key={index} className="vendor-item">
                      <div className="vendor-info">
                        
                        <div className="vendor-details">
                          <h3>{vendor.name}</h3>
                          <div className="vendor-meta">
                            {vendor.orderCount} orders this month
                            <div className="vendor-rating">
                              <Star className="rating-icon" size={14} />
                              <span>{vendor.rating.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="vendor-revenue">{formatCurrency(vendor.revenue)}</div>
                    </div>
                  ))
                ) : (
                  <div className="no-vendors">No vendors with orders this month.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
export { DashboardHome };