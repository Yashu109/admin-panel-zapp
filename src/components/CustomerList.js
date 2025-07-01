import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { ref, onValue } from 'firebase/database';
import {
  FaUser,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaShoppingBag,
  FaCalendarAlt,
  FaSort,
  FaSortAmountDown,
  FaSortAmountUp,
  FaSearch,
  FaEye
} from 'react-icons/fa';
import '../styles/CustomerList.css';

const CustomerList = () => {
  // State for customers
  const [customers, setCustomers] = useState([]);
  
  // State for filtered customers
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  
  // State for loading
  const [loading, setLoading] = useState(true);
  
  // State for error
  const [error, setError] = useState('');
  
  // State for search term
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for sorting
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // State for area filter
  const [areaFilter, setAreaFilter] = useState('all');
  
  // State for unique areas
  const [areas, setAreas] = useState(['all']);
  
  // State for expanded customer details
  const [expandedCustomerId, setExpandedCustomerId] = useState(null);

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

  // Fetch customers from Firebase
  useEffect(() => {
    const ordersRef = ref(db, 'orders');
    
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      setLoading(true);
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
              new Date(b.date) - new Date(a.date)
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
        setError('Failed to load customers data.');
        setCustomers([]);
        setFilteredCustomers([]);
      } finally {
        setLoading(false);
      }
    }, (err) => {
      console.error('Error fetching customers:', err);
      setError('Failed to load customers data.');
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...customers];
    
    // Apply area filter
    if (areaFilter !== 'all') {
      filtered = filtered.filter(customer => customer.area === areaFilter);
    }
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
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
          comparison = new Date(b.lastOrderDate) - new Date(a.lastOrderDate);
          break;
        case 'area':
          comparison = a.area.localeCompare(b.area);
          break;
        case 'customer':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'amount':
          comparison = b.totalSpent - a.totalSpent;
          break;
        case 'orders':
          comparison = b.totalOrders - a.totalOrders;
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? -comparison : comparison;
    });
    
    setFilteredCustomers(filtered);
  }, [customers, searchTerm, areaFilter, sortBy, sortDirection]);

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

  // Format date
  const formatDate = (dateString) => {
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
    }).format(amount);
  };

  // Toggle expanded customer details
  const toggleExpandCustomer = (customerId) => {
    if (expandedCustomerId === customerId) {
      setExpandedCustomerId(null);
    } else {
      setExpandedCustomerId(customerId);
    }
  };

  // Render loading state
  if (loading && customers.length === 0) {
    return (
      <div className="customer-list-loading">
        <div className="spinner"></div>
        <p>Loading customers data...</p>
      </div>
    );
  }

  return (
    <div className="customer-list-container">
      <div className="customer-list-header">
        <h2>Customer List</h2>
        <p>Total Customers: {filteredCustomers.length}</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="customer-filters">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, phone or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
          className={`sort-button ${sortBy === 'customer' ? 'active' : ''}`}
          onClick={() => handleSortChange('customer')}
        >
          Customer Name {sortBy === 'customer' && (
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
                  <h3>{customer.name}</h3>
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
                  <span>{customer.phone}</span>
                </div>
                
                <div className="customer-info-item">
                  <FaEnvelope className="info-icon" />
                  <span>{customer.email}</span>
                </div>
                
                <div className="customer-info-item">
                  <FaMapMarkerAlt className="info-icon" />
                  <span>{customer.area}</span>
                </div>
                
                <div className="customer-info-item">
                  <FaShoppingBag className="info-icon" />
                  <span>{customer.totalOrders} orders</span>
                </div>
                
                <div className="customer-info-item">
                  <strong>Total Spent:</strong>
                  <span>{formatCurrency(customer.totalSpent)}</span>
                </div>
                
                <div className="customer-info-item">
                  <FaCalendarAlt className="info-icon" />
                  <span>Last order: {formatDate(customer.lastOrderDate)}</span>
                </div>
              </div>
              
              <div className="customer-address">
                <FaMapMarkerAlt className="address-icon" />
                <span>{customer.address}</span>
              </div>
              
              {expandedCustomerId === customer.id && (
                <div className="customer-orders">
                  <h4>Order History ({customer.orders.length})</h4>
                  
                  <div className="orders-list">
                    {customer.orders.map((order, index) => (
                      <div key={index} className="order-item">
                        <div className="order-header">
                          <div className="order-id">Order #{order.id.substring(0, 8)}</div>
                          <div className="order-date">{formatDate(order.date)}</div>
                          <div className="order-amount">{formatCurrency(order.totalAmount)}</div>
                          <div className={`order-status status-${order.status}`}>
                            {order.status}
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
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{formatCurrency(item.price * item.quantity)}</td>
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
  );
};

export default CustomerList;