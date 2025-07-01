import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { ref, onValue, update, remove, get } from 'firebase/database';
import '../styles/MerchantCollaboration.css';
import {
  FaSpinner, FaCheck, FaTimes, FaSearch,
  FaFilter, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaBuilding, FaSort, FaSortAmountDown, FaSortAmountUp,
  FaEye, FaStore, FaCalendarAlt, FaUser, FaCommentAlt
} from 'react-icons/fa';

// Direct email sending using EmailJS - much simpler than Firebase Functions
const sendEmailNotification = async (email, status, description) => {
  try {
    // IMPORTANT: Replace these with your actual EmailJS credentials
    const serviceID = 'service_dmeda33'; // Create at emailjs.com
    const templateID = 'template_jvvgl4h'; // Create at emailjs.com
    const userID = 'Q2J8X0Uj_nEVDL-24'; // Get from your EmailJS account

    console.log(`Sending status email to merchant: ${email}`);

    // FOR DEVELOPMENT TESTING ONLY - Comment this out when EmailJS is set up
    // console.log('Email would be sent with:', {
    //   to: email,
    //   status: status,
    //   message: description
    // });
    // return true; // Temporarily return success for testing

    // UNCOMMENT THIS CODE when you have set up EmailJS

    // Prepare the email parameters
    const templateParams = {
      to_email: email,
      name: email.split('@')[0],
      time: new Date().toLocaleString(),
      // message: `Your merchant request has been ${status},Welcome to Zappcart`,
      headers: {
        "X-Priority": "1",
        "Importance": "high"
      }
    };

    // Send the email directly using EmailJS
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: serviceID,
        template_id: templateID,
        user_id: userID,
        template_params: templateParams
      })
    });

    if (response.ok) {
      console.log('Email sent successfully to merchant:', email);
      return true;
    } else {
      console.error('Failed to send email to merchant, server responded with:', response.status);
      return false;
    }

  } catch (error) {
    console.error("Failed to send email notification to merchant:", error);
    return false;
  }
};

const MerchantCollaboration = () => {
  // State for merchant requests
  const [merchantRequests, setMerchantRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);

  // State for filters and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  // State for response
  const [responseDescription, setResponseDescription] = useState('');
  const [submittingResponse, setSubmittingResponse] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Fetch merchant requests from Firebase
  useEffect(() => {
    const requestsRef = ref(db, 'merchantRequests');

    const unsubscribe = onValue(requestsRef, (snapshot) => {
      setLoading(true);
      try {
        if (snapshot.exists()) {
          const requestsData = [];
          snapshot.forEach((childSnapshot) => {
            const requestId = childSnapshot.key;
            const requestDetails = childSnapshot.val();

            // Extract the form data fields from Firebase based on the exact structure from screenshot
            const processedRequest = {
              id: requestId,
              businessName: requestDetails.vendorName || 'Unknown Business',
              contactName: requestDetails.vendorName || 'Unknown Contact',
              email: requestDetails.email || 'N/A',
              phone: requestDetails.phoneNumber || 'N/A',
              location: requestDetails.address || 'N/A',
              description: requestDetails.message || '',
              // Convert numeric timestamp to ISO string if it exists, otherwise use current date
              submittedAt: requestDetails.createdAt
                ? new Date(requestDetails.createdAt).toISOString()
                : new Date().toISOString(),
              status: requestDetails.status || 'pending',
              adminResponse: requestDetails.adminResponse || '',
              processedAt: requestDetails.processedAt || ''
            };

            // Log the processed request to debug
            console.log('Processed request:', processedRequest);

            requestsData.push(processedRequest);
          });

          // Sort by date (newest first by default)
          requestsData.sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));

          setMerchantRequests(requestsData);
          setFilteredRequests(requestsData);
        } else {
          setMerchantRequests([]);
          setFilteredRequests([]);
        }
      } catch (err) {
        console.error('Error fetching merchant requests:', err);
        setError('Failed to load merchant requests data.');
      } finally {
        setLoading(false);
      }
    }, (err) => {
      console.error('Error fetching merchant requests:', err);
      setError('Failed to load merchant requests data.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...merchantRequests];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(request =>
        (request.businessName && request.businessName.toLowerCase().includes(searchLower)) ||
        (request.contactName && request.contactName.toLowerCase().includes(searchLower)) ||
        (request.email && request.email.toLowerCase().includes(searchLower)) ||
        (request.phone && request.phone.toLowerCase().includes(searchLower)) ||
        (request.location && request.location.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0);
          break;
        case 'business':
          comparison = (a.businessName || '').localeCompare(b.businessName || '');
          break;
        case 'location':
          comparison = (a.location || '').localeCompare(b.location || '');
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'asc' ? -comparison : comparison;
    });

    setFilteredRequests(filtered);
  }, [merchantRequests, searchTerm, statusFilter, sortBy, sortDirection]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

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

  // View request details
  const viewRequestDetails = (request) => {
    setSelectedRequest(request);
    setResponseDescription('');
    setEmailSent(false);
  };

  // Close request details
  const closeRequestDetails = () => {
    setSelectedRequest(null);
    setResponseDescription('');
    setEmailSent(false);
  };

  // Update request status and send notification to the merchant's email
  const updateRequestStatus = async (requestId, newStatus) => {
    setSubmittingResponse(true);

    try {
      const requestRef = ref(db, `merchantRequests/${requestId}`);

      // Get current request data
      const requestSnapshot = await get(requestRef);
      const requestData = requestSnapshot.val();

      if (!requestData) {
        throw new Error('Request data not found.');
      }

      // Get the merchant's email from the request data
      const merchantEmail = requestData.email;

      if (!merchantEmail) {
        throw new Error('Merchant email not found in request data.');
      }

      // Prepare response description - use provided description or default message
      const finalDescription = responseDescription.trim() ||
        (newStatus === 'approved'
          ? 'Your merchant collaboration request has been approved. Welcome to ZappCart!'
          : 'Your merchant collaboration request has been rejected.');

      // Set the current timestamp for processedAt
      const processedTimestamp = Date.now();

      // Update request status in Firebase - use the same format as in your database
      await update(requestRef, {
        status: newStatus,
        adminResponse: finalDescription,
        processedAt: processedTimestamp
      });

      // Send email notification to the merchant's email
      const emailSuccess = await sendEmailNotification(
        merchantEmail,
        newStatus,
        finalDescription
      );

      // Format the timestamp for display
      const processedAtISO = new Date(processedTimestamp).toISOString();

      // Update local state
      setSelectedRequest(prev => ({
        ...prev,
        status: newStatus,
        adminResponse: finalDescription,
        processedAt: processedAtISO
      }));

      // Update the requests array
      setMerchantRequests(prev =>
        prev.map(request =>
          request.id === requestId
            ? {
              ...request,
              status: newStatus,
              adminResponse: finalDescription,
              processedAt: processedAtISO
            }
            : request
        )
      );

      setEmailSent(emailSuccess);

      // Show clear message about email status
      if (emailSuccess) {
        alert(`Request ${newStatus}. Notification email sent to ${merchantEmail}`);
      } else {
        alert(`Request ${newStatus}, but failed to send notification email to ${merchantEmail}. Please check your email configuration.`);
      }

      setResponseDescription('');
    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Failed to update request status. Please try again.');
    } finally {
      setSubmittingResponse(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-badge status-pending';
      case 'approved':
        return 'status-badge status-approved';
      case 'rejected':
        return 'status-badge status-rejected';
      default:
        return 'status-badge';
    }
  };

  // Render loading state
  if (loading && merchantRequests.length === 0) {
    return (
      <div className="merchant-collab-loading">
        <FaSpinner className="loading-spinner" />
        <p>Loading merchant collaboration requests...</p>
      </div>
    );
  }

  return (
    <div className="merchant-collab-container">
      {error && <div className="error-message">{error}</div>}

      {/* Search and Filters */}
      <div className="merchant-filters">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by business name, contact name, email..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <div className="status-filters">
          <button
            className={`filter-button ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleStatusFilterChange('all')}
          >
            All
          </button>
          <button
            className={`filter-button ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => handleStatusFilterChange('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-button ${statusFilter === 'approved' ? 'active' : ''}`}
            onClick={() => handleStatusFilterChange('approved')}
          >
            Approved
          </button>
          <button
            className={`filter-button ${statusFilter === 'rejected' ? 'active' : ''}`}
            onClick={() => handleStatusFilterChange('rejected')}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="sort-controls">
        <span>Sort by:</span>
        <button
          className={`sort-button ${sortBy === 'date' ? 'active' : ''}`}
          onClick={() => handleSortChange('date')}
        >
          Date {sortBy === 'date' && (
            sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
          )}
        </button>
        <button
          className={`sort-button ${sortBy === 'business' ? 'active' : ''}`}
          onClick={() => handleSortChange('business')}
        >
          Business Name {sortBy === 'business' && (
            sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
          )}
        </button>
        <button
          className={`sort-button ${sortBy === 'location' ? 'active' : ''}`}
          onClick={() => handleSortChange('location')}
        >
          Location {sortBy === 'location' && (
            sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
          )}
        </button>
      </div>

      {/* Merchant Requests List */}
      <div className="merchant-requests-list-container">
        <div className="requests-header">
          <h2>Merchant Collaboration Requests ({filteredRequests.length})</h2>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="no-requests">
            <p>No merchant requests match your criteria.</p>
          </div>
        ) : (
          <div className="requests-list">
            {filteredRequests.map(request => (
              <div
                key={request.id}
                className="request-item"
                onClick={() => viewRequestDetails(request)}
              >
                <div className="request-main-info">
                  <div className="request-header">
                    <h3>
                      <FaStore className="business-icon" />
                      {request.businessName || 'Unknown Business'}
                    </h3>
                    <span className={getStatusBadgeClass(request.status || 'pending')}>
                      {request.status ? (
                        request.status.charAt(0).toUpperCase() + request.status.slice(1)
                      ) : 'Pending'}
                    </span>
                  </div>

                  <div className="request-contact">
                    <span className="contact-name">
                      <FaUser className="contact-icon" />
                      {request.contactName || 'Unknown Contact'}
                    </span>
                    <span className="request-date">
                      <FaCalendarAlt className="date-icon" />
                      {formatDate(request.submittedAt)}
                    </span>
                  </div>

                  <div className="request-details">
                    <div className="detail-item">
                      <FaEnvelope className="detail-icon" />
                      {request.email || 'N/A'}
                    </div>
                    <div className="detail-item">
                      <FaPhone className="detail-icon" />
                      {request.phone || 'N/A'}
                    </div>
                    <div className="detail-item">
                      <FaMapMarkerAlt className="detail-icon" />
                      {request.location || 'N/A'}
                    </div>
                  </div>

                  {request.description && (
                    <div className="request-description">
                      <FaCommentAlt className="description-icon" />
                      <p>
                        {request.description.length > 120
                          ? `${request.description.substring(0, 120)}...`
                          : request.description}
                      </p>
                    </div>
                  )}
                </div>

                <button className="view-details-button">
                  <FaEye /> View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="request-details-modal">
          <div className="request-details-container">
            <div className="request-details-header">
              <div>
                <h2>Merchant Request Details</h2>
                <p className="business-name">
                  <FaStore className="header-icon" />
                  {selectedRequest.businessName || 'Unknown Business'}
                </p>
              </div>
              <button className="close-details-button" onClick={closeRequestDetails}>
                <FaTimes />
              </button>
            </div>

            <div className="request-details-content">
              <div className="request-info-section">
                <div className="request-info-item">
                  <span className="info-label"><FaUser /> Contact Name:</span>
                  <span className="info-value">
                    {selectedRequest.contactName || 'N/A'}
                  </span>
                </div>

                <div className="request-info-item">
                  <span className="info-label"><FaEnvelope /> Email:</span>
                  <span className="info-value">
                    {selectedRequest.email || 'N/A'}
                  </span>
                </div>

                <div className="request-info-item">
                  <span className="info-label"><FaPhone /> Phone:</span>
                  <span className="info-value">
                    {selectedRequest.phone || 'N/A'}
                  </span>
                </div>

                <div className="request-info-item">
                  <span className="info-label"><FaBuilding /> Business Type:</span>
                  <span className="info-value">
                    {selectedRequest.businessType || 'N/A'}
                  </span>
                </div>

                <div className="request-info-item">
                  <span className="info-label"><FaMapMarkerAlt /> Location:</span>
                  <span className="info-value">
                    {selectedRequest.location || 'N/A'}
                  </span>
                </div>

                <div className="request-info-item">
                  <span className="info-label"><FaCalendarAlt /> Submitted At:</span>
                  <span className="info-value">
                    {formatDate(selectedRequest.submittedAt)}
                  </span>
                </div>

                <div className="request-info-item">
                  <span className="info-label">Status:</span>
                  <span className={getStatusBadgeClass(selectedRequest.status || 'pending')}>
                    {selectedRequest.status ? (
                      selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)
                    ) : 'Pending'}
                  </span>
                </div>
              </div>

              {selectedRequest.description && (
                <div className="business-description-section">
                  <h3>Business Description:</h3>
                  <p className="business-description">{selectedRequest.description}</p>
                </div>
              )}

              {selectedRequest.adminResponse && (
                <div className="admin-response-section">
                  <h3>Admin Response:</h3>
                  <div className="admin-response">
                    <p>{selectedRequest.adminResponse}</p>
                    <p className="response-date">
                      Processed on: {formatDate(selectedRequest.processedAt)}
                    </p>
                  </div>
                </div>
              )}

              {(!selectedRequest.status || selectedRequest.status === 'pending') && (
                <div className="response-form">
                  <h3>Your Response:</h3>
                  <textarea
                    className="response-textarea"
                    placeholder="Provide a description for your decision..."
                    value={responseDescription}
                    onChange={(e) => setResponseDescription(e.target.value)}
                    rows={4}
                  ></textarea>

                  <div className="response-actions">
                    <button
                      className="approve-button"
                      onClick={() => updateRequestStatus(selectedRequest.id, 'approved')}
                      disabled={submittingResponse}
                    >
                      <FaCheck /> {submittingResponse ? 'Processing...' : 'Approve Request'}
                    </button>
                    <button
                      className="reject-button"
                      onClick={() => updateRequestStatus(selectedRequest.id, 'rejected')}
                      disabled={submittingResponse}
                    >
                      <FaTimes /> {submittingResponse ? 'Processing...' : 'Reject Request'}
                    </button>
                  </div>

                  {emailSent && (
                    <div className="email-sent-notification">
                      <FaEnvelope /> Email notification sent successfully!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantCollaboration;