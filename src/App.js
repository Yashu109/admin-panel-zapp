// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// // Import components
// import Login from './components/Login';
// import DashboardLayout from './components/DashboardLayout';
// import OrderManagement from './components/OrderManagement';
// import ShopPartnerDashboard from './components/ShopPartnerDashboard';
// import DeliveryManagement from './components/DeliveryManagement';
// import PaymentCommission from './components/PaymentCommission';
// import CustomerSupport from './components/CustomerSupport';
// import ReportsAnalytics from './components/ReportsAnalytics';

// // Import CSS
// import './App.css';

// const App = () => {
//   // Simple authentication state (in a real app, this would use context/redux)
//   const [isAuthenticated, setIsAuthenticated] = React.useState(
//     localStorage.getItem('isAuthenticated') === 'true'
//   );

//   // Handle login
//   const handleLogin = (credentials) => {
//     console.log('Logging in with:', credentials);
//     // In a real app, you would validate credentials against an API
//     localStorage.setItem('isAuthenticated', 'true');
//     localStorage.setItem('user', JSON.stringify({
//       name: 'Admin User',
//       email: credentials.email,
//       role: 'Administrator'
//     }));
//     setIsAuthenticated(true);
//   };

//   // Handle logout
//   const handleLogout = () => {
//     localStorage.removeItem('isAuthenticated');
//     setIsAuthenticated(false);
//   };

//   // Protected route component
//   const ProtectedRoute = ({ children }) => {
//     if (!isAuthenticated) {
//       return <Navigate to="/login" />;
//     }
//     return children;
//   };

//   return (
//     <Router>
//       <Routes>
//         {/* Public routes */}
//         <Route 
//           path="/login" 
//           element={
//             isAuthenticated ? 
//             <Navigate to="/dashboard" /> : 
//             <Login onLogin={handleLogin} />
//           } 
//         />

//         {/* Protected routes */}
//         <Route 
//           path="/dashboard" 
//           element={
//             <ProtectedRoute>
//               <DashboardLayout onLogout={handleLogout} />
//             </ProtectedRoute>
//           } 
//         />

//         <Route 
//           path="/orders" 
//           element={
//             <ProtectedRoute>
//               <DashboardLayout onLogout={handleLogout}>
//                 <OrderManagement />
//               </DashboardLayout>
//             </ProtectedRoute>
//           } 
//         />

//         <Route 
//           path="/partners" 
//           element={
//             <ProtectedRoute>
//               <DashboardLayout onLogout={handleLogout}>
//                 <ShopPartnerDashboard />
//               </DashboardLayout>
//             </ProtectedRoute>
//           } 
//         />

//         <Route 
//           path="/delivery" 
//           element={
//             <ProtectedRoute>
//               <DashboardLayout onLogout={handleLogout}>
//                 <DeliveryManagement />
//               </DashboardLayout>
//             </ProtectedRoute>
//           } 
//         />

//         <Route 
//           path="/payments" 
//           element={
//             <ProtectedRoute>
//               <DashboardLayout onLogout={handleLogout}>
//                 <PaymentCommission />
//               </DashboardLayout>
//             </ProtectedRoute>
//           } 
//         />

//         <Route 
//           path="/support" 
//           element={
//             <ProtectedRoute>
//               <DashboardLayout onLogout={handleLogout}>
//                 <CustomerSupport />
//               </DashboardLayout>
//             </ProtectedRoute>
//           } 
//         />

//         <Route 
//           path="/analytics" 
//           element={
//             <ProtectedRoute>
//               <DashboardLayout onLogout={handleLogout}>
//                 <ReportsAnalytics />
//               </DashboardLayout>
//             </ProtectedRoute>
//           } 
//         />

//         {/* Redirect any unknown routes to dashboard if authenticated, login otherwise */}
//         <Route 
//           path="*" 
//           element={
//             isAuthenticated ? 
//             <Navigate to="/dashboard" /> : 
//             <Navigate to="/login" />
//           } 
//         />
//       </Routes>
//     </Router>
//   );
// };

// export default App;



// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// // Import components
// import Login from './components/Login';
// import DashboardLayout from './components/DashboardLayout';
// import OrderManagement from './components/OrderManagement';
// import ShopPartnerDashboard from './components/ShopPartnerDashboard';
// import DeliveryManagement from './components/DeliveryManagement';
// import PaymentCommission from './components/PaymentCommission';
// import CustomerSupport from './components/CustomerSupport';
// import ReportsAnalytics from './components/ReportsAnalytics';
// import Notifications from './components/Notifications';

// // Import CSS
// import './App.css';

// const App = () => {
//   // Simple authentication state (in a real app, this would use context/redux)
//   const [isAuthenticated, setIsAuthenticated] = React.useState(
//     localStorage.getItem('isAuthenticated') === 'true'
//   );

//   // Handle login
//   const handleLogin = (credentials) => {
//     console.log('Logging in with:', credentials);
//     // In a real app, you would validate credentials against an API
//     localStorage.setItem('isAuthenticated', 'true');
//     localStorage.setItem('user', JSON.stringify({
//       name: 'Admin User',
//       email: credentials.email,
//       role: 'Administrator'
//     }));
//     setIsAuthenticated(true);
//   };

//   // Handle logout
//   const handleLogout = () => {
//     localStorage.removeItem('isAuthenticated');
//     setIsAuthenticated(false);
//   };

//   // Protected route component
//   const ProtectedRoute = ({ children }) => {
//     if (!isAuthenticated) {
//       return <Navigate to="/login" />;
//     }
//     return children;
//   };

//   return (
//     <Router>
//       <Routes>
//         {/* Public routes */}
//         <Route 
//           path="/login" 
//           element={
//             isAuthenticated ? 
//             <Navigate to="/dashboard" /> : 
//             <Login onLogin={handleLogin} />
//           } 
//         />

//         {/* Protected routes */}
//         <Route 
//           path="/dashboard" 
//           element={
//             <ProtectedRoute>
//               <DashboardLayout onLogout={handleLogout} />
//             </ProtectedRoute>
//           } 
//         />

//         <Route 
//           path="/orders" 
//           element={
//             <ProtectedRoute>
//               <DashboardLayout onLogout={handleLogout}>
//                 <OrderManagement />
//               </DashboardLayout>
//             </ProtectedRoute>
//           } 
//         />

//         <Route 
//           path="/partners" 
//           element={
//             <ProtectedRoute>
//               <DashboardLayout onLogout={handleLogout}>
//                 <ShopPartnerDashboard />
//               </DashboardLayout>
//             </ProtectedRoute>
//           } 
//         />

//         <Route 
//           path="/delivery" 
//           element={
//             <ProtectedRoute>
//               <DashboardLayout onLogout={handleLogout}>
//                 <DeliveryManagement />
//               </DashboardLayout>
//             </ProtectedRoute>
//           } 
//         />

//         <Route 
//           path="/payments" 
//           element={
//             <ProtectedRoute>
//               <DashboardLayout onLogout={handleLogout}>
//                 <PaymentCommission />
//               </DashboardLayout>
//             </ProtectedRoute>
//           } 
//         />

//         <Route 
//           path="/support" 
//           element={
//             <ProtectedRoute>
//               <DashboardLayout onLogout={handleLogout}>
//                 <CustomerSupport />
//               </DashboardLayout>
//             </ProtectedRoute>
//           } 
//         />

//         <Route 
//           path="/analytics" 
//           element={
//             <ProtectedRoute>
//               <DashboardLayout onLogout={handleLogout}>
//                 <ReportsAnalytics />
//               </DashboardLayout>
//             </ProtectedRoute>
//           } 
//         />
        
//         {/* Add new Notifications route */}
//         <Route 
//           path="/notifications" 
//           element={
//             <ProtectedRoute>
//               <DashboardLayout onLogout={handleLogout}>
//                 <Notifications />
//               </DashboardLayout>
//             </ProtectedRoute>
//           } 
//         />

//         {/* Redirect any unknown routes to dashboard if authenticated, login otherwise */}
//         <Route 
//           path="*" 
//           element={
//             isAuthenticated ? 
//             <Navigate to="/dashboard" /> : 
//             <Navigate to="/login" />
//           } 
//         />
//       </Routes>
//     </Router>
//   );
// };

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import components
import Login from './components/Login';
import DashboardLayout from './components/DashboardLayout';
import OrderManagement from './components/OrderManagement';
import ShopPartnerDashboard from './components/ShopPartnerDashboard';
import DeliveryManagement from './components/DeliveryManagement';
import PaymentCommission from './components/PaymentCommission';
import CustomerSupport from './components/CustomerSupport';
import ReportsAnalytics from './components/ReportsAnalytics';
import Notifications from './components/Notifications';

// Import notification context
import { NotificationProvider } from './components/NotificationContext';

// Import CSS
import './App.css';

const App = () => {
  // Simple authentication state (in a real app, this would use context/redux)
  const [isAuthenticated, setIsAuthenticated] = React.useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  // Handle login
  const handleLogin = (credentials) => {
    console.log('Logging in with:', credentials);
    // In a real app, you would validate credentials against an API
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify({
      name: 'Admin User',
      email: credentials.email,
      role: 'Administrator'
    }));
    setIsAuthenticated(true);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  // Protected route component with NotificationProvider
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return (
      <NotificationProvider>
        {children}
      </NotificationProvider>
    );
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" /> : 
            <Login onLogin={handleLogin} />
          } 
        />

        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout}>
                <OrderManagement />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/partners" 
          element={
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout}>
                <ShopPartnerDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/delivery" 
          element={
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout}>
                <DeliveryManagement />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/payments" 
          element={
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout}>
                <PaymentCommission />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/support" 
          element={
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout}>
                <CustomerSupport />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout}>
                <ReportsAnalytics />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Add new Notifications route */}
        <Route 
          path="/notifications" 
          element={
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout}>
                <Notifications />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        {/* Redirect any unknown routes to dashboard if authenticated, login otherwise */}
        <Route 
          path="*" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" /> : 
            <Navigate to="/login" />
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;