import React, { useState, useEffect } from 'react';
import { ref, onValue, query, orderByChild } from 'firebase/database';
import { db } from '../firebase/config';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle, Clock, Search, Calendar, Download, Eye } from 'lucide-react';
import PaymentStatusChecker from './PaymentStatusChecker';
import './PaymentHistory.css'; // Assuming you have a CSS file for styles
/**
 * Component to display payment history and check payment status
 * Can be added as a new tab in the PaymentCommission component
 */
const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showStatusChecker, setShowStatusChecker] = useState(false);

  useEffect(() => {
    const paymentsRef = query(ref(db, 'payments'), orderByChild('timestamp'));
    
    const unsubscribe = onValue(paymentsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          // Convert object to array and sort by timestamp (newest first)
          const paymentsArray = Object.entries(data)
            .map(([key, value]) => ({
              id: key,
              ...value
            }))
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          
          setPayments(paymentsArray);
        } else {
          setPayments([]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching payments:', err);
        setError('Failed to load payment history');
        setLoading(false);
      }
    }, (err) => {
      console.error('Error setting up payments listener:', err);
      setError('Failed to connect to payment database');
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

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

  const getStatusIcon = (status) => {
    if (!status) return <Clock className="status-icon unknown" size={16} />;
    
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return <CheckCircle className="status-icon success" size={16} />;
      case 'failed':
      case 'failure':
        return <XCircle className="status-icon failed" size={16} />;
      case 'processing':
        return <RefreshCw className="status-icon processing" size={16} />;
      case 'initiated':
        return <Clock className="status-icon initiated" size={16} />;
      default:
        return <AlertTriangle className="status-icon unknown" size={16} />;
    }
  };

  const filteredPayments = payments.filter(payment => {
    // Apply search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const vendorNameMatch = payment.vendorName?.toLowerCase().includes(searchLower);
      const itemNameMatch = payment.itemName?.toLowerCase().includes(searchLower);
      const refIdMatch = payment.merchant_ref_id?.toLowerCase().includes(searchLower);
      
      if (!(vendorNameMatch || itemNameMatch || refIdMatch)) {
        return false;
      }
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const paymentDate = new Date(payment.timestamp);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (paymentDate < today) {
            return false;
          }
          break;
        case 'week':
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          if (paymentDate < weekAgo) {
            return false;
          }
          break;
        case 'month':
          const monthAgo = new Date();
          monthAgo.setMonth(now.getMonth() - 1);
          if (paymentDate < monthAgo) {
            return false;
          }
          break;
        default:
          break;
      }
    }
    
    return true;
  });

  const handleViewStatus = (payment) => {
    setSelectedPayment(payment);
    setShowStatusChecker(true);
  };

  const exportPaymentsCSV = () => {
    if (filteredPayments.length === 0) {
      alert('No payments to export');
      return;
    }
    
    // Define CSV headers
    const headers = [
      'Ref ID',
      'Payout ID',
      'Vendor',
      'Item',
      'Amount',
      'Payment Method',
      'Status',
      'Date & Time'
    ];
    
    // Map payments to CSV rows
    const rows = filteredPayments.map(payment => {
      return [
        payment.merchant_ref_id || '',
        payment.payout_id || '',
        payment.vendorName || '',
        payment.itemName || '',
        payment.amount || 0,
        payment.paymentMethod || '',
        payment.status || '',
        payment.timestamp || ''
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
    link.setAttribute('download', `payment_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="payment-history-section">
      <div className="payment-history-header">
        <h2>Payment History</h2>
        
        <div className="payment-history-actions">
          <div className="search-filter-container">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search by vendor or item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-container">
              <Calendar className="filter-icon" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="date-filter"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
          
          <button className="export-button" onClick={exportPaymentsCSV}>
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading payment history...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <AlertTriangle size={20} />
          <p>{error}</p>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="no-payments-message">
          <p>No payment records found matching your criteria.</p>
        </div>
      ) : (
        <div className="payments-table-container">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Ref ID</th>
                <th>Date</th>
                <th>Vendor</th>
                <th>Item</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map(payment => (
                <tr key={payment.id} className={`payment-row ${payment.status?.toLowerCase() || 'unknown'}`}>
                  <td className="payment-ref">
                    {payment.merchant_ref_id || 'N/A'}
                    {payment.payout_id && <span className="payout-id">ID: {payment.payout_id}</span>}
                  </td>
                  <td>{formatDate(payment.timestamp)}</td>
                  <td>{payment.vendorName}</td>
                  <td>{payment.itemName}</td>
                  <td className="amount-cell">{formatCurrency(payment.amount)}</td>
                  <td>
                    <span className={`payment-method ${payment.paymentMethod?.toLowerCase() || 'unknown'}`}>
                      {payment.paymentMethod}
                    </span>
                  </td>
                  <td>
                    <div className={`payment-status ${payment.status?.toLowerCase() || 'unknown'}`}>
                      {getStatusIcon(payment.status)}
                      <span>{payment.status || 'Unknown'}</span>
                    </div>
                  </td>
                  <td>
                    <button 
                      className="check-status-button" 
                      onClick={() => handleViewStatus(payment)}
                      title="Check Status"
                      disabled={!payment.merchant_ref_id}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {showStatusChecker && selectedPayment && (
        <div className="status-checker-overlay">
          <div className="status-checker-modal">
            <div className="status-checker-header">
              <h3>Check Payment Status</h3>
              <button 
                className="close-button"
                onClick={() => setShowStatusChecker(false)}
              >
                &times;
              </button>
            </div>
            <div className="status-checker-content">
              <div className="payment-details">
                <div className="payment-detail-row">
                  <span className="detail-label">Vendor:</span>
                  <span className="detail-value">{selectedPayment.vendorName}</span>
                </div>
                <div className="payment-detail-row">
                  <span className="detail-label">Item:</span>
                  <span className="detail-value">{selectedPayment.itemName}</span>
                </div>
                <div className="payment-detail-row">
                  <span className="detail-label">Amount:</span>
                  <span className="detail-value">{formatCurrency(selectedPayment.amount)}</span>
                </div>
                <div className="payment-detail-row">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">{formatDate(selectedPayment.timestamp)}</span>
                </div>
              </div>
              
              <PaymentStatusChecker payment={selectedPayment} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;

