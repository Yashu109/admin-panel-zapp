import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Calendar, 
  User, 
  MapPin, 
  Package, 
  Truck, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  FileText,
  Phone,
  DollarSign,
  Send
} from 'lucide-react';
import '../styles/OrderDetails.css'; // Assuming you have a CSS file for styling

const OrderDetails = ({ order, onBack, onStatusChange, vendors, onAssignVendor, formatCurrency }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(order?.assignedVendor || '');
  const [customerNote, setCustomerNote] = useState('');
  const [orderTimeline, setOrderTimeline] = useState(order ? [
    { 
      status: 'Order Received', 
      time: order.time, 
      description: 'Order has been received and is awaiting confirmation.'
    }
  ] : []);

  // Simulate loading order details
  useEffect(() => {
    if (!order) return; // Guard clause to prevent accessing properties of undefined
    
    // In a real implementation, we would fetch order details from API
    if (order.status === 'processing') {
      setOrderTimeline(prev => [
        ...prev,
        { 
          status: 'Order Confirmed', 
          time: new Date(new Date(order.time).getTime() + 15 * 60000).toISOString(), 
          description: 'Order has been confirmed and is being prepared.'
        }
      ]);
    }
    
    if (order.status === 'completed') {
      setOrderTimeline(prev => [
        ...prev,
        { 
          status: 'Order Confirmed', 
          time: new Date(new Date(order.time).getTime() + 15 * 60000).toISOString(), 
          description: 'Order has been confirmed and is being prepared.'
        },
        { 
          status: 'Order Delivered', 
          time: new Date(new Date(order.time).getTime() + 45 * 60000).toISOString(), 
          description: 'Order has been delivered successfully.'
        }
      ]);
    }
    
    if (order.status === 'cancelled') {
      setOrderTimeline(prev => [
        ...prev,
        { 
          status: 'Order Cancelled', 
          time: new Date(new Date(order.time).getTime() + 10 * 60000).toISOString(), 
          description: 'Order has been cancelled.'
        }
      ]);
    }
  }, [order]);

  // Sample order items
  const orderItems = [
    { id: 1, name: 'Premium Basmati Rice', quantity: 2, price: 180.50, total: 361.00 },
    { id: 2, name: 'Organic Brown Eggs (dozen)', quantity: 1, price: 89.25, total: 89.25 },
    { id: 3, name: 'Fresh Paneer', quantity: 1, price: 120.00, total: 120.00 },
    { id: 4, name: 'Whole Wheat Bread', quantity: 1, price: 45.00, total: 45.00 }
  ];
  
  // Calculate order subtotals
  const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
  const deliveryFee = 40.00;
  const taxes = subtotal * 0.05; // 5% tax
  const total = subtotal + deliveryFee + taxes;
  
  // Handle status change
  const handleStatusChange = (newStatus) => {
    if (!order) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onStatusChange(order.id, newStatus);
      
      // Add to timeline
      const timelineEntry = {
        status: newStatus === 'completed' ? 'Order Completed' : 
               newStatus === 'cancelled' ? 'Order Cancelled' : 
               newStatus === 'processing' ? 'Order Processing' : 'Status Updated',
        time: new Date().toISOString(),
        description: `Order status changed to ${newStatus}.`
      };
      
      setOrderTimeline(prev => [...prev, timelineEntry]);
      setIsLoading(false);
    }, 800);
  };
  
  // Handle vendor assignment
  const handleAssignVendor = () => {
    if (!selectedVendor || !order) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onAssignVendor(order.id, selectedVendor);
      
      // Add to timeline
      const vendorName = vendors.find(v => v.id === selectedVendor)?.name || 'Unknown';
      const timelineEntry = {
        status: 'Vendor Assigned',
        time: new Date().toISOString(),
        description: `${vendorName} has been assigned to this order.`
      };
      
      setOrderTimeline(prev => [...prev, timelineEntry]);
      setIsLoading(false);
    }, 800);
  };
  
  // Handle sending customer note
  const handleSendNote = () => {
    if (!customerNote.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Add to timeline
      const timelineEntry = {
        status: 'Customer Contacted',
        time: new Date().toISOString(),
        description: `Message sent to customer: "${customerNote}"`
      };
      
      setOrderTimeline(prev => [...prev, timelineEntry]);
      setCustomerNote('');
      setIsLoading(false);
    }, 800);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // If order is undefined, render a loading state or error message
  if (!order) {
    return (
      <div className="order-details-container">
        <div className="order-details-header">
          <button className="back-button" onClick={onBack}>
            <ChevronLeft size={18} /> Back to Orders
          </button>
          <h2>Loading order details...</h2>
        </div>
        <div className="order-details-content">
          <p className="loading-message">Order data is not available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-details-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      
      <div className="order-details-header">
        <button className="back-button" onClick={onBack}>
          <ChevronLeft size={18} /> Back to Orders
        </button>
        <h2>Order #{order.id}</h2>
        <div className={`order-status ${order.status}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </div>
      </div>
      
      <div className="order-details-content">
        <div className="order-details-grid">
          <div className="order-info-card">
            <h3>Order Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label"><Calendar size={14} /> Order Date</div>
                <div className="info-value">{formatDate(order.time)}</div>
              </div>
              <div className="info-item">
                <div className="info-label"><User size={14} /> Customer</div>
                <div className="info-value">{order.customer}</div>
              </div>
              <div className="info-item">
                <div className="info-label"><Phone size={14} /> Contact</div>
                <div className="info-value">+91 9876543210</div>
              </div>
              <div className="info-item">
                <div className="info-label"><MapPin size={14} /> Delivery Address</div>
                <div className="info-value">123 Main Street, Sector 15, Gurgaon, Haryana 122001</div>
              </div>
              <div className="info-item">
                <div className="info-label"><Package size={14} /> Items</div>
                <div className="info-value">{order.items} items</div>
              </div>
              <div className="info-item">
                <div className="info-label"><DollarSign size={14} /> Total Amount</div>
                <div className="info-value">{formatCurrency(order.amount)}</div>
              </div>
            </div>
          </div>
          
          <div className="order-actions-card">
            <h3>Actions</h3>
            <div className="action-buttons">
              {order.status === 'pending' && (
                <>
                  <button 
                    className="action-button confirm"
                    onClick={() => handleStatusChange('processing')}
                  >
                    <CheckCircle size={16} /> Confirm Order
                  </button>
                  <button 
                    className="action-button cancel"
                    onClick={() => handleStatusChange('cancelled')}
                  >
                    <AlertTriangle size={16} /> Cancel Order
                  </button>
                </>
              )}
              
              {order.status === 'processing' && (
                <>
                  <button 
                    className="action-button complete"
                    onClick={() => handleStatusChange('completed')}
                  >
                    <CheckCircle size={16} /> Mark as Completed
                  </button>
                  <button 
                    className="action-button cancel"
                    onClick={() => handleStatusChange('cancelled')}
                  >
                    <AlertTriangle size={16} /> Cancel Order
                  </button>
                </>
              )}
              
              {(order.status === 'completed' || order.status === 'cancelled') && (
                <button className="action-button print">
                  <FileText size={16} /> Print Invoice
                </button>
              )}
            </div>
            
            {(order.status === 'pending' || order.status === 'processing') && (
              <div className="vendor-assignment">
                <h4>Assign Vendor</h4>
                <div className="vendor-select-container">
                  <select 
                    value={selectedVendor} 
                    onChange={(e) => setSelectedVendor(e.target.value)}
                    className="vendor-select"
                  >
                    <option value="">-- Select Vendor --</option>
                    {vendors
                      .filter(v => v.available)
                      .map(vendor => (
                        <option key={vendor.id} value={vendor.id}>
                          {vendor.name} ({vendor.rating}★)
                        </option>
                      ))}
                  </select>
                  <button 
                    className="assign-button"
                    disabled={!selectedVendor}
                    onClick={handleAssignVendor}
                  >
                    Assign
                  </button>
                </div>
                {order.assignedVendor && (
                  <div className="current-vendor">
                    <span className="label">Currently Assigned:</span>
                    <span className="value">
                      {vendors.find(v => v.id === order.assignedVendor)?.name || 'Unknown'}
                    </span>
                  </div>
                )}
              </div>
            )}
            
            <div className="customer-note">
              <h4>Contact Customer</h4>
              <div className="note-container">
                <textarea 
                  className="note-input"
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder="Type a message to the customer..."
                  rows={3}
                />
                <button 
                  className="send-note-button"
                  disabled={!customerNote.trim()}
                  onClick={handleSendNote}
                >
                  <Send size={16} /> Send
                </button>
              </div>
            </div>
          </div>
          
          <div className="order-items-card">
            <h3>Order Items</h3>
            <div className="items-table-container">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map(item => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td>{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (5%)</span>
                <span>{formatCurrency(taxes)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
          
          <div className="order-timeline-card">
            <h3>Order Timeline</h3>
            <div className="timeline">
              {orderTimeline.map((event, index) => (
                <div className="timeline-item" key={index}>
                  <div className="timeline-indicator"></div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className="timeline-title">{event.status}</span>
                      <span className="timeline-time">{formatDate(event.time)}</span>
                    </div>
                    <p className="timeline-description">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;