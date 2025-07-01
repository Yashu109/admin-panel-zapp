// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const crypto = require('crypto');
// const axios = require('axios');
// const app = express();
// const PORT = process.env.PORT || 5000;

// // Environment variables (set to true to use mock responses for testing)
// const USE_MOCK_RESPONSES = process.env.USE_MOCK_RESPONSES === 'false' ? false : true;

// // Enhanced CORS configuration to allow frontend access including Vercel domain
// app.use(cors({
//   origin: [
//     'http://localhost:5174', 
//     'http://127.0.0.1:5174', 
//     'http://localhost:3000',
//     'https://admin-panel-mu-sepia.vercel.app', // Added Vercel deployment URL
//     process.env.FRONTEND_URL, // For any additional deployment URLs
//   ].filter(Boolean), // Removes any undefined/null entries
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));

// // Middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // In-memory storage for payouts (Note: this will reset on server restart)
// let vendorPayouts = {};

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ 
//     status: 'ok', 
//     message: 'Vendor Payout Server is running',
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV || 'development',
//     firebase: admin.apps.length > 0 ? 'connected' : 'not connected'
//   });
// });

// // VENDOR TRANSFER PAYMENT API - Easebuzz Payout Format
// app.post('/api/vendor-transfer', async (req, res) => {
//   console.log('Received vendor transfer request:', req.body);
//   try {
//     const { 
//       vendor_id, 
//       amount, 
//       beneficiary_name,
//       beneficiary_account_number,
//       beneficiary_ifsc,
//       beneficiary_upi,
//       payment_mode,
//       purpose 
//     } = req.body;

//     // Validation
//     if (!vendor_id || !amount || !beneficiary_name) {
//       return res.status(400).json({
//         status: 0,
//         msg: 'Missing required fields: vendor_id, amount, or beneficiary_name'
//       });
//     }

//     // Validate payment mode and required fields
//     if (payment_mode === 'NEFT' || payment_mode === 'IMPS') {
//       if (!beneficiary_account_number || !beneficiary_ifsc) {
//         return res.status(400).json({
//           status: 0,
//           msg: 'Missing bank details: account_number and ifsc_code required for bank transfers'
//         });
//       }
//     } else if (payment_mode === 'UPI') {
//       if (!beneficiary_upi) {
//         return res.status(400).json({
//           status: 0,
//           msg: 'Missing UPI ID for UPI transfers'
//         });
//       }
//     } else {
//       return res.status(400).json({
//         status: 0,
//         msg: 'Invalid payment_mode. Must be NEFT, IMPS, or UPI'
//       });
//     }

//     console.log(`Initiating vendor transfer: ${vendor_id}, amount: ${amount}`);

//     // Format amount to 2 decimal places
//     const formattedAmount = parseFloat(amount).toFixed(2);

//     // Get Easebuzz credentials
//     const key = process.env.EASEBUZZ_KEY || '2PBP7IABZ2';
//     const salt = process.env.EASEBUZZ_SALT || 'DAH88E3UWQ';
//     const merchant_email = process.env.EASEBUZZ_MERCHANT_EMAIL || 'payout@easebuzz.in';

//     // Generate unique payout reference ID
//     const merchant_ref_id = `PAYOUT${Date.now()}`;

//     // Format payout date as DD-MM-YYYY (as per Easebuzz requirement)
//     const today = new Date();
//     const payout_date = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;

//     // Prepare Easebuzz Payout API data structure
//     const payoutData = {
//       // Mandatory Parameters (as per Easebuzz documentation)
//       key: key,
//       merchant_email: merchant_email,
//       payout_date: payout_date,
//       amount: formattedAmount,
//       merchant_ref_id: merchant_ref_id,
      
//       // Beneficiary Details
//       beneficiary_name: beneficiary_name,
//       beneficiary_account_number: beneficiary_account_number || '',
//       beneficiary_ifsc: beneficiary_ifsc || '',
//       beneficiary_upi: beneficiary_upi || '',
      
//       // Transfer Details
//       payment_mode: payment_mode, // NEFT, IMPS, or UPI
//       purpose: purpose || `Payment to vendor ${vendor_id}`,
      
//       // Optional fields
//       beneficiary_mobile: '', // Optional
//       beneficiary_email: ''   // Optional
//     };

//     // Generate hash for Easebuzz Payout API
//     // Hash format: key|merchant_email|payout_date|amount|merchant_ref_id|salt
//     const hashString = 
//       key + '|' + 
//       merchant_email + '|' + 
//       payout_date + '|' + 
//       formattedAmount + '|' + 
//       merchant_ref_id + '|' + 
//       salt;

//     const hash = crypto.createHash('sha512').update(hashString).digest('hex').toLowerCase();
//     payoutData.hash = hash;

//     console.log('Payout request to Easebuzz:', {
//       ...payoutData,
//       beneficiary_account_number: payoutData.beneficiary_account_number 
//         ? `XXXX${payoutData.beneficiary_account_number.slice(-4)}` 
//         : '',
//       hash: `${hash.substring(0, 10)}...`
//     });

//     let easebuzzResult;

//     // Use mock response for testing if enabled
//     if (USE_MOCK_RESPONSES) {
//       console.log('Using mock payout response for testing');
      
//       // Mock successful response
//       easebuzzResult = {
//         status: 1,
//         msg: "Payout initiated successfully",
//         data: {
//           payout_id: "MOCK" + Date.now(),
//           status: "initiated",
//           reference_id: merchant_ref_id,
//           beneficiary_name: beneficiary_name,
//           amount: formattedAmount
//         }
//       };
      
//       // Uncomment to test failure response
//       /*
//       easebuzzResult = {
//         status: 0,
//         msg: "Mock payout failure - Insufficient balance",
//         error: {
//           code: "INSUFFICIENT_BALANCE",
//           description: "Not enough balance in merchant account"
//         }
//       };
//       */
      
//     } else {
//       // Call actual Easebuzz Payout API
//       try {
//         const apiUrl = process.env.EASEBUZZ_API_URL || 'https://testpay.easebuzz.in/api/v1/payout/initiate';
//         const easebuzzResponse = await axios.post(
//           apiUrl,
//           payoutData, 
//           {
//             headers: {
//               'Content-Type': 'application/json',
//               'Accept': 'application/json'
//             },
//             // Always get a response regardless of status code
//             validateStatus: function (status) {
//               return true; 
//             }
//           }
//         );

//         // Check if response is HTML (404 page) or JSON
//         const contentType = easebuzzResponse.headers['content-type'] || '';
//         const isHtml = contentType.includes('html');
        
//         if (isHtml || easebuzzResponse.status !== 200) {
//           console.log('Received HTML or error response from API:', 
//             isHtml ? 'HTML content detected' : `Status: ${easebuzzResponse.status}`);
          
//           throw new Error('Payment gateway API endpoint not found or inaccessible');
//         }

//         easebuzzResult = easebuzzResponse.data;
//         console.log('Easebuzz payout response:', easebuzzResult);
//       } catch (apiError) {
//         console.error('API call error:', apiError);
//         throw new Error(`API error: ${apiError.message}`);
//       }
//     }

//     // Store payout record
//     vendorPayouts[merchant_ref_id] = {
//       vendor_id: vendor_id,
//       merchant_ref_id: merchant_ref_id,
//       amount: formattedAmount,
//       beneficiary_name: beneficiary_name,
//       payment_mode: payment_mode,
//       purpose: purpose,
//       status: easebuzzResult.status === 1 ? 'initiated' : 'failed',
//       timestamp: new Date().toISOString(),
//       payout_date: payout_date,
//       easebuzz_response: easebuzzResult
//     };

//     // Return response based on Easebuzz result
//     if (easebuzzResult.status === 1) {
//       // SUCCESS RESPONSE
//       res.json({
//         status: 1,
//         msg: 'Vendor transfer initiated successfully',
//         data: {
//           vendor_id: vendor_id,
//           merchant_ref_id: merchant_ref_id,
//           amount: formattedAmount,
//           beneficiary_name: beneficiary_name,
//           payment_mode: payment_mode,
//           payout_id: easebuzzResult.data?.payout_id || '',
//           status: 'initiated',
//           payout_date: payout_date,
//           purpose: purpose
//         }
//       });
//     } else {
//       // FAILURE RESPONSE
//       res.status(400).json({
//         status: 0,
//         msg: easebuzzResult.msg || 'Vendor transfer failed',
//         error: {
//           vendor_id: vendor_id,
//           merchant_ref_id: merchant_ref_id,
//           amount: formattedAmount,
//           reason: easebuzzResult.msg || 'Transfer failed',
//           timestamp: new Date().toISOString()
//         }
//       });
//     }

//   } catch (error) {
//     console.error('Vendor transfer error:', error);
    
//     // ERROR RESPONSE
//     res.status(500).json({
//       status: 0,
//       msg: 'Vendor transfer failed due to server error',
//       error: {
//         message: error.message,
//         timestamp: new Date().toISOString()
//       }
//     });
//   }
// });

// // CHECK VENDOR TRANSFER STATUS
// app.get('/api/vendor-transfer-status/:merchant_ref_id', async (req, res) => {
//   try {
//     const merchant_ref_id = req.params.merchant_ref_id;

//     // Check if merchant_ref_id exists in local storage first
//     if (!vendorPayouts[merchant_ref_id] && USE_MOCK_RESPONSES) {
//       return res.status(404).json({
//         status: 0,
//         msg: 'Transfer not found',
//         error: {
//           merchant_ref_id: merchant_ref_id,
//           reason: 'Not found in local storage'
//         }
//       });
//     }

//     // Get Easebuzz credentials
//     const key = process.env.EASEBUZZ_KEY || '2PBP7IABZ2';
//     const salt = process.env.EASEBUZZ_SALT || 'DAH88E3UWQ';
//     const merchant_email = process.env.EASEBUZZ_MERCHANT_EMAIL || 'payout@easebuzz.in';

//     // Prepare status check data
//     const statusData = {
//       key: key,
//       merchant_email: merchant_email,
//       merchant_ref_id: merchant_ref_id
//     };

//     // Generate hash for status check
//     const hashString = key + '|' + merchant_email + '|' + merchant_ref_id + '|' + salt;
//     const hash = crypto.createHash('sha512').update(hashString).digest('hex').toLowerCase();
//     statusData.hash = hash;

//     let statusResult;

//     // Use mock status response for testing if enabled
//     if (USE_MOCK_RESPONSES) {
//       console.log('Using mock status response for testing');
      
//       // Mock successful status response
//       const mockStatuses = ['initiated', 'processing', 'completed', 'failed'];
//       const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];
      
//       statusResult = {
//         status: 1,
//         msg: "Status retrieved successfully",
//         data: {
//           merchant_ref_id: merchant_ref_id,
//           payout_id: "MOCK" + merchant_ref_id.substring(6),
//           status: randomStatus,
//           amount: vendorPayouts[merchant_ref_id]?.amount || "100.00",
//           beneficiary_name: vendorPayouts[merchant_ref_id]?.beneficiary_name || "Test Vendor",
//           payment_mode: vendorPayouts[merchant_ref_id]?.payment_mode || "UPI",
//           status_message: `Payout ${randomStatus}`,
//           timestamp: new Date().toISOString()
//         }
//       };
//     } else {
//       // Call actual Easebuzz status API
//       try {
//         const apiUrl = process.env.EASEBUZZ_STATUS_API_URL || 'https://testpay.easebuzz.in/api/v1/payout/status';
//         const statusResponse = await axios.post(
//           apiUrl,
//           statusData,
//           {
//             headers: {
//               'Content-Type': 'application/json',
//               'Accept': 'application/json'
//             },
//             // Always get a response regardless of status code
//             validateStatus: function (status) {
//               return true;
//             }
//           }
//         );

//         // Check if response is HTML (404 page) or JSON
//         const contentType = statusResponse.headers['content-type'] || '';
//         const isHtml = contentType.includes('html');
        
//         if (isHtml || statusResponse.status !== 200) {
//           console.log('Received HTML or error response from status API:', 
//             isHtml ? 'HTML content detected' : `Status: ${statusResponse.status}`);
          
//           throw new Error('Payment gateway status API endpoint not found or inaccessible');
//         }

//         statusResult = statusResponse.data;
//       } catch (apiError) {
//         console.error('Status API call error:', apiError);
//         throw new Error(`Status API error: ${apiError.message}`);
//       }
//     }

//     console.log('Status check response:', statusResult);

//     // Update local record if found
//     if (vendorPayouts[merchant_ref_id] && statusResult.status === 1) {
//       vendorPayouts[merchant_ref_id].current_status = statusResult.data?.status || 'unknown';
//       vendorPayouts[merchant_ref_id].last_status_check = new Date().toISOString();
//       vendorPayouts[merchant_ref_id].status_response = statusResult.data;
//     }

//     // Return status response
//     if (statusResult.status === 1) {
//       res.json({
//         status: 1,
//         msg: 'Status retrieved successfully',
//         data: {
//           merchant_ref_id: merchant_ref_id,
//           payout_status: statusResult.data?.status || 'unknown',
//           amount: statusResult.data?.amount || '',
//           beneficiary_name: statusResult.data?.beneficiary_name || '',
//           payout_id: statusResult.data?.payout_id || '',
//           status_message: statusResult.data?.status_message || '',
//           last_updated: new Date().toISOString()
//         }
//       });
//     } else {
//       res.status(404).json({
//         status: 0,
//         msg: statusResult.msg || 'Transfer not found',
//         error: {
//           merchant_ref_id: merchant_ref_id,
//           reason: statusResult.msg || 'Not found'
//         }
//       });
//     }

//   } catch (error) {
//     console.error('Status check error:', error);
//     res.status(500).json({
//       status: 0,
//       msg: 'Status check failed',
//       error: {
//         message: error.message,
//         timestamp: new Date().toISOString()
//       }
//     });
//   }
// });

// // GET ALL VENDOR TRANSFERS (for admin dashboard)
// app.get('/api/vendor-transfers', (req, res) => {
//   // Convert the object to an array for easier frontend handling
//   const payoutsArray = Object.values(vendorPayouts);
  
//   res.json({
//     status: 1,
//     msg: 'Vendor transfers retrieved successfully',
//     count: payoutsArray.length,
//     data: payoutsArray
//   });
// });

// // Fallback route for undefined routes
// app.use('*', (req, res) => {
//   res.status(404).json({
//     status: 0,
//     msg: 'API endpoint not found',
//     path: req.originalUrl
//   });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('Unhandled error:', err);
//   res.status(500).json({
//     status: 0,
//     msg: 'Internal server error',
//     error: {
//       message: err.message,
//       timestamp: new Date().toISOString()
//     }
//   });
// });

// // For local development
// if (require.main === module) {
//   app.listen(PORT, () => {
//     console.log(`🏦 Vendor Transfer Server running on http://localhost:${PORT}`);
//     console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
//     console.log(`💰 Transfer API: POST http://localhost:${PORT}/api/vendor-transfer`);
//     console.log(`📋 Status API: GET http://localhost:${PORT}/api/vendor-transfer-status/:ref_id`);
//     console.log(`📊 All transfers: GET http://localhost:${PORT}/api/vendor-transfers`);
    
//     if (USE_MOCK_RESPONSES) {
//       console.log('⚠️ USING MOCK RESPONSES - Set USE_MOCK_RESPONSES to false for real API calls');
//     }
//   });
// }

// // For serverless environments (e.g., Vercel)
// module.exports = app;

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const axios = require('axios');

// Initialize Firebase Admin (only if you're using Firebase)
let admin = null;
try {
  admin = require('firebase-admin');
  // Initialize Firebase Admin only if not already initialized
  if (!admin.apps.length) {
    // Add your Firebase configuration here if needed
    // admin.initializeApp({
    //   credential: admin.credential.cert(serviceAccount),
    //   // other config
    // });
  }
} catch (error) {
  console.log('Firebase Admin not configured or not installed');
  admin = { apps: [] }; // Mock admin object to prevent errors
}

const app = express();
const PORT = process.env.PORT || 5000;

// Environment variables (set to true to use mock responses for testing)
const USE_MOCK_RESPONSES = process.env.USE_MOCK_RESPONSES === 'false' ? false : true;

// Enhanced CORS configuration to allow frontend access including Vercel domain
app.use(cors({
  origin: [
    'http://localhost:5174', 
    'http://127.0.0.1:5174', 
    'http://localhost:3000',
    'https://admin-panel-mu-sepia.vercel.app', // Added Vercel deployment URL
    process.env.FRONTEND_URL, // For any additional deployment URLs
  ].filter(Boolean), // Removes any undefined/null entries
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage for payouts (Note: this will reset on server restart)
let vendorPayouts = {};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Vendor Payout Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    firebase: admin && admin.apps.length > 0 ? 'connected' : 'not connected'
  });
});

// Root endpoint for basic health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Vendor Payout API Server',
    status: 'running',
    endpoints: {
      health: '/api/health',
      vendorTransfer: 'POST /api/vendor-transfer',
      transferStatus: 'GET /api/vendor-transfer-status/:merchant_ref_id',
      allTransfers: 'GET /api/vendor-transfers'
    }
  });
});

// VENDOR TRANSFER PAYMENT API - Easebuzz Payout Format
app.post('/api/vendor-transfer', async (req, res) => {
  console.log('Received vendor transfer request:', req.body);
  try {
    const { 
      vendor_id, 
      amount, 
      beneficiary_name,
      beneficiary_account_number,
      beneficiary_ifsc,
      beneficiary_upi,
      payment_mode,
      purpose 
    } = req.body;

    // Validation
    if (!vendor_id || !amount || !beneficiary_name) {
      return res.status(400).json({
        status: 0,
        msg: 'Missing required fields: vendor_id, amount, or beneficiary_name'
      });
    }

    // Validate payment mode and required fields
    if (payment_mode === 'NEFT' || payment_mode === 'IMPS') {
      if (!beneficiary_account_number || !beneficiary_ifsc) {
        return res.status(400).json({
          status: 0,
          msg: 'Missing bank details: account_number and ifsc_code required for bank transfers'
        });
      }
    } else if (payment_mode === 'UPI') {
      if (!beneficiary_upi) {
        return res.status(400).json({
          status: 0,
          msg: 'Missing UPI ID for UPI transfers'
        });
      }
    } else {
      return res.status(400).json({
        status: 0,
        msg: 'Invalid payment_mode. Must be NEFT, IMPS, or UPI'
      });
    }

    console.log(`Initiating vendor transfer: ${vendor_id}, amount: ${amount}`);

    // Format amount to 2 decimal places
    const formattedAmount = parseFloat(amount).toFixed(2);

    // Get Easebuzz credentials
    const key = process.env.EASEBUZZ_KEY || '2PBP7IABZ2';
    const salt = process.env.EASEBUZZ_SALT || 'DAH88E3UWQ';
    const merchant_email = process.env.EASEBUZZ_MERCHANT_EMAIL || 'payout@easebuzz.in';

    // Generate unique payout reference ID
    const merchant_ref_id = `PAYOUT${Date.now()}`;

    // Format payout date as DD-MM-YYYY (as per Easebuzz requirement)
    const today = new Date();
    const payout_date = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;

    // Prepare Easebuzz Payout API data structure
    const payoutData = {
      // Mandatory Parameters (as per Easebuzz documentation)
      key: key,
      merchant_email: merchant_email,
      payout_date: payout_date,
      amount: formattedAmount,
      merchant_ref_id: merchant_ref_id,
      
      // Beneficiary Details
      beneficiary_name: beneficiary_name,
      beneficiary_account_number: beneficiary_account_number || '',
      beneficiary_ifsc: beneficiary_ifsc || '',
      beneficiary_upi: beneficiary_upi || '',
      
      // Transfer Details
      payment_mode: payment_mode, // NEFT, IMPS, or UPI
      purpose: purpose || `Payment to vendor ${vendor_id}`,
      
      // Optional fields
      beneficiary_mobile: '', // Optional
      beneficiary_email: ''   // Optional
    };

    // Generate hash for Easebuzz Payout API
    // Hash format: key|merchant_email|payout_date|amount|merchant_ref_id|salt
    const hashString = 
      key + '|' + 
      merchant_email + '|' + 
      payout_date + '|' + 
      formattedAmount + '|' + 
      merchant_ref_id + '|' + 
      salt;

    const hash = crypto.createHash('sha512').update(hashString).digest('hex').toLowerCase();
    payoutData.hash = hash;

    console.log('Payout request to Easebuzz:', {
      ...payoutData,
      beneficiary_account_number: payoutData.beneficiary_account_number 
        ? `XXXX${payoutData.beneficiary_account_number.slice(-4)}` 
        : '',
      hash: `${hash.substring(0, 10)}...`
    });

    let easebuzzResult;

    // Use mock response for testing if enabled
    if (USE_MOCK_RESPONSES) {
      console.log('Using mock payout response for testing');
      
      // Mock successful response
      easebuzzResult = {
        status: 1,
        msg: "Payout initiated successfully",
        data: {
          payout_id: "MOCK" + Date.now(),
          status: "initiated",
          reference_id: merchant_ref_id,
          beneficiary_name: beneficiary_name,
          amount: formattedAmount
        }
      };
      
    } else {
      // Call actual Easebuzz Payout API
      try {
        const apiUrl = process.env.EASEBUZZ_API_URL || 'https://testpay.easebuzz.in/api/v1/payout/initiate';
        const easebuzzResponse = await axios.post(
          apiUrl,
          payoutData, 
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            timeout: 30000, // 30 second timeout for Vercel
            validateStatus: function (status) {
              return true; 
            }
          }
        );

        // Check if response is HTML (404 page) or JSON
        const contentType = easebuzzResponse.headers['content-type'] || '';
        const isHtml = contentType.includes('html');
        
        if (isHtml || easebuzzResponse.status !== 200) {
          console.log('Received HTML or error response from API:', 
            isHtml ? 'HTML content detected' : `Status: ${easebuzzResponse.status}`);
          
          throw new Error('Payment gateway API endpoint not found or inaccessible');
        }

        easebuzzResult = easebuzzResponse.data;
        console.log('Easebuzz payout response:', easebuzzResult);
      } catch (apiError) {
        console.error('API call error:', apiError);
        throw new Error(`API error: ${apiError.message}`);
      }
    }

    // Store payout record
    vendorPayouts[merchant_ref_id] = {
      vendor_id: vendor_id,
      merchant_ref_id: merchant_ref_id,
      amount: formattedAmount,
      beneficiary_name: beneficiary_name,
      payment_mode: payment_mode,
      purpose: purpose,
      status: easebuzzResult.status === 1 ? 'initiated' : 'failed',
      timestamp: new Date().toISOString(),
      payout_date: payout_date,
      easebuzz_response: easebuzzResult
    };

    // Return response based on Easebuzz result
    if (easebuzzResult.status === 1) {
      // SUCCESS RESPONSE
      res.json({
        status: 1,
        msg: 'Vendor transfer initiated successfully',
        data: {
          vendor_id: vendor_id,
          merchant_ref_id: merchant_ref_id,
          amount: formattedAmount,
          beneficiary_name: beneficiary_name,
          payment_mode: payment_mode,
          payout_id: easebuzzResult.data?.payout_id || '',
          status: 'initiated',
          payout_date: payout_date,
          purpose: purpose
        }
      });
    } else {
      // FAILURE RESPONSE
      res.status(400).json({
        status: 0,
        msg: easebuzzResult.msg || 'Vendor transfer failed',
        error: {
          vendor_id: vendor_id,
          merchant_ref_id: merchant_ref_id,
          amount: formattedAmount,
          reason: easebuzzResult.msg || 'Transfer failed',
          timestamp: new Date().toISOString()
        }
      });
    }

  } catch (error) {
    console.error('Vendor transfer error:', error);
    
    // ERROR RESPONSE
    res.status(500).json({
      status: 0,
      msg: 'Vendor transfer failed due to server error',
      error: {
        message: error.message,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// CHECK VENDOR TRANSFER STATUS
app.get('/api/vendor-transfer-status/:merchant_ref_id', async (req, res) => {
  try {
    const merchant_ref_id = req.params.merchant_ref_id;

    // Check if merchant_ref_id exists in local storage first
    if (!vendorPayouts[merchant_ref_id] && USE_MOCK_RESPONSES) {
      return res.status(404).json({
        status: 0,
        msg: 'Transfer not found',
        error: {
          merchant_ref_id: merchant_ref_id,
          reason: 'Not found in local storage'
        }
      });
    }

    // Get Easebuzz credentials
    const key = process.env.EASEBUZZ_KEY || '2PBP7IABZ2';
    const salt = process.env.EASEBUZZ_SALT || 'DAH88E3UWQ';
    const merchant_email = process.env.EASEBUZZ_MERCHANT_EMAIL || 'payout@easebuzz.in';

    // Prepare status check data
    const statusData = {
      key: key,
      merchant_email: merchant_email,
      merchant_ref_id: merchant_ref_id
    };

    // Generate hash for status check
    const hashString = key + '|' + merchant_email + '|' + merchant_ref_id + '|' + salt;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex').toLowerCase();
    statusData.hash = hash;

    let statusResult;

    // Use mock status response for testing if enabled
    if (USE_MOCK_RESPONSES) {
      console.log('Using mock status response for testing');
      
      // Mock successful status response
      const mockStatuses = ['initiated', 'processing', 'completed', 'failed'];
      const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];
      
      statusResult = {
        status: 1,
        msg: "Status retrieved successfully",
        data: {
          merchant_ref_id: merchant_ref_id,
          payout_id: "MOCK" + merchant_ref_id.substring(6),
          status: randomStatus,
          amount: vendorPayouts[merchant_ref_id]?.amount || "100.00",
          beneficiary_name: vendorPayouts[merchant_ref_id]?.beneficiary_name || "Test Vendor",
          payment_mode: vendorPayouts[merchant_ref_id]?.payment_mode || "UPI",
          status_message: `Payout ${randomStatus}`,
          timestamp: new Date().toISOString()
        }
      };
    } else {
      // Call actual Easebuzz status API
      try {
        const apiUrl = process.env.EASEBUZZ_STATUS_API_URL || 'https://testpay.easebuzz.in/api/v1/payout/status';
        const statusResponse = await axios.post(
          apiUrl,
          statusData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            timeout: 30000, // 30 second timeout for Vercel
            validateStatus: function (status) {
              return true;
            }
          }
        );

        // Check if response is HTML (404 page) or JSON
        const contentType = statusResponse.headers['content-type'] || '';
        const isHtml = contentType.includes('html');
        
        if (isHtml || statusResponse.status !== 200) {
          console.log('Received HTML or error response from status API:', 
            isHtml ? 'HTML content detected' : `Status: ${statusResponse.status}`);
          
          throw new Error('Payment gateway status API endpoint not found or inaccessible');
        }

        statusResult = statusResponse.data;
      } catch (apiError) {
        console.error('Status API call error:', apiError);
        throw new Error(`Status API error: ${apiError.message}`);
      }
    }

    console.log('Status check response:', statusResult);

    // Update local record if found
    if (vendorPayouts[merchant_ref_id] && statusResult.status === 1) {
      vendorPayouts[merchant_ref_id].current_status = statusResult.data?.status || 'unknown';
      vendorPayouts[merchant_ref_id].last_status_check = new Date().toISOString();
      vendorPayouts[merchant_ref_id].status_response = statusResult.data;
    }

    // Return status response
    if (statusResult.status === 1) {
      res.json({
        status: 1,
        msg: 'Status retrieved successfully',
        data: {
          merchant_ref_id: merchant_ref_id,
          payout_status: statusResult.data?.status || 'unknown',
          amount: statusResult.data?.amount || '',
          beneficiary_name: statusResult.data?.beneficiary_name || '',
          payout_id: statusResult.data?.payout_id || '',
          status_message: statusResult.data?.status_message || '',
          last_updated: new Date().toISOString()
        }
      });
    } else {
      res.status(404).json({
        status: 0,
        msg: statusResult.msg || 'Transfer not found',
        error: {
          merchant_ref_id: merchant_ref_id,
          reason: statusResult.msg || 'Not found'
        }
      });
    }

  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      status: 0,
      msg: 'Status check failed',
      error: {
        message: error.message,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// GET ALL VENDOR TRANSFERS (for admin dashboard)
app.get('/api/vendor-transfers', (req, res) => {
  // Convert the object to an array for easier frontend handling
  const payoutsArray = Object.values(vendorPayouts);
  
  res.json({
    status: 1,
    msg: 'Vendor transfers retrieved successfully',
    count: payoutsArray.length,
    data: payoutsArray
  });
});

// Fallback route for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    status: 0,
    msg: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    status: 0,
    msg: 'Internal server error',
    error: {
      message: err.message,
      timestamp: new Date().toISOString()
    }
  });
});

// For local development
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🏦 Vendor Transfer Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`💰 Transfer API: POST http://localhost:${PORT}/api/vendor-transfer`);
    console.log(`📋 Status API: GET http://localhost:${PORT}/api/vendor-transfer-status/:ref_id`);
    console.log(`📊 All transfers: GET http://localhost:${PORT}/api/vendor-transfers`);
    
    if (USE_MOCK_RESPONSES) {
      console.log('⚠️ USING MOCK RESPONSES - Set USE_MOCK_RESPONSES to false for real API calls');
    }
  });
}

// For serverless environments (e.g., Vercel)
module.exports = app;