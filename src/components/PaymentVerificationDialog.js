import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, CreditCard, Shield, Building, Send } from 'lucide-react';
import { ref, get } from 'firebase/database';
import { db } from '../firebase/config';

const PaymentVerificationDialog = ({ 
  isOpen, 
  onClose, 
  itemId, 
  vendorId, 
  amount, 
  onProcessPayment 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vendorDetails, setVendorDetails] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchVendorDetails = async () => {
      if (!isOpen || !vendorId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const vendorRef = ref(db, `shops/${vendorId}`);
        const snapshot = await get(vendorRef);
        
        if (!snapshot.exists()) {
          throw new Error("Vendor information not found");
        }
        
        const vendorData = snapshot.val();
        setVendorDetails(vendorData);
        
        const paymentInfo = vendorData.paymentDetails || {};
        
        // Verify payment details exist and are complete
        if (!paymentInfo.preferredPaymentMode) {
          throw new Error("Vendor payment mode not set");
        }
        
        // Verify based on payment mode
        if (paymentInfo.preferredPaymentMode === 'BANK') {
          const bankDetails = paymentInfo.bankDetails || {};
          if (!bankDetails.accountHolderName || !bankDetails.accountNumber || 
              !bankDetails.ifscCode || !bankDetails.bankName) {
            throw new Error("Incomplete bank account details");
          }
        } else if (paymentInfo.preferredPaymentMode === 'UPI') {
          const upiDetails = paymentInfo.upiDetails || {};
          if (!upiDetails.upiId || !upiDetails.upiMobileNumber) {
            throw new Error("Incomplete UPI details");
          }
        } else {
          throw new Error("Invalid payment mode");
        }
        
        // Verify payment contact info
        if (!paymentInfo.paymentContactName || !paymentInfo.paymentContactPhone) {
          throw new Error("Payment contact information not available");
        }
        
        setPaymentDetails(paymentInfo);
        
      } catch (err) {
        console.error("Error fetching vendor payment details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVendorDetails();
  }, [isOpen, vendorId]);
  
  const handleProcessPayment = async () => {
    if (processingPayment) return;
    
    setProcessingPayment(true);
    try {
      await onProcessPayment(vendorDetails, paymentDetails);
    } catch (err) {
      console.error("Payment processing error:", err);
      setError(err.message);
    } finally {
      setProcessingPayment(false);
    }
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(value || 0);
  };
  
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container payment-verification-dialog">
        <div className="modal-header">
          <h2>Payment Verification</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Verifying payment details...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <AlertTriangle size={48} className="error-icon" />
              <h3>Payment Verification Failed</h3>
              <p>{error}</p>
              <p className="note">Please contact the vendor to update their payment information.</p>
            </div>
          ) : (
            <>
              <div className="payment-verification-success">
                <CheckCircle size={48} className="success-icon" />
                <h3>Payment Details Verified</h3>
              </div>
              
              <div className="payment-summary">
                <div className="payment-amount">
                  <span className="label">Payment Amount:</span>
                  <span className="value">{formatCurrency(amount)}</span>
                </div>
                
                <div className="vendor-details">
                  <span className="label">Vendor:</span>
                  <span className="value">{vendorDetails?.name}</span>
                </div>
                
                <div className="payment-method">
                  <span className="label">Payment Method:</span>
                  <span className="value">
                    {paymentDetails?.preferredPaymentMode === 'BANK' ? (
                      <>
                        <Building size={16} className="method-icon" />
                        Bank Transfer
                      </>
                    ) : (
                      <>
                        <CreditCard size={16} className="method-icon" />
                        UPI Payment
                      </>
                    )}
                  </span>
                </div>
              </div>
              
              <div className="payment-details-container">
                <h4>
                  <Shield size={16} />
                  Verified Payment Details
                </h4>
                
                {paymentDetails?.preferredPaymentMode === 'BANK' ? (
                  <div className="bank-details">
                    <div className="detail-row">
                      <span className="label">Account Holder:</span>
                      <span className="value">{paymentDetails.bankDetails.accountHolderName}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Bank Name:</span>
                      <span className="value">{paymentDetails.bankDetails.bankName}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Account Number:</span>
                      <span className="value">
                        {/* Show masked account number */}
                        {'•'.repeat(paymentDetails.bankDetails.accountNumber.length - 4)}
                        {paymentDetails.bankDetails.accountNumber.slice(-4)}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">IFSC Code:</span>
                      <span className="value">{paymentDetails.bankDetails.ifscCode}</span>
                    </div>
                  </div>
                ) : (
                  <div className="upi-details">
                    <div className="detail-row">
                      <span className="label">UPI ID:</span>
                      <span className="value">{paymentDetails.upiDetails.upiId}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">UPI Provider:</span>
                      <span className="value">
                        {paymentDetails.upiDetails.upiProvider === 'other' 
                          ? paymentDetails.upiDetails.otherUpiProvider 
                          : paymentDetails.upiDetails.upiProvider.charAt(0).toUpperCase() + 
                            paymentDetails.upiDetails.upiProvider.slice(1)}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="payment-contact">
                  <h4>Payment Contact</h4>
                  <div className="detail-row">
                    <span className="label">Contact Person:</span>
                    <span className="value">{paymentDetails.paymentContactName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Contact Phone:</span>
                    <span className="value">{paymentDetails.paymentContactPhone}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          {!loading && !error && (
            <button 
              className="process-button" 
              onClick={handleProcessPayment}
              disabled={processingPayment}
            >
              <Send size={16} />
              {processingPayment ? 'Processing...' : 'Process Payment'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentVerificationDialog;