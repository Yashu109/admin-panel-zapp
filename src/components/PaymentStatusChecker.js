import React, { useState } from 'react';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';
import './PaymentStatusChecker.css'; // Assuming you have a CSS file for styles
/**
 * Component to check payment status from API
 * This can be added to your payment management page to allow users to check status
 */
const PaymentStatusChecker = ({ payment }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

 // Add this function to periodically check payment status
const checkPaymentStatus = async (merchantRefId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/vendor-transfer-status/${merchantRefId}`);
    const result = await response.json();
    
    if (result.status === 1) {
      // Update payment status in Firebase
      const paymentsRef = ref(db, 'payments');
      const paymentsSnapshot = await get(paymentsRef);
      
      if (paymentsSnapshot.exists()) {
        const payments = paymentsSnapshot.val();
        const paymentKey = Object.keys(payments).find(
          key => payments[key].merchant_ref_id === merchantRefId
        );
        
        if (paymentKey) {
          update(ref(db, `payments/${paymentKey}`), {
            status: result.data.payout_status,
            lastChecked: new Date().toISOString()
          });
          
          // Show status update notification
          if (result.data.payout_status === 'completed') {
            setNotification({
              message: 'Payment Completed',
              details: `Payment with ref ${merchantRefId} has been completed successfully`,
              type: 'success',
              icon: <CheckCircle size={20} />
            });
          } else if (result.data.payout_status === 'failed') {
            setNotification({
              message: 'Payment Failed',
              details: `Payment with ref ${merchantRefId} has failed. ${result.data.status_message || ''}`,
              type: 'error',
              icon: <XCircle size={20} />
            });
          }
        }
      }
      
      return result.data.payout_status;
    } else {
      console.error('Failed to check payment status:', result.msg);
      return null;
    }
  } catch (error) {
    console.error('Error checking payment status:', error);
    return null;
  }
};

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const getStatusIcon = (statusText) => {
    if (!statusText) return <Clock size={16} className="status-icon unknown" />;
    
    switch (statusText.toLowerCase()) {
      case 'completed':
      case 'success':
        return <CheckCircle size={16} className="status-icon success" />;
      case 'failed':
      case 'failure':
        return <XCircle size={16} className="status-icon failed" />;
      case 'processing':
        return <RefreshCw size={16} className="status-icon processing" />;
      case 'initiated':
        return <Clock size={16} className="status-icon initiated" />;
      default:
        return <AlertTriangle size={16} className="status-icon unknown" />;
    }
  };

  return (
    <div className="payment-status-checker">
      <div className="payment-ref-container">
        <span className="payment-ref-label">Payment Reference:</span>
        <span className="payment-ref-id">{payment?.merchant_ref_id || 'N/A'}</span>
      </div>

      {status && (
        <div className="payment-status-result">
          <div className="status-header">
            <div className={`status-indicator ${status.payout_status}`}>
              {getStatusIcon(status.payout_status)}
              <span>{status.payout_status?.toUpperCase() || 'UNKNOWN'}</span>
            </div>
          </div>
          
          <div className="status-details">
            <div className="status-detail-row">
              <span className="detail-label">Amount:</span>
              <span className="detail-value">{formatCurrency(status.amount)}</span>
            </div>
            <div className="status-detail-row">
              <span className="detail-label">Beneficiary:</span>
              <span className="detail-value">{status.beneficiary_name}</span>
            </div>
            <div className="status-detail-row">
              <span className="detail-label">Last Update:</span>
              <span className="detail-value">{new Date(status.last_updated).toLocaleString()}</span>
            </div>
            {status.status_message && (
              <div className="status-detail-row">
                <span className="detail-label">Message:</span>
                <span className="detail-value">{status.status_message}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {error && <div className="status-error">{error}</div>}

      <button 
        className="check-status-button" 
        onClick={checkPaymentStatus}
        disabled={loading}
      >
        {loading ? (
          <>
            <RefreshCw size={16} className="spinning" />
            Checking...
          </>
        ) : (
          <>
            <RefreshCw size={16} />
            Check Status
          </>
        )}
      </button>
    </div>
  );
};

export default PaymentStatusChecker;

